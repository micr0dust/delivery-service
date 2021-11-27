const client = require('../connection_db');
const config = require('../../config/development_config');

module.exports = async function memberLogin(memberData) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.product);
    try {
        const findResult = await collection.find({}).toArray();
        console.log('Found documents =>', findResult);
    } catch (err) {
        throw "伺服器錯誤，請稍後在試";
    }
}