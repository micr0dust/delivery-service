const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function storeEstablish(storeData) {
    let insertResult;
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const member = db.collection(config.mongo.member);

    try {
        try {
            const memberResult = await member.findOne({ _id: ObjectId(storeData.belong) });
            if (!memberResult) throw new Error('查無帳號，請重新登入');
            const storeResult = await store.findOne({ belong: storeData.belong });
            if (storeResult) throw new Error('該帳號已綁定店家');
        } catch (err) {
            throw err;
        }
        // 將資料寫入資料庫
        try {
            insertResult = await store.insertOne(storeData);
            if (!insertResult) throw new Error("資料寫入過程中發生錯誤");
            // 帳號store綁定
            try {
                const updateResult = await member.updateOne({ _id: ObjectId(storeData.belong) }, {
                    $set: {
                        store_id: insertResult.insertedId.toString()
                    },
                    $push: {
                        role: "store"
                    }
                });
                if (!updateResult) throw new Error("帳號和商店間綁定發生錯誤");
            } catch (err) {
                throw err;
            }
            return storeData;
        } catch (err) {
            throw err;
        }

    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}