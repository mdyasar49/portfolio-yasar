const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// [GET /api/profile]
router.get('/profile', portfolioController.getProfile);

// [GET /api/visitors]
router.get('/visitors', portfolioController.getVisitors);

// [GET /api/health] - System Monitoring
router.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.status(200).json({
        success: true,
        status: 'Operational',
        ...(isProduction ? {} : {
            database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        })
    });
});

module.exports = router;
