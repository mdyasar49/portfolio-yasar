const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');

const asyncHandler = require('../middleware/asyncHandler');
const safeArray = (value) => Array.isArray(value) ? value : [];
const safeObject = (value) => (value && typeof value === 'object' ? value : {});
const safeString = (value, fallback = '') => (typeof value === 'string' ? value : fallback);

const normalizeProfile = (source) => {
    const profile = safeObject(source);
    const technicalSkills = safeObject(profile.technicalSkills);
    const additionalInfo = safeObject(profile.additionalInfo);
    const socials = safeObject(profile.socials);

    return {
        name: safeString(profile.name, 'Profile Unavailable'),
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
    return { visitors: 0, maintenanceMode: false }; // Starting from zero as requested
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

    const stats = mongoose.connection.readyState === 1 ? await Stats.findOne() : getLocalStats();

    res.status(200).json({
        ...normalizeProfile(profile),
        maintenanceMode: stats?.maintenanceMode || false
    });
});

/**
 * @desc    Get site visitors (Optional Increment)
 * @route   GET /api/visitors?inc=true
 * @access  Public
 */
exports.getVisitors = asyncHandler(async (req, res, next) => {
    const shouldIncrement = req.query.inc === 'true';
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Portable/Offline Logic
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
        res.status(200).json({ 
            success: true, 
            count: 0, 
            history: req.headers.authorization ? [] : undefined 
        });
    }
});

/**
 * @desc    Update portfolio profile (Full Sync)
 * @route   PUT /api/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const newData = req.body;

    if (!newData || typeof newData !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid payload provided.' });
    }

    // 1. Persist to Local JSON (Primary for current architecture)
    try {
        fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(newData, null, 2));
        console.log("💾 [Storage] Local JSON synchronization complete.");
    } catch (err) {
        console.error("LOCAL_STORAGE_SYNC_ERROR:", err.message);
        return res.status(500).json({ success: false, message: 'Failed to sync local data storage.' });
    }

    // 2. Sync with MongoDB Cloud (Optional persistence)
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            await Profile.findOneAndUpdate({}, newData, { upsert: true, new: true, runValidators: true });
            console.log("☁️ [Cloud] MongoDB persistence finalized.");
        } catch (error) {
            console.error("CLOUD_SYNC_ERROR:", error.message);
        }
    }

    res.status(200).json({ 
        success: true, 
        message: 'Portfolio architecture updated successfully.',
        timestamp: new Date().toISOString()
    });
});

/**
 * @desc    Get live system health metrics
 * @route   GET /api/health
 * @access  Private
 */
exports.getSystemHealth = asyncHandler(async (req, res, next) => {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    
    const memUsage = Math.round((memory.heapUsed / memory.heapTotal) * 100);
    
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
            db: {
                status: dbStatus,
                latency: dbLatency
            },
            api: 'STABLE',
            maintenance: mongoose.connection.readyState === 1 ? (await Stats.findOne())?.maintenanceMode : getLocalStats().maintenanceMode,
            timestamp: new Date()
        }
    });
});

/**
 * @desc    Toggle Maintenance Mode
 * @route   PUT /api/health/maintenance
 * @access  Private
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

    res.status(200).json({ 
        success: true, 
        message: enabled ? 'System placed in MAINTENANCE_LOCK.' : 'System restored to PRODUCTION_STATUS.' 
    });
});



