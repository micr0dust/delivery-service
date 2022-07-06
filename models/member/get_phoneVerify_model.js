const springedge = require("springedge");
const jwt = require('jsonwebtoken');
const client = require('../connection_db');
const config = require('../../config/development_config');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function phoneEmit(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    let errValue = new Error("伺服器錯誤，請稍後在試");

    try {
        let memberResult;
        try {
            memberResult = await member.findOne({ _id: ObjectId(data.id) });
            if (!memberResult) throw new Error("查無帳號，請重新登入");
        } catch (err) {
            throw err;
        }

        let verityCode = createNum();
        const token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + 60 * 10, // token 10 分鐘後過期。
                data: verityCode
            },
            config.verify_secret
        );

        try {
            const updateResult = await member.updateOne({ _id: ObjectId(data.id) }, {
                $set: {
                    phoneVerityCode: verityCode,
                    update_date: time
                }
            });
        } catch (err) {
            throw err;
        }
        var params = {
            'sender': 'SEDEMO',
            'apikey': 'API_KEY_HERE',
            'to': ['9190xxxxxxxx'],
            'message': 'Hi, this is a test message',
            'format': 'json'
        };

        springedge.messages.send(params, 5000, function(err, response) {
            if (err) {
                return console.log(err);
            }
            console.log(response);
        });
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }

    function createNum() {
        var Num = "";
        for (var i = 0; i < 10; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        return Num;
    }
}