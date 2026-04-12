const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Admin login & Issue Token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    // 1. Validation
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Please provide username and password' });
    }

    // 2. Check for Admin
    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 3. Match Password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 4. Issue Secure JWT
    const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'cyber_premium_secure_key_2024',
        { expiresIn: '30d' }
    );

    res.status(200).json({
        success: true,
        token,
        admin: {
            id: admin._id,
            username: admin.username,
            role: admin.role
        }
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
