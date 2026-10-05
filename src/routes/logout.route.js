const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logout.controller');
const { protect } = require('../middlewares/auth.middleware');

// POST /api/auth/logout protected by JWT
router.post('/', protect, logoutController);

module.exports = router;
