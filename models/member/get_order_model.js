const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getOrder(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);

    try {
        const findResult = await order.find({ id: data.id }).toArray();
        if (!findResult) throw new Error("查無訂單");
        for (const child in findResult) {
            delete findResult[child]["id"];
            Object.keys(findResult[child]).forEach((key) => findResult[child][key] == null && delete findResult[child][key]);
        }
        return findResult;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}