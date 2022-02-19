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
            if (!findResult) throw err;
            let result = {}
            if (findResult.name) result.name = findResult.name;
            if (findResult.email) result.email = findResult.email;
            if (findResult.phone) result.phone = findResult.phone;
            if (findResult.birthday) result.birthday = findResult.birthday;
            if (findResult.gender) result.gender = findResult.gender;
            if (findResult.store_id) result.store_id = findResult.store_id;
            result.verityCode = (findResult.verityCode === true);
            if (findResult.update_date) result.update_date = findResult.update_date;
            if (findResult.create_date) result.create_date = findResult.create_date;
            console.log('Found documents =>', result);
            return result;
        } catch (err) {
            throw "伺服器錯誤，請稍後在試";
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}