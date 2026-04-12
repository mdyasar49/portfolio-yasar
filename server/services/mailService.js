/**
 * [Node.js Mail Service]
 * Handles automated email dispatch for contact inquiries using Nodemailer.
 */
const nodemailer = require('nodemailer');

const sendEmail = async (contactData) => {
    // 1. Create a Secure Transport Module
    // Use Gmail App Passwords or similar for production
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, subject, message } = contactData;

    // 2. High-Premium Technical HTML Template
    const htmlTemplate = `
        <div style="background-color: #010409; color: #ffffff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #33ccff; border-radius: 12px; max-width: 600px; margin: auto;">
            <div style="text-align: center; border-bottom: 1px solid rgba(51, 204, 255, 0.2); padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #33ccff; font-size: 24px; margin: 0; letter-spacing: 2px;">[ CONTACT_INQUIRY_RECEIVED ]</h1>
                <p style="color: #64748b; font-size: 12px; margin-top: 5px;">MERN PORTFOLIO CORE v4.0.5</p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <label style="color: #33ccff; font-weight: bold; font-size: 10px; text-transform: uppercase;">Sender Name</label>
                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; border-left: 3px solid #33ccff; margin-top: 5px;">${name}</div>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="color: #33ccff; font-weight: bold; font-size: 10px; text-transform: uppercase;">Origin Email</label>
                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; border-left: 3px solid #ff3366; margin-top: 5px;">${email}</div>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="color: #33ccff; font-weight: bold; font-size: 10px; text-transform: uppercase;">Subject Protocol</label>
                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; margin-top: 5px;">${subject || 'General Inquiry'}</div>
            </div>

            <div style="margin-bottom: 35px;">
                <label style="color: #33ccff; font-weight: bold; font-size: 10px; text-transform: uppercase;">Payload Content</label>
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 6px; border: 1px dashed rgba(51, 204, 255, 0.3); margin-top: 5px; line-height: 1.6; color: #cbd5e1;">${message}</div>
            </div>

            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.05); pt: 20px;">
                <p style="color: #444; font-size: 10px;">This is an automated transmission from your portfolio's backend system.</p>
            </div>
        </div>
    `;

    // 3. Dispatch Configuration
    const mailOptions = {
        from: `[PORTFOLIO_SYSTEM] <${process.env.EMAIL_USER}>`,
        to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
        subject: `🌐 PORTFOLIO_MSG: ${name} presents a new opportunity`,
        html: htmlTemplate
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
