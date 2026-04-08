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

// Routes (Express.js)
app.use('/api', portfolioRoutes);

// Error Handler
app.use(errorHandler);

// Health Check
app.get('/', (req, res) => {
    res.send('[Express.js API Home] - Health Check: Online');
});

module.exports = app;
