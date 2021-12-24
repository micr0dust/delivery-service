var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('console', { title: 'Hello中原-個人資料' });
});

router.get('/verify', function(req, res, next) {
    res.render('form', { title: 'Hello中原-郵箱驗證', part: 'verify' });
});

module.exports = router;