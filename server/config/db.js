/**
 * [MongoDB Database Connection]
 * All logic related to your database connection goes here.
 */
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_db');
        console.log(`✅ [MongoDB Layer] Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ [MongoDB Layer] Connection Error: ${error.message}`);
        // Do NOT exit the process, so the app can fallback to JSON
        throw error;
    }
};

module.exports = connectDB;
