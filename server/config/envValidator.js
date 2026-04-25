/**
 * Environment Variable Validator
 * Validates environment variables at startup.
 * - MONGO_URI: Optional (server falls back to data.json if missing)
 * - PORT: Optional (defaults to 5001)
 * - CLIENT_URL: Optional (primary frontend origin)
 * - CLIENT_URLS: Optional (comma-separated extra origins)
 * - NODE_ENV: Optional (defaults to 'development')
 */
const validateEnv = () => {
  // These vars are optional — server has fallbacks for all of them
  const optional = ['MONGO_URI', 'PORT', 'CLIENT_URL', 'CLIENT_URLS', 'NODE_ENV'];
  const missing = [];

  optional.forEach((variable) => {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  });

  if (missing.length > 0) {
    console.warn(
      `\n⚠️  [ENV WARNING] The following optional environment variables are not set: ${missing.join(', ')}`,
    );
    console.warn(`   Server will use default fallback values for missing variables.\n`);
    // Do NOT call process.exit() — server can run with fallbacks
  }

  // Validate MONGO_URI format only if it is provided
  if (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith('mongodb')) {
    console.warn(
      `\n⚠️  [ENV WARNING] MONGO_URI does not look like a valid MongoDB connection string.\n`,
    );
  }

  console.log(`✅ [ENV] Environment check complete. Server is starting...`);
};

module.exports = validateEnv;
