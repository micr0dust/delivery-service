var express = require('express');
var router = express.Router();

const BusinessModifyMethod = require('../controllers/business/modify_controller');
const middleWave = require('../models/middleWave/business');

let businessModifyMethod = new BusinessModifyMethod();

router.get('/token', middleWave, businessModifyMethod.getToken, () => {
    //  #swagger.summary  = '營業中商家獲取 token'
    //  #swagger.description = '以商家營業模式的 refresh_token 請求，返回此商家營業模式的 token'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['refresh_token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'store refresh token',
                schema: { $ref: '#/definitions/token' }
    }
    */

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
        #swagger.responses[500] = {
                description: '無法獲取token',
                schema: {
                    status: '無法獲取token',
                    code: false,
                    result: 'error message'
                }
            }
    */
});
router.get('/order', middleWave, businessModifyMethod.getOrder, () => {
    //  #swagger.summary  = '營業中商家獲取訂單'
    //  #swagger.description = '以商家營業模式的 token 請求，返回此商家所有未完成的訂單'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'store access token',
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
router.put('/order/accept', middleWave, businessModifyMethod.putAccept, () => {
    //  #swagger.summary  = '營業中商家接受訂單'
    //  #swagger.description = '以商家營業模式的 token 和訂單 id 請求，將訂單標記為已接受'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'store access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  #swagger.parameters['id'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '訂單 id',
                 schema: "62bfabae55036d765d2adfbf"
     } */

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
router.put('/order/complete', middleWave, businessModifyMethod.putComplete, () => {
    //  #swagger.summary  = '營業中商家將訂單標記為已完成'
    //  #swagger.description = '以商家營業模式的 token 和訂單 id 請求，將訂單標記為已完成'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'store access token',
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

module.exports = router;