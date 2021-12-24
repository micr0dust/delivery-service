const client = require('../connection_db')
const config = require('../../config/development_config')
const jwt = require('jsonwebtoken')

module.exports = async function memberLogin(memberData) {
    await client.connect()
    const db = client.db(config.mongo.database)
    const collection = db.collection(config.mongo.member)

    try {
        let errValue = '伺服器錯誤，請稍後在試'
        try {
            const findResult = await collection.findOne({
                email: memberData.email,
                password: memberData.password
            })
            console.log('Found documents =>', findResult)
            if (!findResult) throw '請輸入正確的帳號或密碼'
            memberData = findResult;
        } catch (err) {
            throw err ? err : errValue
        }

        memberData.refresh_token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // token7天後過期。
                data: memberData._id.toString()
            },
            config.fresh_secret
        );

        // 更新refresh_token
        try {
            await collection.updateOne({ _id: memberData._id }, {
                $set: {
                    refresh_token: memberData.refresh_token
                }
            })
            return memberData;
        } catch (err) {
            console.log(err)
            throw '伺服器錯誤，請稍後再試'
        }
    } catch (err) {
        throw err
    } finally {
        client.close()
    }
}