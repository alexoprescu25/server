const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');

//register

router.get('/signup', authController.getSignUpPage);

router.post('/signup', authController.postUser);

//login

router.get('/signin', authController.getSignInPage);

module.exports = router;