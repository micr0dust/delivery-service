require('dotenv').config();

module.exports = {
    heroku: {
        hostname: process.env.HOST_NAME
    },
    mongo: {
        host: process.env.HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        member: "member",
        product: "product",
        store: "store",
        order: "order",
        group: "group",
        log: "log"
    },
    mail: {
        account: process.env.MAIL,
        password: process.env.MAIL_PASSWORD,
        id: process.env.MAIL_ID,
        secret: process.env.MAIL_SECRET,
        freshToken: process.env.MAIL_REFRESHTOKEN,
        accessToken: process.env.MAIL_ACCESSTOKEN,
    },
    teilio: {
        id: process.env.TWILIO_ID,
        token: process.env.TWILIO_TOKEN
    },
    secret: process.env.MY_SECRET,
    fresh_secret: process.env.FRESH_SECRET,
    verify_secret: process.env.VERIFY_SECRET
}