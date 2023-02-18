const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getAd() {
    await client.connect();
    const db = client.db(config.mongo.database);
    const ad = db.collection("ad");
    const group = db.collection(config.mongo.group);

    try {
        const groupResult = await group.findOne({ _id: ObjectId("62ce7094d47de10b3b6d68f7") });
        if (!groupResult) throw new Error("查無群組");
        console.log(groupResult);
        const findResult = await ad.find({ _id: { $in: groupResult.data } }).toArray();
        console.log(findResult);
        if (!findResult) throw new Error("查無廣告");
        return findResult;
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}