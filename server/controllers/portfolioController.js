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
 * @desc    Get complete portfolio profile
 * @route   GET /api/profile
 * @access  Public
 */
exports.getProfile = asyncHandler(async (req, res, next) => {
    // 1. Try to fetch from MongoDB first
    let profile = await Profile.findOne();
    
    if (!profile) {
        // 2. Fallback to Local JSON
        profile = getLocalData();
    }

    if (!profile) {
        return res.status(404).json({ success: false, message: "Portfolio data not found." });
    }

    res.status(200).json(profile);
});
