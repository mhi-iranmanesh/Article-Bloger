const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------UPDATE PROFILE-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

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

    }else{

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

    }else{

        res.status(403).send('Access Denied...')

    }

});


module.exports = router;