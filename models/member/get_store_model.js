const client = require('../connection_db');
const config = require('../../config/development_config');

module.exports = async function getStore(_id, storeData) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        const storeResult = await store.findOne({ url: storeData.url });
        if (!storeResult) throw new Error("查無店家，請確認 id 是否正確");
        if (!storeResult.product) return [];

        const productResult = await product.find({ _id: { $in: storeResult.product } }).toArray();
        if (!productResult) throw new Error("查無此商家商品");

        const productData = [];
        for (let i = 0; i < productResult.length; i++) {
            productData.push({
                id: productResult[i]._id.toString(),
                name: productResult[i].name,
                price: productResult[i].price,
                describe: productResult[i].describe,
                type: productResult[i].type,
                discount: productResult[i].discount || "[]",
                options: productResult[i].options,
                pause: productResult[i].pause,
                thumbnail: productResult[i].thumbnail,
                last_update: productResult[i].last_update
            });
        }
        //const today = [];
        const now = new Date();
        const UTC8Time = new Date(
            now.getTime() + (8 * 60 + now.getTimezoneOffset()) * 60 * 1000
        );
        const day = UTC8Time.getDay();
        // for (let i = 0; i < storeResult.businessTime.length; i++)
        //     today.push(storeResult.businessTime[i][day]);
        const result = {
            name: storeResult.name,
            address: storeResult.address,
            url: storeResult.url,
            timeEstimate: storeResult.timeEstimate,
            businessTime: storeResult.businessTime,
            place: storeResult.place,
            describe: storeResult.describe,
            discount: storeResult.allDiscount || "[]",
            product: productData,
            location: storeResult.location,
            thumbnail: storeResult.thumbnail,
            host: `https://${config.aws.bucket}.s3.amazonaws.com/store/product`
        };

        return result;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}