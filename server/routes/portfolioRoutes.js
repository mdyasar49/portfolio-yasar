const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// [GET /api/profile]
router.get('/profile', portfolioController.getProfile);

// [GET /api/visitors]
router.get('/visitors', portfolioController.getVisitors);

module.exports = router;
