const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

const getPortableAdmin = () => ({
    id: 'portable-admin',
    username: process.env.PORTABLE_ADMIN_USERNAME || 'admin',
    role: 'admin'
});

/**
 * @desc    Admin login & Issue Token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
    const username = (req.body.username || '').trim();
    const password = req.body.password || '';

    // 1. Validation
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Please provide username and password' });
    }

    let adminPayload = null;

    if (isDbConnected()) {
        // 2. Check for Admin (DB mode)
        const admin = await Admin.findOne({ username }).select('+password');
        if (!admin) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // 3. Match Password
        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        adminPayload = {
            id: admin._id,
            username: admin.username,
            role: admin.role
        };
    } else {
        // Portable fallback mode: allow controlled local admin login
        const portableUsername = process.env.PORTABLE_ADMIN_USERNAME || 'admin';
        const portablePassword = process.env.PORTABLE_ADMIN_PASSWORD || 'admin';
        if (username !== portableUsername || password !== portablePassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        adminPayload = getPortableAdmin();
    }

    // 4. Issue Secure JWT
    const token = jwt.sign(
        { id: adminPayload.id, role: adminPayload.role, username: adminPayload.username },
        process.env.JWT_SECRET || 'cyber_premium_secure_key_2024',
        { expiresIn: '30d' }
    );

    res.status(200).json({
        success: true,
        token,
        admin: adminPayload
    });
});

/**
 * @desc    Identify current admin
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
    // req.admin is set by the auth middleware
    res.status(200).json({
        success: true,
        data: req.admin
    });
});

/**
 * @desc    Change admin password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Please provide all password fields.' });
    }

    if (isDbConnected()) {
        const admin = await Admin.findById(req.admin.id).select('+password');
        if (!admin) {
            return res.status(404).json({ success: false, message: 'System Admin not found.' });
        }

        // Match current password
        const isMatch = await admin.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current access key is incorrect.' });
        }

        // Set New Password (hashed via schema pre-save hook)
        admin.password = newPassword;
        await admin.save();

        res.status(200).json({ success: true, message: 'Security credentials updated successfully.' });
    } else {
        // Portable mode security restriction
        res.status(403).json({ 
            success: false, 
            message: 'PORTABLE_MODE Restriction: Please update credentials manually in your server .env file.' 
        });
    }
});


