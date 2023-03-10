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
    let imageUrl;
    
    if (image) {
         imageUrl = image.path;
    } 

    try {
        const userDoc = await User.findOne({ email: req.body.email });

        if (!userDoc) {
            bcrypt.hash(req.body.password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: req.body.email,
                        password: hashedPassword,
                        profilePicture: imageUrl,
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

exports.postSignIn =  async (req, res, next) => {
    const userDoc = await User.findOne({ email: req.body.email });
    if (userDoc) {
        const password = req.body.password;
        bcrypt.compare(password, userDoc.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = userDoc;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/my-account');
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.redirect('/signin')
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/signin');
    });
}