const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function mailEmit(id, time) {
    let member;
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        try {
            member = await collection.findOne({ _id: ObjectId(id) });
            console.log('Found documents =>', member);
            if (!member) throw err;
        } catch (err) {
            throw "伺服器錯誤，請稍後再試";
        }

        let verityCode = createSixNum();

        try {
            const updateResult = await collection.updateOne({ _id: ObjectId(id) }, { $set: { verityCode: verityCode, update_date: time } });
        } catch (err) {
            throw "伺服器錯誤，請稍後再試";
        }
        // 寄驗證信
        try {
            //OAuth2 驗證
            // const oauth2Client = new OAuth2(
            //     config.mail.id,
            //     config.mail.secret, // Client Secret
            //     "https://developers.google.com/oauthplayground" // Redirect URL
            // );
            // oauth2Client.setCredentials({
            //     refresh_token: config.mail.freshToken
            // });
            // const accessToken = oauth2Client.getAccessToken();
            // const transporter = nodemailer.createTransport({
            //     host: 'smtp.gmail.com',
            //     port: 465,
            //     secure: true,
            //     auth: {
            //         type: "OAuth2",
            //         user: config.mail.account,
            //         clientId: config.mail.id,
            //         clientSecret: config.mail.secret,
            //         refreshToken: config.mail.freshToken,
            //         accessToken: accessToken
            //     },
            //     tls: {
            //         rejectUnauthorized: false
            //     }
            // });
            //低安全性驗證
            // console.log(config.mail.account, config.mail.password);
            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: config.mail.account,
            //         pass: config.mail.password,
            //     },
            //     tls: {
            //         rejectUnauthorized: false,
            //     }
            // });
            //nodemailer SMTP 伺服器測試
            var transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "c6acc18c2879f4",
                    pass: "8ec458587916cd"
                }
            });
            console.log(member.email, verityCode);
            // send mail with defined transport object
            const mailOptions = {
                from: config.mail.account,
                to: member.email,
                subject: 'Hello中原外送平台-信箱驗證',
                html: '<h1>' + verityCode + '</h1><p>使用者 ' + member.name + ' 您好，您的驗證碼為 ' + verityCode + '</p><p>驗證碼將在十分鐘後無效，如果你沒有註冊過本平台請無視此郵件</p>',
            };
            transporter.sendMail(mailOptions, (error, response) => {
                error ? console.log(error) : console.log(response);
                transporter.close();
            });
        } catch (err) {
            console.log(err);
            throw "驗證信無法寄出";
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }

    function createSixNum() {
        var Num = "";
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        // const token = jwt.sign({
        //     algorithm: 'HS256',
        //     exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一小時後過期。
        //     data: id.toString()
        // }, Num);
        // return token;
        return Num;
    }
}