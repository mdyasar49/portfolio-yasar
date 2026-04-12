/**
 * [Express.js Core Framework]
 * This file configures the Express.js application, including route handling and 
 * implementation of global middlewares like CORS and JSON parsing.
 */
const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolioRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middlewares (Express.js)
app.use(logger);
// 1. CORS Whitelist Security (Uses .env configuration)
const allowedOrigins = [
  'http://localhost:3000',                              // Local Client
  process.env.CLIENT_URL                               // Live Production Client (from .env)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('⚠️ [Security Error]: Access Denied by CORS Policy.'));
    }
  }
}));

// 2. Direct Browser Access Protection (Applied to ALL endpoints)
app.use((req, res, next) => {
    // Skip protection for the health check root path if needed, 
    // or apply globally for maximum security.
    const origin = req.headers.origin;
    const referer = req.headers.referer;

    if (!origin && !referer && req.method === 'GET' && req.path !== '/') {
        return res.status(403).send(`
            <div style="background:#010409; color:#ff3366; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
                <h1 style="font-size:3rem; margin-bottom:10px;">🚫 ACCESS_DENIED</h1>
                <p style="color:#64748b; font-size:1.2rem;">Direct system access via browser is restricted to maintain MERN core integrity.</p>
                <a href="${process.env.CLIENT_URL || '#'}" style="color:#33ccff; text-decoration:none; border:1px solid #33ccff; padding:12px 30px; border-radius:8px; margin-top:30px; font-weight:bold; transition: 0.3s;">RETURN_TO_PORTFOLIO</a>
            </div>
        `);
    }
    next();
});

app.use(express.json());

// Routes (Express.js) - Consolidating all API routes under /api prefix
app.use('/api', portfolioRoutes);

// JSON 404 Handler for API
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'API Endpoint not found' });
});

// Error Handler
app.use(errorHandler);

// Health Check
app.get('/', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(200).json({
        status: 'Online',
        message: '[Express.js API] - Systems Operational',
        timestamp: new Date().toISOString(),
        ...(isProduction ? {} : { version: '1.0.0', mode: 'Development' })
    });
});

module.exports = app;
