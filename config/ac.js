module.exports = {
    routeController: (roles) => {
        return (req, res, next) =>{
            if (roles.includes(req.user.role)) return next();
            else return res.status(403).send('access denied');
        }
    }
}