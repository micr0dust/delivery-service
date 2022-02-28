var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var jsonParser = bodyParser.json();

const MemberModifyMethod = require('../controllers/member/modify_controller');
const middleWave = require('../models/middleWave/member');

let memberModifyMethod = new MemberModifyMethod();

router.post('/register', memberModifyMethod.postRegister);
router.post('/login', memberModifyMethod.postLogin);
router.put('/update', middleWave, memberModifyMethod.putUpdate);
router.delete('/delete', middleWave, memberModifyMethod.deleteAccount);

router.put('/email/send', middleWave, memberModifyMethod.putEmailSend);
router.put('/email/verify', middleWave, memberModifyMethod.putEmailVerify);

router.get('/user/info', middleWave, memberModifyMethod.getUserInfo);
router.get('/user/token', middleWave, memberModifyMethod.getUserToken);
router.post('/user/order', jsonParser, middleWave, memberModifyMethod.postOrder);

router.get('/store', middleWave, memberModifyMethod.getStoreInfo);
router.get('/store/product', middleWave, memberModifyMethod.getProductInfo);

module.exports = router;