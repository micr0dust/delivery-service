const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getNowOrder(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);

    try {
        try {
            const findResult = await order.find({
                store: ObjectId(id),
                complete: false,
                accept: true
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