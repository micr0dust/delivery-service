const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function mailEmit(data) {
    let member;
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);
    try {
        try {
            member = await collection.findOne({ _id: ObjectId(data.id) });
            if (!member) throw new Error("查無帳號，請重新登入");
        } catch (err) {
            throw err;
        }

        let now = new Date(data.time);
        let past = new Date(member.time);
        let exp = now - past;

        if (exp > 1000 * (60) * (10)) throw new Error("驗證碼超時");
        if (member.verityCode === true) {
            return "此信箱已被驗證過";
        } else if (data.verityCode === member.verityCode) {
            try {
                const updateResult = await collection.updateOne({ _id: ObjectId(data.id) }, { $set: { verityCode: true, update_date: data.time } });
                if (!updateResult) new Error("資料庫更新失敗");
                return "驗證成功";
            } catch (err) {
                throw err;
            }
        } else throw new Error("驗證碼錯誤");

    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}