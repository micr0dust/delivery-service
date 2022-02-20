const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getProduct(storeData) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        try {
            const storeResult = await store.findOne({ name: storeData.name, address: storeData.address });
            const productResult = await product.find({ _id: { $in: storeResult.product } }).toArray();
            for (let i = 0; i < productResult.length; i++) {
                productResult[i] = {
                    name: productResult[i].name,
                    price: productResult[i].price,
                    describe: productResult[i].describe,
                    type: productResult[i].type
                }
            }
            console.log('Found documents =>', productResult);
            if (productResult) return productResult;
            if (!productResult) throw err;
        } catch (err) {
            throw "伺服器錯誤，請稍後在試";
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}