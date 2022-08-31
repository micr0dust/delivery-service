const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function putComplete(data) {
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
        if (findResult.complete === true) throw new Error("訂單已經標記為完成");
        const putResult = await order.updateOne({ _id: ObjectId(data.orderID) }, {
            $set: {
                complete: true,
                comments: data.comments
            }
        });
        if (!putResult) throw new Error("嘗試標記訂單為完成時發生錯誤");
        return true;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}