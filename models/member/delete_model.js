const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function deleteAction(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(data.id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        if (memberResult.name != data.name) throw new Error("密碼錯誤");
        const storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });

        // 商家product刪除
        if (storeResult) {
            const deleteResult = await product.deleteMany({ _id: { $in: storeResult.product } });
            if (!deleteResult) throw new Error("刪除商品時發生錯誤");
            const deleteCheck = await product.deleteMany({ belong: storeResult._id.toString() });
        }

        // 商家資料刪除
        if (storeResult) {
            const deleteResult = await store.deleteOne({ _id: storeResult._id });
            if (!deleteResult) throw new Error("刪除商家資料時發生錯誤");
            const deleteCheck = await store.deleteMany({ belong: data.id });
        }

        // 刪除帳號
        const deleteResult = await member.deleteOne({ _id: ObjectId(data.id) });
        if (!deleteResult) throw new Error("刪除帳號時發生錯誤");
        return "成功刪除帳號";
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}