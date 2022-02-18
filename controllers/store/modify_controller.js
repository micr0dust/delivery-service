const toEstablish = require('../../models/store/store_establish_model');
const storeData = require('../../models/store/get_store_model');
const loginAction = require('../../models/store/store_mode_model');
const addProduct = require('../../models/store/add_product_model');

const verify = require('../../models/store/verification_model');
const Check = require('../../service/store_check');
const encryption = require('../../models/encryption');
const config = require('../../config/development_config');

const jwt = require('jsonwebtoken');
const { token } = require('morgan');

let check = new Check();

module.exports = class Store {
    postEstablish(req, res, next) {
        // get data from store
        const data = {
            belong: req.headers['token'],
            name: req.body.name,
            address: req.body.address,
            create_date: onTime()
        }

        if (!check.checkName(data.name)) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: '店名必須介於1~30字'
            })
        } else if (!check.checkAddress(data.address)) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: '地址必須介於1~200字'
            })
        } else {
            // insert to database
            toEstablish(data).then(result => {
                    const token = getTokenFn(result._id.toString(), 30, config.secret);
                    res.setHeader('token', token);
                    // respon successful
                    res.json({
                        status: '註冊成功',
                        code: true,
                        result: {
                            name: result.name,
                            address: result.address
                        }
                    })
                })
                .catch(err => {
                    // respon error
                    res.status(500).send({
                        status: '註冊失敗',
                        code: false,
                        result: err
                    })
                })
        }
    }

    postLogin(req, res, next) {
        // 獲取client端資料
        const data = {
            id: req.headers['token'],
            time: onTime()
        }

        loginAction(data)
            .then(rows => {
                if (check.checkNull(rows) === true) {
                    res.status(400).send({
                        status: '切換失敗',
                        code: false,
                        result: '請確認登入狀態'
                    })
                } else if (check.checkNull(rows) === false) {
                    const token = getTokenFn(rows._id.toString(), 30, config.secret);
                    res.setHeader('token', token);
                    res.setHeader('refresh_token', rows.refresh_token);
                    res.json({
                        status: '成功',
                        code: true,
                        result: rows.name + ' 的營運模式已開啟'
                    });
                }
            })
            .catch(err => {
                res.status(400).send({
                    status: '登入失敗',
                    code: false,
                    result: err
                })
            })
    }

    postProduct(req, res, next) {
        // get data from store
        const data = {
            belong: req.headers['token'],
            name: req.body.name,
            price: req.body.price,
            describe: req.body.describe,
            type: req.body.type,
            create_date: onTime()
        }

        if (!check.checkName(data.name)) {
            res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '商品名必須介於1~30字'
            })
        } else if (!check.checkAddress(data.address)) {
            res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '地址必須介於1~200字'
            })
        } else if (!check.checkPrice(data.price)) {
            res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '金額必須為大於0的整數'
            })
        } else if (!check.checkDescribe(data.describe)) {
            res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '描述必須介於0~30字'
            })
        } else if (!check.checkType(data.type)) {
            res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '類別名稱必須介於0~10字'
            })
        } else {
            // insert to database
            addProduct(data).then(result => {
                    // respon successful
                    res.json({
                        status: '新增成功',
                        code: true,
                        result: {
                            name: result.name,
                            price: result.price,
                            describe: result.describe,
                            type: result.type
                        }
                    })
                })
                .catch(err => {
                    // respon error
                    res.status(500).send({
                        status: '新增失敗',
                        code: false,
                        result: err
                    })
                })
        }
    }

    // 取得全部店家
    getStoreInfo(req, res, next) {
        storeData().then(result => {
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

    // 取得accesstoken
    getAccessToken(req, res, next) {
        getToken().then(result => {
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
}

function getTokenFn(id, minutes, secret) {
    return jwt.sign({
            algorithm: 'HS256',
            exp: Math.floor(Date.now() / 1000) + 60 * minutes,
            data: id
        },
        secret
    )
}

const onTime = () => {
    const date = new Date()
    const mm = date.getMonth() + 1
    const dd = date.getDate()
    const hh = date.getHours()
    const mi = date.getMinutes()
    const ss = date.getSeconds()

    return [
        date.getFullYear(),
        '-' + (mm > 9 ? '' : '0') + mm,
        '-' + (dd > 9 ? '' : '0') + dd,
        ' ' + (hh > 9 ? '' : '0') + hh,
        ':' + (mi > 9 ? '' : '0') + mi,
        ':' + (ss > 9 ? '' : '0') + ss
    ].join('')
}