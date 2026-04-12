/**
 * Environment Variable Validator
 * Ensures all required environment variables are present and valid
 */
const validateEnv = () => {
    const required = ['MONGO_URI', 'PORT', 'CLIENT_URL'];
    const missing = [];

    required.forEach(variable => {
        if (!process.env[variable]) {
            missing.push(variable);
        }
    });

    if (missing.length > 0) {
        console.error(`\n❌ [ENV ERROR] Missing required environment variables: ${missing.join(', ')}`);
        console.error(`Please check your .env file and ensure these are defined.\n`);
        process.exit(1);
    }

    // Validate MONGO_URI format
    if (!process.env.MONGO_URI.startsWith('mongodb')) {
        console.error(`\n⚠️  [ENV WARNING] MONGO_URI does not look like a valid MongoDB connection string.\n`);
    }

    console.log(`✅ [ENV] Environment variables validated.`);
};

module.exports = validateEnv;
