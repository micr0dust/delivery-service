const jwt = require('jsonwebtoken');

//進行token認證
module.exports = function verifyToken(token, secret) {
    let tokenResult = "";
    const time = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
        //判斷token是否正確
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    tokenResult = false;
                    resolve(tokenResult);
                } else if (decoded.exp <= time) {
                    tokenResult = false;
                    resolve(tokenResult);
                } else {
                    tokenResult = decoded.data
                    resolve(tokenResult);
                }
            })
        }
    });
}