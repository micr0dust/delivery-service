const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getProduct() {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);

    try {
        try {
            const storeResult = await store.find({}).toArray();
            for (let i = 0; i < storeResult.length; i++) {
                storeResult[i] = {
                    name: storeResult[i].name,
                    address: storeResult[i].address
                }
            }
            console.log('Found documents =>', storeResult);
            if (storeResult) return storeResult;
            if (!storeResult) throw err;
        } catch (err) {
            throw "伺服器錯誤，請稍後在試";
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}