var express = require('express');
var router = express.Router();

router.get('/register', function(req, res, next) {
    res.render('form', { title: 'foodone 註冊', part: 'register' });
});

router.get('/login', function(req, res, next) {
    res.render('form', { title: 'foodone 登入', part: 'login' });
});

router.get('/old_login', function(req, res, next) {
    res.render('form', { title: 'foodone 登入', part: 'old_login' });
});

module.exports = router;