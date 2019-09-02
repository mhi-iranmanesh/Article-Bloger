module.exports = {
    isLogin: (req, res, next) => {
        return (req.isAuthenticated()) ? next() : res.redircte('./api',{title: 'teset'});
    }
}