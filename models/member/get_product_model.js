const client = require('../connection_db');
const config = require('../../config/development_config');

module.exports = async function getProduct(storeData) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        try {
            const storeResult = await store.findOne({ url: storeData.url });
            if (!storeResult) throw new Error("查無店家，請確認 id 是否正確");
            if (!storeResult.product) return [{
                id: "尚未上架任何商品",
                name: "尚未上架任何商品",
                price: 0,
                describe: "",
                type: "",
                discount: "",
                options: ""
            }];
            const productResult = await product.find({ _id: { $in: storeResult.product } }).toArray();
            if (!productResult) throw new Error("查無此商家商品");
            for (let i = 0; i < productResult.length; i++) {
                productResult[i] = {
                    id: productResult[i]._id.toString(),
                    name: productResult[i].name,
                    price: productResult[i].price,
                    describe: productResult[i].describe,
                    type: productResult[i].type,
                    discount: productResult[i].discount,
                    options: productResult[i].options
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