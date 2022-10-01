const config = require('../config/development_config');

async function sendNotification(data, callback) {
    const headers = {
        "Content-Type": "application/json charset=utf-8",
        "Authorization": "Basic " + config.onesignal.key
    };
    const options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };
    const http = require('http');
    let req = http.request(options, function(res) {
        res.on("data", function(data) {
            console.log(JSON.parse(data));
            return callback(null, JSON.parse(data));
        });
    });
    req.on("error", function(e) {
        return callback({ message: e });
    });
    req.write(JSON.stringify(data));
    req.end();
};
module.exports = { sendNotification };