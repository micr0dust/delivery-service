const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function mailEmit(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    try {
        const memberResult = await member.findOne({ _id: ObjectId(data.id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");

        const now = new Date(data.time);
        const past = new Date(memberResult.time);
        const exp = now - past;

        if (exp > 1000 * (60) * (10)) throw new Error("驗證碼超時");
        if (memberResult.verityCode === true) {
            return "此信箱已被驗證過";
        } else if (data.verityCode === memberResult.verityCode) {
            const updateResult = await member.updateOne({ _id: ObjectId(data.id) }, {
                $set: {
                    verityCode: true,
                    update_date: data.time
                }
            });
            if (!updateResult) throw new Error("資料庫更新失敗");
            return "驗證成功";
        } else throw new Error("驗證碼錯誤");

    } catch (err) {
        throw err;
    } finally {
        //s
    }
}