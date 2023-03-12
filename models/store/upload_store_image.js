const client = require('../connection_db');
const config = require('../../config/development_config');
const s3 = require('../upload_file');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function uploadStoreImg(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(data._id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        if (!(~memberResult.role.indexOf("store"))) throw new Error("查無店家身分");
        const storeResult = await store.findOne({ belong: memberResult._id.toString() });
        if (!storeResult) return "查無此帳號擁有的商店";

        const path = 'store/main';

        if (storeResult.thumbnail) {
            s3.putObject({
                Bucket: `${config.aws.bucket}/${path}`,
                Key: storeResult.url,
                Body: data.image.buffer,
                ACL: 'public-read',
                ContentType: data.image.mimetype
            }, function(err, data) {
                if (err) console.log(err, err.stack);
            });
        } else {
            const params = {
                Bucket: `${config.aws.bucket}/${path}`,
                Key: storeResult.url,
                Body: data.image.buffer,
                ACL: 'public-read',
                ContentType: data.image.mimetype
            };

            s3.upload(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log('Bucket Created Successfully', data.Location);
            });

            const updateStore = await store.updateOne({ belong: memberResult._id.toString() }, {
                $set: {
                    thumbnail: `https://${config.aws.bucket}.s3.amazonaws.com/${path}/${storeResult.url}`
                }
            });
            if (!updateStore) throw new Error("資料更新至資料庫時發生錯誤");
            return `https://${config.aws.bucket}.s3.amazonaws.com/${path}/${storeResult.url}`;
        }
        return `https://${config.aws.bucket}.s3.amazonaws.com/${path}/${storeResult.url}`;
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}