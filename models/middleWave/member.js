const verify = require('../member/verification_model');
const Check = require('../../service/member_check');
const config = require('../../config/development_config');
let check = new Check();

module.exports = (req, res, next) => {
    //var token = req.body.token || req.query.token || req.headers['token'];
    let token = req.headers['token'];
    let refresh_token = req.headers['refresh_token'];
    if (refresh_token) {
        if (check.checkNull(refresh_token)) return res.status(403).send({
            status: "token錯誤",
            code: false,
            result: "請重新登入"
        });
        verify(refresh_token, config.fresh_secret).then(tokenResult => {
            if (!tokenResult) {
                return res.status(403).send({
                    status: "token錯誤",
                    code: false,
                    result: "請重新登入"
                });
            } else {
                req.headers['refresh_token'] = tokenResult;
                next();
            }
        });
    } else {
        if (!(token) || check.checkNull(token)) return res.status(403).send({
            status: "token錯誤",
            code: false,
            result: "請重新登入"
        });
        verify(token, config.secret).then(tokenResult => {
            if (!tokenResult) {
                return res.status(403).send({
                    status: "token錯誤",
                    code: false,
                    result: "請重新登入"
                });
            } else {
                req.headers['token'] = tokenResult;
                next();
            }
        });
    }
}