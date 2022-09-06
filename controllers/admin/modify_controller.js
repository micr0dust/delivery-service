const addRole = require('../../models/admin/add_role');
const removeRole = require('../../models/admin/delete_role');

const Check = require('../../service/admin_check');
const config = require('../../config/development_config');

const jwt = require('jsonwebtoken');

let check = new Check();

module.exports = class Admin {
    // 賦予特定使用者特定身分
    postAddRole(req, res, next) {
        const data = {
            id: req.body.id,
            role: req.body.role
        };
        if (!check.checkRole(data.role))
            return res.status(400).json({
                status: "身分格式錯誤",
                code: true,
                result: `沒有名為 ${data.role} 的身分`
            });
        addRole(req.headers['token'], data).then(result => {
                res.json({
                    status: '成功新增身分',
                    code: true,
                    result: result
                });
            },
            err => {
                res.status(500).send({
                    status: '無法新增身分',
                    code: false,
                    result: err.message
                });
            }
        );
    }

    // 移除特定使用者特定身分
    deleteRole(req, res, next) {
        const data = {
            id: req.body.id,
            role: req.body.role
        };
        if (!check.checkRole(data.role))
            return res.status(400).json({
                status: "身分格式錯誤",
                code: true,
                result: `沒有名為 ${data.role} 的身分`
            });
        removeRole(req.headers['token'], data).then(result => {
            return res.json({
                status: "成功移除身分",
                code: true,
                result: result
            });
        }, (err) => {
            return res.status(500).json({
                status: "無法移除身分",
                code: false,
                result: err.message
            });
        });
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