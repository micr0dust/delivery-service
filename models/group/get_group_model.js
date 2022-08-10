const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function groupData(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const group = db.collection(config.mongo.group);
    try {
        try {
            const groupResult = await group.findOne({ _id: ObjectId(data.id) });
            if (!groupResult) throw new Error(`查無群組 ${data.id}`)
            const findResult = await store.find({ _id: { $in: groupResult.store } }).toArray();
            if (!findResult) throw new Error("查無此帳號擁有的商店");
            let finalData = []
            for (let i = 0; i < findResult.length; i++)
                finalData.push({
                    name: findResult[i].name,
                    address: findResult[i].address,
                    url: findResult[i].url,
                    discount: findResult[i].allDiscount || "[]"
                });
            return finalData;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}