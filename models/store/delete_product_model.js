const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function delProduct(data) {
    let targetProduct;
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        let errValue = '伺服器錯誤，請稍後在試';
        try {
            const storeResult = await store.findOne({ _id: ObjectId(data.store) });
            if (!storeResult) throw (errValue = "請確認是否為登入狀態");
            console.log(data.product);
            const productResult = await product.findOne({ _id: ObjectId(data.product) });
            if (!productResult) throw (errValue = "請確認是否有該商品");
            targetProduct = productResult;
            if (storeResult._id.toString() != productResult.belong) throw (errValue = "請確認是否為該商品所有者");
        } catch (err) {
            throw errValue;
        }
        // 將資料刪除
        try {
            const deleteResult = await product.deleteOne({ _id: ObjectId(data.product) });
            if (!deleteResult) throw errValue;
            console.log(deleteResult);
            // 帳號product綁定
            try {
                const updateResult = await store.updateOne({ _id: ObjectId(targetProduct.belong) }, {
                    $pull: { product: targetProduct._id }
                });
                console.log(updateResult);
            } catch (err) {
                throw errValue;
            }
            return "成功刪除商品";
        } catch (err) {
            throw errValue;
        }

    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}