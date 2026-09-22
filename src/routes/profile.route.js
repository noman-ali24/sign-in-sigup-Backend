const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { protect } = require('../middlewares/auth.middleware');

// GET /profile protected by JWT
router.get('/', protect, profileController);

module.exports = router;
