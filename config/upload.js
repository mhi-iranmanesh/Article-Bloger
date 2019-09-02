const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/avatar/')
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + '.jpg')
    }
})

var upload = multer({ storage: storage })

module.exports = upload;
