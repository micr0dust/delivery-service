const client = require('../connection_db');
const notifyPush = require('../push_notification');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function subscribeNotification(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(data._id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");

        // 更新資料庫資料
        const updateResult = await member.updateOne({ _id: ObjectId(data._id) }, {
            $set: { notify_id: data.user_id }
        });
        if (!updateResult) throw new Error("資料庫更新失敗");

        return "通知訂閱成功";

        // const message = {
        //     app_id: config.onesignal.id,
        //     contents: { "zh-Hant": "通知訂閱成功", "en": "notification subscribe successful" },
        //     included_segments: ["included_player_ids"],
        //     include_player_ids: [data.user_id],
        //     content_availabe: true,
        //     small_icon: "ic_notification_icon",
        //     data: {
        //         method: "test"
        //     },
        // };

        // notifyPush.sendNotification(message, (error, result) => {
        //     if (error) throw error;
        //     console.log(result);
        // });
        // return "測試通知已發送，請確認有無收到通知";
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}