/**
 * [A. MOHAMED YASAR | MERN PORTFOLIO]
 * Copyright (c) 2026 A. Mohamed Yasar
 * MIT License
 * 
 * Language: JavaScript (Node.js / Express)
 * Purpose of this file:
 * This is the primary entry point of the backend server. It orchestrates the 
 * environment variable loading, database connection, real-time socket 
 * initialization, and starts the Express application listener.
 */


// MUST be first to load environment variables (.env) into process.env
require('dotenv').config(); 

const app = require('./app');
const connectDB = require('./config/db');
const validateEnv = require('./config/envValidator');
const http = require('http');
const initSocket = require('./socket');

/**
 * [Environment Validation]
 * Ensures that all critical variables (DB_URI, JWT_SECRET, etc.) are present 
 * before the server starts to prevent runtime crashes.
 */
validateEnv();

const PORT = process.env.PORT || 5001;
// Create an HTTP server instance using the Express 'app'
const server = http.createServer(app);

/**
 * [initSocket]
 * Initializes the Real-time Layer (Socket.io) to enable live telemetry streaming 
 * between the server and the administrative dashboard.
 */
initSocket(server);

/**
 * [startServer]
 * Async function to handle the startup sequence:
 * 1. Attempt MongoDB connection.
 * 2. Start the HTTP server regardless of DB status (Enables Portable Mode).
 */
const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        // Fallback warning if the cloud database is unreachable
        console.warn("⚠️  MongoDB could not start. Server is running in PORTABLE MODE.");
    } finally {
        server.listen(PORT, () => {
            console.log(`🚀 [Node.js] Runtime environment active.`);
            console.log(`🌐 [Express.js] API Layer: http://localhost:${PORT}/api`);
            console.log(`📡 [Socket.io] Persistence Layer: Active`);
        });
    }
};

startServer();
