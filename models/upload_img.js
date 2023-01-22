const AWS = require('aws-sdk');
const config = require('../config/development_config');

const s3 = new AWS.S3({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret
});

module.exports = (fileName, file) => {
    const params = {
        Bucket: 'foodone-s3/store',
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype
    };

    s3.upload(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log('Bucket Created Successfully', data.Location);
    });
}