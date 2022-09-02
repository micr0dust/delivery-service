const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function putAccept(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);

    try {
        const storeResult = await store.findOne({ _id: ObjectId(data.id) });
        if (!storeResult) throw new Error("查無店家");
        const storeUrl = storeResult.url;

        const findResult = await order.findOne({ _id: ObjectId(data.orderID) });
        if (!findResult) throw new Error("查無訂單");
        if (findResult.store != storeUrl) throw new Error("該訂單屬於其他店家");
        if (findResult.accept === true) throw new Error("已經接受過該訂單");
        if (findResult.complete === true) throw new Error("訂單已被撤回");
        const putResult = await order.updateOne({ _id: ObjectId(data.orderID) }, {
            $set: { accept: true }
        });
        if (!putResult) throw new Error("接受訂單時發生錯誤");
        return true;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}