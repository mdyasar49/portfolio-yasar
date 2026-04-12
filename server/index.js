/**
 * [Node.js Server Entry Point]
 */
require('dotenv').config(); // MUST be first to load environment variables
const app = require('./app');
const connectDB = require('./config/db');
const validateEnv = require('./config/envValidator');

// Validate Environment before starting
validateEnv();

const http = require('http');
const initSocket = require('./socket');

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Initialize Real-time Layer
initSocket(server);

const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
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
