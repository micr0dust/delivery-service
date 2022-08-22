const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function loginAction(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const member = db.collection(config.mongo.member);
    try {
        const memberResult = await member.findOne({ _id: ObjectId(data.id) });
        if (!memberResult) throw new Error("請確認登入狀態");
        const storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });
        if (!storeResult) throw new Error("查無店家帳號，請建立店家");
        let storeData = storeResult;

        storeData.refresh_token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // token7天後過期。
                data: storeData._id.toString()
            },
            config.fresh_secret
        );

        // 更新refresh_token
        const refreshToken = await store.updateOne({ _id: storeData._id }, {
            $set: {
                last_login: data.time,
                refresh_token: storeData.refresh_token
            }
        });
        if (!refreshToken) throw new Error("refresh_token 更新發生錯誤");

        return storeData;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}