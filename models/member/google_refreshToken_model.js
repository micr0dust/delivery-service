const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

module.exports = async function googleGetRefreshToken(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        const findResult = await collection.findOne({ googleID: id });
        if (!findResult) throw new Error("查無帳號，請重新登入");
        if (!findResult._id) throw new Error("資料更新失敗");
        const refresh_token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // token7天後過期。
                data: findResult._id.toString()
            },
            config.fresh_secret
        );
        const updateData = await collection.updateOne({ _id: findResult._id }, {
            $set: {
                refresh_token: refresh_token
            }
        });
        if (!updateData) throw new Error("資料更新失敗");
        return {
            _id: findResult._id,
            refresh_token: refresh_token
        };
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}