const toRegister = require('../../models/member/register_model');
const loginAction = require('../../models/member/login_model');
const verify = require('../../models/member/verification_model');
const updateAction = require('../../models/member/update_model');
const emailSend = require('../../models/member/email_send_model');
const emailVerify = require('../../models/member/mail_verify_model');
const getUser = require('../../models/member/getUser_model');

const Check = require('../../service/member_check');
const encryption = require('../../models/encryption');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
let check = new Check();

module.exports = class Member {
    postRegister(req, res, next) {
        // 進行加密
        const check_password = check.checkPassword(req.body.password);
        if (check_password === false) {
            return res.json({
                status: "註冊失敗",
                code: false,
                result: "密碼必須由8個以上的大小寫字母和數字組成"
            })
        }
        const password = encryption(req.body.password);

        // get data from client
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            create_date: onTime()
        }

        const checkEmail = check.checkEmail(memberData.email);
        const checkName = check.checkNull(memberData.name);
        // email filter
        if (checkEmail === false) {
            res.json({
                status: "註冊失敗",
                code: false,
                result: "請輸入正確的Eamil格式 (如format24@gmail.com)"
            })
        } else if (!(checkName === false)) {
            res.json({
                status: "註冊失敗",
                code: false,
                result: "名字不可為空"
            })
        } else if (checkEmail === true) {
            console.log(memberData);
            // insert to database
            toRegister(memberData).then(result => {
                const token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一小時後過期。
                    data: result._id.toString()
                }, config.secret);
                res.setHeader('token', token);
                // respon successful
                res.json({
                    status: "註冊成功",
                    code: true,
                    result: {
                        name: result.name,
                        email: result.email
                    }
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
                    status: "登入失敗",
                    code: false,
                    result: "請輸入正確的帳號或密碼"
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
                    status: "登入成功",
                    code: true,
                    result: "歡迎 " + rows.name + " 的登入"
                })
            }
        }).catch(err => {
            res.json({
                status: "登入失敗",
                code: false,
                result: err
            })
        })
    }

    putUpdate(req, res, next) {
        const password = encryption(req.body.password);
        const memberUpdateData = {
            name: req.body.name,
            password: password,
            update_date: onTime()
        }
        updateAction(req.headers['token'], memberUpdateData).then(result => {
            res.json({
                code: true,
                result: result
            })
        }, (err) => {
            res.json({
                code: false,
                result: err
            })
        })
    }

    putEmailSend(req, res, next) {
        emailSend(req.headers['token'], onTime()).then(result => {
            res.json({
                status: "成功發送驗證碼",
                code: true,
                result: result
            })
        }, (err) => {
            res.json({
                status: "無法發送驗證碼",
                code: false,
                result: err
            })
        })
    }

    putEmailVerify(req, res, next) {
        const data = {
            id: req.headers['token'],
            verityCode: req.body.verityCode,
            time: onTime()
        }
        emailVerify(data).then(result => {
            res.json({
                status: "驗證成功",
                code: true,
                result: result
            })
        }, (err) => {
            res.json({
                status: "驗證失敗",
                code: false,
                result: err
            })
        })
    }

    getUserInfo(req, res, next) {
        getUser(req.headers['token']).then(result => {
            let verify = (result.verityCode === true) ? true : false;
            res.json({
                status: "成功獲取使用者資料",
                code: true,
                result: {
                    name: result.name,
                    email: result.email,
                    verify: verify,
                    create: result.create_date,
                    update: result.update_date
                }
            })
        }, (err) => {
            res.json({
                status: "無法獲取使用者資料",
                code: false,
                result: err
            })
        })
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