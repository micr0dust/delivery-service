const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function addProduct(_id, data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(_id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        const storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });
        if (!storeResult) throw new Error('查無商家，請確認該帳號確實擁有店家身分');
        const productResult = await product.findOne({ _id: ObjectId(data.productID) });
        if (!productResult) throw new Error('查無商品，請確認商品 ID 是否正確');
        if (productResult.belong != storeResult._id.toString()) throw new Error('該商品不屬於你的商店');

        // 將資料寫入資料庫
        productResult.pause = Boolean(!productResult.pause);
        const updateProduct = await product.updateOne({ _id: ObjectId(data.productID) }, {
            $set: { pause: productResult.pause }
        });
        if (!updateProduct) throw new Error("資料更新至資料庫時發生錯誤");

        return {
            name: productResult.name,
            price: productResult.price,
            describe: productResult.describe,
            type: productResult.type,
            discount: productResult.discount,
            options: productResult.options,
            pause: productResult.pause
        };
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}