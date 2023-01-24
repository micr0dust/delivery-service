const AWS = require('aws-sdk');
const config = require('../config/development_config');

const s3 = new AWS.S3({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret
});

module.exports = s3;