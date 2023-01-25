const toEstablish = require('../../models/store/store_establish_model');
const delStore = require('../../models/store/delete_store_model');
const storeData = require('../../models/store/get_store_model');
const orderData = require('../../models/store/get_order_model');
const loginAction = require('../../models/store/store_mode_model');
const addProduct = require('../../models/store/add_product_model');
const updateProduct = require('../../models/store/put_product_model');
const delProduct = require('../../models/store/delete_product_model');
const getOneProduct = require('../../models/store/get_one_product');
const storeUpdate = require('../../models/store/put_store_model');
const getIncome = require('../../models/store/get_lastIncome_model');
const pauseProduct = require('../../models/store/switch_product_pause');
const geocoder = require('../../models/store/addressInfo');
const uploadStoreImg = require('../../models/store/upload_store_image');
const uploadProductImg = require('../../models/store/upload_product_image');


const Check = require('../../service/store_check');
const encryption = require('../../models/encryption');
const config = require('../../config/development_config');

const jwt = require('jsonwebtoken');

let check = new Check();

module.exports = class Store {
    // 建立商家並綁定帳號
    postEstablish(req, res, next) {
        const data = {
            belong: req.headers['token'],
            name: req.body.name,
            address: req.body.address,
            location: {
                lat: req.body.lat,
                lng: req.body.lng,
                googlePlaceId: req.body.googlePlaceId,
                verified: false
            },
            url: ((new Date().getTime() - 1637560475159) * 100 + parseInt(createNum())).toString(36),
            create_date: onTime(),
            last_update: onTime()
        };

        if (!check.checkName(data.name)) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: '店名必須介於 1~30 字'
            });
        } else if (!check.checkAddress(data.address)) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: '地址必須介於1~200字'
            });
        } else if (!(!isNaN(data.location.lat) && ~data.location.lat.toString().indexOf('.'))) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: 'lat 必須為 float 字串'
            });
        } else if (!(!isNaN(data.location.lng) && ~data.location.lng.toString().indexOf('.'))) {
            res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: 'lng 必須為 float 字串'
            });
        } else {
            toEstablish(data).then(result => {
                    const token = getTokenFn(result._id.toString(), 30, config.secret);
                    res.setHeader('token', token);
                    res.status(201).json({
                        status: '註冊成功',
                        code: true,
                        result: {
                            name: result.name,
                            address: result.address
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
        }
    }

    // 刪除商家、商家身分及其商品
    deleteStore(req, res, next) {
        const data = {
            id: req.headers['token'],
            name: req.body.name
        };

        if (!check.checkName(data.name))
            res.status(400).send({
                status: '商家身分刪除失敗',
                code: false,
                result: '必須輸入正確店名才能刪除帳號'
            });


        delStore(data).then(
            result => {
                res.json({
                    status: '商家身分已成功刪除',
                    code: true,
                    result: result
                });
            },
            err => {
                res.status(500).send({
                    status: '商家身分刪除失敗',
                    code: false,
                    result: err.message
                });
            });
    }

    // 營業模式開啟
    postLogin(req, res, next) {
        const data = {
            id: req.headers['token'],
            time: onTime()
        };

        loginAction(data)
            .then(rows => {
                const token = getTokenFn(rows._id.toString(), 30, config.secret);
                if (!token) res.status(500).send({
                    status: '切換失敗',
                    code: false,
                    result: "伺服器錯誤，請稍後在試"
                });

                res.setHeader('token', token);
                res.setHeader('refresh_token', rows.refresh_token);
                res.json({
                    status: '成功',
                    code: true,
                    result: rows.name + ' 的營運模式已開啟'
                });
            })
            .catch(err => {
                res.status(500).send({
                    status: '切換失敗',
                    code: false,
                    result: err.message
                });
            });
    }

    // 店家新增商品
    postProduct(req, res, next) {
        const data = {
            name: req.body.name,
            price: req.body.price,
            describe: req.body.describe,
            type: req.body.type,
            discount: req.body.discount || null,
            options: req.body.options || null,
            pause: false,
            create_date: onTime(),
            last_update: onTime()
        };

        if (!check.checkName(data.name)) {
            return res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '商品名必須介於1~30字'
            });
        }
        if (!check.checkAddress(data.address)) {
            return res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '地址必須介於1~200字'
            });
        }
        if (!check.checkPrice(data.price)) {
            return res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '金額必須為大於0的整數'
            });
        }
        if (!check.checkDescribe(data.describe)) {
            return res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '描述必須介於0~30字'
            });
        }
        if (!check.checkType(data.type)) {
            return res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '類別名稱必須介於0~10字'
            });
        }
        // insert to database
        addProduct(req.headers['token'], data).then(result => {
                // respon successful
                res.status(201).json({
                    status: '新增成功',
                    code: true,
                    result: {
                        name: result.name,
                        price: result.price,
                        describe: result.describe,
                        type: result.type,
                        discount: result.discount,
                        options: result.options
                    }
                });
            })
            .catch(err => {
                res.status(500).send({
                    status: '新增失敗',
                    code: false,
                    result: err.message
                });
            });
    }

    // 店家更新商品
    putProduct(req, res, next) {
        const data = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            describe: req.body.describe,
            type: req.body.type,
            discount: req.body.discount || null,
            options: req.body.options || null,
            last_update: onTime()
        };

        Object.keys(data).forEach((key) => !data[key] && delete data[key]);

        if (data.name && !check.checkName(data.name)) {
            return res.status(400).send({
                status: '更新失敗',
                code: false,
                result: '商品名必須介於1~30字'
            });
        }
        if (data.address && !check.checkAddress(data.address)) {
            return res.status(400).send({
                status: '更新失敗',
                code: false,
                result: '地址必須介於1~200字'
            });
        }
        if (data.price && !check.checkPrice(data.price)) {
            return res.status(400).send({
                status: '更新失敗',
                code: false,
                result: '金額必須為大於0的整數'
            });
        }
        if (data.describe && !check.checkDescribe(data.describe)) {
            return res.status(400).send({
                status: '更新失敗',
                code: false,
                result: '描述必須介於0~30字'
            });
        }
        if (data.type && !check.checkType(data.type)) {
            return res.status(400).send({
                status: '更新失敗',
                code: false,
                result: '類別名稱必須介於0~10字'
            });
        }
        // insert to database
        updateProduct(req.headers['token'], data).then(result => {
                // respon successful
                return res.status(200).json({
                    status: '更新成功',
                    code: true,
                    result: {
                        name: result.name,
                        price: result.price,
                        describe: result.describe,
                        type: result.type,
                        discount: result.discount,
                        options: result.options,
                        pause: result.pause
                    }
                });
            })
            .catch(err => {
                return res.status(500).send({
                    status: '更新失敗',
                    code: false,
                    result: err.message
                });
            });
    }

    // 取得特定單一商品
    oneProduct(req, res, next) {
        const data = {
            productID: req.headers.productid
        };

        if (!check.check_id(data.productID))
            return res.status(400).send({
                status: '格式錯誤',
                code: false,
                result: '必須輸入正確 ID 格式'
            });
        getOneProduct(req.headers['token'], data).then(result => {
            res.json({
                status: "成功獲取商品資料",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "無法獲取商品資料",
                code: false,
                result: err.message
            });
        });
    }

    // 店家更新商品上下架狀態
    switchProductStatue(req, res, next) {
        const data = {
            productID: req.body.productID
        };

        if (!check.check_id(data.productID))
            return res.status(400).send({
                status: '格式錯誤',
                code: false,
                result: '必須輸入正確 ID 格式'
            });

        pauseProduct(req.headers['token'], data).then(result => {
                return res.status(200).json({
                    status: '狀態更新成功',
                    code: true,
                    result: {
                        name: result.name,
                        price: result.price,
                        describe: result.describe,
                        type: result.type,
                        discount: result.discount,
                        options: result.options,
                        pause: result.pause
                    }
                });
            })
            .catch(err => {
                return res.status(500).send({
                    status: '狀態更新失敗',
                    code: false,
                    result: err.message
                });
            });
    }

    // 店家刪除商品
    deleteProduct(req, res, next) {
        const data = {
            id: req.headers['token'],
            product: req.body.product
        };

        delProduct(data).then(result => {
            res.json({
                status: "成功刪除商品 ",
                code: true,
                result: req.body.product
            });
        }, (err) => {
            res.status(500).json({
                status: "刪除商品失敗",
                code: false,
                result: err.message
            });
        });
    }

    // 店家取得歷史訂單
    getOrder(req, res, next) {
        orderData(req.headers['token']).then(result => {
            res.json({
                status: "成功獲取訂單",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "無法獲取訂單",
                code: false,
                result: err.message
            });
        });
    }

    // 取得店家資料
    getStoreInfo(req, res, next) {
        storeData(req.headers['token']).then(result => {
            if (result === "查無此帳號擁有的商店")
                return res.redirect('/shop/establish');
            return res.json({
                status: "成功獲取店家資料",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "無法獲取店家資料",
                code: false,
                result: err.message
            });
        });
    }

    // 取得店家上個月營收
    getIncome(req, res, next) {
        const date = new Date();
        getIncome(req.headers['token']).then(result => {
            res.json({
                status: `成功獲取 ${date.getMonth()} 月營收`,
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: `無法獲取 ${date.getMonth()} 月營收`,
                code: false,
                result: err.message
            });
        });
    }

    // 更新店家資料
    putStoreData(req, res, next) {
        const data = {
            id: req.headers['token'],
            name: req.body.name,
            address: req.body.address,
            location: {
                lat: req.body.lat,
                lng: req.body.lng,
                googlePlaceId: req.body.googlePlaceId,
                verified: false
            },
            describe: req.body.describe || " ",
            place: req.body.place,
            allDiscount: req.body.discount,
            timeEstimate: req.body.timeEstimate,
            businessTime: req.body.businessTime,
            last_update: onTime()
        };
        Object.keys(data).forEach((key) => !data[key] && delete data[key]);
        for (let prop in data)
            if (!data[prop]) delete data[prop];
        if (data.name && !check.checkName(data.name)) {
            return res.status(400).send({
                status: '資料更新失敗',
                code: false,
                result: '店名必須介於 1~30 字'
            });
        }
        if (data.address && !check.checkAddress(data.address)) {
            return res.status(400).send({
                status: '資料更新失敗',
                code: false,
                result: '地址必須介於 1~200 字'
            });
        }
        if (data.location.lat && !(!isNaN(data.location.lat) && ~data.location.lat.toString().indexOf('.'))) {
            return res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: 'lat 必須為 float 字串'
            });
        }
        if (data.location.lug && !(!isNaN(data.location.lng) && ~data.location.lng.toString().indexOf('.'))) {
            return res.status(400).send({
                status: '註冊失敗',
                code: false,
                result: 'lng 必須為 float 字串'
            });
        }
        if (data.allDiscount && !check.checkDiscount(data.allDiscount)) {
            return res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '折價資料格式錯誤'
            });
        }
        if (data.timeEstimate && !check.checkPrice(data.timeEstimate)) {
            return res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '預估時間格式錯誤'
            });
        }
        if (data.place && !check.checkPlace(data.place)) {
            return res.status(400).send({
                status: '新增失敗',
                code: false,
                result: '無效的取餐位置'
            });
        }
        if (data.describe && !check.checkDescribe(data.describe)) {
            return res.status(400).send({
                status: '格式錯誤',
                code: false,
                result: '敘述上限為 100 字'
            });
        }
        storeUpdate(data).then(result => {
            res.status(200).json({
                status: "成功更新店家資料",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "無法更新店家資料",
                code: false,
                result: err.message
            });
        });
    }

    // 取得地址資料
    addressInfo(req, res, next) {
        const data = {
            id: req.headers['token'],
            address: req.body.address
        };
        geocoder(data).then(result => {
            res.status(200).json({
                status: "成功請求地址資料",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "請求地址資料失敗",
                code: false,
                result: err.message
            });
        });
    }

    // 上傳店家封面圖片
    uploadStoreImg(req, res, next) {
        const data = {
            id: req.headers['token'],
            image: req.file
        };
        uploadStoreImg(data).then(result => {
            res.status(200).json({
                status: "成功上傳圖片",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "上傳圖片失敗",
                code: false,
                result: err.message
            });
        });
    }

    // 上傳特定商品縮略圖
    uploadProductImg(req, res, next) {
        const data = {
            id: req.headers['token'],
            productID: req.body.product,
            image: req.file
        };
        uploadProductImg(data).then(result => {
            res.status(200).json({
                status: "成功上傳圖片",
                code: true,
                result: result
            });
        }, (err) => {
            res.status(500).json({
                status: "上傳圖片失敗",
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
    );
}

function createNum() {
    var Num = "";
    for (var i = 0; i < 2; i++)
        Num += Math.floor(Math.random() * 10);
    return Num;
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