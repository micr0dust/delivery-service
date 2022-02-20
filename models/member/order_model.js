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
        let errValue = "伺服器錯誤，請稍後在試";
        try {
            const findResult = await member.findOne({ _id: ObjectId(data.id) });
            //console.log('Found documents =>', findResult);
            if (!findResult) throw errValue = "無此使用者";
        } catch (err) {
            throw errValue;
        }
        let firestProduct;
        try {
            firestProduct = await product.findOne({ _id: ObjectId(orderList[0].id) });
            //console.log('Found documents =>', firestProduct);
            if (!firestProduct) throw errValue = "查無商品：" + orderList[0].id;
        } catch (err) {
            throw errValue;
        }
        let productOwner;
        try {
            productOwner = await store.findOne({ _id: ObjectId(firestProduct.belong) });
            //console.log('Found documents =>', productOwner);
            if (!productOwner) throw errValue = "查無商品商家";
        } catch (err) {
            throw errValue;
        }

        let productResult;
        try {
            let products = [];
            for (let i = 0; i < orderList.length; i++) products.push(ObjectId(orderList[i].id));
            productResult = await product.find({ _id: { $in: products } }).toArray();
            if (orderList.length - productResult.length) throw "在提交的訂單中有" + orderList.length - productResult.length + "項商品找不到資料"
                //console.log('Found documents =>', productResult);
            for (let i = 0; i < productResult.length; i++) {
                if (productResult[i].belong != productOwner._id.toString()) throw "無法跨店家購買：" + productResult[i].id;
            }
        } catch (err) {
            throw err;
        }

        // 將資料寫入資料庫
        try {
            data.store = productOwner._id;
            const insertOrder = await order.insertOne(data);
            const result = await order.findOne({ _id: insertOrder.insertedId });
            return result.order;
        } catch (err) {
            throw errValue;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}