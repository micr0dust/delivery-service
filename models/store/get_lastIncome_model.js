const client = require('../connection_db');
const config = require('../../config/development_config');
const mongoFn = require('../../service/mongodbFns');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function income(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);

    try {
        let storeUrl;
        try {
            const storeResult = await store.findOne({ belong: id });
            if (!storeResult) throw new Error("查無店家");
            if (storeResult) storeUrl = storeResult.url;
        } catch (err) {
            throw err;
        }
        try {
            let dateStart = new Date();
            dateStart.setHours(0, 0, 0, 0);
            let dateEnd = new Date();
            dateEnd.setHours(0, 0, 0, 0);
            dateStart.setMonth(dateStart.getMonth() - 1);
            dateEnd.setMonth(dateEnd.getMonth());
            dateStart.setDate(1);
            dateEnd.setDate(1);
            const findResult = await mongoFn.findToArray(order, {
                store: storeUrl,
                DATE: {
                    $gte: new Date(dateStart.toISOString()),
                    $lt: new Date(dateEnd.toISOString())
                }
            });
            if (!findResult) throw new Error("查無訂單");
            if (findResult) {
                let sum = 0;
                findResult.forEach(order => {
                    sum += order.total;
                });
                return sum;
            }
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}