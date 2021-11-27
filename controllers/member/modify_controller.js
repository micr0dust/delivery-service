const toRegister = require('../../models/member/register_model');
const loginAction = require('../../models/member/login_model');
const verify = require('../../models/member/verification_model');
const updateAction = require('../../models/member/update_model');
const emailSend = require('../../models/member/email_send_model');
const emailVerify = require('../../models/member/mail_verify_model');

const Check = require('../../service/member_check');
const encryption = require('../../models/encryption');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');

let check = new Check();

module.exports = class Member {
    postRegister(req, res, next) {

        // 進行加密
        const password = encryption(req.body.password);

        // get data from client
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            create_date: onTime()
        }

        const checkEmail = check.checkEmail(memberData.email);
        // email filter
        if (checkEmail === false) {
            res.json({
                result: {
                    status: "註冊失敗",
                    code: false,
                    err: "請輸入正確的Eamil格式 (如rightformat123@gmail.com)"
                }
            })
        } else if (checkEmail === true) {
            console.log(memberData);
            // insert to database
            toRegister(memberData).then(result => {
                // respon successful
                res.json({
                    status: "註冊成功",
                    code: true,
                    result: result
                })
            }).catch((err) => {
                // respon error
                res.json({
                    status: "註冊失敗",
                    code: false,
                    result: err
                })
            });
        }
    }
    postLogin(req, res, next) {
        // 進行加密
        const password = encryption(req.body.password);

        // 獲取client端資料
        const memberData = {
            email: req.body.email,
            password: password,
        }

        loginAction(memberData).then(rows => {
            if (check.checkNull(rows) === true) {
                res.json({
                    result: {
                        status: "登入失敗",
                        code: false,
                        err: "請輸入正確的帳號或密碼"
                    }
                })
            } else if (check.checkNull(rows) === false) {
                // 產生token
                const token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一小時後過期。
                    data: rows._id.toString()
                }, config.secret);
                res.setHeader('token', token);
                res.json({
                    result: {
                        status: "登入成功",
                        code: true,
                        loginMember: "歡迎 " + rows.name + " 的登入",
                        // token: token
                    }
                })
            }
        }).catch(err => {
            res.json({
                result: {
                    status: "登入失敗",
                    code: false,
                    err: err
                }
            })
        })
    }

    putUpdate(req, res, next) {
        const token = req.headers['token'];
        if (check.checkNull(token) === true) {
            res.json({
                status: "token錯誤",
                code: false,
                err: "必須輸入token"
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (!tokenResult) {
                    res.json({
                        result: {
                            status: "token錯誤",
                            code: false,
                            err: "請重新登入"
                        }
                    })
                } else {
                    const id = tokenResult;

                    const password = encryption(req.body.password);

                    const memberUpdateData = {
                        name: req.body.name,
                        password: password,
                        update_date: onTime()
                    }
                    updateAction(id, memberUpdateData).then(result => {
                        res.json({
                            result: { code: true, result }
                        })
                    }, (err) => {
                        res.json({
                            result: { code: false, err }
                        })
                    })
                }
            })
        }
    }

    putEmailSend(req, res, next) {
        const token = req.headers['token'];
        if (check.checkNull(token) === true) {
            res.json({
                status: "token錯誤",
                code: false,
                err: "必須輸入token"
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (!tokenResult) {
                    res.json({
                        result: {
                            status: "token錯誤",
                            code: false,
                            err: "請重新登入"
                        }
                    })
                } else {
                    const id = tokenResult;

                    emailSend(id, onTime()).then(result => {
                        res.json({
                            result: { code: true, result }
                        })
                    }, (err) => {
                        res.json({
                            result: { code: false, err }
                        })
                    })
                }
            })
        }
    }

    putEmailVerify(req, res, next) {
        const token = req.headers['token'];
        if (check.checkNull(token) === true) {
            res.json({
                status: "token錯誤",
                code: false,
                err: "必須輸入token"
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (!tokenResult) {
                    res.json({
                        result: {
                            status: "token錯誤",
                            code: false,
                            err: "請重新登入"
                        }
                    })
                } else {
                    const data = {
                        id: tokenResult,
                        verityCode: req.body.verityCode,
                        time: onTime()
                    }
                    emailVerify(data).then(result => {
                        res.json({
                            result: { code: true, result }
                        })
                    }, (err) => {
                        res.json({
                            result: { code: false, err }
                        })
                    })
                }
            })
        }
    }
}

const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}