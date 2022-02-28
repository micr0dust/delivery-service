const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function addProduct(id, productData) {
    let insertResult;
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        let storeResult;
        try {
            const memberResult = await member.findOne({ _id: ObjectId(id) });
            if (!memberResult) throw new Error("查無帳號，請重新登入");
            storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });
            if (!storeResult) throw new Error('查無商家，請確認該帳號確實擁有店家身分');
            productData.belong = storeResult._id.toString();
        } catch (err) {
            throw err;
        }
        // 將資料寫入資料庫
        try {
            insertResult = await product.insertOne(productData);
            if (!insertResult) throw new Error("資料插入時發生錯誤");
            // 帳號product綁定
            try {
                const updateResult = await store.updateOne({ _id: ObjectId(productData.belong) }, {
                    $push: {
                        product: insertResult.insertedId
                    }
                });
                if (!updateResult) throw new Error("商家和商品綁定時發生錯誤");
            } catch (err) {
                throw err;
            }
            return productData;
        } catch (err) {
            throw err;
        }

    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}