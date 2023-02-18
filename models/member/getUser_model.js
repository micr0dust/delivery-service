const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getUser(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        const findResult = await collection.findOne({ _id: ObjectId(id) });
        if (!findResult) throw new Error("查無帳號，請重新登入");
        const data = {
            name: findResult.name || null,
            email: findResult.email || null,
            phone: findResult.phone || null,
            birthday: findResult.birthday || null,
            gender: findResult.gender || null,
            locale: findResult.locale || null,
            picture: findResult.picture || null,
            store_id: findResult.store_id || null,
            role: findResult.role || null,
            verityCode: findResult.verityCode === true,
            update_date: findResult.update_date || null,
            create_date: findResult.create_date || null,
            phoneVerify: findResult.phoneVerify.verified || null
        };
        Object.keys(data).forEach((key) => !data[key] && delete data[key]);
        return data;
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}