const LocalStrategy = require('passport-local').Strategy;

// Load User model
const User = require('../models/user');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'userName' }, (userName, password, done) => {
            // Match user
            User.findOne({ userName })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'نام کاربری یا رمز عبور اشتباه است.' });
                    }

                    // Match password
                    if (password === user.password) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'نام کاربری یا رمز عبور اشتباه است.' });
                    }
                });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};