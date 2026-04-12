/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for developer
    console.error(`[Error] ${err.name}: ${err.message}`);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(404).json({ success: false, error: message });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        return res.status(400).json({ success: false, error: message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ success: false, error: message });
    }

    // In Production: Hide detailed error messages for a [Premium/Clean] experience
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.status(error.statusCode || 500).json({
        success: false,
        error: isProduction ? 'An unexpected error occurred. Please try again later.' : (error.message || 'Server Error')
    });
};

module.exports = errorHandler;
