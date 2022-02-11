const toEstablish = require('../../models/store/store_establish_model');
const storeData = require('../../models/store/get_store_model');

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
                result: '店名必須介於1~30字元'
            })
        } else if (!check.checkAddress(data.address)) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: '地址必須介於1~200字元'
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