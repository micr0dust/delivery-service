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

    try {
        try {
            const memberResult = await member.findOne({ _id: ObjectId(data.id) });
            const storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });
            console.log('Found documents =>', storeResult);
            storeData = storeResult;
            if (!storeData) throw err;
        } catch (err) {
            throw "伺服器錯誤，請稍後在試";
        }

        storeData.refresh_token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // token7天後過期。
                data: storeData._id.toString()
            },
            config.fresh_secret
        );

        console.log("storeData");
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
            console.log(err)
            throw '伺服器錯誤，請稍後再試'
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}