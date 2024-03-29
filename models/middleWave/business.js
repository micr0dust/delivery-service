const verify = require('../store/verification_model');
const Check = require('../../service/store_check');
const config = require('../../config/development_config');
const check = new Check();

module.exports = (req, res, next) => {

    //var token = req.body.token || req.query.token || req.headers['token'];
    /* #swagger.security = [{
               "bearerAuth": []
        }] */
    /*  #swagger.responses[403] = {
                description: 'token錯誤',
                schema: {
                    status: 'token錯誤',
                    code: false,
                    result: "請重新登入"
                }
            }
    } */

    const token = req.headers['token'];
    const refresh_token = req.headers['refresh_token'];

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