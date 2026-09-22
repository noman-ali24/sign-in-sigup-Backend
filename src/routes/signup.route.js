const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signup.controller');
const validate = require('../middlewares/validate.middleware');
const validateSignup = require('../validators/signup.validator');

// POST /signup with input validation
router.post('/', validate(validateSignup), signupController);

module.exports = router;
