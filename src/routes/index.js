const express = require('express');
const router = express.Router();

const signupRoute = require('./signup.route');
const signinRoute = require('./signin.route');
const profileRoute = require('./profile.route');

router.use('/signup', signupRoute);
router.use('/signin', signinRoute);
router.use('/profile', profileRoute);

module.exports = router;
