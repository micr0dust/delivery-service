const client = require('../connection_db');
const config = require('../../config/development_config');

module.exports = async function getProduct() {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);

    try {
        const storeResult = await store.find({
            name: { $exists: true },
            address: { $exists: true },
            url: { $exists: true },
            businessTime: { $exists: true },
        }).toArray();
        if (!storeResult) throw new Error("查無商家");
        for (let i = 0; i < storeResult.length; i++) {
            const today = [];
            const day = new Date().getDay();
            for (let j = 0; j < storeResult[i].businessTime.length; j++)
                today.push(storeResult[i].businessTime[j][day]);
            storeResult[i] = {
                name: storeResult[i].name,
                address: storeResult[i].address,
                id: storeResult[i].url,
                place: storeResult[i].place,
                describe: storeResult[i].describe || "",
                discount: storeResult[i].allDiscount || "[]",
                timeEstimate: storeResult[i].timeEstimate || null,
                businessTime: today
            }
        }
        if (storeResult) return storeResult;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}