const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const Admin = require('../models/Admin');
const mongoose = require('mongoose');

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

  // 2. Verify token presence & validity
  if (!token || token === 'null' || token === 'undefined') {
    return res
      .status(401)
      .json({ success: false, error: 'Access denied. Valid administrative token required.' });
  }

  try {
    // 3. Decode & Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cyber_premium_secure_key_2024');

    // 4. Attach admin to request
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    const isPortableUser = decoded.id === 'portable-admin';

    if (isDbConnected && !isPortableUser) {
      req.admin = await Admin.findById(decoded.id);
      if (!req.admin) {
        return res
          .status(401)
          .json({ success: false, error: 'Unauthorized access. Session terminated.' });
      }
    } else {
      // Portable/Override authorization logic
      if (decoded.role !== 'admin') {
        return res
          .status(401)
          .json({ success: false, error: 'Unauthorized access. Session terminated.' });
      }
      req.admin = {
        _id: decoded.id || 'portable-admin',
        username: decoded.username || process.env.PORTABLE_ADMIN_USERNAME || 'admin',
        role: decoded.role,
      };
    }

    next();
  } catch (err) {
    console.error('AUTH_GATE_FAIL:', err.message);
    return res.status(401).json({ success: false, error: 'Session expired or invalid token.' });
  }
});
