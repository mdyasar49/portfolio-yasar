/**
 * Language: JavaScript (Node.js/Express)
 * Purpose of this file:
 * This file defines the specific API routes for the "Proposal" feature.
 * It maps endpoints for submitting, viewing, and approving architectural proposals.
 */

// Import the Express framework
const express = require('express');
// Create a new router object to handle proposal routing
const router = express.Router();
// Import the entire proposal controller to access its functions
const proposalController = require('../controllers/proposalController');
// Import the 'protect' middleware to secure admin-only routes
const { protect } = require('../middleware/authMiddleware');

/**
 * [POST /api/proposals/submit]
 * Public route for visitors to submit a new proposal.
 */
// Route: POST /submit -> trigger submitProposal logic
router.post('/submit', proposalController.submitProposal);

/**
 * [GET /api/proposals/:id]
 * Public route to view the details of a specific proposal by its ID.
 */
// Route: GET /:id -> trigger getProposal logic
router.get('/:id', proposalController.getProposal);

/**
 * [PUT /api/proposals/approve/:id]
 * Protected route for the admin to approve a specific proposal.
 */
// Route: PUT /approve/:id -> first run 'protect', then run approveProposal logic
router.put('/approve/:id', protect, proposalController.approveProposal);

// Export the router so it can be mounted in the main server file
module.exports = router;
