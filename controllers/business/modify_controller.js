const getToken = require('../../models/business/get_token_model');
const getOrder = require('../../models/business/get_order_model');
const putAccept = require('../../models/business/put_accept_model');
const putComplete = require('../../models/business/put_complete_model');

const verify = require('../../models/store/verification_model');
const Check = require('../../service/store_check');
const encryption = require('../../models/encryption');
const config = require('../../config/development_config');

const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const req = require('express/lib/request');

let check = new Check();

module.exports = class Store {
    //取得營業模式 token
    getToken(req, res, next) {
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

    // 營業店家取得未完成訂單
    getOrder(req, res, next) {
        getOrder(req.headers['token']).then(result => {
            res.json({
                status: "成功獲取訂單",
                code: true,
                result: result
            })
        }, (err) => {
            res.status(500).json({
                status: "無法獲取訂單",
                code: false,
                result: err.message
            })
        })
    }

    // 營業店家接受訂單
    putAccept(req, res, next) {
        const data = {
            id: req.headers['token'],
            orderID: req.body.id
        };
        if (!check.check_id(data.orderID)) return res.status(401).send({
            status: "無法接受",
            code: false,
            result: "id 格式錯誤"
        });
        putAccept(data).then(result => {
            res.json({
                status: "成功接受訂單",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "無法接受訂單",
                code: false,
                result: err.message
            });
        })
    }

    // 營業店家完成訂單
    putComplete(req, res, next) {
        const data = {
            id: req.headers['token'],
            orderID: req.body.id
        };
        if (!check.check_id(data.orderID)) return res.status(401).send({
            status: "無法接受",
            code: false,
            result: "id 格式錯誤"
        });
        putComplete(data).then(result => {
            res.json({
                status: "成功更改訂單狀態為已完成",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "無法更改訂單狀態為已完成",
                code: false,
                result: err.message
            });
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