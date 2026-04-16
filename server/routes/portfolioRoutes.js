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
    max: 5, 
    message: { success: false, message: 'Spam protection active. Please try again later.' }
});

/**
 * @swagger
 * tags:
 *   name: Portfolio
 *   description: Professional profile data and system information
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Retrieve professional profile
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Professional profile data retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/profile', portfolioController.getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update professional profile (Protected)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', protect, portfolioController.updateProfile);

/**
 * @swagger
 * tags:
 *   name: Proposals
 *   description: Integrated proposal management system
 */

/**
 * @swagger
 * /api/proposals/submit:
 *   post:
 *     summary: Submit a new dynamic proposal
 *     tags: [Proposals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Proposal submitted
 */
router.post('/proposals/submit', proposalController.submitProposal);

/**
 * @swagger
 * /api/visitors:
 *   get:
 *     summary: Get visitor statistics
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Visitor count statistics
 */
router.get('/visitors', portfolioController.getVisitors);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: System diagnostics (Protected)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Health report generated
 */
router.get('/health', protect, portfolioController.getSystemHealth);

// REST OF THE ROUTES (Kept for functionality)
router.get('/proposals', protect, proposalController.getProposals);
router.get('/proposals/:id', proposalController.getProposal);
router.put('/proposals/approve/:id', protect, proposalController.approveProposal);
router.put('/proposals/reject/:id', protect, proposalController.rejectProposal);
router.post('/contact', contactLimiter, contactController.submitContactForm);
router.get('/contact', protect, contactController.getContacts);
router.delete('/contact/:id', protect, contactController.deleteContact);
router.put('/health/maintenance', protect, portfolioController.toggleMaintenance);

module.exports = router;
