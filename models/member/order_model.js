const client = require('../connection_db');
const config = require('../../config/development_config');
const Check = require('../../service/member_check');

var ObjectId = require('mongodb').ObjectId;
let check = new Check();

module.exports = async function order(data) {
    let orderList = JSON.parse(data.order);
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
            if (productOwner.sale) data.sale = productOwner.sale;
        } catch (err) {
            throw err;
        }

        // Json 格式檢查
        for (let i = 0; i < orderList.length; i++) {
            if (!check.checkHexStringId(orderList[i].id)) throw new Error("Json格式錯誤-> 'id':'" + orderList[i].id + "' ");
            if (!check.checkCount(orderList[i].count)) throw new Error("Json格式錯誤-> 'count':'" + orderList[i].count + "' ");
            if (!check.checkDescribe(orderList[i].note)) throw new Error("Json格式錯誤-> 'note':'" + orderList[i].note + "' ");
            orderList[i] = {
                id: orderList[i].id,
                count: orderList[i].count,
                note: orderList[i].note
            };
        }

        let productResult;
        try {
            let products = [];
            for (let i = 0; i < orderList.length; i++)
                products.push(ObjectId(orderList[i].id));
            productResult = await product.find({ _id: { $in: products } }).toArray();
            if (!productResult) throw new Error('查無商品');

            data.total = 0;
            for (let i = 0; i < orderList.length; i++)
                if (!productResult.some(item => item._id.toString() == orderList[i].id))
                    throw new Error(
                        '在提交的訂單中找不到關於 ' +
                        orderList[i].id +
                        ' 商品的資料'
                    );
                else {
                    let product = productResult.filter(
                        function(item) { return (item._id.toString() == orderList[i].id); }
                    )[0];
                    data.total += parseInt(product.price) * parseInt(orderList[i].count);
                }
            if (data.sale) data.total *= data.sale;
            for (let i = 0; i < productResult.length; i++)
                if (productResult[i].belong != productOwner._id.toString())
                    throw new Error('無法跨店家購買：' + productResult[i].id);
        } catch (err) {
            throw err;
        }

        // 將資料寫入資料庫
        let result;
        try {
            const insertOrder = await order.insertOne(data);
            if (!insertOrder) throw new Error('資料庫訂單寫入失敗');
            const expire = order.createIndex({ DATE: 1 }, { expireAfterSeconds: 86400 });
            if (!expire) throw new Error('資料庫訂單時效寫入失敗');
            result = await order.findOne({ _id: insertOrder.insertedId });
            if (!result) throw new Error('資料庫中查無寫入的訂單');
        } catch (err) {
            throw err;
        }

        let finalData = {
            order: result.order,
            total: data.total,
            store: data.store
        };
        if (data.sale) finalData.sale = data.sale
        return finalData;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}