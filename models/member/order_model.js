const client = require('../connection_db');
const config = require('../../config/development_config');
const Check = require('../../service/member_check');
const Discount = require('../../service/discount_check');

var ObjectId = require('mongodb').ObjectId;
let check = new Check();
let discount = new Discount();

module.exports = async function order(data) {
    let orderData = JSON.parse(data.order);
    let orderList = orderData['orders'];
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);
    const order = db.collection(config.mongo.order);
    try {
        try {
            const findResult = await member.findOne({ _id: ObjectId(data.id) });
            if (!findResult) throw new Error('查無帳號，請重新登入');
        } catch (err) {
            throw err;
        }
        let firestProduct;
        try {
            firestProduct = await product.findOne({ _id: ObjectId(orderList[0].id) });
            if (!firestProduct) throw new Error('查無商品：' + orderList[0].id);
        } catch (err) {
            throw err;
        }
        let productOwner;
        try {
            productOwner = await store.findOne({ _id: ObjectId(firestProduct.belong) });
            if (!productOwner) throw new Error('查無商品商家');
            data.store = productOwner.url;
            data.store_info = {
                name: productOwner.name,
                address: productOwner.address
            };
        } catch (err) {
            throw err;
        }

        // Json 格式檢查
        if (typeof orderData.tableware != "boolean") throw new Error("tableware 型別必須是 boolean");
        for (let i = 0; i < orderList.length; i++) {
            if (!check.checkHexStringId(orderList[i].id)) throw new Error("Json格式錯誤-> 'id':'" + orderList[i].id + "' ");
            if (!check.checkCount(orderList[i].count)) throw new Error("Json格式錯誤-> 'count':'" + orderList[i].count + "' ");
            if (!check.checkDescribe(orderList[i].note)) throw new Error("Json格式錯誤-> 'note':'" + orderList[i].note + "' ");
            orderList[i] = {
                id: orderList[i].id,
                count: orderList[i].count,
                note: orderList[i].note,
                options: orderList[i].options
            };
        }

        let productResult, finalRecord = [];
        try {
            let products = [];
            for (let i = 0; i < orderList.length; i++)
                products.push(ObjectId(orderList[i].id));
            productResult = await product.find({ _id: { $in: products } }).toArray();
            if (!productResult) throw new Error('查無商品');
            for (let i = 0; i < productResult.length; i++)
                if (productResult[i].belong != productOwner._id.toString())
                    throw new Error('無法跨店家購買：' + productResult[i].id);
            for (let i = 0; i < orderList.length; i++) {
                if (!productResult.some(item => item._id.toString() == orderList[i].id))
                    throw new Error(
                        '在提交的訂單中找不到關於 ' +
                        orderList[i].id +
                        ' 商品的資料'
                    );
                let product = productResult.filter(
                    function(item) { return (item._id.toString() == orderList[i].id); }
                )[0];
                let newPrice, newOptions;
                //選項處理
                if (product.options) {
                    let arrOptions = JSON.parse(product.options);
                    let orderOptions = JSON.parse(orderList[i].options);
                    let optionData = [];
                    let price = parseFloat(product.price);
                    for (let j = 0; j < arrOptions.length; j++) {
                        const found = orderOptions.find(opt => opt['title'] == arrOptions[j]['title']);
                        if (found) {
                            const optData = (arrOptions[j]['option']).find(opt => opt['name'] == found['option'])
                            if (optData) price += parseFloat(optData.cost);
                            optionData.push(found);
                        } else if (arrOptions[j].require) throw new Error(
                            `商品 ${orderList[i].id} 中，的選項 ${arrOptions[j]['name']} 為必選`
                        );
                    }
                    newPrice = price;
                    newOptions = JSON.stringify(optionData);
                }

                const record = {
                    _id: product._id.toString(),
                    name: product.name,
                    price: newPrice,
                    type: product.type,
                    discount: (product.discount) ? product.discount : null,
                    note: orderList[i].note,
                    options: newOptions
                };
                for (let j = 0; j < orderList[i].count; j++)
                    finalRecord.push(record);
            }
        } catch (err) {
            throw err;
        }

        //折扣處理
        try {
            let discountSum = 0;
            if (productOwner.productDiscount) {
                let hadDiscount = new Set();
                for (let i = 0; i < finalRecord.length; i++) {
                    if (!finalRecord[i].discount) continue;
                    for (let tag in finalRecord[i].discount) {
                        if (hadDiscount.has(finalRecord[i].discount[tag])) continue;
                        const discounter = productOwner.productDiscount[finalRecord[i].discount[tag]];
                        const discounts = finalRecord.filter(
                            function(item) { return (item.discount[tag]); }
                        );
                        if (discounter.method = "exceedPriceDiscount") discountSum += discount.exceedPriceDiscount(discounts, discounter);
                        if (discounter.method = "exceedCountDiscount") discountSum += discount.exceedCountDiscount(discounts, discounter);
                        hadDiscount.add(finalRecord[tag]);
                    }
                }
            }
            let sum = 0;
            let allDiscountSum = 0;
            let discountList = [];
            for (let i = 0; i < finalRecord.length; i++)
                sum += finalRecord[i].price;
            sum = (sum - discountSum > 0) ? sum - discountSum : 0;
            if (productOwner.allDiscount) {
                const allDiscount = JSON.parse(productOwner.allDiscount);
                for (let i = 0; i < allDiscount.length; i++) {
                    let discountMessage = null;
                    if (allDiscount[i].method == "exceedPriceDiscount" && sum >= parseInt(allDiscount[i].goal)) {
                        allDiscountSum += (parseInt(allDiscount[i].discount) >= 1) ? parseInt(allDiscount[i].discount) : sum * (1 - parseFloat(allDiscount[i].discount));
                        discountMessage = (parseInt(allDiscount[i].discount) >= 1) ? `滿${parseInt(allDiscount[i].goal)}元，現省${parseInt(allDiscount[i].discount)}元` : `滿${parseInt(allDiscount[i].goal)}元，打${parseFloat(allDiscount[i].discount)*10}折`;
                    }
                    if (allDiscount[i].method == "exceedCountDiscount") {
                        allDiscountSum += discount.exceedCountDiscount(finalRecord, allDiscount[i]);
                        discountMessage = (parseInt(allDiscount[i].discount) >= 1) ? `滿${parseInt(allDiscount[i].goal)}件商品，現省${parseInt(allDiscount[i].discount)}元` : `滿${parseInt(allDiscount[i].goal)}件商品，打${parseFloat(allDiscount[i].discount)*10}折`;
                    }
                    if (discountMessage) discountList.push(discountMessage);
                }
            }
            data.tableware = orderData.tableware;
            data.order = JSON.stringify(finalRecord);
            data.total = sum - allDiscountSum;
            data.discount = JSON.stringify(discountList);
            data.complete = false;
            data.accept = false;
        } catch (err) {
            throw err;
        }

        // 將資料寫入資料庫
        let result;
        try {
            const insertOrder = await order.insertOne(data);
            if (!insertOrder) throw new Error('資料庫訂單寫入失敗');
            const expire = order.createIndex({ DATE: 1 }, { expireAfterSeconds: 86400 * 60 });
            if (!expire) throw new Error('資料庫訂單時效寫入失敗');
            result = await order.findOne({ _id: insertOrder.insertedId });
            if (!result) throw new Error('資料庫中查無寫入的訂單');
        } catch (err) {
            throw err;
        }

        let finalData = {
            order: result.order,
            total: result.total,
            store: result.store,
            store_info: result.store_info,
            discount: result.discount,
            tableware: result.tableware
        };
        if (data.sale) finalData.sale = data.sale
        return finalData;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}