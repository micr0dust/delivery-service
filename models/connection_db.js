const config = require('../config/development_config');
const { MongoClient } = require('mongodb');
const url = "mongodb+srv://" + config.mongo.user + ":" + config.mongo.password + "@" + config.mongo.host + "/" + config.mongo.database + "?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("connect to: " + config.mongo.host);
module.exports = client;