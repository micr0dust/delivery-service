var express = require('express');
var router = express.Router();

const GroupModifyMethod = require('../controllers/group/modify_controller');
const middleWave = require('../models/middleWave/member');

let groupModifyMethod = new GroupModifyMethod();

router.get('/', middleWave, groupModifyMethod.getGroupInfo, () => {
    //  #swagger.summary  = '獲取特定群組'
    //  #swagger.description = '以 token 請求和群組ID請求，返回特定群組資料'
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
                 in: 'header',
                 type: 'string',
                 required: 'true',
                 description: '群組ID',
                 schema: "62ce7094d47de10b3b6d68f7"
     } */

    /*  #swagger.responses[200] = {
                description: '成功獲取群組資料',
                schema: {
                    status: '成功獲取群組資料',
                    code: true,
                    result: [
                                {
                                    "name": "燒肉飯店",
                                    "address": "台北市中山區OO街OO號",
                                    "url": "9xe72aqx",
                                    "discount": "[]"
                                }
                            ]
                }
            }
    } */
    /*
        #swagger.responses[500] = {
                description: '無法獲取群組資料',
                schema: {
                    status: '無法獲取群組資料',
                    code: false,
                    result: 'error message'
                }
            }
    */
});


module.exports = router;