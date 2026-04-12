const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const Admin = require('../models/Admin');

/**
 * Middleware: Protect
 * Verifies the JWT and attaches the admin user to the request.
 */
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Verify token presence
    if (!token) {
        return res.status(401).json({ success: false, error: 'Authorization denied. Gateway locked.' });
    }

    try {
        // 3. Decode & Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cyber_premium_secure_key_2024');

        // 4. Attach admin to request
        req.admin = await Admin.findById(decoded.id);
        
        if (!req.admin) {
             return res.status(401).json({ success: false, error: 'Identity mismatch. Access revoked.' });
        }

        next();
    } catch (err) {
        console.error('SEC_GATE_FAIL:', err.message);
        return res.status(401).json({ success: false, error: 'Session expired or invalid token.' });
    }
});
