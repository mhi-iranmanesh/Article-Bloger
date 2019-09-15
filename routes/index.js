const express = require('express');
const router = express.Router();
const islogin = require('../config/auth').isLogin;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'مقالستان' });
});

/* GET profile. */

router.get('/profile', islogin, (req, res ,next) => {
  res.render('profile', {
    title: `پروفایل ${req.user.firstName} ${req.user.lastName}`,
    user: req.user,
    layout: false
})
});

module.exports = router;
