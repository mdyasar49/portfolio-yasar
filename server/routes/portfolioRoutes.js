const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// [GET /api/profile]
router.get('/profile', portfolioController.getProfile);
router.put('/profile', protect, portfolioController.updateProfile);

// [POST /api/contact] - Contact Dispatch Protocol
router.post('/contact', contactController.submitContactForm);

// [GET /api/contact] - Retrieve Correspondence (Protected)
router.get('/contact', protect, contactController.getContacts);

// [DELETE /api/contact/:id] - Purge Correspondence (Protected)
router.delete('/contact/:id', protect, contactController.deleteContact);

// [GET /api/visitors]
router.get('/visitors', portfolioController.getVisitors);

// [GET /api/health] - System Diagnostics
router.get('/health', protect, portfolioController.getSystemHealth);

// [PUT /api/health/maintenance] - Maintenance Toggle
router.put('/health/maintenance', protect, portfolioController.toggleMaintenance);




module.exports = router;

