const client = require('../connection_db');
const config = require('../../config/development_config');

module.exports = async function getProduct(storeData) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        try {
            const storeResult = await store.findOne({ name: storeData.name, address: storeData.address });
            if (!storeResult) throw new Error("查無店家，請確認資料是否正確");
            const productResult = await product.find({ _id: { $in: storeResult.product } }).toArray();
            if (!productResult) throw new Error("查無此商家商品");
            for (let i = 0; i < productResult.length; i++) {
                productResult[i] = {
                    name: productResult[i].name,
                    price: productResult[i].price,
                    describe: productResult[i].describe,
                    type: productResult[i].type
                }
            }
            if (productResult) return productResult;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}