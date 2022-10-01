const client = require('../connection_db');
const notifyPush = require('../push_notification');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function putAccept(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const order = db.collection(config.mongo.order);
    const store = db.collection(config.mongo.store);

    try {
        const storeResult = await store.findOne({ _id: ObjectId(data.id) });
        if (!storeResult) throw new Error("查無店家");
        const storeUrl = storeResult.url;

        const findResult = await order.findOne({ _id: ObjectId(data.orderID) });
        if (!findResult) throw new Error("查無訂單");
        if (findResult.store != storeUrl) throw new Error("該訂單屬於其他店家");
        if (findResult.accept === true) throw new Error("已經接受過該訂單");
        if (findResult.complete === true) throw new Error("訂單已被撤回");
        const putResult = await order.updateOne({ _id: ObjectId(data.orderID) }, {
            $set: {
                accept: true,
                comments: data.comments
            }
        });
        if (!putResult) throw new Error("接受訂單時發生錯誤");

        const memberResult = await member.findOne({ _id: ObjectId(findResult.id) });
        if (!memberResult) throw new Error("查無消費者帳號");
        if (!memberResult[device]) throw new Error("無法通知消費者");
        const message = {
            app_id: config.onesignal.id,
            contents: { en: data.orderID },
            include_segments: ["included_player_ids"],
            include_players_ids: [memberResult[notify_id]],
            content_availabe: true,
            small_icon: "ic_notification_icon",
            data: {
                PushTitle: "店家已經接受訂單"
            },
        };

        notifyPush.sendNotification(message, (error, result) => {
            if (error) throw error;
            return "成功接受訂單並通知消費者";
        });
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}