var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('console', { title: 'Hello中原-個人資料', part: 'user/profile' });
});

router.get('/mail', function(req, res, next) {
    res.render('form', { title: 'Hello中原-郵箱驗證', part: 'mail' });
});

router.get('/verify', function(req, res, next) {
    res.render('form', { title: 'Hello中原-郵箱驗證', part: 'verify' });
});

router.get('/wall', function(req, res, next) {
    res.render('posts', { title: 'Hello中原', part: 'wall' });
});

router.get('/storepage', function(req, res, next) {
    res.render('posts', { title: 'Hello中原', part: 'storePage' });
});
router.get('/verify/phone', function(req, res, next) {
    res.render('form', { title: 'Hello中原-手機驗證', part: 'phone_message' });
});

router.get('/admin', function(req, res, next) {
    res.render('console', { title: '管理員後台', part: 'admin/index' });
});

module.exports = router;