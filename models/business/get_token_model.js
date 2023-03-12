const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getToken(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);

    try {
        const findResult = await store.findOne({ _id: ObjectId(id) });
        if (findResult) return id;
        throw new Error("查無帳號，請重新登入");
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}