/**
 * Language: JavaScript (Node.js/Mongoose)
 * Purpose of this file:
 * This file defines the database schema and model for the "Contact" messages.
 * It enforces the structure for messages sent through the portfolio's contact form,
 * ensuring they have a name, email, message, and trackable read/unread status.
 */

// Import the mongoose library to define the schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the structure (Schema) for a Contact message document
const contactSchema = new mongoose.Schema({
    // The sender's name
    name: {
        // Must be a text string
        type: String,
        // This field is mandatory
        required: true
    },
    // The sender's email address
    email: {
        // Must be a text string
        type: String,
        // This field is mandatory
        required: true
    },
    // The subject line of the message
    subject: {
        // Must be a text string
        type: String,
        // If not provided, default to 'No Subject'
        default: 'No Subject'
    },
    // The actual content of the message
    message: {
        // Must be a text string
        type: String,
        // This field is mandatory
        required: true
    },
    // The current status of the message in the admin dashboard
    status: {
        // Must be a text string
        type: String,
        // Value must be exactly one of these three options
        enum: ['unread', 'read', 'archived'],
        // When a new message arrives, it is 'unread' by default
        default: 'unread'
    },
    // Timestamp for when the message was received
    createdAt: {
        // Must be a Date object
        type: Date,
        // Automatically set to the current date and time
        default: Date.now
    }
});

// Compile and export the contact schema as a usable Mongoose model named 'Contact'
module.exports = mongoose.model('Contact', contactSchema);
