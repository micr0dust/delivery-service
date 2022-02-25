const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function order(data) {
    let result = [];
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
            if (!findResult) throw new Error("查無帳號，請重新登入");
        } catch (err) {
            throw err;
        }
        let firestProduct;
        try {
            firestProduct = await product.findOne({ _id: ObjectId(orderList[0].id) });
            if (!firestProduct) throw new Error("查無商品：" + orderList[0].id);
        } catch (err) {
            throw err;
        }
        let productOwner;
        try {
            productOwner = await store.findOne({ _id: ObjectId(firestProduct.belong) });
            if (!productOwner) throw new Error("查無商品商家");
        } catch (err) {
            throw err;
        }

        let productResult;
        try {
            let products = [];
            for (let i = 0; i < orderList.length; i++) products.push(ObjectId(orderList[i].id));
            productResult = await product.find({ _id: { $in: products } }).toArray();
            if (!productResult) throw new Error("查無商品");
            if (orderList.length - productResult.length) throw new Error("在提交的訂單中有" + orderList.length - productResult.length + "項商品找不到資料");
            for (let i = 0; i < productResult.length; i++)
                if (productResult[i].belong != productOwner._id.toString()) throw new Error("無法跨店家購買：" + productResult[i].id);
        } catch (err) {
            throw err;
        }

        // 將資料寫入資料庫
        try {
            data.store = productOwner._id;
            const insertOrder = await order.insertOne(data);
            if (!insertOrder) throw new Error("資料庫訂單寫入失敗");
            const result = await order.findOne({ _id: insertOrder.insertedId });
            if (!result) throw new Error("資料庫中查無寫入的訂單");
            return result.order;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}