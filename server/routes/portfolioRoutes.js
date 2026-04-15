const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const contactController = require('../controllers/contactController');
const proposalController = require('../controllers/proposalController');
const { protect } = require('../middleware/authMiddleware');

const rateLimit = require('express-rate-limit');

// Specialized Spam Protection for Contact Dispatch
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hour
    max: 5, // Limit each IP to 5 contact submissions per hour
    message: { success: false, message: 'Spam protection active. Please try again later.' }
});

// [GET /api/profile]
router.get('/profile', portfolioController.getProfile);
router.put('/profile', protect, portfolioController.updateProfile);

// [PROPOSALS_PROTOCOL]
router.post('/proposals/submit', proposalController.submitProposal);
router.get('/proposals/:id', proposalController.getProposal);
router.put('/proposals/approve/:id', protect, proposalController.approveProposal);
router.put('/proposals/reject/:id', protect, proposalController.rejectProposal);



// [POST /api/contact] - Contact Dispatch Protocol (Rate Limited)
router.post('/contact', contactLimiter, contactController.submitContactForm);

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

