const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');

//register

router.get('/signup', authController.getSignUpPage);

router.post('/signup', authController.postUser);

//login

router.get('/signin', authController.getSignInPage);

router.post('/signin', authController.postSignIn);

//logout

router.post('/logout', authController.postLogout);

module.exports = router;