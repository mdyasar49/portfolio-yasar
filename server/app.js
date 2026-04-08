/**
 * MERN Stack Application: Portfolio Server
 * Core Framework: Express.js
 * Developer: A. Mohamed Yasar
 */
const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolioRoutes');

const app = express();

// Midlewares (Express.js)
app.use(cors());
app.use(express.json());

// Routes (Express.js)
app.use('/api', portfolioRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('[Express.js API Home] - Health Check: Online');
});

module.exports = app;
