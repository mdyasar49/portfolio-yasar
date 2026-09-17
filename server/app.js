/**
 * Main application core.
 * Sets up express, security middleware, and routes.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const responseWrapper = require('./middleware/responseWrapper');
const path = require('path');
const responseTime = require('response-time');
const portfolioRoutes = require('./routes/portfolioRoutes');
const portfolioController = require('./controllers/portfolioController');
const requestLogger = require('./middleware/logger');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorMiddleware');
const { createCorsOptions } = require('./config/cors');

const app = express();

// Trust reverse proxy (Render, Cloudflare, etc.) to accurately determine client IP
app.set('trust proxy', 1);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Online', timestamp: new Date() });
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Track response time

app.use(
  responseTime((req, res, time) => {
    if (req.path.startsWith('/api')) {
      logger.info(`${req.method} ${req.path} -> ${time.toFixed(3)}ms`);
    }
  }),
);

// Enable Gzip compression

app.use(compression());

// Setup CORS

const { allowedOrigins, corsOptions } = createCorsOptions();
logger.info(`🔐 [CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle pre-flight requests globally

// Security headers

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: [
          "'self'",
          'data:',
          'https://images.unsplash.com',
          'https://plus.unsplash.com',
          'https://i.ibb.co',
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: [
          "'self'",
          'https://mern-portfolio-yasar.onrender.com',
          'https://mern-portfolio-yasar-backend.onrender.com',
          'http://localhost:5001',
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    xFrameOptions: { action: 'sameorigin' }, // Allows internal iframes while preventing external hijacking
    hidePoweredBy: true, // Hides "X-Powered-By: Express" header
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
);

// Rate limiting and logging

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests from this IP.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

app.use(requestLogger);
app.use(responseWrapper);
app.use('/api', limiter);

app.use((req, res, next) => {
  if (req.method === 'POST') {
    logger.info(`Inbound POST: ${req.path}`);
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const accept = req.headers.accept || '';
  const contentType = req.headers['content-type'] || '';

  const isApiRequest = req.path.startsWith('/api');

  // Strict JSON check for POST requests
  if (req.method === 'POST' && isApiRequest && !contentType.includes('application/json')) {
    return res
      .status(415)
      .json({ success: false, message: 'Unsupported Media Type: application/json required.' });
  }

  const hasReferer = req.headers.referer;
  const isAjax = req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest';
  const hasOrigin = req.headers.origin;

  // Allow local development and cross-origin requests from validated origins
  const isLocal =
    req.headers.host?.includes('localhost') || req.headers.host?.includes('127.0.0.1');

  const isPostJson = req.method === 'POST' && contentType.includes('application/json');

  // Basic security check
  if (isApiRequest && !isLocal && !isAjax && !isPostJson && !hasOrigin) {
    logger.warn(`Access Denied: ${req.path}`);
    return res.status(403).send('Access Restricted');
  }
  next();
});

// Body parsers moved to top of stack in app.js

// Static assets
app.use(express.static(path.join(__dirname, '../client/public')));

// Main API Routes
app.use('/api', portfolioRoutes);

// JSON 404 Handler for undefined API paths
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found' });
});

// Final Error Handling Middleware
app.use(errorHandler);

// Production build delivery

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

module.exports = app;
