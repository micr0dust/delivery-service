const client = require('../connection_db');
const config = require('../../config/development_config');
const Check = require('../../service/member_check');
const Discount = require('../../service/discount_check');

var ObjectId = require('mongodb').ObjectId;
let check = new Check();
let discount = new Discount();

module.exports = async function order(data, finalOrder) {
    const orderData = JSON.parse(data.order);
    const orderList = orderData['orders'];
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);
    const order = db.collection(config.mongo.order);

    try {
        if (!data.id) throw new Error('id 為必填內容');
        const userID = data.id;
        const memberResult = await member.findOne({ _id: ObjectId(userID) });
        if (!memberResult) throw new Error('查無帳號，請重新登入');
        if (!memberResult['phoneVerify']['verified']) throw new Error('未通過手機驗證，無法訂餐');

        const firestProduct = await product.findOne({ _id: ObjectId(orderList[0].id) });
        if (!firestProduct) throw new Error('查無商品：' + orderList[0].id);

        const productOwner = await store.findOne({ _id: ObjectId(firestProduct.belong) });
        if (!productOwner) throw new Error('查無商品商家');

        // Json 格式檢查
        if (typeof orderData.tableware != "boolean") throw new Error("tableware 型別必須是 boolean");
        if (!(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]:?)$/.test(orderData.reservation))) throw new Error("reservation 格式必須是 HH:MM");

        // 時間檢查
        const hourData = parseInt(orderData.reservation.split(':')[0]);
        const minData = parseInt(orderData.reservation.split(':')[1]);
        //const tomorrow = orderData.reservation.length - 5;
        const hourNow = data.DATE.getHours();
        const minNow = data.DATE.getMinutes();
        if (!(hourData * 60 + minData > hourNow * 60 + minNow +
                ((productOwner.timeEstimate) ? parseInt(productOwner.timeEstimate) : 0)))
            throw new Error((productOwner.timeEstimate) ? `請提早${productOwner.timeEstimate}分鐘預約` : "預約時間已超過");


        let checked = [];
        for (let i = 0; i < orderList.length; i++) {
            if (!check.checkHexStringId(orderList[i].id)) throw new Error("Json格式錯誤-> 'id':'" + orderList[i].id + "' ");
            if (!check.checkCount(orderList[i].count)) throw new Error("Json格式錯誤-> 'count':'" + orderList[i].count + "' ");
            if (!check.checkDescribe(orderList[i].note)) throw new Error("Json格式錯誤-> 'note':'" + orderList[i].note + "' ");
            checked.push({
                id: orderList[i].id,
                count: orderList[i].count,
                note: orderList[i].note,
                options: orderList[i].options
            });
        }

        const testRecords = [];
        const finalRecords = [];
        const products = [];
        const checkedOrder = checked;
        for (let i = 0; i < checkedOrder.length; i++)
            products.push(ObjectId(checkedOrder[i].id));
        const productResult = await product.find({ _id: { $in: products } }).toArray();
        if (!productResult) throw new Error('查無商品');
        for (let i = 0; i < productResult.length; i++)
            if (productResult[i].belong != productOwner._id.toString())
                throw new Error('無法跨店家購買：' + productResult[i].id);
        for (let i = 0; i < checkedOrder.length; i++) {
            if (!productResult.some(item => item._id.toString() === checkedOrder[i].id))
                throw new Error(
                    '在提交的訂單中找不到關於 ' +
                    checkedOrder[i].id +
                    ' 商品的資料'
                );
            const aProduct = productResult.filter(
                function(item) { return (item._id.toString() === checkedOrder[i].id); }
            )[0];

            //選項處理
            let newPrice, newOptions;
            if (aProduct.options) {
                let arrOptions = JSON.parse(aProduct.options);
                let orderOptions = JSON.parse(checkedOrder[i].options);
                let optionData = [];
                let price = parseFloat(aProduct.price);
                for (let j = 0; j < arrOptions.length; j++) {
                    const found = orderOptions.find(opt => opt['title'] === arrOptions[j]['title']);
                    if (found) {
                        if (arrOptions[j]['multiple'] === true) {
                            if (!Array.isArray(found['option'])) throw new Error(
                                `商品 ${checkedOrder[i].id} 中，的選項 ${arrOptions[j]['title']} 為複選，需用 List 處理`
                            );
                            if (arrOptions[j]['min'] && found['option'].length < parseInt(arrOptions[j]['min'])) throw new Error(
                                `商品 ${checkedOrder[i].id} 中的選項 ${arrOptions[j]['title']}，最少限制為 ${arrOptions[j]['min']} 項`
                            );
                            if (arrOptions[j]['max'] && found['option'].length > parseInt(arrOptions[j]['max'])) throw new Error(
                                `商品 ${checkedOrder[i].id} 中的選項 ${arrOptions[j]['title']}，最大限制為 ${arrOptions[j]['max']} 項`
                            );
                            for (let k = 0; k < found['option'].length; k++) {
                                const optData = (arrOptions[j]['option']).find(opt => opt['name'] === found['option'][k]);
                                if (!optData) throw new Error(
                                    `商品 ${checkedOrder[i].id} 中的選項 ${arrOptions[j]['title']}，查無子選項 ${found['option'][k]}`
                                );
                                price += parseFloat(optData.cost);
                            }
                            optionData.push(found);
                        } else {
                            const optData = (arrOptions[j]['option']).find(opt => opt['name'] === found['option']);
                            if (!optData) throw new Error(
                                `商品 ${checkedOrder[i].id} 中的選項 ${arrOptions[j]['title']}，查無子選項 ${found['option']}`
                            );
                            price += parseFloat(optData.cost);
                            optionData.push(found);
                        }
                    } else if (arrOptions[j]['require']) throw new Error(
                        `商品 ${checkedOrder[i].id} 中，的選項 ${arrOptions[j]['name']} 為必選`
                    );
                }
                newPrice = price;
                newOptions = JSON.stringify(optionData);
            }

            for (let j = 0; j < checkedOrder[i].count; j++)
                testRecords.push({
                    _id: aProduct._id.toString(),
                    name: aProduct.name,
                    price: newPrice,
                    type: aProduct.type,
                    discount: (aProduct.discount) ? aProduct.discount : null,
                    note: checkedOrder[i].note,
                    options: newOptions
                });

            finalRecords.push({
                _id: aProduct._id.toString(),
                name: aProduct.name,
                price: newPrice,
                type: aProduct.type,
                discount: (aProduct.discount) ? aProduct.discount : null,
                note: checkedOrder[i].note,
                options: newOptions,
                count: checkedOrder[i].count
            });
        }

        //折扣處理
        let discountSum = 0;
        if (productOwner.productDiscount) {
            let hadDiscount = new Set();
            for (let i = 0; i < testRecords.length; i++) {
                if (!testRecords[i].discount) continue;
                for (let tag in testRecords[i].discount) {
                    if (hadDiscount.has(testRecords[i].discount[tag])) continue;
                    const discounter = productOwner.productDiscount[testRecords[i].discount[tag]];
                    const discounts = testRecords.filter(
                        function(item) { return (item.discount[tag]); }
                    );
                    if (discounter.method = "exceedPriceDiscount")
                        discountSum += discount.exceedPriceDiscount(discounts, discounter);
                    if (discounter.method = "exceedCountDiscount")
                        discountSum += discount.exceedCountDiscount(discounts, discounter);
                    hadDiscount.add(testRecords[tag]);
                }
            }
        }
        let sum = 0;
        let allDiscountSum = 0;
        const discountList = [];
        for (let i = 0; i < testRecords.length; i++)
            sum += testRecords[i].price;
        sum = (sum - discountSum > 0) ? sum - discountSum : 0;
        if (productOwner.allDiscount) {
            const allDiscount = JSON.parse(productOwner.allDiscount);
            for (let i = 0; i < allDiscount.length; i++) {
                let discountMessage = null;
                if (allDiscount[i].method === "exceedPriceDiscount" && sum >= parseInt(allDiscount[i].goal)) {
                    allDiscountSum += (parseInt(allDiscount[i].discount) >= 1) ?
                        parseInt(allDiscount[i].discount) :
                        sum * (1 - parseFloat(allDiscount[i].discount));
                    discountMessage = (parseInt(allDiscount[i].discount) >= 1) ?
                        `滿${parseInt(allDiscount[i].goal)}元，現省${parseInt(allDiscount[i].discount)}元` :
                        `滿${parseInt(allDiscount[i].goal)}元，打${parseFloat(allDiscount[i].discount)*10}折`;
                }
                if (allDiscount[i].method === "exceedCountDiscount") {
                    allDiscountSum += discount.exceedCountDiscount(testRecords, allDiscount[i]);
                    discountMessage = (parseInt(allDiscount[i].discount) >= 1) ?
                        `滿${parseInt(allDiscount[i].goal)}件商品，現省${parseInt(allDiscount[i].discount)}元` :
                        `滿${parseInt(allDiscount[i].goal)}件商品，打${parseFloat(allDiscount[i].discount)*10}折`;
                }
                if (discountMessage) discountList.push(discountMessage);
            }
        }


        const today = () => {
            const date = data.DATE;
            const mm = date.getMonth() + 1;
            const dd = date.getDate();

            return [
                date.getFullYear(),
                '-' + (mm > 9 ? '' : '0') + mm,
                '-' + (dd > 9 ? '' : '0') + dd
            ].join('');
        };
        const orderResult = await order.find({ store: productOwner.url, DATE: { $gte: new Date(today()) } }).toArray();

        const final = {
            DATE: data.DATE,
            id: userID,
            sequence: orderResult.length,
            store: productOwner.url,
            store_info: {
                name: productOwner.name,
                address: productOwner.address
            },
            tableware: orderData.tableware,
            reservation: orderData.reservation || null,
            order: JSON.stringify(finalRecords),
            total: sum - allDiscountSum,
            discount: JSON.stringify(discountList),
            complete: false,
            accept: false
        };

        // 將資料寫入資料庫
        if (finalOrder) {
            const insertOrder = await order.insertOne(final);
            if (!insertOrder) throw new Error('資料庫訂單寫入失敗');
            const expire = order.createIndex({ DATE: 1 }, { expireAfterSeconds: 86400 * 60 });
            if (!expire) throw new Error('資料庫訂單時效寫入失敗');
            const result = await order.findOne({ _id: insertOrder.insertedId });
            if (!result) throw new Error('資料庫中查無寫入的訂單');
        }

        const finalData = {
            DATE: final.DATE,
            sequence: final.sequence,
            order: final.order,
            total: final.total,
            store: final.store,
            store_info: final.store_info,
            discount: final.discount,
            tableware: final.tableware,
            reservation: final.reservation
        };

        return finalData;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}