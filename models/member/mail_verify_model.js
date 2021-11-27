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
            console.log('Found documents =>', member);
            if (!member) throw err;
        } catch (err) {
            throw "伺服器錯誤，請稍後再試";
        }

        let now = new Date(data.time);
        let past = new Date(member.time);
        let exp = now - past;

        if (exp > 1000 * (60) * (10)) throw "驗證碼超時";
        if (data.verityCode === member.verityCode) {
            try {
                const updateResult = await collection.updateOne({ _id: ObjectId(data.id) }, { $set: { verityCode: true, update_date: data.time } });
                console.log(updateResult);
                return "驗證成功";
            } catch (err) {
                throw "伺服器錯誤，請稍後再試";
            }
        } else throw "驗證碼錯誤";

    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}