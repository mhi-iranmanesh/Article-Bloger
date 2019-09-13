const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Article = require('../models/article');

const { isLogin } = require('../config/auth');
const { routeController } = require('../config/ac');
const jalaliDate = require('../tools/jalaliDate')

const user = require('./user');
const admin = require('./admin');
const general = require('./general');

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------login Post-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/api/allArticle/1',
        failureRedirect: '/api/allArticle/1',
        failureFlash: true
    })(req, res, next);
});

router.get('/logOut', (req, res, next) => {
    let name = req.user.firstName + " " + req.user.lastName;
    req.logout();
    req.flash('success_msg', `${name} ، خدانگهدار...`)
    res.redirect('./allArticle/1');

});


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------Register Post-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

router.post('/register', (req, res, next) => {
    const { firstName, lastName, userNameRe, passwordRe, gender, phone } = req.body;
     
    console.log(req.body);

    User.findOne({ userName: userNameRe }, (err, user) => {
        if (err) {
            return res.json({ success: false, msg: "user is exist!" })
        }

        if (user) {
            return res.json({ success: false, msg: " User Is Exist! " })
        }

        new User({
            firstName, lastName, userName:
                userNameRe, password: passwordRe, gender, phone, role: "user"
        }).save((err, result) => {

            if (err) return res.json({ success: false, msg: "User not Adedd...", err })

            req.flash('success_msg', 'کاربر بـــا موفقیت ایجاد شد')
            res.redirect('/api/allArticle/1')

        })


    })

});

router.put('/addAdmin', (req, res) => {
    User.findOne({ role: 'admin' }, (err, existAdmin) => {
        if (err) return res.json({ success: false, msg: 'error' });
        if (existAdmin) return res.status(404).send('NOT FOUND');

        new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
            gender: req.body.gender,
            role: 'admin',
            phone: req.body.phone
        }).save((err, user) => {
            if (err) return res.json({ success: false, msg: 'error' });
            return res.json({ success: true, user })
        })
    })
})

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------Router Access Controler-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

router.get('/allArticle/:page', (req, res, next) => {

    let page = 5 * (--req.params.page)

    Article.find({}, async (err, article) => {

        for (let i = 0; i < article.length; i++) {

            article[i].text = article[i].text.slice(0, 250) + " ...";

            let dt = new Date(article[i].dateCreate);

            article[i].dateAt = jalaliDate.gregorian_to_jalali(dt.getFullYear(), dt.getMonth(), dt.getDay());

            await User.findOne({ userName: article[i].userName }, { firstName: 1, lastName: 1 }, (err, user) => {

                if (err) res.json({ success: false, err })
                article[i].firstName = user.firstName;
                article[i].lastName = user.lastName;
                article[i].idWriter = user._id;

            })
        }
        res.render('index', {
            article,
            title: 'مقالستان'
        }
        )
    })
        .sort({ dateCreate: -1 })
        .limit(5)
        .skip(page);
});



/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------Router Access Controler-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

router.use('/admin', isLogin, routeController('admin'), admin);
router.use('/user', isLogin, routeController('user'), user);
router.use('/general', isLogin, general);


module.exports = router;
