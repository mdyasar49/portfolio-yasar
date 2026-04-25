/**
 * [Node.js Seed Script]
 * Creates the initial Admin account for the Portfolio Dashboard.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

// Load environment from parent folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        console.log('📡 [Database] Connecting to infrastructure...');
        await mongoose.connect(process.env.MONGO_URI);

        // Configuration: [CHANGE THESE LOCALLY OR DURING PROMPT]
        const username = 'admin';
        const password = 'admin';

        const exists = await Admin.findOne({ username });
        if (exists) {
            console.log(`⚠️ [System] Admin "${username}" already exists in core.`);
            process.exit(0);
        }

        const newAdmin = new Admin({
            username,
            password
        });

        await newAdmin.save();
        console.log(`🚀 [Success] Secure Admin account "${username}" has been provisioned.`);
        console.log(`💻 [Action] You can now log into the Dashboard at /admin/login.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ [Failure] Cryptographic operation failed:', error.message);
        process.exit(1);
    }
};

seedAdmin();
