const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function delStore(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(data.id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        const storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });
        if (!storeResult) throw new Error("查無商家，請確認該帳號確實擁有店家身分");
        if (storeResult.name != data.name) throw new Error("店名錯誤");

        // 商家 product 刪除
        if (storeResult.product) {
            const deleteResult = await product.deleteMany({ _id: { $in: storeResult.product } });
            if (!deleteResult) throw new Error("刪除商品時發生錯誤");
            const productDelCheck = await product.deleteMany({ belong: storeResult._id.toString() });
        }

        // 商家資料刪除
        const deleteResult = await store.deleteOne({ _id: storeResult._id });
        if (!deleteResult) throw new Error("刪除商家資料時發生錯誤");
        const storeDelCheck = await store.deleteMany({ belong: data.id });

        // 商家身分解除綁定
        const updateResult = await member.updateOne({ _id: ObjectId(data.id) }, {
            $unset: { store_id: 1 },
            $pull: { role: "store" }
        });
        if (!updateResult) throw new Error("解除綁定商家身分時發生錯誤");
        return "成功刪除商家及其商品";
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}