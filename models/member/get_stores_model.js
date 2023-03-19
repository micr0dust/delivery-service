const client = require('../connection_db');
const config = require('../../config/development_config');
const mongoFn = require('../../service/mongodbFns');

module.exports = async function getProduct() {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);

    try {
        const storeResult = await mongoFn.findToArray(store, {
            name: { $exists: true },
            address: { $exists: true },
            url: { $exists: true },
            businessTime: { $exists: true },
        });
        if (!storeResult) throw new Error("查無商家");
        for (let i = 0; i < storeResult.length; i++) {
            const today = [];
            const now = new Date();
            const UTC8Time = new Date(
                now.getTime() + (8 * 60 + now.getTimezoneOffset()) * 60 * 1000
            );
            const day = UTC8Time.getDay();
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
                businessTime: today,
                product: storeResult[i].product,
                thumbnail: storeResult[i].thumbnail || null,
                location: storeResult[i].location,
                last_update: storeResult[i].last_update,
                status: storeResult[i].latest ? (new Date() - new Date(storeResult[i].latest)) / 1000 : null
            }
        }
        if (storeResult) return storeResult;
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}