const productData = require('../../models/product/get_all_product_model');

module.exports = class GetProduct {
    // 取得全部產品資料
    getAllProduct(req, res, next) {
        productData().then(result => {
            res.json({
                code: true,
                result: result
            })
        }, (err) => {
            res.json({
                code: false,
                result: err
            })
        })
    }
}