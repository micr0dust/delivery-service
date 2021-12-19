var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/member/modify_controller');
const middleWave = require('../models/middleWave/member');

let memberModifyMethod = new MemberModifyMethod();

router.post('/register', memberModifyMethod.postRegister);
router.post('/login', memberModifyMethod.postLogin);
router.put('/update', middleWave, memberModifyMethod.putUpdate);
router.put('/email/send', middleWave, memberModifyMethod.putEmailSend);
router.put('/email/verify', middleWave, memberModifyMethod.putEmailVerify);
router.get('/user/info', middleWave, memberModifyMethod.getUserInfo);
module.exports = router;