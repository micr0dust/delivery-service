const client = require('../connection_db');
const config = require('../../config/development_config');
const mongoFn = require('../../service/mongodbFns');

module.exports = async function getProduct(_id, storeData) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        const storeResult = await store.findOne({ url: storeData.url });
        if (!storeResult) throw new Error("查無店家，請確認 id 是否正確");
        if (!storeResult.product) return [];

        const isOwner = storeResult.belong === _id;
        const productResult = await mongoFn.findToArray(product, { _id: { $in: storeResult.product } });
        if (!productResult) throw new Error("查無此商家商品");

        const responData = [];
        for (let i = 0; i < productResult.length; i++) {
            //if (isOwner || !productResult[i].pause)
            responData.push({
                id: productResult[i]._id.toString(),
                name: productResult[i].name,
                price: productResult[i].price,
                describe: productResult[i].describe,
                type: productResult[i].type,
                discount: productResult[i].discount,
                options: productResult[i].options,
                pause: productResult[i].pause,
                thumbnail: productResult[i].thumbnail,
                last_update: productResult[i].last_update
            });
        }
        return { products: responData, host: `https://${config.aws.bucket}.s3.amazonaws.com/store/product` };
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}