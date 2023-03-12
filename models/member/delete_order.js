const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function delOrder(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const order = db.collection(config.mongo.order);

    try {
        const memberResult = await member.findOne({ _id: ObjectId(data._id) });
        if (!memberResult) throw new Error("查無帳號，請重新登入");
        const orderResult = await order.findOne({ _id: ObjectId(data.orderID) });
        if (orderResult.id != data._id) throw new Error("此訂單不屬於你的帳號");
        if (orderResult.accept === true) throw new Error("店家已經接受訂單，無法取消");
        if (orderResult.complete === true && orderResult.comments) throw new Error(`此訂單已被拒絕，原因：${orderResult.comments}`);
        if (orderResult.complete === true) throw new Error("此訂單已被撤回");

        const putResult = await order.updateOne({ _id: ObjectId(data.orderID) }, {
            $set: { complete: true }
        });
        if (!putResult) throw new Error("撤回訂單時發生錯誤");

        return "成功撤回訂單";
    } catch (err) {
        throw err;
    } finally {
        //await client.close();
    }
}