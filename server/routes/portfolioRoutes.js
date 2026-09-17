/**
 * Main routes for the portfolio API.
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
 * Rate limiter for contact form.
 */
const contactLimiter = rateLimit({
  // Set the time window to 1 Hour (in milliseconds)
  windowMs: 60 * 60 * 1000,
  // Limit each IP to exactly 5 requests per hour window
  max: 5,
  // Custom error message sent when the limit is exceeded
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

// Core profile routes
router.get('/profile', portfolioController.getProfile);

// Data fragment routes
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

// Contact routes
router.post('/contact', contactLimiter, contactController.submitContactForm);
// [GET /contact] - Fetch transmission logs
router.get('/contact', contactController.getContacts);

// [GET /fragments/:type] - Public route to fetch specific data modules
router.get('/fragments/:type', portfolioController.getFragment);

// Export the router so it can be mounted in the main server file
module.exports = router;
