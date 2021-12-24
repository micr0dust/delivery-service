var express = require('express');
var router = express.Router();

router.get('/register', function(req, res, next) {
    res.render('form', { title: 'Hello中原-註冊', part: 'register' });
});

router.get('/login', function(req, res, next) {
    res.render('form', { title: 'Hello中原-登入', part: 'login' });
});

module.exports = router;