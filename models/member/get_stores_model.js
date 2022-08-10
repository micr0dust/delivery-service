const client = require('../connection_db');
const config = require('../../config/development_config');

module.exports = async function getProduct() {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);

    try {
        try {
            const storeResult = await store.find({}).toArray();
            if (!storeResult) throw new Error("查無商家");
            for (let i = 0; i < storeResult.length; i++) {
                storeResult[i] = {
                    name: storeResult[i].name,
                    address: storeResult[i].address,
                    id: storeResult[i].url,
                    discount: storeResult[i].allDiscount || "[]"
                }
            }
            if (storeResult) return storeResult;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}