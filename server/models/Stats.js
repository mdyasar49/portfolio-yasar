/**
 * Language: JavaScript (Node.js/Mongoose)
 * Purpose of this file:
 * This file defines the database schema and model for "Stats" (system statistics).
 * It tracks the total number of visitors, keeps a daily history log of visits,
 * and stores the current global "maintenance mode" toggle state for the website.
 */

// Import the mongoose library to define the schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the structure (Schema) for the website's statistics document
const statsSchema = new mongoose.Schema({
  // The total, all-time number of visitors
  visitors: {
    // Must be a Number
    type: Number,
    // Starts at 0
    default: 0,
  },
  // An array storing the daily history of visits
  history: [
    {
      // The specific date in YYYY-MM-DD format (mandatory)
      date: { type: String, required: true },
      // The number of visits on that specific date (defaults to 0)
      count: { type: Number, default: 0 },
    },
  ],
  // Timestamp for the last time these stats were modified
  lastUpdated: {
    // Must be a Date object
    type: Date,
    // Automatically set to the current time initially
    default: Date.now,
  },
  // A global flag indicating whether the site is currently locked in maintenance mode
  maintenanceMode: {
    // Must be a True/False boolean
    type: Boolean,
    // Site is NOT in maintenance mode by default
    default: false,
  },
});

// Compile and export the stats schema as a usable Mongoose model named 'Stats'
module.exports = mongoose.model('Stats', statsSchema);
