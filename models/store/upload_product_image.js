const client = require('../connection_db');
const config = require('../../config/development_config');
const s3 = require('../upload_file');
const uuid = require("uuid");

var ObjectId = require('mongodb').ObjectId;

module.exports = async function uploadProductImg(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(data.id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        if (!(~memberResult.role.indexOf("store"))) throw new Error("查無店家身分");
        const storeResult = await store.findOne({ belong: memberResult._id.toString() });
        if (!storeResult) return "查無此帳號擁有的商店";
        const productResult = await product.findOne({ _id: ObjectId(data.productID) });
        if (!productResult) throw new Error(`查無商品 ID：${data.productID}`);
        if (productResult.belong != memberResult.store_id) throw new Error(`此商品不屬於商店 ${id}`);

        const path = 'store/product';

        if (productResult.thumbnail) {
            s3.putObject({
                Bucket: `${config.aws.bucket}/${path}`,
                Key: data.productID,
                Body: data.image.buffer,
                ACL: 'public-read',
                ContentType: data.image.mimetype
            }, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log();
            });
        } else {
            const params = {
                Bucket: `${config.aws.bucket}/${path}`,
                Key: data.productID,
                Body: data.image.buffer,
                ACL: 'public-read',
                ContentType: data.image.mimetype
            };

            s3.upload(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log('Bucket Created Successfully', data.Location);
            });

            const updateProduct = await product.updateOne({ _id: ObjectId(data.productID) }, {
                $set: { thumbnail: true }
            });
            if (!updateProduct) throw new Error("資料更新至資料庫時發生錯誤");
            return `https://${config.aws.bucket}.s3.amazonaws.com/${path}/${params.Key}`;
        }
        return storeResult.thumbnail;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}