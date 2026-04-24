/**
 * Language: JavaScript (Node.js/Express)
 * Purpose of this file:
 * This file defines the API routes (endpoints) related to Authentication.
 * It maps specific URL paths (like /login or /me) to their corresponding 
 * logic in the authController, and applies security middleware where necessary.
 */

// Import the Express framework
const express = require('express');
// Create a new router object to handle routing independently
const router = express.Router();
// Import specific controller functions that contain the actual business logic
const { login, getMe, changePassword } = require('../controllers/authController');
// Import the 'protect' middleware to secure routes that require a logged-in user
const { protect } = require('../middleware/authMiddleware');

/**
 * [POST /api/auth/login]
 * Public route to authenticate an admin and receive a JWT token.
 */
// When a POST request is made to '/login', execute the 'login' function
router.post('/login', login);

/**
 * [GET /api/auth/me]
 * Protected route to get the currently logged-in user's profile data.
 */
// When a GET request is made to '/me', first run 'protect', then run 'getMe'
router.get('/me', protect, getMe);

/**
 * [PUT /api/auth/change-password]
 * Protected route to allow the admin to change their password.
 */
// When a PUT request is made to '/change-password', first run 'protect', then run 'changePassword'
router.put('/change-password', protect, changePassword);

// Export the router so it can be mounted in the main server file (server.js)
module.exports = router;
