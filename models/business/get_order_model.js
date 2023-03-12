const client = require('../connection_db');
const config = require('../../config/development_config');
const mongoFn = require('../../service/mongodbFns');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getNowOrder(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);

    try {
        const storeResult = await store.findOne({ _id: ObjectId(data.id) });
        if (!storeResult) throw new Error("查無店家");
        const storeUrl = storeResult.url;
        const putResult = await store.updateOne({ _id: ObjectId(data.id) }, {
            $set: {
                latest: data.time
            }
        });
        if (!putResult) throw new Error("接受訂單時發生錯誤");
        const findResult = await mongoFn.findToArray(order, {
            store: storeUrl,
            complete: false
        });

        if (!findResult) throw new Error("查無訂單");
        return findResult;
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}