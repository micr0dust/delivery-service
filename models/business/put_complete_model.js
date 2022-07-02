const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function putComplete(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);

    try {
        let storeUrl;
        try {
            const storeResult = await store.findOne({ _id: ObjectId(data.id) });
            if (!storeResult) throw new Error("查無店家");
            if (storeResult) storeUrl = storeResult.url;
        } catch (err) {
            throw err;
        }
        try {
            const findResult = await order.findOne({ _id: ObjectId(data.orderID) });
            if (!findResult) throw new Error("查無訂單");
            if (findResult.store != storeUrl) throw new Error("該訂單屬於其他店家");
            if (findResult.accept != true) throw new Error("訂單必須先接受才能完成");
            if (findResult.complete == true) throw new Error("訂單已經標記為完成");
            const putResult = await order.updateOne({
                _id: ObjectId(data.orderID)
            }, { $set: { complete: true } });
            if (!putResult) throw new Error("嘗試標記訂單為完成時發生錯誤");
            if (putResult) return true;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}