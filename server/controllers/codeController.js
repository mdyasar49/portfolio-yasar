/**
 * Language: JavaScript (Node.js)
 * Purpose of this file:
 * This controller handles the "Code Live" feature, which allows visitors or
 * admins to view the actual source code of the modules they are interacting with.
 * It maps module identifiers to their respective frontend and backend source files.
 */

const fs = require('fs');
const path = require('path');
const asyncHandler = require('../middleware/asyncHandler');

// Registry of modules and their source code locations
const moduleMapping = {
    'portfolio': {
        frontend: 'client/src/pages/Portfolio.js',
        backend: 'server/controllers/portfolioController.js'
    },
    'resume': {
        frontend: 'client/src/pages/Resume.js',
        backend: 'server/controllers/portfolioController.js'
    },
    'skills': {
        frontend: 'client/src/components/Skills.js',
        backend: 'server/controllers/portfolioController.js'
    },
    'projects': {
        frontend: 'client/src/components/Projects.js',
        backend: 'server/controllers/portfolioController.js'
    },

    'documentation': {
        frontend: 'client/src/pages/Documentation.js',
        backend: 'server/controllers/portfolioController.js'
    },
    'admin': {
        frontend: 'client/src/pages/AdminDashboard.js',
        backend: 'server/controllers/authController.js'
    },
    'contact': {
        frontend: 'client/src/components/Contact.js',
        backend: 'server/controllers/contactController.js'
    },
    'management': {
        frontend: 'client/src/pages/AdministrativeTerminal.js',
        backend: 'server/controllers/proposalController.js'
    }
};

/**
 * [getModuleCode]
 * @desc    Retrieves the raw source code for both frontend and backend of a module.
 * @route   GET /api/code
 */
exports.getModuleCode = asyncHandler(async (req, res) => {
    // Extract module name from query parameters
    const { moduleName } = req.query;

    // Check if the requested module is in our registry
    const mapping = moduleMapping[moduleName || 'portfolio'];

    if (!mapping) {
        return res.status(404).json({ success: false, message: 'MODULE_CODE_MAP_NOT_FOUND' });
    }

    try {
        // Resolve the root directory of the project
        const root = path.resolve(__dirname, '../../');

        // Read file contents from the file system
        // These files are annotated with technical comments added during the audit
        const frontendContent = fs.readFileSync(path.join(root, mapping.frontend), 'utf-8');
        const backendContent = fs.readFileSync(path.join(root, mapping.backend), 'utf-8');

        // Respond with the file paths and raw contents
        res.status(200).json({
            success: true,
            module: moduleName,
            frontend: {
                path: mapping.frontend,
                content: frontendContent
            },
            backend: {
                path: mapping.backend,
                content: backendContent
            }
        });
    } catch (err) {
        // Log error and return failure response
        console.error(`CODE_FETCH_FAILURE [${moduleName}]:`, err.message);
        res.status(500).json({ success: false, message: 'FAILED_TO_LOAD_SOURCE_STREAM' });
    }
});
