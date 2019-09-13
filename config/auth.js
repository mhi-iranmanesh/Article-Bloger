module.exports = {
    isLogin: (req, res, next) => {
        if (req.isAuthenticated()) {
            next()
        } else {
            req.flash('error_msg', 'لطفاً وارد شوید')
            res.redirect('/api/allArticle/1');
        }
    }
}