const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function storeData(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    try {
        const memberResult = await member.findOne({ _id: ObjectId(id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        if (!(~memberResult.role.indexOf("store"))) throw new Error("查無店家身分");
        const findResult = await store.findOne({ belong: memberResult._id.toString() });
        if (!findResult) return "查無此帳號擁有的商店";
        return {
            name: findResult.name,
            address: findResult.address,
            create_date: findResult.create_date,
            last_update: findResult.last_update,
            url: findResult.url,
            product: findResult.product,
            place: findResult.place || null,
            allDiscount: findResult.allDiscount || null,
            timeEstimate: findResult.timeEstimate || null,
            businessTime: findResult.businessTime || null,
            describe: findResult.describe || "",
            location: findResult.location,
            thumbnail: findResult.thumbnail
        };
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}