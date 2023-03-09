const express = require('express');
const router = express.Router();

const myAccountController = require('../controller/my-account');

router.get('/', myAccountController.getHomepage);

module.exports = router;