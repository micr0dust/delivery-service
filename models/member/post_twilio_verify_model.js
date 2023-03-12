const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function mailEmit(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    try {
        const tryTimes = 10;
        const memberResult = await member.findOne({ _id: ObjectId(data._id) });
        if (!memberResult)
            throw new Error("查無帳號，請重新登入");

        const now = new Date(data.time);
        const past = new Date(memberResult.time);
        const exp = now - past;

        if (memberResult["phoneVerify"]["tryTimes"] >= tryTimes)
            throw new Error("超過驗證嘗試次數，請請求新驗證碼");
        if (exp > 1000 * (60) * (10))
            throw new Error("驗證碼超時");
        if (memberResult["phoneVerify"]["verified"] === true)
            throw new Error("此手機號碼已被驗證過");
        if (data["code"] === memberResult["phoneVerify"]["code"]) {
            const updateResult = await member.updateOne({ _id: ObjectId(data._id) }, {
                $set: {
                    phoneVerify: {
                        code: memberResult["phoneVerify"]["code"],
                        verified: true,
                        times: memberResult["phoneVerify"]["times"],
                        lastSend: memberResult["phoneVerify"]["lastSend"],
                        tryTimes: 0
                    }
                }
            });
            if (!updateResult) new Error("資料庫更新失敗");
            return "驗證成功";
        } else {
            const updateResult = await member.updateOne({ _id: ObjectId(data._id) }, {
                $set: {
                    phoneVerify: {
                        code: memberResult["phoneVerify"]["code"],
                        verified: memberResult["phoneVerify"]["verified"],
                        times: memberResult["phoneVerify"]["times"],
                        lastSend: memberResult["phoneVerify"]["lastSend"],
                        tryTimes: memberResult["phoneVerify"]["tryTimes"] + 1
                    }
                }
            });
            if (!updateResult) new Error("資料庫更新失敗");
            throw new Error(`驗證碼錯誤，還剩 ${tryTimes-memberResult["phoneVerify"]["tryTimes"]-1} 次嘗試機會`);
        }

    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}