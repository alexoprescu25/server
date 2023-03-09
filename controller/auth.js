const User = require('../model/User');

const bcrypt = require('bcryptjs');

exports.getSignUpPage = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
        pageId: 'auth'
    })
}

exports.postUser = async (req, res, next) => {
    const image = req.file;

    console.log(image);

    try {
        const userDoc = await User.findOne({ email: req.body.email });

        if (!userDoc) {
            bcrypt.hash(req.body.password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: req.body.email,
                        password: hashedPassword,
                        role: 'user'
                    })

                    return user.save();
                })
                .then(result => {
                    res.redirect('/signin');
                })
                .catch(err => {
                    console.log(err);
                })
        }
    } catch(e) {
        console.log(e);
    }
}

exports.getSignInPage = (req, res, next) => {
    res.render('auth/signin', {
        pageTitle: 'Sign In',
        pageId: 'auth'
    })
}