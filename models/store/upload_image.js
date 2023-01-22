const client = require('../connection_db');
const config = require('../../config/development_config');
const upload = require('../upload_img');

var ObjectId = require('mongodb').ObjectId;

module.exports = async function addProduct(data) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const member = db.collection(config.mongo.member);
    const store = db.collection(config.mongo.store);
    const product = db.collection(config.mongo.product);

    try {
        upload(data.fileName, data.file);
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}