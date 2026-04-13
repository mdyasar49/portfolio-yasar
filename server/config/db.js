const mongoose = require('mongoose');

/**
 * [MongoDB Database Connection]
 * Configured with a 5-second timeout to prevent server "hangs" on Render.
 * If connection fails, the server will continue in PORTABLE_MODE.
 */
const connectDB = async () => {
    try {
        // Strict 5s timeout to ensure fast fallback to JSON mode if DB is unreachable
        const options = {
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        };

        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.warn("⚠️  MONGO_URI is not defined. Skipping DB connection.");
            return;
        }

        const conn = await mongoose.connect(mongoUri, options);
        console.log(`✅ [MongoDB Layer] Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ [MongoDB Layer] Connection Error: ${error.message}`);
        // Let the caller handle the fallback logic
        throw error;
    }
};

module.exports = connectDB;
