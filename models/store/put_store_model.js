const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function storeUpdate(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    try {
        let storeID;
        try {
            const memberResult = await member.findOne({ _id: ObjectId(data.id) });
            if (!memberResult) throw new Error("查無帳號，請重新登入")
            const storeResult = await store.findOne({ belong: memberResult._id.toString() });
            if (!storeResult) throw new Error("查無此帳號擁有的商店");
            storeID = storeResult._id.toString();
        } catch (err) {
            throw err;
        }

        // 更新資料庫資料
        try {
            let putData = {};
            if (data.name) putData.name = data.name;
            if (data.address) putData.address = data.address;
            if (data.allDiscount) putData.allDiscount = data.allDiscount;

            for (key in putData)
                await store.updateOne({ _id: ObjectId(storeID) }, {
                    $set: {
                        [key]: putData[key]
                    }
                });
            return putData;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}