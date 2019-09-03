const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/avatarArticle/')
    },
    filename: function (req, file, cb) {
        console.log("avatart image  :", req.body)
        cb(null, req.body.picPath + '.jpg')
    }
})

var articleImgUpload = multer({ storage: storage })

module.exports = articleImgUpload;
