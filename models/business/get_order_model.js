const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getNowOrder(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);

    try {
        let storeUrl;
        try {
            const storeResult = await store.findOne({ _id: ObjectId(id) });
            if (!storeResult) throw new Error("查無店家");
            if (storeResult) storeUrl = storeResult.url;
        } catch (err) {
            throw err;
        }
        try {
            const findResult = await order.find({
                store: storeUrl,
                complete: false
            }).toArray();
            if (!findResult) throw new Error("查無訂單");
            if (findResult) return findResult;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}