var express = require('express');
var router = express.Router();

const AdminModifyMethod = require('../controllers/admin/modify_controller');
const middleWave = require('../models/middleWave/member');

let adminModifyMethod = new AdminModifyMethod();

router.post('/verify', middleWave, adminModifyMethod.postAdminVerify, () => {
    //  #swagger.summary = '管理員身分驗證'
    //  #swagger.description = '以 token 請求，對該帳號進行管理員身分驗證'
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
                description: '成功驗證管理員身分',
                schema: {
                    status: '成功驗證管理員身分',
                    code: true,
                    result: "成功驗證管理員身分"
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '無法驗證管理員身分',
                schema: {
                    status: '無法驗證管理員身分',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
         #swagger.responses[500] = {
                 description: '無法移除身分',
                 schema: {
                     status: '無法移除身分',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});

router.post('/role/add', middleWave, adminModifyMethod.postAddRole, () => {
    //  #swagger.summary  = '對特定帳號新增身分'
    //  #swagger.description = '以 token、欲加身分和目標 ID 請求，對該帳號新增身分'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  #swagger.parameters['id'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '目標帳號 ID',
                 schema: "6218bc479bd8bbdaa3036906"
        }
        #swagger.parameters['role'] = {
                 in: 'formData',
                 type: 'integer',
                 required: 'true',
                 description: '身分別',
                 schema: "store"
        }
    */

    /*  #swagger.responses[200] = {
                description: '成功新增身分',
                schema: {
                    status: '成功新增身分',
                    code: true,
                    result: "成功新增身分 store 至帳號 吳玼仁"
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '身分格式錯誤',
                schema: {
                    status: '身分格式錯誤',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
         #swagger.responses[500] = {
                 description: '無法新增身分',
                 schema: {
                     status: '無法新增身分',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});

router.post('/role/remove', middleWave, adminModifyMethod.deleteRole, () => {
    //  #swagger.summary = '對特定帳號移除身分'
    //  #swagger.description = '以 token、欲移除身分和目標 ID 請求，對該帳號移除身分'
    /*  #swagger.consumes = ['application/x-www-form-urlencoded']*/
    /*  #swagger.parameters['token'] = {
                in: 'header',
                type: 'string',
                required: 'true',
                description: 'member access token',
                schema: { $ref: '#/definitions/token' }
    }
    */
    /*  #swagger.parameters['id'] = {
                 in: 'formData',
                 type: 'string',
                 required: 'true',
                 description: '目標帳號 ID',
                 schema: "6218bc479bd8bbdaa3036906"
        }
        #swagger.parameters['role'] = {
                 in: 'formData',
                 type: 'integer',
                 required: 'true',
                 description: '身分別',
                 schema: "store"
        }
    */

    /*  #swagger.responses[200] = {
                description: '成功移除身分',
                schema: {
                    status: '成功移除身分',
                    code: true,
                    result: "成功從帳號 吳玼仁 移除身分 store"
                }
            }
    } */
    /*
        #swagger.responses[400] = {
                description: '身分格式錯誤',
                schema: {
                    status: '身分格式錯誤',
                    code: false,
                    result: 'error message'
                }
            }
    */
    /*
         #swagger.responses[500] = {
                 description: '無法移除身分',
                 schema: {
                     status: '無法移除身分',
                     code: false,
                     result: 'error message'
                 }
             }
     */
});

module.exports = router;