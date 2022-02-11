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
        let errValue = '伺服器錯誤，請稍後在試'
        try {
            const findResult = await store.findOne({ belong: storeData.belong });
            console.log('Found documents =>', findResult);
            if (findResult) throw (errValue = '該帳號已綁定店家');
        } catch (err) {
            throw errValue;
        }
        // 將資料寫入資料庫
        try {
            insertResult = await store.insertOne(storeData);
            console.log(insertResult);
            // 帳號store綁定
            try {
                if (!insertResult) throw errValue;
                console.log(storeData.belong);
                console.log(insertResult.insertedId.toString());
                const updateResult = await member.updateOne({ _id: ObjectId(storeData.belong) }, {
                    $set: {
                        store_id: insertResult.insertedId.toString()
                    }
                });
                console.log(updateResult);
            } catch (err) {
                throw errValue;
            }
            return storeData;
        } catch (err) {
            throw errValue;
        }

    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}