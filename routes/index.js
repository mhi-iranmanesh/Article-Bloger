const express = require('express');
const router = express.Router();
const islogin = require('../config/auth').isLogin;
const Article = require('../models/article');
const jalaliDate = require('../tools/jalaliDate');
const User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  let page = 5 * (--req.params.page);
  let numberArticl;
  console.log(req.param('page'))
  Article.find({}, async (err, article) => {

      for (let i = 0; i < article.length; i++) {

          article[i].text = article[i].text.slice(0, 250) + " ...";
          
          let dt = new Date(article[i].dateCreate);
          
          article[i].dateAt = jalaliDate.gregorian_to_jalali(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
          article[i].datePersian = jalaliDate.persianDateLong(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getDay() );
          
          await User.findOne({ userName: article[i].userName }, { firstName: 1, lastName: 1 }, (err, user) => {

              if (err) res.json({ success: false, err })
              article[i].firstName = user.firstName;
              article[i].lastName = user.lastName;
              article[i].idWriter = user._id;

          })

          numberArticl = await Article.find({}).count();
      }
      res.render('index', {
          article,
          numberArticl,
          title: 'مقالات'
      }
      )
  })
      .sort({ dateCreate: -1 })
      .limit(5)
      .skip(page);});

/* GET profile. */

router.get('/profile', islogin, (req, res ,next) => {
  res.render('profile', {
    title: `پروفایل ${req.user.firstName} ${req.user.lastName}`,
    user: req.user,
    layout: false
})
});

module.exports = router;
