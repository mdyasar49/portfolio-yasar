/**
 * [Node.js Server Entry Point]
 * This file initializes the server environment, connects to the MongoDB database,
 * and starts the Express.js application listener.
 */
const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();
const validateEnv = require('./config/envValidator');

// Validate Environment before starting
validateEnv();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        // Attempt to connect to the [MongoDB] Layer
        await connectDB();
    } catch (error) {
        console.warn("⚠️  MongoDB could not start. Server is running in PORTABLE MODE with data.json.");
    } finally {
        // Always start the [Express.js] Server on top of [Node.js]
        app.listen(PORT, () => {
            console.log(`🚀 [Node.js] Runtime environment active.`);
            console.log(`🌐 [Express.js] Server running on port ${PORT}`);
            console.log(`📂 [Data Layer] Serving dynamic content from JSON fallback.`);
        });
    }
};

startServer();
