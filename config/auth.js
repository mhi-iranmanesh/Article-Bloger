module.exports = {
    isLogin: (req, res, next) => {
        return (req.isAuthenticated()) ? next() : res.json({success: false, msg:'please login'});
    }
}