var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Hello中原' });
});

router.get('/register', function(req, res, next) {
    res.render('form', { title: 'Hello中原-註冊', part: 'register' });
});

router.get('/login', function(req, res, next) {
    res.render('form', { title: 'Hello中原-登入', part: 'login' });
});

router.get('/verify', function(req, res, next) {
    res.render('form', { title: 'Hello中原-郵箱驗證', part: 'verify' });
});

router.get('/user', function(req, res, next) {
    res.render('console', { title: 'Hello中原' });
});

module.exports = router;