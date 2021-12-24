const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getToken(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        try {
            const findResult = await collection.findOne({ _id: ObjectId(id) });
            console.log('Found documents =>', findResult);
            if (findResult) return id;
            throw "請重新登入";
        } catch (err) {
            throw err ? err : "伺服器錯誤，請稍後再試";
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}