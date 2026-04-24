/**
 * Language: JavaScript (Node.js)
 * Purpose of this file:
 * This file is a backend controller for managing "authentication".
 * It handles the logic for the admin login, issuing JSON Web Tokens (JWT) for secure access,
 * retrieving the current logged-in user's profile, and changing the admin password.
 * It also supports a fallback "portable mode" if the database is disconnected.
 */

// Import the Admin model which defines the MongoDB schema for admin users
const Admin = require('../models/Admin');
// Import the jsonwebtoken library to generate secure access tokens for the admin
const jwt = require('jsonwebtoken');
// Import mongoose to check the status of the MongoDB database connection
const mongoose = require('mongoose');
// Import a middleware wrapper to handle async errors cleanly without try-catch blocks everywhere
const asyncHandler = require('../middleware/asyncHandler');

// Define a helper function to quickly check if the MongoDB database is currently connected (readyState === 1)
const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Define a helper function to return a default "portable admin" object when the DB is offline
const getPortableAdmin = () => ({
    // Set a static ID for the portable admin
    id: 'portable-admin',
    // Use the username from environment variables, or default to 'admin'
    username: process.env.PORTABLE_ADMIN_USERNAME || 'admin',
    // Hardcode the role as 'admin'
    role: 'admin'
});

/**
 * [login]
 * @desc    Admin login & Issue Token
 * @route   POST /api/auth/login
 * @access  Public
 */
// Export the login controller function, wrapped in asyncHandler
exports.login = asyncHandler(async (req, res, next) => {
    // Extract the username from the request body and trim any extra spaces (default to empty string if missing)
    const username = (req.body.username || '').trim();
    // Extract the password from the request body
    const password = req.body.password || '';

    // Step 1. Validation: Check if both username and password were provided
    if (!username || !password) {
        // If not, return a 400 Bad Request error
        return res.status(400).json({ success: false, error: 'Please provide username and password' });
    }

    // Initialize a variable to hold the admin's data payload for the token
    let adminPayload = null;

    // Step 2. Check if the database is connected
    if (isDbConnected()) {
        // Search the Admin collection for a user matching the username, explicitly asking to include the hidden 'password' field
        const admin = await Admin.findOne({ username }).select('+password');
        // If no admin is found with that username, return a 401 Unauthorized error
        if (!admin) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Step 3. Compare the provided password with the hashed password in the database
        const isMatch = await admin.matchPassword(password);
        // If the passwords do not match, return a 401 Unauthorized error
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // If credentials are valid, package the admin details into the payload object
        adminPayload = {
            id: admin._id,
            username: admin.username,
            role: admin.role
        };
    } else {
        // Fallback: If the database is NOT connected, use portable mode
        // Get the allowed portable username from environment variables (or default to 'admin')
        const portableUsername = process.env.PORTABLE_ADMIN_USERNAME || 'admin';
        // Get the allowed portable password from environment variables (or default to 'admin')
        const portablePassword = process.env.PORTABLE_ADMIN_PASSWORD || 'admin';
        
        // Check if the provided credentials match the portable credentials
        if (username !== portableUsername || password !== portablePassword) {
            // If not, return a 401 Unauthorized error
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        // If they match, get the portable admin payload using the helper function
        adminPayload = getPortableAdmin();
    }

    // Step 4. Issue a Secure JSON Web Token (JWT)
    const token = jwt.sign(
        // Include the admin's ID, role, and username inside the token payload
        { id: adminPayload.id, role: adminPayload.role, username: adminPayload.username },
        // Use the secret key from environment variables to sign the token (or a default key)
        process.env.JWT_SECRET || 'cyber_premium_secure_key_2024',
        // Set the token to expire in 30 days
        { expiresIn: '30d' }
    );

    // Respond with a 200 OK status, sending the token and the admin details back to the client
    res.status(200).json({
        success: true,
        token,
        admin: adminPayload
    });
});

/**
 * [getMe]
 * @desc    Identify current admin
 * @route   GET /api/auth/me
 * @access  Private
 */
// Export the getMe controller function to return the currently logged-in user's data
exports.getMe = asyncHandler(async (req, res, next) => {
    // Respond with the admin details that were attached to the 'req' object by the authentication middleware
    res.status(200).json({
        success: true,
        data: req.admin
    });
});

/**
 * [changePassword]
 * @desc    Change admin password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
// Export the changePassword controller function
exports.changePassword = asyncHandler(async (req, res, next) => {
    // Extract the current password and new password from the incoming request body
    const { currentPassword, newPassword } = req.body;

    // Validate that both fields were actually provided
    if (!currentPassword || !newPassword) {
        // If not, return a 400 Bad Request error
        return res.status(400).json({ success: false, message: 'Please provide all password fields.' });
    }

    // Check if the database is currently connected
    if (isDbConnected()) {
        // Find the currently logged-in admin in the DB using the ID from the req object, including the hidden password field
        const admin = await Admin.findById(req.admin.id).select('+password');
        // If the admin somehow doesn't exist in the DB, return a 404 Not Found error
        if (!admin) {
            return res.status(404).json({ success: false, message: 'System Admin not found.' });
        }

        // Check if the provided 'current password' actually matches the password in the database
        const isMatch = await admin.matchPassword(currentPassword);
        // If it doesn't match, block the operation with a 401 Unauthorized error
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current access key is incorrect.' });
        }

        // Set the admin's password field to the new password (it will be automatically hashed before saving due to Mongoose pre-save hooks)
        admin.password = newPassword;
        // Save the updated admin document back to the database
        await admin.save();

        // Respond with a 200 OK success message
        res.status(200).json({ success: true, message: 'Security credentials updated successfully.' });
    } else {
        // Fallback: If in portable mode (no DB), changing the password via the API is forbidden
        res.status(403).json({ 
            success: false, 
            message: 'PORTABLE_MODE Restriction: Please update credentials manually in your server .env file.' 
        });
    }
});


