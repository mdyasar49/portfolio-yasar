/**
 * [Node.js & Express.js - Application Core]
 * Technologies: Node.js (Runtime), Express.js (Framework), CORS (Inter-origin policy), Helmet (Security), Compression (Gzip)
 * Purpose: This is the entry point for the backend logic. It initializes the Express application, 
 * configures middleware pipelines, and orchestrates the routing for API and static build delivery.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const responseWrapper = require('./middleware/responseWrapper');
const path = require('path');
const portfolioRoutes = require('./routes/portfolioRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorMiddleware');
const { createCorsOptions } = require('./config/cors');

const app = express();

/**
 * [LAYER 0] Performance Optimization
 * Enabling Gzip compression reduces the payload size of the JSON and static assets.
 */
app.use(compression());

/**
 * [LAYER 1] CORS (Cross-Origin Resource Sharing)
 * This layer validates if the incoming request origin is allowed based on the production security policy.
 */
const { allowedOrigins, corsOptions } = createCorsOptions();
console.log(`🔐 [CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle pre-flight requests globally

/**
 * [LAYER 2] Security Headers (Helmet)
 * Injects 15+ automated security headers (Content-Security-Policy, X-Frame-Options, etc.).
 */
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://plus.unsplash.com", "https://i.ibb.co"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "https://mern-portfolio-yasar-backend.onrender.com", "http://localhost:5001"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    xFrameOptions: { action: "deny" }, // Prevents Clickjacking
    hidePoweredBy: true, // Hides "X-Powered-By: Express" header
}));

/**
 * [LAYER 3] Protection & Telemetry
 * Implements rate limiting to prevent brute-force attacks and logs incoming traffic.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500, 
    message: { success: false, message: 'Too many requests from this IP.' }
});

app.use(logger); // Visualizes incoming traffic in the terminal
app.use(responseWrapper); // Standardizes the JSON output format
app.use('/api', limiter); // Applies general rate limiting to all API endpoints

/**
 * [LAYER 4] Direct Access Shield & Request Validation
 * Prevents direct browser access to the API and ensures strict JSON payloads.
 */
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const accept = req.headers.accept || '';
    const contentType = req.headers['content-type'] || '';

    const isApiRequest = req.path.startsWith('/api');
    
    // Strict JSON check for POST requests
    if (req.method === 'POST' && isApiRequest && !contentType.includes('application/json')) {
        return res.status(415).json({ success: false, message: 'Unsupported Media Type: application/json required.' });
    }

    const isApiDiagnostic = isApiRequest && accept.includes('application/json');
    
    // Logic: If user tries to visit /api/profile directly in a URL bar, show a custom 403 page
    if (req.method === 'GET' && isApiRequest && req.path !== '/api' && !origin && !referer && !isApiDiagnostic) {
        const returnUrl = allowedOrigins.find(o => o.includes('onrender.com')) || 'https://mern-portfolio-yasar-1.onrender.com';
        
        return res.status(403).send(`
            <div style="background:#010409; color:#ff3366; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
                <h1 style="font-size:3rem; margin-bottom:10px;">🚫 ACCESS_DENIED</h1>
                <p style="color:#64748b; font-size:1.2rem;">Direct API access via browser is restricted to maintain system integrity.</p>
                <a href="${returnUrl}" style="color:#33ccff; text-decoration:none; border:1px solid #33ccff; padding:12px 30px; border-radius:8px; margin-top:30px; font-weight:bold;">RETURN_TO_PORTFOLIO</a>
            </div>
        `);
    }
    next();
});

/**
 * [LAYER 5] Data Handlers
 * Configures the application to handle high-payload JSON sync (up to 50MB).
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Main API Routes
app.use('/api', portfolioRoutes);

// JSON 404 Handler for undefined API paths
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'API Endpoint not found' });
});

// Final Error Handling Middleware
app.use(errorHandler);

/**
 * [LAYER 6] Production File Delivery
 * In production mode, Express serves the compiled React build and handles SPA routing.
 */
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../client/build');
    app.use(express.static(buildPath));

    // Wildcard route to deliver index.html (SPA support)
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(buildPath, 'index.html'));
        } else {
            res.status(404).json({ success: false, message: 'API Endpoint not found' });
        }
    });
}

// Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'Online', timestamp: new Date() });
});

module.exports = app;
