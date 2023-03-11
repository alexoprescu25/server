const User = require('../model/User');

exports.getHomepage = (req, res, next) => {
    res.render('my-account/index', {
        pageTitle: 'My Account',
        layout: 'layout/my-account-layout',
        path: '/home'
    })
}

exports.getMyAccountPage = (req, res, next) => {
    User.findById({ _id: req.session.user._id })
        .then(userDoc => {
            res.render('my-account/account', {
                pageTitle: 'Account',
                pageId: 'my-account',
                user: userDoc,
                layout: 'layout/my-account-layout',
                path: '/my-account'
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getUserPage = (req, res, next) => {
    User.find({ })
        .then(users => {
            res.render('my-account/users', {
                pageTitle: 'Users',
                pageId: 'my-account',
                users: users,
                layout: 'layout/my-account-layout',
                path: '/users'
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postEditUser = async (req, res, next) => {
    const { firstName, lastName, email, userId } = req.body;

    const user = await User.findOne({ _id: userId });

    if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.fullName = firstName + ' ' + lastName;

        user.save()
            .then(() => {
                res.redirect('/my-account/account');
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.redirect('/my-account');
    }
}