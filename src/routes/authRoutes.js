const express = require('express');
const router = express.Router();
const { signup, signin, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', protect, getProfile);

module.exports = router;
