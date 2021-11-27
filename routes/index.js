var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/member/modify_controller');

let memberModifyMethod = new MemberModifyMethod();

router.post('/register', memberModifyMethod.postRegister);
router.post('/login', memberModifyMethod.postLogin);
router.put('/update', memberModifyMethod.putUpdate);
router.put('/email/send', memberModifyMethod.putEmailSend);
router.put('/email/verify', memberModifyMethod.putEmailVerify);
module.exports = router;