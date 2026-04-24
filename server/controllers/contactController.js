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
            createdAt: contact.createdAt instanceof Date ? contact.createdAt.toISOString() : contact.createdAt
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
 * [submitContactForm]
 * @desc    Submit contact form, save to DB and send email
 * @route   POST /api/contact
 * @access  Public
 */
// Export the submitContactForm controller wrapped in the asyncHandler
exports.submitContactForm = asyncHandler(async (req, res, next) => {
    // Destructure the necessary fields from the incoming HTTP request body
    const { name, email, subject, message } = req.body;

    // Validate that the required fields (name, email, message) are provided
    if (!name || !email || !message) {
        // If required fields are missing, return a 400 Bad Request error response
        return res.status(400).json({ success: false, error: 'Incomplete dispatch payload.' });
    }

    // Package the validated fields into a new contactData object, applying a default subject if missing, and stamping the current time
    const contactData = { name, email, subject: subject || 'No Subject', message, createdAt: new Date() };

    // Step 1. Persist to MongoDB if the database is currently connected
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        // Try saving to the database
        try {
            // Create a new Contact record in the MongoDB database
            await Contact.create(contactData);
        // Catch any database creation errors
        } catch (e) {
            // Log the error to the console if database save fails
            console.error('DB_SAVE_FAIL:', e.message);
        }
    }

    // Step 2. Persist to Local JSON using our helper function as a backup
    saveLocalContact(contactData);

    // Step 3. Dispatch an Email Notification to the administrator
    try {
        // Wait for the email service to send the alert
        await sendContactAlert(contactData);
    // Catch any errors that occur while sending the email
    } catch (error) {
        // Log the email failure to the console
        console.error('MAIL_DISPATCH_ERROR:', error);
    }

    // Respond back to the frontend with a 200 OK success status and a confirmation message
    res.status(200).json({
        success: true,
        message: 'Your correspondence has been securely logged and dispatched.'
    });
});

/**
 * [getContacts]
 * @desc    Get all contact messages from DB and local backup
 * @route   GET /api/contact
 * @access  Private
 */
// Export the getContacts controller wrapped in the asyncHandler
exports.getContacts = asyncHandler(async (req, res, next) => {
    // Initialize an array to hold contacts fetched from the database
    let dbContacts = [];
    // Initialize an array to hold contacts fetched from the local JSON file
    let localContacts = [];

    // Step 1. Fetch all records from MongoDB if the connection is active
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        // Find all contacts and convert them to plain JavaScript objects (.lean() is faster)
        dbContacts = await Contact.find().lean();
    }

    // Step 2. Fetch records from the local JSON Buffer
    if (fs.existsSync(contactsFile)) {
        // Try reading and parsing the file
        try {
            // Read the contacts JSON file and parse it into the localContacts array
            localContacts = JSON.parse(fs.readFileSync(contactsFile, 'utf-8'));
        // Silently ignore errors if the file is unreadable
        } catch (e) {}
    }

    // Step 3. Merge and Deduplicate the two lists (using the unique _id)
    const allMap = new Map();
    // Combine both arrays and loop through every single contact
    [...dbContacts, ...localContacts].forEach(c => {
        // Convert the ID to a string to use as a Map key
        const id = c._id.toString();
        // Add it to the map only if it's not already there (this prefers the DB version since it comes first)
        if (!allMap.has(id)) {
            allMap.set(id, c);
        }
    });

    // Convert the Map back to an array and sort it by creation date (newest first)
    const merged = Array.from(allMap.values()).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Respond to the client with a 200 OK status, the total count, and the merged data array
    res.status(200).json({
        success: true,
        count: merged.length,
        data: merged
    });
});

/**
 * [deleteContact]
 * @desc    Delete a contact message from both DB and local backup
 * @route   DELETE /api/contact/:id
 * @access  Private
 */
// Export the deleteContact controller wrapped in the asyncHandler
exports.deleteContact = asyncHandler(async (req, res, next) => {
    // Extract the contact 'id' parameter from the URL
    const { id } = req.params;

    // Validate that an ID was actually provided
    if (!id) {
        // If no ID, return a 400 Bad Request error
        return res.status(400).json({ success: false, message: 'IDENTIFIER_REQUIRED_FOR_PURGE' });
    }

    // Step 1. Attempt to remove the record from MongoDB
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        // Try deleting from the database
        try {
            // Find the document by its ID and delete it
            await Contact.findByIdAndDelete(id);
        // Catch any database errors
        } catch (e) {
            // Log the error if the DB deletion fails
            console.error('DB_DELETE_FAIL:', e.message);
        }
    }

    // Step 2. Remove the record from the Local JSON file
    try {
        // Check if the local backup file exists
        if (fs.existsSync(contactsFile)) {
            // Read the file contents
            const content = fs.readFileSync(contactsFile, 'utf-8');
            // Parse it into an array
            let contacts = JSON.parse(content || '[]');
            
            // Store the initial count of items to see if we actually delete something
            const initialCount = contacts.length;
            // Filter out the contact that matches the provided ID or timestamp (for older local records)
            contacts = contacts.filter(c => {
                const cid = String(c._id || '');
                const ctime = String(c.createdAt || '');
                // Keep the record ONLY if both the ID and Timestamp do not match the ID we want to delete
                return cid !== id && ctime !== id;
            });

            // If the array size changed, it means we found and removed the item
            if (contacts.length !== initialCount) {
                // Write the newly filtered array back to the JSON file
                fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
                // Log a success message to the console
                console.log(`🗑️ [Storage] LOCAL_TRANSMISSION_PURGED: ${id}`);
            }
        }
    // Catch any errors during the local file deletion process
    } catch (e) {
        // Log the error to the console
        console.error('LOCAL_DELETE_FAIL:', e.message);
    }

    // Respond with a 200 OK success message indicating the deletion was completed
    res.status(200).json({ success: true, message: 'Message purged from system successfully.' });
});
