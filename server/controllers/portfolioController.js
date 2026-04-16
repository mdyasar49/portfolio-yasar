/**
 * [Node.js & Express.js - Backend Architecture]
 * Technologies: Node.js Runtime, Express.js Framework, MongoDB/Mongoose (NoSQL), File System (fs)
 * Purpose: This controller handles the core business logic for the portfolio data, 
 * including profile retrieval, visitor tracking, and system health diagnostics.
 */
const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');
const Stats = require('../models/Stats');

/**
 * Utility: Safety Normalizers
 * These helpers ensure that even if data is missing or corrupted, 
 * the frontend receives valid data types (arrays, strings, objects).
 */
const safeArray = (value) => Array.isArray(value) ? value : [];
const safeObject = (value) => (value && typeof value === 'object' ? value : {});
const safeString = (value, fallback = '') => (typeof value === 'string' ? value : fallback);

/**
 * normalizeProfile
 * Transforms the raw database/JSON object into a strictly structured format 
 * expected by the React.js frontend.
 * @param {Object} source - Raw profile data from DB or local JSON.
 */
const normalizeProfile = (source) => {
    const profile = safeObject(source);
    const technicalSkills = safeObject(profile.technicalSkills);
    const additionalInfo = safeObject(profile.additionalInfo);
    const socials = safeObject(profile.socials);

    return {
        // Enforce a hardcoded fallback if 'name' is missing completely
        name: safeString(profile.name, 'A. MOHAMED YASAR'),
        title: safeString(profile.title, 'Full Stack Developer'),
        email: safeString(profile.email),
        phone: safeString(profile.phone),
        location: safeString(profile.location),
        summary: safeString(profile.summary),
        technicalSkills: {
            frontend: safeArray(technicalSkills.frontend),
            backend: safeArray(technicalSkills.backend),
            database: safeArray(technicalSkills.database),
            tools: safeArray(technicalSkills.tools),
            aiTools: safeArray(technicalSkills.aiTools),
            other: safeArray(technicalSkills.other)
        },
        experience: safeArray(profile.experience).map(exp => ({
            role: safeString(exp?.role, 'Role'),
            company: safeString(exp?.company, 'Company'),
            companyUrl: safeString(exp?.companyUrl),
            companyLinkedIn: safeString(exp?.companyLinkedIn),
            period: safeString(exp?.period),
            location: safeString(exp?.location),
            description: safeArray(exp?.description)
        })),
        projects: safeArray(profile.projects).map(project => ({
            name: safeString(project?.name, 'Project'),
            type: safeString(project?.type),
            technologies: safeArray(project?.technologies),
            image: safeString(project?.image),
            link: safeString(project?.link),
            github: safeString(project?.github),
            description: safeArray(project?.description),
            highlights: safeArray(project?.highlights),
            stats: safeObject(project?.stats)
        })),
        education: safeArray(profile.education).map(edu => ({
            degree: safeString(edu?.degree, 'Education'),
            institution: safeString(edu?.institution, 'Institution'),
            institutionUrl: safeString(edu?.institutionUrl),
            year: safeString(edu?.year)
        })),
        softSkills: safeArray(profile.softSkills),
        additionalInfo: {
            availability: safeString(additionalInfo.availability),
            workPreference: safeString(additionalInfo.workPreference),
            languages: safeArray(additionalInfo.languages)
        },
        socials: {
            linkedin: safeString(socials.linkedin),
            github: safeString(socials.github),
            twitter: safeString(socials.twitter),
            instagram: safeString(socials.instagram),
            facebook: safeString(socials.facebook)
        },
        readme: safeString(profile.readme),
        projectExplanation: safeString(profile.projectExplanation)
    };
};

/**
 * getLocalData
 * Resilience Strategy: Reads synchronous data from data.json if MongoDB is offline.
 */
const getLocalData = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Local Data Fetch Error:", err.message);
        return null;
    }
};

/**
 * Persistence Logic for system stats (Visitors/Maintenance) when DB is down.
 */
const statsFile = path.join(__dirname, '../stats.json');

const getLocalStats = () => {
    try {
        if (fs.existsSync(statsFile)) {
            return JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
        }
    } catch (e) {}
    return { visitors: 0, maintenanceMode: false };
};

const saveLocalStats = (stats) => {
    try {
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    } catch (e) {}
};

/**
 * [API_METHOD] getProfile
 * @desc    Retrieves the complete portfolio profile. 
 *          Prioritizes Local JSON for zero-latency development.
 * @route   GET /api/profile
 */
exports.getProfile = asyncHandler(async (req, res, next) => {
    let profile = null;

    // Phase 1: Try Local Storage (High Speed)
    profile = getLocalData();

    // Phase 2: If Local fails, Fallback to MongoDB (High Durability)
    if (!profile && mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            profile = await Profile.findOne().lean();
        } catch (error) {
            console.error("MongoDB Query Error:", error.message);
        }
    }

    // Safety: If no data found in either source, return error
    if (!profile) {
        return res.status(404).json({ success: false, message: "Portfolio data not found." });
    }

    // Fetch site orchestration stats (maintenance mode status)
    const stats = mongoose.connection.readyState === 1 ? await Stats.findOne() : getLocalStats();

    // Send normalized response
    res.status(200).json({
        ...normalizeProfile(profile),
        maintenanceMode: stats?.maintenanceMode || false
    });
});

/**
 * [API_METHOD] getVisitors
 * @desc    Get visitor statistics and optionally increment the counter.
 * @route   GET /api/visitors?inc=true
 */
exports.getVisitors = asyncHandler(async (req, res, next) => {
    const shouldIncrement = req.query.inc === 'true';
    const today = new Date().toISOString().split('T')[0];
    
    // Portable Logic: If DB is offline, use local JSON storage for counts
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
        const stats = getLocalStats();
        if (!stats.history) stats.history = [];

        if (shouldIncrement) {
            stats.visitors += 1;
            let dayRecord = stats.history.find(h => h.date === today);
            if (dayRecord) dayRecord.count += 1;
            else stats.history.push({ date: today, count: 1 });
            saveLocalStats(stats);
        }

        return res.status(200).json({ 
            success: true, 
            count: stats.visitors,
            history: req.headers.authorization ? stats.history : undefined,
            mode: 'PORTABLE'
        });
    }

    // Standard Logic: Cloud Persistence via MongoDB
    try {
        let stats = await Stats.findOne();
        if (!stats) {
            stats = new Stats({ visitors: 0, history: [{ date: today, count: 0 }] });
            await stats.save();
        }

        if (shouldIncrement) {
            stats.visitors += 1;
            let dayRecord = stats.history.find(h => h.date === today);
            if (dayRecord) dayRecord.count += 1;
            else stats.history.push({ date: today, count: 1 });
            stats.lastUpdated = Date.now();
            await stats.save();
        }

        res.status(200).json({ 
            success: true, 
            count: stats.visitors,
            history: req.headers.authorization ? stats.history : undefined 
        });
    } catch (error) {
        console.error("STATS_SERVICE_FAILURE:", error.message);
        res.status(200).json({ success: true, count: 0 });
    }
});

/**
 * [API_METHOD] updateProfile
 * @desc    Updates the profile data. Synchronizes both local JSON and MongoDB.
 * @route   PUT /api/profile
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const newData = req.body;

    // payload validation
    if (!newData || typeof newData !== 'object' || Object.keys(newData).length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid payload.' });
    }

    // 1. Persist to Local File System
    try {
        fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(newData, null, 2));
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to sync local disk storage.' });
    }

    // 2. Persist to MongoDB Cloud
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            await Profile.findOneAndUpdate({}, newData, { upsert: true, new: true });
        } catch (error) {
            console.error("Cloud Storage Sync Fail:", error.message);
        }
    }

    res.status(200).json({ success: true, message: 'Portfolio updated.' });
});

/**
 * [API_METHOD] getSystemHealth
 * @desc    Retrieves live system metrics like uptime and memory usage.
 * @route   GET /api/health
 */
exports.getSystemHealth = asyncHandler(async (req, res, next) => {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    const memUsage = Math.round((memory.heapUsed / memory.heapTotal) * 100);
    
    // DB Latency Check
    const dbStart = Date.now();
    let dbStatus = 'OFFLINE';
    let dbLatency = 0;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            await mongoose.connection.db.admin().ping();
            dbLatency = Date.now() - dbStart;
            dbStatus = 'ONLINE';
        } catch (e) {
            dbStatus = 'ERROR';
        }
    }

    res.status(200).json({
        success: true,
        data: {
            uptimeSeconds: Math.floor(uptime),
            memoryUsage: memUsage,
            db: { status: dbStatus, latency: dbLatency },
            timestamp: new Date()
        }
    });
});

/**
 * [API_METHOD] toggleMaintenance
 * @desc    Locks or Unlocks the site for maintenance.
 * @route   PUT /api/health/maintenance
 */
exports.toggleMaintenance = asyncHandler(async (req, res, next) => {
    const { enabled } = req.body;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
        let stats = await Stats.findOne();
        if (!stats) stats = new Stats();
        stats.maintenanceMode = enabled;
        await stats.save();
    } else {
        const stats = getLocalStats();
        stats.maintenanceMode = enabled;
        saveLocalStats(stats);
    }

    res.status(200).json({ success: true, message: 'Maintenance status toggled.' });
});


