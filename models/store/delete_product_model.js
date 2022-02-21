const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function deleteProduct(data) {
    let insertResult;
    await client.connect();
    const db = client.db(config.mongo.database);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        let errValue = '伺服器錯誤，請稍後在試';
        try {
            const storeResult = await store.findOne({ _id: ObjectId(data.store) });
            if (!storeResult) throw (errValue = '請確認是否為登入狀態');
            const productResult = await product.findOne({ _id: ObjectId(data.product) });
            if (!productResult) throw (errValue = '請確認是否為登入狀態');
            console.log('Found documents =>', storeResult);
        } catch (err) {
            throw errValue;
        }
        // 將資料刪除
        try {
            deleteResult = await product.delete(data.product);
            console.log(insertResult);
            // 帳號product綁定
            try {
                if (!insertResult) throw errValue;
                console.log(productData.belong);
                console.log(insertResult.insertedId.toString());
                const updateResult = await store.updateOne({ _id: ObjectId(productData.belong) }, {
                    $push: {
                        product: insertResult.insertedId
                    }
                });
                console.log(updateResult);
            } catch (err) {
                throw errValue;
            }
            return productData;
        } catch (err) {
            throw errValue;
        }

    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}