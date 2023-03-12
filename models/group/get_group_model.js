const client = require('../connection_db');
const config = require('../../config/development_config');
const mongoFn = require('../../service/mongodbFns');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function groupData(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const group = db.collection(config.mongo.group);
    try {
        const groupResult = await group.findOne({ _id: ObjectId(data.id) });
        if (!groupResult) throw new Error(`查無群組 ${data.id}`)
        const findResult = await mongoFn.findToArray(db.collection(groupResult.type), { _id: { $in: groupResult.data } });
        if (!findResult) throw new Error("查無此帳號擁有的商店");
        const finalData = [];
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
    } finally {
        //await client.close();
    }
}