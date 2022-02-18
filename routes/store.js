var express = require('express');
var router = express.Router();

const StoreModifyMethod = require('../controllers/store/modify_controller');
const middleWave = require('../models/middleWave/store');

let storeModifyMethod = new StoreModifyMethod();

router.get('/get', middleWave, storeModifyMethod.getStoreInfo);
router.post('/login', middleWave, storeModifyMethod.postLogin);
router.post('/establish', middleWave, storeModifyMethod.postEstablish);
router.post('/product/add', middleWave, storeModifyMethod.postProduct);

module.exports = router;