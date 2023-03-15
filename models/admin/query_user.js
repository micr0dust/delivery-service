const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function queryUser(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    // log = db.collection(config.mongo.log);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(data._id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        if (!memberResult.role) throw new Error("查無該帳號身分");
        if (!(~memberResult.role.indexOf("admin"))) return 403;
        // 查詢身分
        const accountResult = await member.findOne({ email: data.email });
        if (!accountResult) throw new Error("查無目標帳號");

        return accountResult._id.toString();
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}