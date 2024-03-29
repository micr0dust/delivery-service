const client = require('../connection_db');
const config = require('../../config/development_config');
const twilio = require('twilio')(config.teilio.id, config.teilio.token);

var ObjectId = require('mongodb').ObjectId;

module.exports = async function deleteAction(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);

    try {
        const maxTryPerDay = 3;
        const waitHours = 20;
        const memberResult = await member.findOne({ _id: ObjectId(data._id) });
        const timeUntilLast = memberResult["phoneVerify"] ? new Date(memberResult["phoneVerify"]["lastSend"]) : new Date(0);
        const nowTime = new Date(data["time"]);
        const getTimes = memberResult["phoneVerify"] ? memberResult["phoneVerify"]["times"] : 0;
        const times = nowTime - timeUntilLast > 1000 * 3600 * waitHours ? 0 : getTimes + 1;
        let phoneNumber = memberResult["phone"];

        if (!phoneNumber)
            throw new Error("查無電話號碼");
        if (memberResult["phoneVerify"] && memberResult["phoneVerify"]["verified"] === true)
            throw new Error("電話號碼已經驗證過");
        if (memberResult["phoneVerify"] && memberResult["phoneVerify"]["times"] >= maxTryPerDay && nowTime - timeUntilLast < 1000 * 3600 * waitHours)
            throw new Error(`已達到簡訊請求上限，請等待 ${waitHours} 小時後再嘗試`);
        if (memberResult["phone"][0] === '0')
            memberResult["phone"].split('0')[1];
        if (phoneNumber[0] === '0')
            phoneNumber = phoneNumber.substr(1, phoneNumber.length - 1);
        let phoneVerify = createNum();
        const updateResult = await member.updateOne({ _id: ObjectId(data._id) }, {
            $set: {
                phoneVerify: {
                    code: phoneVerify,
                    verified: false,
                    times: times,
                    lastSend: data["time"],
                    tryTimes: 0
                }
            }
        });

        const messages = await twilio.messages
            .create({
                body: `你的 Foodone 驗證碼為 ${phoneVerify}`,
                from: config.teilio.phone,
                to: '+886' + phoneNumber
            });
        return messages.sid ? `還剩 ${maxTryPerDay-times} 次簡訊發送機會` : messages;
    } catch (err) {
        throw err;
    } finally {
        //s
    }

    function createNum() {
        var Num = "";
        for (var i = 0; i < 8; i++)
            Num += Math.floor(Math.random() * 10);

        return Num;
    }
}