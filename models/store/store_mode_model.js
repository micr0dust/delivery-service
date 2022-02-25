const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function loginAction(data) {
    let storeData = null;
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const member = db.collection(config.mongo.member);
    let errValue = "伺服器錯誤，請稍後在試";
    try {
        try {
            const memberResult = await member.findOne({ _id: ObjectId(data.id) });
            if (!memberResult) throw (errValue = "請確認登入狀態");
            const storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });
            if (!storeResult) throw (errValue = "查無店家帳號，請建立店家");
            console.log('Found documents =>', storeResult);
            storeData = storeResult;
            if (!storeData) throw err;
        } catch (err) {
            throw errValue;
        }

        storeData.refresh_token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // token7天後過期。
                data: storeData._id.toString()
            },
            config.fresh_secret
        );

        // 更新refresh_token
        try {
            await store.updateOne({ _id: storeData._id }, {
                $set: {
                    last_login: data.time,
                    refresh_token: storeData.refresh_token
                }
            })
            return storeData;
        } catch (err) {
            throw errValue;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}