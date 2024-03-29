const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

module.exports = async function memberLogin(data, onTime) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);

    let existData;

    try {
        const profile = JSON.parse(data);
        if (!profile.id) throw new Error("向 Google 請求資料失敗");
        const findResult = await member.findOne({
            googleID: profile.id,
            email: profile.email
        });
        if (!findResult) {
            const memberData = {
                googleID: profile.id,
                name: profile.name,
                email: profile.email,
                verityCode: profile.verified_email,
                picture: profile.picture,
                locale: profile.locale,
                role: ["user"],
                update_date: onTime,
                create_date: onTime,
                phoneVerify: {
                    code: "00000000",
                    verified: false,
                    times: 0,
                    lastSend: "2022-01-01 00:00:00"
                }
            };
            for (key in memberData) {
                if (!key) throw new Error("資料存取錯誤");
            }
            const insertResult = await member.insertOne(memberData);
            if (!insertResult) throw new Error("資料儲存過程發生錯誤");
            existData = memberData;
            existData.id = insertResult.insertedId;
        } else {
            existData = findResult;
        }
        existData.refresh_token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // token7天後過期。
                data: existData._id.toString()
            },
            config.fresh_secret
        );
        if (!findResult) return {
            _id: existData._id,
            name: existData.name,
            email: existData.email,
            verityCode: profile.verified_email,
            locale: profile.locale,
            picture: profile.picture,
            update_date: existData.update_date,
            create_date: existData.create_date,
            role: existData.role,
            refresh_token: existData.refresh_token,
            phoneVerify: false
        };

        // 更新資料
        const updateData = await member.updateOne({ _id: existData._id }, {
            $set: {
                refresh_token: existData.refresh_token,
                name: profile.name,
                email: profile.email,
                verityCode: profile.verified_email,
                locale: profile.locale,
                picture: profile.picture,
                update_date: onTime
            }
        });
        if (!updateData) throw new Error("資料更新失敗");
        return {
            _id: existData._id,
            name: existData.name,
            email: profile.email,
            verityCode: profile.verified_email,
            locale: profile.locale,
            picture: profile.picture,
            update_date: onTime,
            create_date: existData.create_date,
            role: existData.role,
            refresh_token: existData.refresh_token,
            phoneVerify: existData.phoneVerify.verified
        };
    } catch (err) {
        throw err;
    } finally {
        await client.close()
    }
}