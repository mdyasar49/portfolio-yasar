const fs = require('fs');
const path = require('path');
const Contact = require('../models/Contact');
const { sendContactAlert } = require('../services/emailService');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// Portable Persistence Helper
const contactsFile = path.join(__dirname, '../contacts.json');
const saveLocalContact = (contact) => {
    try {
        let contacts = [];
        if (fs.existsSync(contactsFile)) {
            const content = fs.readFileSync(contactsFile, 'utf-8');
            contacts = JSON.parse(content || '[]');
        }
        
        // Ensure unique ID for portable mode
        const localEntry = {
            ...contact,
            _id: contact._id || `LOCAL_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            createdAt: contact.createdAt instanceof Date ? contact.createdAt.toISOString() : contact.createdAt
        };

        contacts.unshift(localEntry); // Most recent first
        fs.writeFileSync(contactsFile, JSON.stringify(contacts.slice(0, 100), null, 2));
    } catch (e) {
        console.error('LOCAL_CONTACT_SYNC_ERROR:', e.message);
    }
};


/**
 * @desc    Submit contact form, save to DB and send email
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContactForm = asyncHandler(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Incomplete dispatch payload.' });
    }

    const contactData = { name, email, subject: subject || 'No Subject', message, createdAt: new Date() };

    // 1. Persist to MongoDB if online
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            await Contact.create(contactData);
        } catch (e) {
            console.error('DB_SAVE_FAIL:', e.message);
        }
    }

    // 2. Persist to Local JSON (Portable mode)
    saveLocalContact(contactData);

    // 3. Dispatch Email Notification
    try {
        await sendContactAlert(contactData);
    } catch (error) {
        console.error('MAIL_DISPATCH_ERROR:', error);
    }


    res.status(200).json({
        success: true,
        message: 'Your correspondence has been securely logged and dispatched.'
    });
});

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact
 * @access  Private
 */
exports.getContacts = asyncHandler(async (req, res, next) => {
    let dbContacts = [];
    let localContacts = [];

    // 1. Fetch from MongoDB if available
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        dbContacts = await Contact.find().lean();
    }

    // 2. Fetch from Local Buffer
    if (fs.existsSync(contactsFile)) {
        try {
            localContacts = JSON.parse(fs.readFileSync(contactsFile, 'utf-8'));
        } catch (e) {}
    }

    // 3. Merge & Deduplicate (using unique _id)
    const allMap = new Map();
    [...dbContacts, ...localContacts].forEach(c => {
        const id = c._id.toString();
        // Prefer DB version if available for the same ID/Content
        if (!allMap.has(id)) {
            allMap.set(id, c);
        }
    });

    const merged = Array.from(allMap.values()).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
        success: true,
        count: merged.length,
        data: merged
    });
});


/**
 * @desc    Delete a contact message
 * @route   DELETE /api/contact/:id
 * @access  Private
 */
exports.deleteContact = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // 1. Remove from MongoDB
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        await Contact.findByIdAndDelete(id);
    }

    // 2. Remove from Local JSON (Filter by date as unique identifier for portable mode)
    try {
        if (fs.existsSync(contactsFile)) {
            let contacts = JSON.parse(fs.readFileSync(contactsFile, 'utf-8'));
            // Note: In portable mode without Mongo IDs, we find by timestamp/match
            contacts = contacts.filter(c => c._id !== id && c.createdAt !== id); 
            fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
        }
    } catch (e) {
        console.error('LOCAL_DELETE_FAIL:', e.message);
    }

    res.status(200).json({ success: true, message: 'Message purged from system.' });
});


