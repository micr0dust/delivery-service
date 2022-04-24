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
            if (!memberResult) throw new Error("查無帳號，請重新登入")
            const findResult = await store.findOne({ belong: memberResult._id.toString() });
            if (findResult) return {
                name: findResult.name,
                address: findResult.address,
                create_date: findResult.create_date,
                last_login: findResult.last_login,
                url: findResult.url,
                product: findResult.product
            };
            throw new Error("查無此帳號擁有的商店");
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}