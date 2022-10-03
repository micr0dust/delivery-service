const client = require('../connection_db');
const notifyPush = require('../push_notification');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function putFinish(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);
    const member = db.collection(config.mongo.member);

    try {
        const storeResult = await store.findOne({ _id: ObjectId(data.id) });
        if (!storeResult) throw new Error("查無店家");
        const storeUrl = storeResult.url;

        const findResult = await order.findOne({ _id: ObjectId(data.orderID) });
        if (!findResult) throw new Error("查無訂單");
        if (findResult.store != storeUrl) throw new Error("該訂單屬於其他店家");
        if (findResult.finish === true) throw new Error("訂單已經標記為完成");
        const putResult = await order.updateOne({ _id: ObjectId(data.orderID) }, {
            $set: {
                finish: true,
                comments: data.comments
            }
        });
        if (!putResult) throw new Error("嘗試標記訂單為完成時發生錯誤");

        const memberResult = await member.findOne({ _id: ObjectId(findResult.id) });
        if (!memberResult) throw new Error("查無消費者帳號");
        if (memberResult['notify_id']) {
            const message = {
                app_id: config.onesignal.id,
                contents: { "zh-Hant": "店家已經完成訂單", "en": "order finished" },
                included_segments: ["included_player_ids"],
                include_player_ids: [memberResult['notify_id']],
                content_availabe: true,
                small_icon: "ic_notification_icon",
                data: {
                    PushTitle: data.orderID
                },
            };

            notifyPush.sendNotification(message, (error, result) => {
                if (error) throw error;
            });
        }
        return true;
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}