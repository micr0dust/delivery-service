const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function storeUpdate(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    try {
        const memberResult = await member.findOne({ _id: ObjectId(data.id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入")
        const storeResult = await store.findOne({ belong: memberResult._id.toString() });
        if (!storeResult) throw new Error("查無此帳號擁有的商店");
        const storeID = storeResult._id.toString();

        if (!data.location.lat || !data.location.lng || !data.location.googlePlaceId)
            delete data['location'];

        if (data.businessTime) {
            const businessTime = JSON.parse(data.businessTime);
            if (!(businessTime[0].constructor === Array))
                throw new Error("營業時間為 24x7 的二維陣列");
            for (let i = 0; i < 24; i++)
                for (let j = 0; j < 7; j++) {
                    if (!businessTime[i][j] && businessTime[i][j] != false)
                        throw new Error(`營業時間陣列[${i}][${j}] 不得為空`);
                    else if (typeof businessTime[i][j] != 'boolean')
                        throw new Error(`營業時間陣列[${i}][${j}] 須為 boolean`);
                }
            data.businessTime = JSON.parse(data.businessTime);
        }

        await store.updateOne({ _id: ObjectId(storeID) }, {
            $set: data
        });
        return data;
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}