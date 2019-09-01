const express = require('express');
const router = express.Router();
const islogin = require('../config/auth').isLogin;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'مقالستان' });
});

/* GET profile. */

router.get('/profile', islogin, (req, res ,next) => {
  res.render('profile');
  console.log(req.user)
});

module.exports = router;
