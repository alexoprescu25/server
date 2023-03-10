const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const isAdministrator = require('../middleware/is-admin');

const myAccountController = require('../controller/my-account');

router.get('/', isAuth, myAccountController.getHomepage);

router.get('/account', isAuth, myAccountController.getMyAccountPage);

router.get('/users', isAuth, myAccountController.getUserPage);

module.exports = router;