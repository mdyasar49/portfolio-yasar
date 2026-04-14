const express = require('express');
const router = express.Router();
const { login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// [POST /api/auth/login]
router.post('/login', login);

// [GET /api/auth/me]
router.get('/me', protect, getMe);

// [PUT /api/auth/change-password]
router.put('/change-password', protect, changePassword);


module.exports = router;
