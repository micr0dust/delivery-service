const client = require('../connection_db');
const config = require('../../config/development_config');

module.exports = async function register(memberData) {
    let result = {};
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        let errValue = "伺服器錯誤，請稍後在試";
        try {
            const findResult = await collection.findOne({ email: memberData.email });
            console.log('Found documents =>', findResult);
            if (findResult) throw errValue = "該信箱已被註冊";
        } catch (err) {
            throw errValue;
        }

        // 將資料寫入資料庫
        try {
            const insertResult = await collection.insertOne(memberData);
            console.log(insertResult);
            return memberData;
        } catch (err) {
            throw errValue;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}