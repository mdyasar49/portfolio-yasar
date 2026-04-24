/**
 * Language: JavaScript (Node.js)
 * Purpose of this file:
 * This file is the core backend controller for managing the "portfolio" data.
 * It handles retrieving the main profile data, tracking site visitors, updating the profile,
 * monitoring system health (memory/uptime), and toggling maintenance mode.
 * It uses a dual-storage strategy (MongoDB + Local JSON) for maximum reliability.
 */

// Import the Node.js built-in 'fs' (file system) module to read and write files locally
const fs = require('fs');
// Import the Node.js built-in 'path' module to work with file and directory paths safely
const path = require('path');
// Import the Profile model which defines the MongoDB schema for the portfolio data
const Profile = require('../models/Profile');
// Import a middleware wrapper to handle async errors cleanly without try-catch blocks everywhere
const asyncHandler = require('../middleware/asyncHandler');
// Import mongoose to interact with the MongoDB database
const mongoose = require('mongoose');
// Import the Stats model which tracks visitor counts and maintenance mode in MongoDB
const Stats = require('../models/Stats');

// [PERFORMANCE_OPTIMIZATION] In-memory cache for the primary profile payload
// This reduces disk I/O and DB queries for high-traffic environments.
let cachedProfile = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 300000; // 5 minutes


/**
 * Utility: Safety Normalizers
 * These helper functions ensure that even if data is missing or corrupted,
 * the frontend receives valid default data types (empty arrays, strings, objects).
 */
// If the value is an array, return it. Otherwise, return an empty array.
const safeArray = (value) => Array.isArray(value) ? value : [];
// If the value is a valid object, return it. Otherwise, return an empty object.
const safeObject = (value) => (value && typeof value === 'object' ? value : {});
// If the value is a string, return it. Otherwise, return the fallback string.
const safeString = (value, fallback = '') => (typeof value === 'string' ? value : fallback);

/**
 * [normalizeProfile]
 * Function purpose: Transforms the raw database/JSON object into a strictly structured format
 * expected by the React.js frontend, preventing frontend crashes due to missing fields.
 */
// Define the normalizeProfile function that takes raw source data
const normalizeProfile = (source) => {
    // Ensure the main source is a valid object
    const profile = safeObject(source);
    // Ensure technicalSkills is a valid object
    const technicalSkills = safeObject(profile.technicalSkills);
    // Ensure additionalInfo is a valid object
    const additionalInfo = safeObject(profile.additionalInfo);
    // Ensure socials is a valid object
    const socials = safeObject(profile.socials);

    // Return a deeply structured and sanitized object
    return {
        // Enforce a hardcoded fallback if 'name' is missing completely
        name: safeString(profile.name, 'A. MOHAMED YASAR'),
        // Set a default title if missing
        title: safeString(profile.title, 'Full Stack Developer'),
        // Safely extract email, phone, location, and summary strings
        email: safeString(profile.email),
        phone: safeString(profile.phone),
        location: safeString(profile.location),
        summary: safeString(profile.summary),
        // Safely extract technical skills into categorized arrays
        technicalSkills: {
            frontend: safeArray(technicalSkills.frontend),
            backend: safeArray(technicalSkills.backend),
            database: safeArray(technicalSkills.database),
            tools: safeArray(technicalSkills.tools),
            aiTools: safeArray(technicalSkills.aiTools),
            other: safeArray(technicalSkills.other)
        },
        // Safely map over the experience array to guarantee each item has the correct structure
        experience: safeArray(profile.experience).map(exp => ({
            role: safeString(exp?.role, 'Role'),
            company: safeString(exp?.company, 'Company'),
            companyUrl: safeString(exp?.companyUrl),
            companyLinkedIn: safeString(exp?.companyLinkedIn),
            period: safeString(exp?.period),
            location: safeString(exp?.location),
            description: safeArray(exp?.description)
        })),
        // Safely map over the projects array
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
        // Safely map over the education array
        education: safeArray(profile.education).map(edu => ({
            degree: safeString(edu?.degree, 'Education'),
            institution: safeString(edu?.institution, 'Institution'),
            institutionUrl: safeString(edu?.institutionUrl),
            year: safeString(edu?.year)
        })),
        // Safely extract softSkills array
        softSkills: safeArray(profile.softSkills),
        // Safely extract additionalInfo properties
        additionalInfo: {
            availability: safeString(additionalInfo.availability),
            workPreference: safeString(additionalInfo.workPreference),
            languages: safeArray(additionalInfo.languages)
        },
        // Safely extract social media links
        socials: {
            linkedin: safeString(socials.linkedin),
            github: safeString(socials.github),
            twitter: safeString(socials.twitter),
            instagram: safeString(socials.instagram),
            facebook: safeString(socials.facebook)
        },
        // Extract raw readme and project explanation strings
        readme: safeString(profile.readme),
        projectExplanation: safeString(profile.projectExplanation),
        // Safely extract navigation menu items
        menuItems: safeArray(profile.menuItems),
        // Safely extract analytics and performance metrics
        performanceData: safeArray(profile.performanceData),
        skillDistribution: safeArray(profile.skillDistribution),
        systemStats: safeArray(profile.systemStats)
    };
};

/**
 * [getLocalData]
 * Function purpose: Aggregates portfolio data from multiple atomized JSON files 
 * in the /data directory. This provides better organization and maintainability.
 */
const getLocalData = () => {
    try {
        const dataDir = path.join(__dirname, '../data');
        
        // Define the atomic data fragments to be aggregated
        const fragments = [
            'basic_info.json',
            'skills.json',
            'experience.json',
            'projects.json',
            'education.json',
            'socials.json',
            'additional.json',
            'documentation.json',
            'navigation.json',
            'analytics.json'
        ];

        let aggregatedData = {};

        fragments.forEach(file => {
            const filePath = path.join(dataDir, file);
            if (fs.existsSync(filePath)) {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                
                // Smart Merge Logic:
                // If the content is an array (like experience or projects), map it to the correct key
                if (Array.isArray(content)) {
                    if (file === 'experience.json') aggregatedData.experience = content;
                    if (file === 'projects.json') aggregatedData.projects = content;
                } else {
                    // Otherwise, merge the object properties into the main payload
                    aggregatedData = { ...aggregatedData, ...content };
                }
            }
        });

        // --- Post-Aggregation Processing (Dynamic Calculations) ---
        
        if (aggregatedData.careerStartDate) {
            const start = new Date(aggregatedData.careerStartDate);
            const now = new Date();
            
            let years = now.getFullYear() - start.getFullYear();
            let months = now.getMonth() - start.getMonth();
            
            if (months < 0) {
                years--;
                months += 12;
            }

            const expString = `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
            
            // Deep Recursive String Replacement for {{EXPERIENCE}}
            const replacePlaceholders = (obj) => {
                if (typeof obj === 'string') {
                    return obj.replace(/{{EXPERIENCE}}/g, expString);
                }
                if (Array.isArray(obj)) {
                    return obj.map(replacePlaceholders);
                }
                if (obj !== null && typeof obj === 'object') {
                    const newObj = {};
                    for (const key in obj) {
                        newObj[key] = replacePlaceholders(obj[key]);
                    }
                    return newObj;
                }
                return obj;
            };

            aggregatedData = replacePlaceholders(aggregatedData);
        }

        return aggregatedData;
    } catch (err) {
        console.error("Atomic Data Aggregation Error:", err.message);
        return null;
    }
};

/**
 * Persistence Logic for system stats (Visitors/Maintenance) when DB is down.
 */
// Define path for local stats JSON file
const statsFile = path.join(__dirname, '../stats.json');

// Define function to read local stats
const getLocalStats = () => {
    try {
        // If the stats file exists, read and parse it
        if (fs.existsSync(statsFile)) {
            return JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
        }
    // Ignore errors quietly
    } catch (e) {}
    // If no file exists or an error occurs, return a default object with 0 visitors
    return { visitors: 0, maintenanceMode: false };
};

// Define function to save stats to local file
const saveLocalStats = (stats) => {
    try {
        // Write the stats object to the stats.json file
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    // Ignore errors quietly
    } catch (e) {}
};

/**
 * [getProfile]
 * @desc    Retrieves the complete portfolio profile. 
 *          Prioritizes Local JSON for zero-latency development.
 * @route   GET /api/profile
 */
// Export getProfile controller function
exports.getProfile = asyncHandler(async (req, res, next) => {
    // Check if a valid cache exists before performing expensive I/O
    const now = Date.now();
    if (cachedProfile && (now - lastCacheUpdate < CACHE_TTL)) {
        return res.status(200).json(cachedProfile);
    }

    // Initialize profile variable to null
    let profile = null;

    // Phase 1: Try Local Storage (High Speed fallback)
    profile = getLocalData();

    // Phase 2: If Local fails, Fallback to MongoDB (High Durability)
    if (!profile && mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            // Find the single profile document and convert it to a lean JavaScript object
            profile = await Profile.findOne().lean();
        // Catch DB query errors
        } catch (error) {
            console.error("MongoDB Query Error:", error.message);
        }
    }

    // Safety check: If no data found in either source, return a 404 error
    if (!profile) {
        return res.status(404).json({ success: false, message: "Portfolio data not found." });
    }

    // Fetch site orchestration stats (mainly to check if maintenance mode is enabled)
    // Use MongoDB if connected, otherwise use the local stats backup
    const stats = mongoose.connection.readyState === 1 ? await Stats.findOne() : getLocalStats();

    // Construct the response payload
    const responsePayload = {
        // Spread all properties from the normalized profile
        ...normalizeProfile(profile),
        // Append the maintenanceMode flag (default to false if missing)
        maintenanceMode: stats?.maintenanceMode || false
    };

    // Update the in-memory cache
    cachedProfile = responsePayload;
    lastCacheUpdate = now;

    // Send a 200 OK response with the fully sanitized/normalized profile data
    res.status(200).json(responsePayload);
});


/**
 * [getVisitors]
 * @desc    Get visitor statistics and optionally increment the counter.
 * @route   GET /api/visitors?inc=true
 */
exports.getVisitors = asyncHandler(async (req, res, next) => {
    const shouldIncrement = req.query.inc === 'true';
    const today = new Date().toISOString().split('T')[0];
    
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
        res.status(200).json({ success: true, count: 0 });
    }
});

/**
 * [getFragment]
 * @desc    Retrieves a specific data fragment (e.g., skills, experience).
 * @route   GET /api/fragments/:type
 */
exports.getFragment = asyncHandler(async (req, res, next) => {
    const { type } = req.params;
    const dataDir = path.join(__dirname, '../data');
    const filePath = path.join(dataDir, `${type}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: `Fragment '${type}' not found.` });
    }

    let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Global Pre-processing: Dynamic Calculations
    const basicPath = path.join(dataDir, 'basic_info.json');
    const basic = fs.existsSync(basicPath) ? JSON.parse(fs.readFileSync(basicPath, 'utf-8')) : {};
    
    // 1. Calculate Experience Duration
    let expString = "";
    if (basic.careerStartDate) {
        const start = new Date(basic.careerStartDate);
        const now = new Date();
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        if (months < 0) { years--; months += 12; }
        expString = `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
    }

    // 2. Recursive Replacement Logic
    const replaceValues = (obj) => {
        if (typeof obj === 'string') {
            return obj
                .replace(/{{EXPERIENCE}}/g, expString)
                .replace(/{{NAME}}/g, basic.name || '')
                .replace(/{{VERSION}}/g, basic.systemVersion || 'v4.0');
        }
        if (Array.isArray(obj)) return obj.map(replaceValues);
        if (obj !== null && typeof obj === 'object') {
            const n = {}; 
            for (const k in obj) n[k] = replaceValues(obj[k]); 
            return n;
        }
        return obj;
    };

    const processedData = replaceValues(data);

    res.status(200).json({
        success: true,
        payload: processedData
    });
});


