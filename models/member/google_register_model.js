const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

module.exports = async function register(accessToken) {
    let result = {};
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);
    let profile;
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
            });
            if (!profile) throw new Error("向 Google 請求資料失敗");
        } catch (err) {
            throw err;
        }

        try {
            const findResult = await collection.findOne({ email: profile.email });
            if (findResult) throw new Error("該信箱已被註冊");
        } catch (err) {
            throw err;
        }
        // 將資料寫入資料庫
        try {
            const memberData = {
                name: profile.name,
                email: profile.email,
                picture: profile.picture,
                role: ["user"],
                create_date: onTime()
            };
            const insertResult = await collection.insertOne(memberData);
            if (!insertResult) throw new Error("資料儲存過程發生錯誤");
            return memberData;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}