const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function storeData(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);

    try {
        try {
            const memberResult = await member.findOne({ _id: ObjectId(id) });
            const findResult = await store.findOne({ belong: memberResult._id.toString() });
            console.log('Found documents =>', findResult);
            if (findResult) return {
                name: findResult.name,
                address: findResult.address,
                create_date: findResult.create_date,
                last_login: findResult.last_login,
                product: findResult.product,
            };
            if (!findResult) throw err;
        } catch (err) {
            throw "伺服器錯誤，請稍後在試";
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}