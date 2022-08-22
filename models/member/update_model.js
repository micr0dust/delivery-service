const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function customerEdit(id, data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        const findResult = await collection.findOne({ _id: ObjectId(id) });
        if (!findResult) throw new Error("查無帳號，請重新登入");

        // 更新資料庫資料
        await collection.updateOne({ _id: ObjectId(id) }, {
            $set: data
        });

        return data;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}