var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('console', { title: 'Hello中原-商家主控台', part: 'shop/profile' });
});

module.exports = router;