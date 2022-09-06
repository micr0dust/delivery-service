const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function removeRole(_id, data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const log = db.collection(config.mongo.log);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(_id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        if (!memberResult.role) throw new Error("查無該帳號身分");
        if (!(~memberResult.role.indexOf("admin"))) throw new Error("該帳號無權限使用此功能");

        // 確認目標帳號狀態是否可移除身分
        const accountResult = await member.findOne({ _id: ObjectId(data.id) });
        if (!accountResult) throw new Error("查無目標帳號");
        if (!(~accountResult.role.indexOf(data.role))) throw new Error(`該帳號本來就沒有身分：${data.role}`);


        // 商家資料刪除
        const updateResult = await member.updateOne({ _id: ObjectId(data.id) }, {
            $pull: { role: data.role }
        });
        if (!updateResult) throw new Error("移除身分時發生錯誤");


        const output = `成功從帳號 ${accountResult.name} (${accountResult._id.toString()}) 移除身分 ${data.role}`;
        const operateData = {
            admin: _id,
            method: this.name,
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
        client.close();
    }
}