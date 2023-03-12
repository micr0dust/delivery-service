const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function customerEdit(id, data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);

    try {
        const findResult = await member.findOne({ _id: ObjectId(id) });
        if (!findResult) throw new Error("查無帳號，請重新登入");

        const numberExist = await member.findOne({ phone: data.phone});
        if (numberExist) throw new Error("此電話已被註冊");
        
        // 更新資料庫資料
        await member.updateOne({ _id: ObjectId(id) }, {
            $set: data
        });

        if(data.phone && findResult["phoneVerify"])
            await member.updateOne({ _id: ObjectId(id) }, {
                $set: {
                    phoneVerify: {
                        code: findResult["phoneVerify"]["code"],
                        verified: false,
                        times: findResult["phoneVerify"]["times"],
                        lastSend: findResult["phoneVerify"]["lastSend"],
                        tryTimes: findResult["phoneVerify"]["tryTimes"]
                    }
                }
            });

        return data;
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}