var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('console', { title: '商家主控台', part: 'shop/profile' });
});
router.get('/establish', function(req, res, next) {
    res.render('form', { title: '建立商家', part: 'shop/establish' });
});
router.get('/add', function(req, res, next) {
    res.render('product', { title: '新增商品', part: 'shop/product', addition: 'shop/addition/add' });
});
router.get('/update', function(req, res, next) {
    res.render('product', { title: '更新商品', part: 'shop/product', addition: 'shop/addition/update' });
});
router.get('/bussiness', function(req, res, next) {
    res.render('console', { title: '營業中', part: 'shop/bussiness/index' });
});


module.exports = router;