const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comments');

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------update Profile-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

router.post('/editAdmin', (req, res, next) => {

    const { lastName, firstName, gender, phone } = req.body;

    User.updateOne({ _id: req.user.id }, { $set: { firstName, lastName, phone, lastUpdate: Date.now(), gender } })
        .then((result) => res.json({ success: true, result }))
        .catch((err) => console.log(err))
});


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
---------------------------------------- ARTICLE TASK -------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

////////////////////////////////////////////////////////REMOVE ARTICLE////////////////////////////////////////////////////////

router.delete('/deleteArticleUser', (req, res, next) => {
    const { _id } = req.body;

    Article.findByIdAndDelete({ _id })
        .then((result) => {
            Comment.deleteMany({ articleId: _id })
                .then(() => {
                    // req.flash('success_msg', 'مقاله باموفقیت حذف شد.');
                    // res.redirect('/api/allArticle/1');
                    res.json({ success: true, msg: 'Article deleted...' })
                })
                .catch((err) => res.json({ success: false, msg: 'Comments Not deleted...', err }))
        })
        .catch((err) => res.json({ success: false, msg: 'Article Not deleted...', err }))


});

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
---------------------------------------- USERS -------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

router.get('/getAllUser', (req, res, next) => {
    User.find({ role: 'user' }, (err, users) => {
        if (err) return res.json({ success: false, msg: 'error', err });
        return res.send(users);
    });
});

////////////////////////////////////////////////////////updateUsers

router.post('/editProfile', (req, res, next) => {

    const { lastName, firstName, gender, phone } = req.body;

    User.updateOne({ userName: req.body.userName }, { $set: { firstName, lastName, phone, lastUpdate: Date.now(), gender } })
        .then((result) => res.json({ success: true, result }))
        .catch((err) => console.log(err))
});

/////////////////////////////////////////////////////////Recovery Password
router.post('/recoveryPass', (req, res, next) => {
    const { userName } = req.body;
    User.findOne({ userName }, { phone: 1 }, (err, userPhone) => {

        if (err) return res.json({ success: false, err })

        User.updateOne({ userName }, { $set: { password: userPhone.phone } })
            .then((result) => res.json({ success: true, result }))
            .catch((err) => res.json({ err }))

    });
});

/////////////////////////////////////////////////////////delteUser
router.delete('/deleteUser', (req, res, next) => {

    const { userName } = req.body;
    User.findOne({ userName }, async (err, result) => {

        if (err) return res.json({ success: false, err })

        const articleUser = await Article.find({ userName })
        const commentsUser = await Comment.find({ userId: result._id })


        if (articleUser) {
            await Article.deleteMany({ userName })
        }

        if (commentsUser) {
            await Comment.deleteMany({ userId: result._id })
        }

        User.findOneAndDelete({ userName }, (err, result) => {
            if(err) return res.json({ success: false, msg: "User Not Deleted...", err })

            res.json({ success: true, msg: "User Deleted...", result })
        })


    });

});


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
---------------------------------------- comment -------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

router.get('/deleteComment:id', (req, res, next) => {

    Comment.findByIdAndDelete({ _id: req.params.id })
        .then((comment) => {
            req.flash('success_msg', `نظر با موفقیت حذف شد.`)
            res.redirect('back')
        })
        .catch((err) => {
            req.flash('success_msg', `حذف نظر با نا موفق بود.`)
            res.redirect('./')
        });

});



module.exports = router;