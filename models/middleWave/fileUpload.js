const multer = require('multer');
const config = require('../../config/development_config');

const profileUpload = multer({
    limit: {
        // 限制上傳檔案的大小為 1MB
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // 只接受三種圖片格式
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(Error("wrong file type"), false);
        } else
            cb(null, true);
    }
})

module.exports = {
    profileUpload
};