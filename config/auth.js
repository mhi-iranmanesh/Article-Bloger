module.exports = {
    isLogin: (req, res, next) => {
        if (req.isAuthenticated()) {
            next()
        } else {
            req.flash('success_msg', 'لطفاً وارد شوید')
            res.redirect('/api/allArticle/1');
        }
    }
}