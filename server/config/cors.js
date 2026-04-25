const normalizeOrigin = (value = '') => value.trim().replace(/\/+$/, '');

const splitOrigins = (value = '') =>
  value
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

const getAllowedOrigins = () => {
  const defaults = [
    'http://localhost:2003',
    'http://127.0.0.1:2003',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://mern-portfolio-yasar-1.onrender.com'
  ];

  const fromEnv = [
    ...splitOrigins(process.env.CLIENT_URL || ''),
    ...splitOrigins(process.env.CLIENT_URLS || '')
  ];

  return [...new Set([...defaults, ...fromEnv].map(normalizeOrigin).filter(Boolean))];
};

const isAllowedOrigin = (origin, allowedOrigins) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  return false;
};

const createCorsOptions = () => {
  const allowedOrigins = getAllowedOrigins();

  return {
    allowedOrigins,
    corsOptions: {
      origin(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if the origin is in our whitelist
        if (!origin || isAllowedOrigin(origin, allowedOrigins)) {
          callback(null, true);
        } else {
          console.error(`🔴 [CORS_BLOCKED] Origin "${origin}" is not in whitelist:`, allowedOrigins);
          callback(new Error(`CORS policy blocked access from origin ${origin}.`));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      credentials: true,
      optionsSuccessStatus: 204
    }

  };
};

module.exports = {
  normalizeOrigin,
  getAllowedOrigins,
  createCorsOptions,
  isAllowedOrigin
};
