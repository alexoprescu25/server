const User = require('../model/User');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

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
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email: email });
    
    if (userDoc) {
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

exports.getResetPwdPage = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        pageId: 'auth'
    })
}

exports.getNewPasswordPage = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'New Password',
        pageId: 'auth'
    })
}

exports.sendResetPasswordEmail = (req, res, next) => {
    const { email } = req.body;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }

        const token = buffer.toString('hex');
        
        User.findOne({ email: email })
            .then((user) => {
                if (!user) {
                    res.redirect('/reset')
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;

                user.save()
                    .then(() => {
                        const emailContent = {
                            to: email,
                            from: 'alexandru.oprescu@outlook.com',
                            subject: `Reset Password!`,
                            html: `
                                <p>Hello, </p>
                                <p>
                                    To reset your password, please click the following link:
                                </p>
                                <a href="http://localhost:8000/new-password/${token}">Reset Password</a>
                            `
                        }

                        return sgMail.send(emailContent);
                    })
                    .then(() => {
                        res.redirect('/signin');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log(err);
            })
    })
}

exports.getNewPasswordPage = (req, res, next) => {
    const { token } = req.params;

    User.findOne({ resetToken: token }) 
        .then(userDoc => {
            if (!userDoc) {
                res.redirect('/signin')
            }

            res.render('auth/new-password', {
                pageTitle: 'New Password', 
                pageId: 'auth',
                userId: userDoc._id
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postNewPassword = async (req, res, next) => {
    const { userId, password: newPassword } = req.body;

    try {
        const user = await User.findOne({ _id: userId });
        const hashedPassword = await bcrypt.hash(newPassword, 12);
    
        user.password = hashedPassword;
    
        await user.save();
        
        res.redirect('/signin');
    } catch(err) {
        console.log(err);
    }
}