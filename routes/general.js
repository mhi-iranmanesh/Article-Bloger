const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');
const upload = require('../config/upload');

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------PROFILE-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

//////////////////////////////////////////////////////// PROFILE RENDER ////////////////////////////////////////////////////////

router.get('/profile', (req, res, next) => {

    res.render('profile', {
        title: `پروفایل ${req.user.firstName} ${req.user.lastName}`,
        user: req.user,
        layout: false
    })

});


////////////////////////////////////////////////////////GET INFO////////////////////////////////////////////////////////

router.get('/getInfo', (req, res, next) => { res.json({ success: true, user: req.user }) });

////////////////////////////////////////////////////////EDIT PROFILE////////////////////////////////////////////////////////

router.post('/profileEdit', (req, res, next) => {

    const { lastName, firstName, gender, phone } = req.body;

    User.updateOne({ _id: req.user.id }, { $set: { firstName, lastName, phone, lastUpdate: Date.now(), gender } })
        .then((result) => res.json({ success: true, result }))
        .catch((err) => console.log(err))
});

////////////////////////////////////////////////////////EDIT PASSWORD////////////////////////////////////////////////////////

router.post('/passwordEdit', (req, res, next) => {

    const { oldPassword, newPassword } = req.body;
    if (req.user.password === oldPassword) {
        User.updateOne({ _id: req.user.id }, { $set: { lastUpdate: Date.now(), password: newPassword } })
            .then((result) => res.json({ success: true, result }))
            .catch((err) => console.log(err))
    } else {
        res.json({ success: false, msg: 'password Warning' });
    }
});

//////////////////////////////////////////////////////// UPLOAD AVATAR ////////////////////////////////////////////////////////

router.post('/avatarUploud', upload.single('file'), (req, res, next) => {

    res.redirect('./profile');

});


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
---------------------------------------- ARTICLE TASK -------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

////////////////////////////////////////////////////////ADD ARTICLE////////////////////////////////////////////////////////

router.put('/articleAdd', (req, res, next) => {

    const { title, text, picPath } = req.body;

    new Article({
        userName: req.user.userName,
        title,
        text,
        picPath
    }).save()
        .then((result) => res.json({ success: true, result }))
        .catch((err) => res.json({ success: false, err }))
});

////////////////////////////////////////////////////////REMOVE ARTICLE////////////////////////////////////////////////////////

router.delete('/articleDelete', async (req, res, next) => {

    const { _id } = req.body;

    let userName = await User.findOne({ _id: req.user.id }, { userName: 1 })
    let userNameArticle = await Article.findOne({ _id }, { userName: 1 })

    if (userName.userName === userNameArticle.userName) {

        Article.deleteOne({ _id })
            .then(res.json({ success: true, msg: 'Article deleted...' }))
            .catch((err) => res.json({ success: false, msg: 'Article Not deleted...', err }))

    } else {

        res.status(403).send('Access Denied...')

    }

});

////////////////////////////////////////////////////////EDIT ARTICLE////////////////////////////////////////////////////////

router.put('/articleEdit', async (req, res, next) => {

    const { _id, title, text } = req.body;

    let userName = await User.findOne({ _id: req.user.id }, { userName: 1 })
    let userNameArticle = await Article.findOne({ _id }, { userName: 1 })

    if (userName.userName === userNameArticle.userName) {

        Article.updateOne({ _id }, { title, text })
            .then(res.json({ success: true, msg: 'Article Edited...' }))
            .catch((err) => res.json({ success: false, msg: 'Article Not Edit...', err }))

    } else {

        res.status(403).send('Access Denied...')

    }

});


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------GET ARTICLE-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

/////////////////////////////////////////////////////// MY ARTICLE ////////////////////////////////////////////////////////

router.get('/myArticle', (req, res, next) => {

    Article.find({ userName: req.user.userName })
        .then((article) => {

            article.forEach(element => {
                element.text = element.text.slice(0, 300);
            });

            res.json(article)

        })
        .catch((err) => res.json({ success: false, err }))

});

/////////////////////////////////////////////////////// ARTICLE ////////////////////////////////////////////////////////

router.get('/article/:id', (req, res, next) => {

    Article.findOne({ _id: req.param('id') })
        .then((exist) => {

            (exist) ?
                res.json({ success: true, exist }) :
                res.json({ success: false, msg: 'article not define...!' })

        })
        .catch((err) => res.json({ success: false, err }))

});

module.exports = router;