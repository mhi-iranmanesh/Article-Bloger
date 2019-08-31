module.exports = {
    isLogin: (req, res, next) => {
        return (req.isAuthenticated()) ? next() : res.json({msg:'please login'});
    }
}