const client = require('../connection_db');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');
const appleSignin = require('apple-signin-auth');
const fs = require('fs');

module.exports = async function memberLogin(code, onTime) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const privateKey = fs.readFileSync("./AuthKey_UNPJD6U65A.p8", 'utf8')
    let existData;
    try {
        const clientSecret = appleSignin.getClientSecret({
            clientID: config.apple.clientID, // Apple Client ID
            teamID: config.apple.teamID, // Apple Developer Team ID.
            privateKey: privateKey, // private key associated with your client ID. -- Or provide a `privateKeyPath` property instead.
            keyIdentifier: config.apple.keyID, // identifier of the private key.
            // OPTIONAL
            expAfter: 15777000, // Unix time in seconds after which to expire the clientSecret JWT. Default is now+5 minutes.
        });
        console.log(clientSecret);
        const options = {
            clientID: config.apple.clientID, // Apple Client ID
            redirectUri: config.heroku.hostname+'/member/google/callback', // use the same value which you passed to authorisation URL.
            clientSecret: clientSecret
        };
        const tokenResponse = await appleSignin.getAuthorizationToken(code, options);
        if (!tokenResponse) throw new Error("嘗試取得 Apple 驗證 token 失敗");
        const { sub: userAppleId, email, email_verified } = await appleSignin.verifyIdToken(tokenResponse.id_token, {
            // Optional Options for further verification - Full list can be found here https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
            audience: config.apple.clientID, // client id - can also be an array
            nonce: 'NONCE', // nonce // Check this note if coming from React Native AS RN automatically SHA256-hashes the nonce https://github.com/invertase/react-native-apple-authentication#nonce
            // If you want to handle expiration on your own, or if you want the expired tokens decoded
            ignoreExpiration: true, // default is false
        });
        if (!userAppleId) throw new Error("Apple 登入驗證失敗");

        const profile = JSON.parse(tokenResponse);
        if (!profile.id) throw new Error("向 Apple 請求資料失敗");

        const findResult = await member.findOne({
            appleID: userAppleId,
            email: email
        });
        if (!findResult) {
            const memberData = {
                googleID: userAppleId,
                name: new Date().getTime().toString(36).split('').reverse().join(''),
                email: email,
                verityCode: email_verified,
                picture: "/images/profile.png",
                locale: "未知",
                role: ["user"],
                update_date: onTime,
                create_date: onTime,
                phoneVerify: {
                    code: "00000000",
                    verified: false,
                    times: 0,
                    lastSend: "2022-01-01 00:00:00"
                },
                appleAccessToken: tokenResponse.access_token,
                appleRefreshToken: tokenResponse.refresh_token,
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

        // 更新資料
        if(findResult){
            const updateData = await member.updateOne({ _id: existData._id }, {
                $set: {
                    refresh_token: existData.refresh_token,
                    name: existData.name,
                    email: email,
                    verityCode: email_verified,
                    locale: existData.locale,
                    picture: existData.picture,
                    update_date: onTime,
                    appleAccessToken: tokenResponse.access_token,
                    appleRefreshToken: tokenResponse.refresh_token
                }
            });
            if (!updateData) throw new Error("資料更新失敗");
        }
        
        return {
            _id: existData._id,
            name: existData.name,
            email: existData.email,
            verityCode: existData.verityCode,
            locale: existData.locale,
            picture: existData.picture,
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