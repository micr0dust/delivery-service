const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getUser(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        try {
            const findResult = await collection.findOne({ _id: ObjectId(id) });
            if (!findResult) throw new Error("查無帳號，請重新登入");
            let result = {}
            if (findResult.name) result.name = findResult.name;
            if (findResult.email) result.email = findResult.email;
            if (findResult.phone) result.phone = findResult.phone;
            if (findResult.birthday) result.birthday = findResult.birthday;
            if (findResult.gender) result.gender = findResult.gender;
            if (findResult.locale) result.locale = findResult.locale;
            if (findResult.picture) result.picture = findResult.picture;
            if (findResult.store_id) result.store_id = findResult.store_id;
            if (findResult.role) result.role = findResult.role;
            result.verityCode = (findResult.verityCode === true);
            if (findResult.update_date) result.update_date = findResult.update_date;
            if (findResult.create_date) result.create_date = findResult.create_date;
            return result;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}