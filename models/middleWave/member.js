const verify = require('../member/verification_model');
const Check = require('../../service/member_check');
let check = new Check();

module.exports = (req, res, next) => {
    //var token = req.body.token || req.query.token || req.headers['token'];
    var token = req.headers['token'];
    if (!token || check.checkNull(token)) return res.status(403).send({
        status: "token錯誤",
        code: false,
        result: "請重新登入"
    });
    verify(token).then(tokenResult => {
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
    })
}