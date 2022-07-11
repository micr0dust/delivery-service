var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var jsonParser = bodyParser.json();

const MemberModifyMethod = require('../controllers/member/modify_controller');
const middleWave = require('../models/middleWave/member');

let memberModifyMethod = new MemberModifyMethod();
router.post('/register', memberModifyMethod.postRegister, () => {
    //  #swagger.summary  = '註冊'
    //  #swagger.description = '以姓名、郵箱、密碼註冊帳號，並返回時效為一小時的 token'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['name'] = {
                in: 'formData',
                type: 'string',
                required: 'true',
                description: '使用者名稱',
                schema: "吳玼芢"
    }
        #swagger.parameters['email'] = {
                in: 'formData',
                type: 'string',
                required: 'true',
                description: '電子信箱',
                schema: "usermail123@gmail.com"
    }
        #swagger.parameters['password'] = {
                in: 'formData',
                type: 'string',
                required: 'true',
                description: '密碼',
                schema: "Aaaaaaa1"
    } */

    /*  #swagger.responses[200] = {
                description: '註冊成功',
                schema: {
                    status: '註冊成功',
                    code: true,
                    result: {
                            name: "使用者名稱",
                            email: "usermail123@gmail.com"
                        }
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '因格式錯誤導致的註冊失敗',
                schema: {
                    status: '註冊失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
        #swagger.responses[500] = {
                description: '因伺服器錯誤導致的註冊失敗',
                schema: {
                    status: '註冊失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.post('/login', memberModifyMethod.postLogin, () => {
    //  #swagger.summary  = '登入'
    //  #swagger.description = '以郵箱、密碼登入帳號，並返回時效為一小時的 token'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['email'] = {
                in: 'formData',
                type: 'string',
                required: 'true',
                description: '電子信箱',
                schema: "usermail123@gmail.com"
    }
        #swagger.parameters['password'] = {
                in: 'formData',
                type: 'string',
                required: 'true',
                description: '密碼',
                schema: "Aaaaaaa1"
    }
        #swagger.responses[200] = {
                description: '登入成功',
                schema: {
                    status: '登入成功',
                    code: true,
                    result: {
                        "name": "測試用帳號2",
                        "role": [
                        "user"
                        ]
                    }
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '登入失敗',
                schema: {
                    status: '註冊失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.get("/google/login", memberModifyMethod.googleLogin, () => {
    //  #swagger.summary  = 'Google 網頁登入'
    //  #swagger.description = '將 id_token 傳給伺服器，表示該使用者授權登入'
    /*  #swagger.parameters['id'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'id_token = googleUser.getAuthResponse().id_token',
                schema: "id_token"
    }
    */
    /*
        #swagger.responses[200] = {
            description: "redirect_url",
            schema: {$ref: "#/definitions/redirect_url"}
        }
    */
});
router.post("/google/mlogin", memberModifyMethod.googleMobileLogin, () => {
    //  #swagger.summary  = 'Google 手機應用程式登入'
    //  #swagger.description = '將 id_token 傳給伺服器，表示該使用者授權登入'
    /*  #swagger.parameters['google_token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'google_token = googleUser.getAuthResponse().id_token',
                schema: "google_token"
    }
    */
    /*
        #swagger.responses[200] = {
            description: "登入成功",
            schema: {
                    status: '登入成功',
                    code: true,
                    result: {
                        name:"吳玼芢",
                        email:"usermail123@gmail.com",
                        create_date:"2022-04-16 22:17:56",
                        update_date:"2022-04-16 22:56:18",
                        verityCode: true,
                        role: ["user"],
                        locale:"en",
                        picture: "https://google.com/users/14856836/parham-khoshravesh.png",
                    }
                }
        }
    */
});
router.get("/google/callback", memberModifyMethod.googleCallback
    // #swagger.ignore = true
);

//router.get("/google/refresh_token", memberModifyMethod.googleGetToken);

router.put('/', middleWave, memberModifyMethod.putUpdate, () => {
    //  #swagger.summary  = '更新使用者資料'
    //  #swagger.description = '以使用者 token 請求，成功將更新使用者資料，資料未填寫將不更新'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }*/
    /*  #swagger.parameters['name'] = {
                in: 'formData',
                type: 'string',
                required: 'false',
                description: '使用者名稱',
                schema: "吳玼芢"
    }
        #swagger.parameters['phone'] = {
                in: 'formData',
                type: 'string',
                required: 'false',
                description: '行動手機號碼',
                schema: "0987654321"
    }
        #swagger.parameters['gender'] = {
                in: 'formData',
                type: 'string',
                required: 'false',
                description: '性別',
                schema: {
                    oneOf: ["男","女","跨性別","不願透漏"]
                }
    }
        #swagger.parameters['birthday'] = {
                in: 'formData',
                type: 'string',
                required: 'false',
                description: '生日',
                schema: "2022-11-06"
    }
        #swagger.parameters['password'] = {
                in: 'formData',
                type: 'string',
                required: 'false',
                description: '密碼',
                schema: "Aaaaaaa1"
    } */

    /*  #swagger.responses[200] = {
                description: '更改成功',
                schema: {
                    status: '更改成功',
                    code: true,
                    result: "資料更改成功"
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '更改失敗',
                schema: {
                    status: '更改失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.delete('/', middleWave, memberModifyMethod.deleteAccount, () => {
    //  #swagger.summary  = '刪除帳號'
    //  #swagger.description = '以 token 和密碼請求，刪除帳號。如有店家身分或商品將一併刪除'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }*/
    /*  #swagger.parameters['password'] = {
                in: 'formData',
                type: 'string',
                required: 'true',
                description: '密碼',
                schema: "Aaaaaaa1"
    } */

    /*  #swagger.responses[200] = {
                description: '帳號已成功刪除',
                schema: {
                    status: '帳號已成功刪除',
                    code: true,
                    result: "成功刪除帳號"
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '因無法驗證身份而刪除失敗',
                schema: {
                    status: '刪除失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
        #swagger.responses[500] = {
                description: '因伺服器問題導致帳號無法刪除',
                schema: {
                    status: '帳號無法刪除',
                    code: false,
                    result: 'error message'
                }
            }
    */
});

router.put('/email/send', middleWave, memberModifyMethod.putEmailSend, () => {
    //  #swagger.summary  = '請求驗證 email 發送'
    //  #swagger.description = '以使用者 token 請求，成功將發送驗證碼 email'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }*/

    /*  #swagger.responses[200] = {
                description: '成功發送驗證碼',
                schema: {
                    status: '成功發送驗證碼',
                    code: true,
                    result: {}
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '無法發送驗證碼',
                schema: {
                    status: '無法發送驗證碼',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.put('/email/verify', middleWave, memberModifyMethod.putEmailVerify, () => {
    //  #swagger.summary  = '驗證 email'
    //  #swagger.description = '以使用者 token 和 verityCode 請求，返回 email 是否驗證成功'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }*/
    /*  #swagger.parameters['verityCode'] = {
                in: 'formData',
                type: 'string',
                required: 'true',
                description: '驗證碼',
                schema: { $ref: '#/definitions/token' }
    } */

    /*  #swagger.responses[200] = {
                description: '驗證成功',
                schema: {
                    status: '驗證成功',
                    code: true,
                    result: {}
                }
            }
    } */
    /*
        #swagger.responses[401] = {
                description: '驗證碼錯誤',
                schema: {
                    status: '驗證碼錯誤',
                    code: false,
                    result: '請確認驗證碼'
                }
            }
    */
});

router.get('/user/info', middleWave, memberModifyMethod.getUserInfo, () => {
    //  #swagger.summary  = '獲取使用者資料'
    //  #swagger.description = '以使用者 token 請求，返回使用者資料'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }*/

    /*  #swagger.responses[200] = {
                description: '成功獲取使用者資料',
                schema: {
                    status: '成功獲取使用者資料',
                    code: true,
                    result: {
                        name:"吳玼芢",
                        email:"usermail123@gmail.com",
                        create_date:"2022-04-16 22:17:56",
                        update_date:"2022-04-16 22:56:18",
                        verityCode: true,
                        phone:"0987654321",
                        birthday:"2022-11-06",
                    }
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '無法獲取使用者資料',
                schema: {
                    status: '無法獲取使用者資料',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.get('/user/token', middleWave, memberModifyMethod.getUserToken, () => {
    //  #swagger.summary  = '請求新令牌 (token)'
    //  #swagger.description = '以使用者 refresh_token 請求，返回一個新的 token'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['refresh_token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member refresh_token',
                schema: { $ref: '#/definitions/token' }
    }*/

    /*  #swagger.responses[200] = {
                description: '成功獲取新token',
                schema: {
                    status: '成功獲取新token',
                    code: true,
                    result: "token時效為半小時"
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '無法獲取token',
                schema: {
                    status: '無法獲取token',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.post('/user/order', jsonParser, middleWave, memberModifyMethod.postOrder, () => {
    //  #swagger.summary  = '訂單寄出'
    //  #swagger.description = '以使用者 token 和 Json 陣列形式的資料請求，在資料庫中新增一個訂單。'
    /*  #swagger.consumes = ['application/json']*/
    /*  #swagger.parameters['token'] = {
            in: 'header',
            type: 'string',
            required: 'true',
            description: 'member access token',
            schema: { $ref: '#/definitions/token' }
    }*/
    /* #swagger.parameters = {
            in: 'body',
            name: 'body',
            required: true,
            type: 'array',
            schema:{ $ref: '#/definitions/order' }
        }
    */

    /*  #swagger.responses[200] = {
                description: '點餐成功',
                schema: {
                    "status": "點餐成功",
                    "code": true,
                    "result": {
                        "order": { $ref: '#/definitions/orderStr' },
                        "DATE": "2022-07-11T08:17:32.616Z",
                        "store_info": {
                            "name": "燒肉飯店",
                            "address": "台北市中山區OO街OO號"
                        },
                        "total": 135,
                        "discount": "[]",
                        "complete": false,
                        "accept": false
                    }
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '點餐失敗',
                schema: {
                    status: '點餐失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.get('/user/order', jsonParser, middleWave, memberModifyMethod.getOrder, () => {
    //  #swagger.summary  = '獲取歷史訂單'
    //  #swagger.description = '以使用者 token 請求，獲取其歷史訂單。'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
            in: 'header',
            type: 'string',
            required: 'true',
            description: 'member access token',
            schema: { $ref: '#/definitions/token' }
    }*/

    /*  #swagger.responses[200] = {
                description: '成功獲取歷史訂單資料',
                schema: {
                    "status": "成功獲取歷史訂單資料",
                    "code": true,
                    "result": [
                        {
                        "_id": "62cbdc9f6c1b617ef9b4d3b9",
                        "order": { $ref: '#/definitions/orderStr' },
                        "DATE": "2022-07-11T08:17:32.616Z",
                        "store_info": {
                            "name": "燒肉飯店",
                            "address": "台北市中山區OO街OO號"
                        },
                        "total": 135,
                        "discount": "[]",
                        "complete": false,
                        "accept": false
                        }
                    ]
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '無法獲取歷史訂單資料',
                schema: {
                    status: '無法獲取歷史訂單資料',
                    code: false,
                    result: 'error message'
                }
            }
    */
});

router.get('/store', middleWave, memberModifyMethod.getStoreInfo, () => {
    //  #swagger.summary  = '獲取商家列表'
    //  #swagger.description = '以使用者 token 請求，返回商家列表'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }*/

    /*  #swagger.responses[200] = {
                description: '成功獲取商家列表',
                schema: {
                    status: '成功獲取商家列表',
                    code: true,
                    "result": [
                            {
                                "name": "友朋小吃",
                                "address": "桃園市中壢區OO街OO號",
                                "id": "8y3un9ka"
                            },
                            {
                                "name": "燒肉飯店",
                                "address": "台北市中山區OO街OO號",
                                "id": "9xe72aqx"
                            }
                        ]
                    }
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '無法獲取商家列表',
                schema: {
                    status: '無法獲取商家列表',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.get('/store/product', middleWave, memberModifyMethod.getProductInfo, () => {
    //  #swagger.summary  = '獲取特定商家所有商品'
    //  #swagger.description = '以使用者 token 請求，返回商家列表'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'access token',
                schema: { $ref: '#/definitions/token' }
        }
        #swagger.parameters['id'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'store id',
                schema: "8y3un9ka"
        }
    */

    /*  #swagger.responses[200] = {
                description: '成功獲取商品資料',
                schema: {
                    status: '成功獲取商品資料',
                    code: true,
                    "result": [
                            {
                                "name": "奶茶",
                                "price": "30",
                                "describe": "",
                                "type": "飲料"
                            },
                            {
                                "name": "漢堡",
                                "price": "1395",
                                "describe": "美味蟹堡",
                                "type": "熱食"
                            }
                        ]
                    }
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '無法獲取商品資料',
                schema: {
                    status: '無法獲取商品資料',
                    code: false,
                    result: 'error message'
                }
            }
    */
});

module.exports = router;