require('dotenv').config();

module.exports = {
    mongo: {
        host: process.env.HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        member: process.env.COLLECTION_MEMBER,
        product: process.env.COLLECTION_PRODUCT
    },
    secret: process.env.MY_SECRET,
    mail: {
        account: process.env.MAIL,
        password: process.env.MAIL_PASSWORD
    }
}