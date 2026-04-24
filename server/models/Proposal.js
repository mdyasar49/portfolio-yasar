/**
 * Language: JavaScript (Node.js/Mongoose)
 * Purpose of this file:
 * This file defines the database schema and model for "Proposals" (suggested architectural changes).
 * It enforces rules for what a proposal looks like, its approval status, and automatically deletes
 * old unapproved proposals from the database after 7 days using an expiration index.
 */

// Import the mongoose library to define the schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the structure (Schema) for an architectural proposal document
const ProposalSchema = new mongoose.Schema({
    // The actual JSON object containing the suggested changes to the portfolio
    suggestedData: {
        // Data type is a flexible Object
        type: Object,
        // The data is mandatory
        required: true
    },
    // The current approval status of the proposal
    status: {
        // Data type must be a String
        type: String,
        // Value must be exactly one of these three options
        enum: ['pending', 'approved', 'rejected'],
        // When a new proposal arrives, it is 'pending' by default
        default: 'pending'
    },
    // The IP address of the user who submitted the proposal
    clientIp: String,
    // Timestamp for when the proposal was created
    createdAt: {
        // Data type must be a Date
        type: Date,
        // Automatically set to the current date and time
        default: Date.now,
        // MongoDB TTL Index: Automatically delete this document after 604800 seconds (7 days)
        expires: 604800 
    }
});

// Compile and export the proposal schema as a usable Mongoose model named 'Proposal'
module.exports = mongoose.model('Proposal', ProposalSchema);
