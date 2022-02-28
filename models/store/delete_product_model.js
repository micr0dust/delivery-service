const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function delProduct(data) {
    let targetProduct;
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        try {
            const memberResult = await member.findOne({ _id: ObjectId(data.id) });
            if (!memberResult) throw new Error("查無帳號，請重新登入");
            const storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });
            if (!storeResult) throw new Error("查無商家，請確認該帳號確實擁有店家身分");
            const productResult = await product.findOne({ _id: ObjectId(data.product) });
            if (!productResult) throw new Error("請確認是否有該商品");
            targetProduct = productResult;
            if (storeResult._id.toString() != productResult.belong) throw new Error("請確認是否為該商品所有者");
        } catch (err) {
            throw err;
        }
        // 將資料刪除
        try {
            const deleteResult = await product.deleteOne({ _id: ObjectId(data.product) });
            if (!deleteResult) throw new Error("刪除資料時發生錯誤");
            // 帳號product綁定
            try {
                const updateResult = await store.updateOne({ _id: ObjectId(targetProduct.belong) }, {
                    $pull: { product: targetProduct._id }
                });
                if (!updateResult) throw new Error("商家和商品解除綁定時發生錯誤");
            } catch (err) {
                throw err;
            }
            return "成功刪除商品";
        } catch (err) {
            throw err;
        }

    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}