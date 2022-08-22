const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getOrder(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);

    try {
        const storeResult = await store.findOne({ belong: id });
        if (!storeResult) throw new Error("查無店家");
        const storeUrl = storeResult.url;

        const findResult = await order.find({
            store: storeUrl
        }).toArray();
        if (!findResult) throw new Error("查無訂單");

        return findResult;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}