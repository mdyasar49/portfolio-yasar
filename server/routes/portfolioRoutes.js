/**
 * Language: JavaScript (Node.js/Express)
 * Purpose of this file:
 * This is the main routing file for the portfolio application.
 * It combines routes for profile data, system health, visitor tracking, 
 * proposals, and contact forms into a single unified API router.
 */

// Import the Express framework
const express = require('express');
// Create a new router object to handle all API routing
const router = express.Router();

// Import the controllers that contain the actual business logic for each feature
const portfolioController = require('../controllers/portfolioController');
const contactController = require('../controllers/contactController');
const proposalController = require('../controllers/proposalController');
const codeController = require('../controllers/codeController');


// Import the 'protect' security middleware for locking down admin routes
const { protect } = require('../middleware/authMiddleware');

// Import express-rate-limit to prevent spam attacks
const rateLimit = require('express-rate-limit');

/**
 * Specialized Spam Protection for Contact Dispatch
 * Creates a middleware that blocks users from sending too many messages.
 */
const contactLimiter = rateLimit({
    // Set the time window to 1 Hour (in milliseconds)
    windowMs: 60 * 60 * 1000, 
    // Limit each IP to exactly 5 requests per hour window
    max: 5, 
    // Custom error message sent when the limit is exceeded
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
// [GET /profile] - Public route to fetch the portfolio data
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
// [PUT /profile] - Protected route to update the portfolio data
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
// [POST /proposals/submit] - Public route to submit a new proposal
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
// [GET /visitors] - Public route to fetch and increment visitor counts
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
// [GET /health] - Protected route to view server RAM and database latency
router.get('/health', protect, portfolioController.getSystemHealth);

// ==========================================
// REST OF THE ROUTES (Admin & Utility Endpoints)
// ==========================================

// [GET /proposals] - Protected route to view all pending/approved proposals
router.get('/proposals', protect, proposalController.getProposals);
// [GET /proposals/:id] - Public/Protected route to view a single proposal
router.get('/proposals/:id', proposalController.getProposal);
// [PUT /proposals/approve/:id] - Protected route to approve a proposal
router.put('/proposals/approve/:id', protect, proposalController.approveProposal);
// [PUT /proposals/reject/:id] - Protected route to reject a proposal
router.put('/proposals/reject/:id', protect, proposalController.rejectProposal);

// [POST /contact] - Public route with SPAM LIMITER to send a message
router.post('/contact', contactLimiter, contactController.submitContactForm);
// [GET /contact] - Protected route for admin to view all messages
router.get('/contact', protect, contactController.getContacts);
// [DELETE /contact/:id] - Protected route for admin to delete a message
router.delete('/contact/:id', protect, contactController.deleteContact);

// [PUT /health/maintenance] - Protected route to lock the site
router.put('/health/maintenance', protect, portfolioController.toggleMaintenance);

// [GET /code] - Public route to fetch module source code for "Code Live" mode
router.get('/code', codeController.getModuleCode);


// Export the router so it can be mounted in the main server file
module.exports = router;
