const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getOrder(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);

    try {
        try {
            const findResult = await order.find({ store: ObjectId(id) }).toArray();
            console.log('Found documents =>', findResult);
            if (findResult) return findResult;
            if (!findResult) throw err;
        } catch (err) {
            throw "伺服器錯誤，請稍後在試";
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}