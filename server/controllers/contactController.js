const { sendEmail } = require('../services/mailService');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Submit contact form and send email
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContactForm = asyncHandler(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    // 1. Validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Please provide name, email, and message.'
        });
    }

    try {
        // 2. Dispatch Email
        await sendEmail({ name, email, subject, message });

        res.status(200).json({
            success: true,
            message: 'Your message has been dispatched successfully.'
        });
    } catch (error) {
        console.error('MAIL_DISPATCH_ERROR:', error);
        
        // Return 500 but keep error message clean for production
        res.status(500).json({
            success: false,
            error: 'System core was unable to dispatch the message. Please try again later.'
        });
    }
});
