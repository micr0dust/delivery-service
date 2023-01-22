var express = require('express');
var router = express.Router();

const StoreModifyMethod = require('../controllers/store/modify_controller');
const middleWave = require('../models/middleWave/store');
const { profileUpload } = require('../models/middleWave/fileUpload');

let storeModifyMethod = new StoreModifyMethod();

router.get('/', middleWave, storeModifyMethod.getStoreInfo, () => {
    //  #swagger.summary  = '獲取商家資訊'
    //  #swagger.description = '以 token 請求，返回商家名稱、地址等相關資訊'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */

    /*  #swagger.responses[200] = {
                description: '成功獲取店家資料',
                schema: {
                    status: '成功獲取店家資料',
                    code: true,
                    result: {
                        "name": "友朋小吃",
                        "address": "桃園市中壢區OO街OO號",
                        "create_date": "2022-02-11 17:34:03",
                        "last_login": "2022-02-25 17:53:25",
                        "product": [
                            "6211e1afb27988329badd497",
                            "6211e1d8b27988329badd498"
                        ],
                        "location": {
                            "lat": "25.0541642",
                            "lng": "121.5282883",
                            "googlePlaceId": "ChIJP4zIp2epQjQRNPL8Eubdr_Q"
                        }
                    }
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '無法獲取店家資料',
                schema: {
                    status: '無法獲取店家資料',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.post('/login', middleWave, storeModifyMethod.postLogin, () => {
    //  #swagger.summary  = '商家開啟營業模式'
    //  #swagger.description = '以 token 請求，返回營業模式專屬的一組 token 和 refresh_token'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */

    /*  #swagger.responses[200] = {
                description: '成功',
                schema: {
                    status: '成功',
                    code: true,
                    result: "友朋小吃 的營運模式已開啟"
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '切換失敗',
                schema: {
                    status: '切換失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.post('/establish', middleWave, storeModifyMethod.postEstablish, () => {
    //  #swagger.summary  = '建立商家'
    //  #swagger.description = '以店名和地址為帳號建立商家'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '商店名稱',
                 schema: "友朋小吃"
     }
         #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '地址',
                 schema: "台北市中壢區OO街OO號"
     }*/

    /*  #swagger.responses[200] = {
                description: '註冊成功',
                schema: {
                    status: '註冊成功',
                    code: true,
                    result: {
                        "name": "友朋小吃",
                        "address": "台北市中壢區OO街OO號",
                        "create_date": "2022-11-06 17:08:07"
                    }
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '因格式資料錯誤導致註冊失敗',
                schema: {
                    status: '註冊失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
         #swagger.responses[500] = {
                 description: '因伺服器錯誤導致註冊失敗',
                 schema: {
                     status: '註冊失敗',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});
router.delete('/', middleWave, storeModifyMethod.deleteStore, () => {
    //  #swagger.summary  = '刪除商家'
    //  #swagger.description = '以 token 和密碼請求，刪除帳號的店家身分及其下商品'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  #swagger.parameters['name'] = {
                in: 'formData',
                type: 'string',
                required: 'true',
                description: '商家名稱',
                schema: '有朋小吃'
    }
    */

    /*  #swagger.responses[200] = {
                description: '商家身分已成功刪除',
                schema: {
                    status: '商家身分已成功刪除',
                    code: true,
                    result: "成功刪除商家及其商品"
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '因找不到該帳號所有之店家而導致刪除失敗',
                schema: {
                    status: '刪除失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
        #swagger.responses[500] = {
                description: '因伺服器錯誤而導致刪除失敗',
                schema: {
                    status: '刪除失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.put('/', middleWave, storeModifyMethod.putStoreData, () => {
    //  #swagger.summary  = '更新商家資料'
    //  #swagger.description = '以 token 請求，成功將更新商家資料，資料未填寫將不更新'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  #swagger.parameters['name'] = {
                in: 'formData',
                type: 'string',
                required: 'false',
                description: '店名',
                schema: "蟹堡王"
    }
        #swagger.parameters['address'] = {
                in: 'formData',
                type: 'string',
                required: 'false',
                description: '商家地址',
                schema: "臺北市中華路3段45號"
    }
        #swagger.parameters['discount'] = {
                in: 'formData',
                type: 'string',
                required: 'false',
                description: '折價公式',
                schema: { $ref: '#/definitions/discount' }
    }
    */

    /*  #swagger.responses[200] = {
                description: '商家身分已成功刪除',
                schema: {
                    status: '商家身分已成功刪除',
                    code: true,
                    result: "成功刪除商家及其商品"
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '因找不到該帳號所有之店家而導致刪除失敗',
                schema: {
                    status: '刪除失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
        #swagger.responses[500] = {
                description: '因伺服器錯誤而導致刪除失敗',
                schema: {
                    status: '刪除失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.post('/product', middleWave, storeModifyMethod.postProduct, () => {
    //  #swagger.summary  = '新增商品'
    //  #swagger.description = '以 token 和商品資料請求，建立商品'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '商品名稱',
                 schema: "超大漢堡"
        }
        #swagger.parameters['price'] = {
                 in: 'formData',
                 type: 'integer',
                 required: 'true',
                 description: '價格',
                 schema: 139
        }
        #swagger.parameters['describe'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'false',
                 description: '簡介',
                 schema: "漢堡超大"
        }
        #swagger.parameters['type'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'false',
                 description: '類別',
                 schema: "漢堡"
        }
        #swagger.parameters['options'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'false',
                 description: '進階選項',
                 schema: { $ref: '#/definitions/options' }
        }
        #swagger.parameters['discount'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'false',
                 description: '折價',
                 schema: { $ref: '#/definitions/discount' }
        }
    */

    /*  #swagger.responses[201] = {
                description: '新增成功',
                schema: {
                    status: '新增成功',
                    code: true,
                    result: {
                        "name": "超大漢堡",
                        "price": "139",
                        "describe": "漢堡超大",
                        "type": "漢堡",
                        "options":{ $ref: '#/definitions/options' },
                        "discount":{ $ref: '#/definitions/discount' }
                    }
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '因格式資料錯誤導致新增失敗',
                schema: {
                    status: '新增失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
         #swagger.responses[500] = {
                 description: '因伺服器錯誤導致新增失敗',
                 schema: {
                     status: '新增失敗',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});
router.put('/product', middleWave, storeModifyMethod.putProduct, () => {
    //  #swagger.summary  = '更新商品'
    //  #swagger.description = '以 token 和商品資料請求，建立商品'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  
        #swagger.parameters['id'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '商品ID',
                 schema: "62bfabae55036d765d2adfbf"
        }
        #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '商品名稱',
                 schema: "超大漢堡"
        }
        #swagger.parameters['price'] = {
                 in: 'formData',
                 type: 'integer',
                 required: 'true',
                 description: '價格',
                 schema: 139
        }
        #swagger.parameters['describe'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'false',
                 description: '簡介',
                 schema: "漢堡超大"
        }
        #swagger.parameters['type'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'false',
                 description: '類別',
                 schema: "漢堡"
        }
        #swagger.parameters['options'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'false',
                 description: '進階選項',
                 schema: { $ref: '#/definitions/options' }
        }
        #swagger.parameters['discount'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'false',
                 description: '折價',
                 schema: { $ref: '#/definitions/discount' }
        }
    */

    /*  #swagger.responses[201] = {
                description: '新增成功',
                schema: {
                    status: '新增成功',
                    code: true,
                    result: {
                        "name": "超大漢堡",
                        "price": "139",
                        "describe": "漢堡超大",
                        "type": "漢堡",
                        "options":{ $ref: '#/definitions/options' },
                        "discount":{ $ref: '#/definitions/discount' }
                    }
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '因格式資料錯誤導致新增失敗',
                schema: {
                    status: '新增失敗',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
         #swagger.responses[500] = {
                 description: '因伺服器錯誤導致新增失敗',
                 schema: {
                     status: '新增失敗',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});
router.put('/product/pause', middleWave, storeModifyMethod.switchProductStatue, () => {
    //  #swagger.summary  = '臨時上下架商品'
    //  #swagger.description = '以 token 和商品 ID 請求，標註商品狀態為 true / false'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  
        #swagger.parameters['productID'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '商品ID',
                 schema: "62bfabae55036d765d2adfbf"
        }
    */

    /*  #swagger.responses[201] = {
                description: '狀態更新成功',
                schema: {
                    status: '狀態更新成功',
                    code: true,
                    result: {
                        "name": "超大漢堡",
                        "price": "139",
                        "describe": "漢堡超大",
                        "type": "漢堡",
                        "options":{ $ref: '#/definitions/options' },
                        "discount":{ $ref: '#/definitions/discount' },
                        "pause": true
                    }
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '格式錯誤',
                schema: {
                    status: '格式錯誤',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
         #swagger.responses[500] = {
                 description: '狀態更新失敗',
                 schema: {
                     status: '狀態更新失敗',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});
router.delete('/product', middleWave, storeModifyMethod.deleteProduct, () => {
    //  #swagger.summary  = '刪除商品'
    //  #swagger.description = '以 token 和商品id請求，刪除商品'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  #swagger.parameters['product'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '商品ID',
                 schema: "6218bc479bd8bbdaa3036906"
        }
    */

    /*  #swagger.responses[200] = {
                description: '成功刪除商品',
                schema: {
                    status: '成功刪除商品',
                    code: true,
                    result: "6218bc479bd8bbdaa3036906"
                }
            }
    } */
    /*
         #swagger.responses[500] = {
                 description: '刪除商品失敗',
                 schema: {
                     status: '刪除商品失敗',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});
router.get('/product/one', middleWave, storeModifyMethod.oneProduct, () => {
    //  #swagger.summary  = '商家獲取特定單一商品'
    //  #swagger.description = '以 token 和商品 ID 請求，返回屬於店家的特定單一商品'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'access token',
                schema: { $ref: '#/definitions/token' }
    }
        #swagger.parameters['productID'] = {
                  in: 'header',
                  type: 'string',
                  required: 'true',
                  description: '商品ID',
                  schema: "62bfabae55036d765d2adfbf"
         }
     */

    /*  #swagger.responses[200] = {
                description: '成功獲取商品資料',
                schema: {
                    status: '成功獲取商品資料',
                    code: true,
                    result: {
                        "_id": "62e34a28167d90df4ef71efc",
                        "name": "超小漢堡",
                        "price": "1395",
                        "describe": "嫌貴就不要買啊",
                        "type": "漢堡",
                        "discount": "[{\"method\":\"exceedPriceDiscount\",\"goal\":100,\"discount\":15}]",
                        "options": "[{\"title\":\"肉種\",\"multiple\":false,\"requires\":true,\"option\":[{\"name\":\"牛肉\",\"cost\":\"0\"},{\"name\":\"雞肉\",\"cost\":\"0\"},{\"name\":\"豬肉\",\"cost\":\"0\"},{\"name\":\"魚肉\",\"cost\":\"0\"}]},{\"title\":\"加料\",\"multiple\":true,\"requires\":false,\"option\":[{\"name\":\"雙層肉\",\"cost\":\"20\"},{\"name\":\"2倍起司\",\"cost\":\"10\"}]}]",
                        "create_date": "2022-08-31 16:09:13",
                        "belong": "62062d8d136e8a533bb22e48",
                        "pause": false
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
router.get('/order', middleWave, storeModifyMethod.getOrder, () => {
    //  #swagger.summary  = '商家獲取訂單'
    //  #swagger.description = '以 token 請求，返回此商家所有的訂單'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'access token',
                schema: { $ref: '#/definitions/token' }
    }
    */

    /*  #swagger.responses[200] = {
                description: '成功獲取訂單',
                schema: {
                    status: '成功獲取訂單',
                    code: true,
                    result: [
                        {
                            "DATE": "2022-02-20T06:29:32.928Z",
                            "id": "61c9774137e1ba4becbbe1c7",
                            "_id": "6211dfd06fdc48d566ae202e",
                            "order": "[{\"id\":\"620cdd750813c9620d3c7fd0\",\"count\":\"2\"},{\"id\":\"620cdc8c8e1bae9b3962b1f2\",\"count\":\"1\",\"describe\":\"去冰\"}]",
                            "store": "62062d8d136e8a533bb22e48"
                        },
                        {
                            "DATE": "2022-02-20T06:30:55.254Z",
                            "id": "61c9774137e1ba4becbbe1c7",
                            "_id": "6211e02249403543cdb3148f",
                            "order": "[{\"id\":\"620cdd750813c9620d3c7fd0\",\"count\":\"4\"},{\"id\":\"620cdc8c8e1bae9b3962b1f2\",\"count\":\"1\",\"describe\":\"熱\"}]",
                            "store": "62062d8d136e8a533bb22e48"
                        },
                        {
                            "DATE": "2022-02-20T06:43:44.598Z",
                            "id": "61c9774137e1ba4becbbe1c7",
                            "_id": "6211e32327e60f21cc93d7a9",
                            "order": "[{\"id\":\"6211e1afb27988329badd497\",\"count\":\"1\"},]",
                            "store": "62062d8d136e8a533bb22e48"
                        }
                    ]
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '無法獲取訂單',
                schema: {
                    status: '無法獲取訂單',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.get('/income', middleWave, storeModifyMethod.getIncome, () => {
    //  #swagger.summary  = '取得店家上個月營收'
    //  #swagger.description = '以 token 請求，返回此店家上個月營收'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'access token',
                schema: { $ref: '#/definitions/token' }
    }
    */

    /*  #swagger.responses[200] = {
                description: '成功獲取 7 月營收',
                schema: {
                    status: '成功獲取 7 月營收',
                    code: true,
                    result: 12345
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '無法獲取 7 月營收',
                schema: {
                    status: '無法獲取 7 月營收',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.post('/addressInfo', middleWave, storeModifyMethod.addressInfo, () => {
    //  #swagger.summary  = '取得地址資料'
    //  #swagger.description = '以 token 和地址請求，取得地址相關資料'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  
        #swagger.parameters['token'] = {
            in: 'header',
            type: 'string',
            required: 'true',
            description: 'access token',
            schema: { $ref: '#/definitions/token' }
        }
    */

    /*  #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '地址',
                 schema: "台北市中壢區OO街OO號"
        }
    */

    /*  #swagger.responses[200] = {
                description: '成功請求地址資料',
                schema: {
                    status: '成功請求地址資料',
                    code: true,
                    result: "result"
                }
            }
    } */
    /*
         #swagger.responses[500] = {
                 description: '請求地址資料失敗',
                 schema: {
                     status: '請求地址資料失敗',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});
router.post('/upload-img', middleWave, profileUpload.single('img'), storeModifyMethod.uploadImg, () => {
    //  #swagger.summary  = '上傳圖片'
    //  #swagger.description = '以 token 獲得許可，上傳圖片'
    /*  #swagger.consumes = ['multipart/form-data']*/
    /*  
        #swagger.parameters['token'] = {
            in: 'header',
            type: 'string',
            required: 'true',
            description: 'access token',
            schema: { $ref: '#/definitions/token' }
        }
    */

    /*  #swagger.parameters['file'] = {
                 in: 'formData',
                 type: 'file',
                 required: 'true',
                 description: '檔案'
        }
    */

    /*  #swagger.responses[200] = {
                description: '成功上傳圖片',
                schema: {
                    status: '成功上傳圖片',
                    code: true,
                    result: "result"
                }
            }
    } */
    /*
         #swagger.responses[500] = {
                 description: '上傳圖片失敗',
                 schema: {
                     status: '上傳圖片失敗',
                     code: false,
                     result: 'error message'
                 }
             }
     */
})

module.exports = router;