exports.getHomepage = (req, res, next) => {
    res.render('my-account/index', {
        pageTitle: 'My Account',
        layout: 'layout/my-account-layout',
        path: '/home'
    })
}