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

const normalizeOrigin = (value = '') => value.trim().replace(/\/+$/, '');

// 1. CORS Whitelist — reads from CLIENT_URL env var (supports comma-separated values)
// Example: CLIENT_URL=https://mern-portfolio-yasar-1.onrender.com
const rawClientUrl = process.env.CLIENT_URL || '';
const allowedOrigins = [
  'http://localhost:3000',                              // Local dev client
  ...rawClientUrl.split(',').map(normalizeOrigin)      // Production client(s) from .env
].map(normalizeOrigin).filter(Boolean);

// Log allowed origins at startup so you can verify the env var is being read
console.log(`🔐 [CORS] Allowed origins: ${allowedOrigins.join(', ')}`);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, server-to-server calls)
    if (!origin) return callback(null, true);
    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ [CORS] Blocked request from origin: ${origin}`);
      console.warn(`   Allowed origins in system: ${allowedOrigins.join(', ')}`);
      callback(new Error(`CORS policy blocked access from origin ${origin}.`));
    }
  },
  credentials: true
}));

// 2. Direct Browser Access Protection (Applied to ALL endpoints)
app.use((req, res, next) => {
    // Skip protection for the health check root path if needed, 
    // or apply globally for maximum security.
    const origin = req.headers.origin;
    const referer = req.headers.referer;

    if (!origin && !referer && req.method === 'GET' && req.path !== '/') {
        // Use the first production URL for the return link if available
        const returnUrl = allowedOrigins.find(o => o.includes('onrender.com')) || 'https://mern-portfolio-yasar-1.onrender.com';
        
        return res.status(403).send(`
            <div style="background:#010409; color:#ff3366; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
                <h1 style="font-size:3rem; margin-bottom:10px;">🚫 ACCESS_DENIED</h1>
                <p style="color:#64748b; font-size:1.2rem;">Direct system access via browser is restricted to maintain MERN core integrity.</p>
                <a href="${returnUrl}" style="color:#33ccff; text-decoration:none; border:1px solid #33ccff; padding:12px 30px; border-radius:8px; margin-top:30px; font-weight:bold; transition: 0.3s;">RETURN_TO_PORTFOLIO</a>
            </div>
        `);
    }
    next();
});

app.use(express.json());

const authRoutes = require('./routes/authRoutes');

// Routes (Express.js) - Consolidating all API routes under /api prefix
app.use('/api', portfolioRoutes);
app.use('/api/auth', authRoutes);

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
