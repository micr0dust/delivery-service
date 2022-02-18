const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getUser(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.store);

    try {
        try {
            const findResult = await collection.findOne({ _id: ObjectId(id) });
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