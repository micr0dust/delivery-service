const toRegister = require('../../models/member/register_model');
const loginAction = require('../../models/member/login_model');
const getToken = require('../../models/member/get_token_model');
const updateAction = require('../../models/member/update_model');
const deleteAction = require('../../models/member/delete_model');
const emailSend = require('../../models/member/email_send_model');
const emailVerify = require('../../models/member/mail_verify_model');
const getUser = require('../../models/member/getUser_model');
const getProduct = require('../../models/member/get_product_model');
const getStore = require('../../models/member/get_stores_model');
const orderAction = require('../../models/member/order_model');

const verify = require('../../models/member/verification_model');
const Check = require('../../service/member_check');
const encryption = require('../../models/encryption');
const config = require('../../config/development_config');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
let check = new Check();

module.exports = class Member {
    //註冊帳號
    postRegister(req, res, next) {
        const check_password = check.checkPassword(req.body.password);
        if (check_password === false) {
            return res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: '密碼必須由8個以上的大小寫字母和數字組成'
            });
        }
        const password = encryption(req.body.password);

        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            create_date: onTime()
        };

        const checkEmail = check.checkEmail(memberData.email);
        if (!checkEmail) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: '請輸入正確的Eamil格式 (如format24@gmail.com)'
            });
        } else if (!check.checkName(memberData.name)) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: '姓名必須介於1~20字元'
            });
        } else if (checkEmail) {
            toRegister(memberData).then(result => {
                    const token = getTokenFn(result._id.toString(), 30, config.secret);
                    res.setHeader('token', token);
                    res.json({
                        status: '註冊成功',
                        code: true,
                        result: {
                            name: result.name,
                            email: result.email
                        }
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        status: '註冊失敗',
                        code: false,
                        result: err.message
                    });
                });
        };
    }

    //登入
    postLogin(req, res, next) {
        // 進行加密
        const password = encryption(req.body.password);

        // 獲取client端資料
        const memberData = {
            email: req.body.email,
            password: password
        };

        loginAction(memberData)
            .then(rows => {
                if (check.checkNull(rows) === true) {
                    res.status(400).send({
                        status: '登入失敗',
                        code: false,
                        result: '請輸入正確的帳號或密碼'
                    })
                } else if (check.checkNull(rows) === false) {
                    const token = getTokenFn(rows._id.toString(), 30, config.secret);
                    res.setHeader('token', token);
                    res.setHeader('refresh_token', rows.refresh_token);
                    res.json({
                        status: '登入成功',
                        code: true,
                        result: '歡迎 ' + rows.name + ' 的登入'
                    });
                }
            })
            .catch(err => {
                res.status(400).send({
                    status: '登入失敗',
                    code: false,
                    result: err.message
                });
            });
    }

    //資料更新
    putUpdate(req, res, next) {
        let password = null;
        if (req.body.password) password = encryption(req.body.password);

        if (password && !check.checkPassword(req.body.password)) {
            return res.status(400).send({
                status: '更改失敗',
                code: false,
                result: '密碼必須由8個以上的大小寫字母和數字組成'
            });
        };
        const memberUpdateData = {
            update_date: onTime(),
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            birthday: req.body.birthday,
            password: password
        };
        for (let prop in memberUpdateData)
            if (!memberUpdateData[prop]) delete memberUpdateData[prop];
        if (memberUpdateData.name && !check.checkName(memberUpdateData.name)) {
            return res.status(400).send({
                status: '更改失敗',
                code: false,
                result: '姓名必須介於 1~20 字元'
            });
        }
        if (memberUpdateData.email && !check.checkEmail(memberUpdateData.email)) {
            return res.status(400).send({
                status: '更改失敗',
                code: false,
                result: '請輸入正確的Eamil格式 (如format24@gmail.com)'
            });
        }
        if (memberUpdateData.phone && !check.checkPhone(memberUpdateData.phone)) {
            return res.status(400).send({
                status: '更改失敗',
                code: false,
                result: '請輸入正確的台灣行動電話號碼'
            });
        }
        if (memberUpdateData.gender && !check.checkGender(memberUpdateData.gender)) {
            return res.status(400).send({
                status: '更改失敗',
                code: false,
                result: '請輸入正確的性別'
            });
        }
        if (memberUpdateData.birthday && !check.checkBirthday(memberUpdateData.birthday)) {
            return res.status(400).send({
                status: '更改失敗',
                code: false,
                result: '請輸入正確的生日格式 (yyyy-mm-dd)'
            });
        }
        updateAction(req.headers['token'], memberUpdateData).then(
            result => {
                res.json({
                    status: '更改成功',
                    code: true,
                    result: '資料更改成功'
                });
            },
            err => {
                res.status(500).send({
                    status: '更改失敗',
                    code: false,
                    result: err.message
                });
            }
        );
    }

    //刪除帳號
    deleteAccount(req, res, next) {
        let password = null;
        if (req.body.password) password = encryption(req.body.password);
        if (password && !check.checkPassword(req.body.password)) {
            return res.status(400).send({
                status: '刪除失敗',
                code: false,
                result: '必須輸入密碼以刪除帳號'
            });
        };
        const data = {
            id: req.headers['token'],
            password: password
        };

        deleteAction(data).then(
            result => {
                res.json({
                    status: '帳號已成功刪除',
                    code: true,
                    result: result
                });
            },
            err => {
                res.status(500).send({
                    status: '帳號無法刪除',
                    code: false,
                    result: err.message
                });
            }
        );
    }

    //驗證碼寄出
    putEmailSend(req, res, next) {
        emailSend(req.headers['token'], onTime()).then(
            result => {
                res.json({
                    status: '成功發送驗證碼',
                    code: true,
                    result: result
                });
            },
            err => {
                res.status(500).send({
                    status: '無法發送驗證碼',
                    code: false,
                    result: err.message
                });
            }
        );
    }

    //驗證驗證碼
    putEmailVerify(req, res, next) {
        if (check.checkNull(req.body.verityCode)) return res.status(401).send({
            status: "驗證失敗",
            code: false,
            result: "驗證碼錯誤"
        });
        verify(req.body.verityCode, config.verify_secret).then(tokenResult => {
            req.body.verityCode = tokenResult;
            console.log(tokenResult, config.verify_secret);
            if (!tokenResult) {
                return res.status(401).send({
                    status: "驗證失敗",
                    code: false,
                    result: "驗證碼錯誤"
                });
            } else {
                const data = {
                    id: req.headers['token'],
                    verityCode: req.body.verityCode,
                    time: onTime()
                };
                emailVerify(data).then(
                    result => {
                        res.json({
                            status: '驗證成功',
                            code: true,
                            result: result
                        });
                    },
                    err => {
                        res.status(400).send({
                            status: '驗證失敗',
                            code: false,
                            result: err.message
                        });
                    }
                );
            }
        });
    }

    //取得使用者資料
    getUserInfo(req, res, next) {
        getUser(req.headers['token']).then(
            result => {
                res.json({
                    status: '成功獲取使用者資料',
                    code: true,
                    result: result
                });
            },
            err => {
                res.status(500).send({
                    status: '無法獲取使用者資料',
                    code: false,
                    result: err.message
                });
            }
        );
    }

    //取得商品資料
    getProductInfo(req, res, next) {
        let data = {
            name: req.body.name,
            address: req.body.address
        };
        getProduct(data).then(
            result => {
                res.json({
                    status: '成功獲取商品資料',
                    code: true,
                    result: result
                });
            },
            err => {
                res.status(500).send({
                    status: '無法獲取商品資料',
                    code: false,
                    result: err.message
                });
            }
        );
    }

    //取得所有店家
    getStoreInfo(req, res, next) {
        getStore().then(
            result => {
                res.json({
                    status: '成功獲取商家列表',
                    code: true,
                    result: result
                });
            },
            err => {
                res.status(500).send({
                    status: '無法獲取商家列表',
                    code: false,
                    result: err.message
                });
            }
        );
    }

    //訂單寄出
    postOrder(req, res, next) {
        const data = {
            id: req.headers['token'],
            order: JSON.stringify(req.body),
            DATE: new Date()
        };
        orderAction(data).then(
            result => {
                res.status(201).json({
                    status: '點餐成功',
                    code: true,
                    result: result
                })
            },
            err => {
                res.status(500).send({
                    status: '點餐失敗',
                    code: false,
                    result: err.message
                });
            }
        );
    }

    //取得使用者 token
    getUserToken(req, res, next) {
        getToken(req.headers['refresh_token']).then(id => {
                const token = getTokenFn(id, 30, config.secret);
                res.setHeader('token', token);
                res.json({
                    status: '成功獲取新token',
                    code: true,
                    result: 'token時效為半小時'
                });
            },
            err => {
                res.status(500).send({
                    status: '無法獲取token',
                    code: false,
                    result: err.message
                });
            }
        );
    }
}

function getTokenFn(id, minutes, secret) {
    return jwt.sign({
            algorithm: 'HS256',
            exp: Math.floor(Date.now() / 1000) + 60 * minutes,
            data: id
        },
        secret
    );
}

const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [
        date.getFullYear(),
        '-' + (mm > 9 ? '' : '0') + mm,
        '-' + (dd > 9 ? '' : '0') + dd,
        ' ' + (hh > 9 ? '' : '0') + hh,
        ':' + (mi > 9 ? '' : '0') + mi,
        ':' + (ss > 9 ? '' : '0') + ss
    ].join('');
}