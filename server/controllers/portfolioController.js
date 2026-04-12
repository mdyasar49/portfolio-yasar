const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');

const asyncHandler = require('../middleware/asyncHandler');

/**
 * Portability Logic: Fallback to local data if MongoDB is off or empty
 */
const getLocalData = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
};

const mongoose = require('mongoose');
const Stats = require('../models/Stats');

/**
 * @desc    Get complete portfolio profile
 * @route   GET /api/profile
 * @access  Public
 */
exports.getProfile = asyncHandler(async (req, res, next) => {
    let profile = null;

    // 1. Force prioritize Local JSON for immediate development updates
    profile = getLocalData();

    // 2. If JSON fails or is missing, try to fetch from MongoDB
    if (!profile && mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            profile = await Profile.findOne();
        } catch (error) {
            console.error("MongoDB Query Error:", error.message);
        }
    }

    if (!profile) {
        return res.status(404).json({ success: false, message: "Portfolio data not found." });
    }

    res.status(200).json(profile);
});

/**
 * @desc    Increment and get site visitors
 * @route   GET /api/visitors
 * @access  Public
 */
exports.getVisitors = asyncHandler(async (req, res, next) => {
    try {
        let stats = await Stats.findOne();
        
        if (!stats) {
            stats = new Stats({ visitors: 100 }); // Starting seed
            await stats.save();
        }

        // Increment count
        stats.visitors += 1;
        stats.lastUpdated = Date.now();
        await stats.save();

        res.status(200).json({ success: true, count: stats.visitors });
    } catch (error) {
        console.error("STATS_ERROR:", error.message);
        res.status(500).json({ success: false, count: 1248 }); // Fallback
    }
});
