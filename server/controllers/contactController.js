/**
 * Language: JavaScript (Node.js)
 * Purpose of this file:
 * This file is a backend controller for managing "contacts" (contact form submissions).
 * It handles the logic for receiving new contact messages from the frontend, saving them
 * to the MongoDB database, saving a local backup copy to a JSON file (portable mode),
 * sending out email notifications via the email service, and providing APIs to retrieve or delete messages.
 */

// Import the Node.js built-in 'fs' (file system) module to read and write files locally
const fs = require('fs');
// Import the Node.js built-in 'path' module to work with file and directory paths safely
const path = require('path');
// Import the Contact model which defines the MongoDB schema for a contact message
const Contact = require('../models/Contact');
// Import the sendContactAlert function from the emailService to send email notifications
const { sendContactAlert } = require('../services/emailService');
// Import an async wrapper middleware to handle errors automatically without try-catch blocks everywhere
const asyncHandler = require('../middleware/asyncHandler');
// Import mongoose to interact with the MongoDB database and check connection status
const mongoose = require('mongoose');

// Define the file path where local backups of contacts will be stored (contacts.json)
const contactsFile = path.join(__dirname, '../contacts.json');

/**
 * [saveLocalContact]
 * Function purpose: Saves a copy of the contact submission to a local JSON file
 * This ensures no data is lost even if the MongoDB connection drops.
 */
// Define a helper function to save a contact to the local JSON file
const saveLocalContact = (contact) => {
  // Start a try block to gracefully catch any errors while reading or writing the file
  try {
    // Initialize an empty array to hold our contacts
    let contacts = [];
    // Check if the contacts.json file already exists on the disk
    if (fs.existsSync(contactsFile)) {
      // Read the contents of the existing JSON file
      const content = fs.readFileSync(contactsFile, 'utf-8');
      // Parse the JSON string back into a JavaScript array (or empty array if empty)
      contacts = JSON.parse(content || '[]');
    }

    // Create a new entry object making sure it has a unique ID and proper date format
    const localEntry = {
      // Copy all existing properties from the incoming contact object
      ...contact,
      // Use the existing ID or generate a fallback unique local ID using timestamp and random string
      _id: contact._id || `LOCAL_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      // Ensure the creation date is stored as a standard ISO string
      createdAt:
        contact.createdAt instanceof Date ? contact.createdAt.toISOString() : contact.createdAt,
    };

    // Add the new contact entry to the VERY BEGINNING of the array (most recent first)
    contacts.unshift(localEntry);
    // Write the updated array back to the JSON file, keeping only the 100 most recent entries to prevent massive files
    fs.writeFileSync(contactsFile, JSON.stringify(contacts.slice(0, 100), null, 2));
    // Catch any errors during the file operations
  } catch (e) {
    // Log the error to the console if local backup fails
    console.error('LOCAL_CONTACT_SYNC_ERROR:', e.message);
  }
};

/**
 * Utility: Input Cleansing Protocol (XSS Protection)
 * Function purpose: Strips all HTML tags and potentially malicious scripts from
 * incoming user strings to prevent cross-site scripting (XSS) attacks.
 */
const cleanse = (str = '') => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .trim();
};

/**
 * [submitContactForm]
 * @desc    Submit contact form, save to DB and send email
 * @route   POST /api/contact
 * @access  Public
 */
// Export the submitContactForm controller wrapped in the asyncHandler
exports.submitContactForm = asyncHandler(async (req, res, next) => {
  // Extract and CLEANSE the necessary fields from the request body
  const name = cleanse(req.body.name);
  const email = cleanse(req.body.email);
  const profession = cleanse(req.body.profession || 'Independent Professional');
  const subject = cleanse(req.body.subject || 'No Subject');
  const message = cleanse(req.body.message);

  // Validate that the required fields are provided
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Incomplete dispatch payload.' });
  }

  // Package the cleansed data
  const contactData = { name, email, profession, subject, message, createdAt: new Date() };

  // Step 1. Persist to MongoDB if connected
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      await Contact.create(contactData);
    } catch (e) {
      console.error('DB_SAVE_FAIL:', e.message);
    }
  }

  // Step 2. Persist to Local JSON backup
  saveLocalContact(contactData);

  // Step 3. Dispatch Email Alert
  try {
    await sendContactAlert(contactData);
  } catch (error) {
    console.error('MAIL_DISPATCH_ERROR:', error);
  }

  // Respond back to the frontend
  res.status(200).json({
    success: true,
    message: 'Your correspondence has been securely logged and dispatched.',
  });
});
