const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function addProduct(id, productData) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        if (productData.options) {
            const optionsData = JSON.parse(productData.options);
            optionsData.forEach(element => {
                if (typeof element.requires != "boolean") throw new Error("requires 須為 boolean 型別");
                if (typeof element.multiple != "boolean") throw new Error("multiple 須為 boolean 型別");
                if (!/^.{0,15}$/.test(element.title)) throw new Error("標題應為0~15字");
                element.option.forEach(opt => {
                    if (!/^.{0,10}$/.test(opt.name)) throw new Error("選項應為0~10字");
                    if (!/^-?\d+/.test(opt.cost)) throw new Error("選項金額格式錯誤");
                });
            });
        }

        const memberResult = await member.findOne({ _id: ObjectId(id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        const storeResult = await store.findOne({ _id: ObjectId(memberResult.store_id) });
        if (!storeResult) throw new Error('查無商家，請確認該帳號確實擁有店家身分');
        productData.belong = storeResult._id.toString();


        // 將資料寫入資料庫
        const insertResult = await product.insertOne(productData);
        if (!insertResult) throw new Error("資料插入時發生錯誤");

        // 帳號product綁定
        const updateResult = await store.updateOne({ _id: ObjectId(productData.belong) }, {
            $push: {
                product: insertResult.insertedId
            }
        });
        if (!updateResult) throw new Error("商家和商品綁定時發生錯誤");

        return productData;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}