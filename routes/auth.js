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

// reset password

router.get('/reset', authController.getResetPwdPage);

router.post('/send-pwd-email', authController.sendResetPasswordEmail);

router.get('/new-password/:token', authController.getNewPasswordPage);

router.post('/post-new-password', authController.postNewPassword);

module.exports = router;