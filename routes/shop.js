var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('console', { title: 'Hello中原-商家主控台', part: 'shop/profile' });
});
router.get('/add', function(req, res, next) {
    res.render('console', { title: 'Hello中原-新增商品', part: 'shop/add' });
});

module.exports = router;