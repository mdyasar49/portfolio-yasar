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
app.use(cors());
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
