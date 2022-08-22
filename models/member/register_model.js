const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

module.exports = async function register(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        const findResult = await collection.findOne({ email: data.email });
        if (findResult) throw new Error("該信箱已被註冊");

        // 將資料寫入資料庫
        const insertResult = await collection.insertOne(data);
        if (!insertResult) throw new Error("資料儲存過程發生錯誤");
        return data;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}