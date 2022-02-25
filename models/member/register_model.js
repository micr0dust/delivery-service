const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

module.exports = async function register(memberData) {
    let result = {};
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        try {
            const findResult = await collection.findOne({ email: memberData.email });
            if (findResult) throw new Error("該信箱已被註冊");
        } catch (err) {
            throw errValue;
        }
        // 將資料寫入資料庫
        try {
            const insertResult = await collection.insertOne(memberData);
            if (!insertResult) throw new Error("資料儲存過程發生錯誤");
            return memberData;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}