var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('console', { title: 'Hello中原-商家主控台', part: 'shop/profile' });
});
router.get('/add', function(req, res, next) {
    res.render('console', { title: 'Hello中原-新增商品', part: 'shop/add' });
});
router.get('/bussiness', function(req, res, next) {
    res.render('console', { title: 'Hello中原-營業中', part: 'shop/bussiness/index' });
});


module.exports = router;