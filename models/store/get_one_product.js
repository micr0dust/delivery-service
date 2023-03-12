const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function oneProduct(id, data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);
    try {
        const memberResult = await member.findOne({ _id: ObjectId(id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入")
        const storeResult = await store.findOne({ belong: memberResult._id.toString() });
        if (!storeResult) throw new Error("查無此帳號擁有的商店");
        const productResult = await product.findOne({ _id: ObjectId(data.productID) });
        if (!productResult) throw new Error("查無商品");
        if (productResult.belong != storeResult._id.toString()) throw new Error("該商品不屬於你的商店");
        productResult.thumbnail = productResult.thumbnail ? `https://${config.aws.bucket}.s3.amazonaws.com/store/product/${productResult._id.toString()}` : null;
        return productResult;
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}