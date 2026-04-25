/**
 * Language: JavaScript (Node.js)
 * Purpose of this file:
 * This file is a backend service module responsible for handling automated email dispatch.
 * It uses the 'nodemailer' library to connect to a Gmail account and send out email
 * notifications (specifically contact inquiries) to the administrator.
 */

// Import the nodemailer library which is used for sending emails in Node.js
const nodemailer = require('nodemailer');

/**
 * [sendEmail]
 * Function purpose: Dispatches a contact inquiry notification to the administrator
 * when a user submits a message from the frontend contact form.
 */
// Define the sendEmail function as an asynchronous function that takes contactData as a parameter
const sendEmail = async (contactData) => {
  // Create a transporter object which configures how nodemailer connects to the email server (Gmail)
  const transporter = nodemailer.createTransport({
    // Specify the email service provider
    service: 'gmail',
    // Provide authentication credentials
    auth: {
      // The sender's email address, securely loaded from environment variables
      user: process.env.EMAIL_USER,
      // The sender's app password, securely loaded from environment variables
      pass: process.env.EMAIL_PASS,
    },
  });

  // Extract name, email, subject, and message variables from the contactData object
  const { name, email, subject, message } = contactData;

  // Define the HTML structure and styling for the email body
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

  // Define the configuration options for this specific email dispatch
  const mailOptions = {
    // Set the sender's display name and actual email address
    from: `[PORTFOLIO_SYSTEM] <${process.env.EMAIL_USER}>`,
    // Set the recipient's email address (the admin)
    to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
    // Dynamically set the subject line of the email
    subject: `🌐 PORTFOLIO_MSG: ${name} presents a new opportunity`,
    // Set the actual HTML content of the email
    html: htmlTemplate,
  };

  // Asynchronously send the email using the transporter and return the resulting promise
  return transporter.sendMail(mailOptions);
};

// Export the sendEmail function so it can be imported and used in other files
module.exports = { sendEmail };
