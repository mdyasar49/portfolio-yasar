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

/**
 * Persistence for Visitors when MongoDB is offline
 */
const statsFile = path.join(__dirname, '../stats.json');
const getLocalStats = () => {
    try {
        if (fs.existsSync(statsFile)) {
            return JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
        }
    } catch (e) {}
    return { visitors: 0 }; // Starting from zero as requested
};

const saveLocalStats = (stats) => {
    try {
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    } catch (e) {}
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
    console.log(`[${new Date().toISOString()}] GET /api/visitors - Request Received`);
    
    // Persistence Check: If MongoDB is offline, use Local JSON persistence
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
        console.warn("⚠️  MongoDB offline. Using Dynamic Local Persistence (stats.json).");
        const stats = getLocalStats();
        stats.visitors += 1;
        saveLocalStats(stats);

        return res.status(200).json({ 
            success: true, 
            count: stats.visitors,
            mode: 'PORTABLE_DYNAMIC'
        });
    }

    try {
        let stats = await Stats.findOne();
        
        if (!stats) {
            console.log("No stats found, creating initial seed.");
            stats = new Stats({ visitors: 0 }); // Starting from zero as requested
            await stats.save();
        }

        // Increment count
        stats.visitors += 1;
        stats.lastUpdated = Date.now();
        await stats.save();

        console.log(`Successfully updated visitor count to: ${stats.visitors}`);
        res.status(200).json({ success: true, count: stats.visitors });
    } catch (error) {
        console.error("STATS_SERVICE_ERROR:", error.message);
        res.status(200).json({ success: true, count: 1 }); // Fallback to 1 if first visit fails
    }
});
