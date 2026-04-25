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

// Specific Atomic Data Routes
router.get('/profile/basicdetails', portfolioController.getBasicDetails);
router.get('/profile/skills', portfolioController.getSkills);
router.get('/profile/experience', portfolioController.getExperience);
router.get('/profile/projects', portfolioController.getProjects);
router.get('/profile/education', portfolioController.getEducation);
router.get('/profile/socials', portfolioController.getSocials);
router.get('/profile/additional', portfolioController.getAdditional);
router.get('/header', portfolioController.getHeader);
router.get('/analytics', portfolioController.getAnalytics);
router.get('/docs', portfolioController.getDocs);
router.get('/common/layout', portfolioController.getCommonLayout);

// [GET /visitors] - Public route to fetch and increment visitor counts
router.get('/visitors', portfolioController.getVisitors);

// [POST /contact] - Public route with SPAM LIMITER to send a message
router.post('/contact', contactLimiter, contactController.submitContactForm);

// [GET /fragments/:type] - Public route to fetch specific data modules
router.get('/fragments/:type', portfolioController.getFragment);

// Export the router so it can be mounted in the main server file
module.exports = router;
