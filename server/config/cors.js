const normalizeOrigin = (value = '') => value.trim().replace(/\/+$/, '');

const splitOrigins = (value = '') =>
  value
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

const getAllowedOrigins = () => {
  const defaults = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
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

  // Optional safety fallback for Render preview/static domains.
  if (normalizedOrigin.endsWith('.onrender.com')) {
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
        if (isAllowedOrigin(origin, allowedOrigins)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS policy blocked access from origin ${origin}.`));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
