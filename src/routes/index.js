const express = require('express');
const router = express.Router();

const signupRoute = require('./signup.route');
const signinRoute = require('./signin.route');
const profileRoute = require('./profile.route');
const logoutRoute = require('./logout.route');

router.use('/signup', signupRoute);
router.use('/signin', signinRoute);
router.use('/profile', profileRoute);
router.use('/logout', logoutRoute);

module.exports = router;
