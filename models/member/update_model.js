const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function customerEdit(id, memberUpdateData) {
    let result = {};
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        try {
            const findResult = await collection.findOne({ _id: ObjectId(id) });
            console.log('Found documents =>', findResult);
            if (!findResult) throw err;
        } catch (err) {
            throw "伺服器錯誤，請稍後再試";
        }

        // 更新資料庫資料
        try {
            const updateResult = await collection.updateOne({ _id: ObjectId(id) }, { $set: { name: memberUpdateData.name, password: memberUpdateData.password, update_date: memberUpdateData.update_date } });
            result.status = "會員資料更新成功";
            result.memberUpdateData = memberUpdateData
            return result;
        } catch (err) {
            throw "伺服器錯誤，請稍後再試";
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}