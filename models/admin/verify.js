const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function verify(_id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const log = db.collection(config.mongo.log);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(_id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        if (!memberResult.role) throw new Error("查無該帳號身分");
        if (!(~memberResult.role.indexOf("admin"))) return 403;

        const output = `成功驗證管理員身分`;
        const operateData = {
            admin: _id,
            method: "驗證管理員身分",
            DATE: new Date(),
            input: null,
            output: output
        };

        const insertLog = await log.insertOne(operateData);
        if (!insertLog) throw new Error("儲存操作紀錄時發生錯誤");

        return output;
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}