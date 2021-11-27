const client = require('../connection_db');
const config = require('../../config/development_config');

module.exports = async function memberLogin(memberData) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);
    try {
        const findResult = await collection.findOne({ email: memberData.email, password: memberData.password });
        console.log('Found documents =>', findResult);
        if (findResult) return findResult;
    } catch (err) {
        throw "伺服器錯誤，請稍後在試";
    }
    throw "請輸入正確的帳號或密碼";
}