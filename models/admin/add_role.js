const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function addRole(_id, data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const log = db.collection(config.mongo.log);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(_id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        if (!memberResult.role) throw new Error("查無該帳號身分");
        if (!(~memberResult.role.indexOf("admin"))) return 403;

        // 確認目標帳號狀態是否可新增身分
        const accountResult = await member.findOne({ _id: ObjectId(data.id) });
        if (!accountResult) throw new Error("查無目標帳號");
        if ((~accountResult.role.indexOf(data.role))) throw new Error(`該帳號已有身分：${data.role}`);


        // 商家資料刪除
        const updateResult = await member.updateOne({ _id: ObjectId(data.id) }, {
            $push: { role: data.role }
        });
        if (!updateResult) throw new Error("新增身分時發生錯誤");


        const output = `成功新增身分 ${data.role} 至帳號 ${accountResult.name} (${accountResult._id.toString()})`;
        const operateData = {
            admin: _id,
            method: "賦予特定使用者特定身分",
            DATE: new Date(),
            input: data,
            output: output
        };

        const insertLog = await log.insertOne(operateData);
        if (!insertLog) throw new Error("儲存操作紀錄時發生錯誤");

        return output;
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}