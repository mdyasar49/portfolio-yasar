const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// [GET /api/profile]
router.get('/profile', portfolioController.getProfile);

module.exports = router;
