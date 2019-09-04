const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');
const upload = require('../config/upload');
const articleImgUpload = require('../config/articleImgUpload');
const CommentArt = require('../models/comments');
const jalaliDate = require('../tools/jalaliDate');

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

router.post('/articleAdd', articleImgUpload.single('filePath'), async (req, res, next) => {

    const { title, text, picPath } = req.body;

    console.log(req.body);


    new Article({
        userName: req.user.userName,
        title,
        text,
        picPath: picPath + ".jpg"
    }).save()
        .then((result) => {
            req.flash('success_msg', 'مقاله شما با موفقیت ایجاد شد.')
            res.redirect('./myArticle');
        })
        .catch((err) => {
            req.flash('error_msg', 'مقاله ذخیره نشد!')
            res.redirect('./myArticle');

        })
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

router.post('/articleEdit', async (req, res, next) => {

    console.log("sdfsdfsdfsdfsdfd", req.body);

    const { _id, title, text } = req.body;

    let userName = await User.findOne({ _id: req.user.id }, { userName: 1 })
    let userNameArticle = await Article.findOne({ _id }, { userName: 1 })

    if (userName.userName === userNameArticle.userName) {

        Article.updateOne({ _id }, { title, text })
            .then(res.redirect(`./article/${_id}`))
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
        .sort({ dateCreate: -1 })
        .then(async (article) => {

            article.forEach(element => {
                element.text = element.text.slice(0, 300);
            });

            for (let i = 0; i < article.length; i++) {

                article[i].text = article[i].text.slice(0, 250) + " ...";
                await User.findOne({ userName: article[i].userName }, { firstName: 1, lastName: 1 }, (err, user) => {


                    if (err) res.json({ success: false, err })
                    article[i].firstName = user.firstName;
                    article[i].lastName = user.lastName;

                })
            }

            res.render('index', {
                article,
                title: ` لیست مقالات ${req.user.firstName} ${req.user.lastName} `
            })

        })
        .catch((err) => res.json({ success: false, err }))

});

/////////////////////////////////////////////////////// ARTICLE ////////////////////////////////////////////////////////

router.get('/article/:id', (req, res, next) => {

    Article.findOne({ _id: req.params.id })
        .then((article) => {

            User.findOne({ userName: article.userName }, { firstName: 1, lastName: 1 }, (err, user) => {

                if (err) return res.json({ success: false, err })

                article.firstName = user.firstName;
                article.lastName = user.lastName;
                article.idWriter = user._id;

                let dt = new Date(article.dateCreate);

                article.dateAt = jalaliDate.gregorian_to_jalali(dt.getFullYear(), dt.getMonth(), dt.getDay());

                let Writer = {};

                Writer.isWriter = (article.userName == req.user.userName) ? true : false;

                Writer.info = req.user;

                CommentArt.find({ articleId: req.params.id }, async (err, comments) => {

                    for (let i = 0; i < comments.length; i++) {

                        let user = await User.findOne({ _id: comments[i].userId });
                        comments[i].fullName = user.firstName + " " + user.lastName;
                    }
                    return (err) ? res.json({ success: false, err }) :
                        (article) ?
                            res.render('article', {

                                success: true, article, title: article.title, layout: false, Writer, comments

                            }) :
                            res.json({ success: false, msg: 'article not define...!' })

                }).sort({ dateCreate: -1 });


            })
        })
        .catch((err) => res.json({ success: false, err }))

});


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
----------------------------------------GET ARTICLE-------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

router.post('/addComment', (req, res, next) => {

    const { text, articleId } = req.body;

    new CommentArt({
        text,
        userId: req.user._id,
        articleId
    }).save()
        .then((result) => {
            res.redirect("./article/" + articleId)
        })
        .catch((err) => {
            res.json({ success: false, err })
        });
});

/////////////////////////////////////////////////////// GET COMMENT ////////////////////////////////////////////////////////

router.get('/getComments', (req, res, next) => {

    const { articleId } = req.body;

    CommentArt.find({ articleId }, (req, res, next) => {

        res.json({})

    });

});


module.exports = router;