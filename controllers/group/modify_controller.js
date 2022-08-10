const getGroupData = require('../../models/group/get_group_model');

const Check = require('../../service/store_check');
const config = require('../../config/development_config');
let check = new Check();

module.exports = class Group {
    // 取得特定群組資料
    getGroupInfo(req, res, next) {
        const data = {
            id: req.headers['id']
        };
        getGroupData(data).then(result => {
            res.json({
                status: "成功獲取群組資料",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "無法獲取群組資料",
                code: false,
                result: err.message
            });
        });
    }
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