const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

module.exports = async function memberLogin(accessToken) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    let profile, memberData;

    try {
        try {
            profile = new Promise((resolve, reject) => {
                if (!accessToken) {
                    resolve(null);
                    return;
                };
                request(
                    `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`,
                    function(error, response, body) {
                        if (error) {
                            console.log(error)
                        }
                        console.log(body);
                        body = JSON.parse(body);
                        if (body.error) {
                            reject(body.error);
                        } else {
                            resolve(body);
                        }
                    }
                )
            })
            if (!profile) throw new Error("向 Google 請求資料失敗");

            const findResult = await collection.findOne({
                email: profile.email
            });
            if (!findResult) throw new Error("請輸入正確的帳號或密碼");
            memberData = findResult;
        } catch (err) {
            throw err;
        }

        memberData.refresh_token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // token7天後過期。
                data: memberData._id.toString()
            },
            config.fresh_secret
        );

        // 更新資料
        try {
            memberData.name = profile.name;
            memberData.picture = profile.picture;
            const refreshToken = await collection.updateOne({ _id: memberData._id }, {
                $set: {
                    refresh_token: memberData.refresh_token,
                    name: memberData.name,
                    picture: memberData.picture
                }
            });
            if (!refreshToken) throw new Error("資料更新失敗");
            return {
                name: memberData.name,
                email: memberData.email,
                picture: memberData.picture,
                create_date: memberData.create_date,
                role: memberData.role
            };
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err
    } finally {
        client.close()
    }
}