const express = require('express');
const router = express.Router();
const signinController = require('../controllers/signin.controller');
const validate = require('../middlewares/validate.middleware');
const validateSignin = require('../validators/signin.validator');

// POST /signin with input validation
router.post('/', validate(validateSignin), signinController);

module.exports = router;
