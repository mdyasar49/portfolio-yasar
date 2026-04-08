const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Portability Logic: Fallback to local data if MongoDB is off
const getLocalData = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
};

// [GET /api/profile]
router.get('/profile', async (req, res) => {
    try {
        // Try getting from local memory or database logic
        const data = getLocalData();
        if (data) {
            return res.json(data);
        }
        res.status(404).json({ message: "Portfolio data not found locally." });
    } catch (err) {
        res.status(500).json({ message: "Server error retrieving profile." });
    }
});

module.exports = router;
