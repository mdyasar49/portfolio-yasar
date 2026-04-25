/**
 * Language: JavaScript (Node.js)
 * Purpose of this file:
 * This file is a backend service module responsible for handling outgoing emails.
 * It uses the 'nodemailer' library to connect to a Gmail account and dispatch
 * automated email notifications (like system proposals and contact form messages)
 * to the administrator.
 */

// Import the nodemailer library which is used for sending emails in Node.js
const nodemailer = require('nodemailer');

// Create a reusable transporter object using the default SMTP transport
// This configures how nodemailer will connect to the email server (Gmail in this case)
const transporter = nodemailer.createTransport({
  // Specify the email service provider
  service: 'gmail',
  // Provide authentication credentials
  auth: {
    // The sender's email address, securely loaded from environment variables
    user: process.env.EMAIL_USER,
    // The sender's app password or regular password, securely loaded from environment variables
    pass: process.env.EMAIL_PASS,
  },
});

// [DIAGNOSTIC] Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.warn(
      '⚠️  [EMAIL_SERVICE] Configuration invalid or SMTP unreachable. Emails will not be sent.',
    );
  } else {
    console.log('✅ [EMAIL_SERVICE] Ready for secure dispatch.');
  }
});

/**
 * [SEND_PROPOSAL_DISPATCH]
 * Function purpose: Dispatches a high-fidelity architectural notification to the administrator
 * when a guest user submits a new proposal.
 */
// Export the sendProposalAlert function so it can be used in other files
exports.sendProposalAlert = async (proposalId) => {
  // Start a try-catch block to handle any potential errors during the email sending process
  try {
    // Construct the Secure Approval Link
    // Fetch the client URL from environment variables, splitting by comma in case multiple exist, and taking the first one
    const clientBase = (process.env.CLIENT_URL || '').split(',')[0];
    // Create the direct link that the admin can click to approve the proposal
    const approveLink = `${clientBase}/admin/management?tab=5&approve=${proposalId}`;
    // Create the direct link that the admin can click to reject the proposal
    const rejectLink = `${clientBase}/admin/management?tab=5&reject=${proposalId}`;

    // Define the configuration options for this specific email
    const mailOptions = {
      // Set the sender's display name and actual email address
      from: `"ARCHITECTURAL_LOGISTICS" <${process.env.EMAIL_USER}>`,
      // Set the recipient's email address (the admin's email)
      to: process.env.RECEIVER_EMAIL,
      // Set the subject line of the email
      subject: '🚨 NEW_ARCHITECTURAL_PROPOSAL_DISPATCHED',
      // Set the actual HTML content/body of the email
      html: `
                <div style="background:#0f172a; color:#f8fafc; padding:40px; font-family:'Inter', sans-serif; border:1px solid #334155; border-radius:12px; max-width:600px; margin:0 auto;">
                    <h2 style="color:#a78bfa; margin-bottom:20px; font-weight:600;">✨ New System Proposal</h2>
                    <p style="color:#94a3b8; line-height:1.6;">A visitor has submitted an architectural refinement for your portfolio system.</p>

                    <div style="background:rgba(139, 92, 246, 0.1); border:1px solid rgba(139, 92, 246, 0.2); padding:20px; border-radius:8px; margin:30px 0;">
                        <span style="color:#64748b; font-size:12px; display:block; margin-bottom:8px; text-transform:uppercase;">Proposal ID</span>
                        <code style="color:#f472b6; font-weight:bold; font-size:16px;">${proposalId}</code>
                    </div>

                    <div style="margin-top:30px;">
                        <a href="${approveLink}" style="display:inline-block; background:linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:6px; font-weight:bold; margin-right:10px; border:none;">Approve Changes</a>
                        <a href="${rejectLink}" style="display:inline-block; background:transparent; border:1px solid #ef4444; color:#ef4444; text-decoration:none; padding:12px 25px; border-radius:6px; font-weight:bold;">Reject Proposal</a>
                    </div>

                    <p style="margin-top:40px; font-size:12px; color:#475569; border-top:1px solid #1e293b; padding-top:20px;">This is an automated notification from your Portfolio System.</p>
                </div>
            `,
    };

    // Asynchronously send the email using the transporter and wait for the result
    const info = await transporter.sendMail(mailOptions);
    // Log a success message to the server console with the email's unique message ID
    console.log(`📧 [EMAIL_SERVICE] Proposal alert dispatched: ${info.messageId}`);
    // Return true to indicate the email was successfully sent
    return true;
    // Catch any errors that occur during the try block
  } catch (error) {
    // Log the error message to the server console for debugging
    console.error('❌ [EMAIL_SERVICE_FAILURE]:', error);
    // Return false to indicate the email sending failed
    return false;
  }
};

/**
 * [SEND_CONTACT_ALERT]
 * Function purpose: Dispatches a high-fidelity contact inquiry notification
 * when a user fills out the contact form on the frontend.
 */
// Export the sendContactAlert function so it can be called from route controllers
exports.sendContactAlert = async (contactData) => {
  // Start a try-catch block to handle email dispatch safely
  try {
    // Extract the name, email, subject, and message variables from the provided contactData object
    const { name, email, profession, subject, message } = contactData;

    // Define the configuration options for the contact email
    const mailOptions = {
      // Set the sender's display name and actual email address
      from: `"CONTACT_LOGISTICS" <${process.env.EMAIL_USER}>`,
      // Set the recipient's email address (the admin)
      to: process.env.RECEIVER_EMAIL,
      // Dynamically set the subject line including the user's name and their specific subject
      subject: `🌐 PORTFOLIO_INQUIRY: ${name} [${profession || 'PRO'}]`,
      // Set the HTML content/body containing the user's message
      html: `
                <div style="background:#020617; color:#f8fafc; padding:40px; font-family:'Segoe UI', Roboto, Helvetica, sans-serif; border:1px solid #1e293b; border-radius:16px; max-width:600px; margin:0 auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                    <!-- Header Section -->
                    <div style="border-bottom:1px solid #1e293b; padding-bottom:20px; margin-bottom:30px;">
                        <span style="color:#00ffcc; font-family:monospace; font-size:11px; letter-spacing:3px; text-transform:uppercase; display:block; margin-bottom:8px;">Incoming Transmission</span>
                        <h2 style="margin:0; color:#ffffff; font-size:24px; font-weight:800; letter-spacing:-0.5px;">Portfolio Inquiry Received</h2>
                    </div>

                    <!-- Metadata Grid -->
                    <div style="display:table; width:100%; margin-bottom:30px; background:rgba(255,255,255,0.03); border-radius:12px; padding:20px; border:1px solid rgba(255,255,255,0.05);">
                        <div style="display:table-row;">
                            <div style="display:table-cell; padding:10px; width:50%;">
                                <label style="color:#64748b; font-size:10px; text-transform:uppercase; display:block; margin-bottom:4px; letter-spacing:1px;">Sender Identity</label>
                                <strong style="color:#ffffff; font-size:14px;">${name}</strong>
                            </div>
                            <div style="display:table-cell; padding:10px;">
                                <label style="color:#64748b; font-size:10px; text-transform:uppercase; display:block; margin-bottom:4px; letter-spacing:1px;">Profession / Role</label>
                                <strong style="color:#00ffcc; font-size:14px;">${profession || 'Not Specified'}</strong>
                            </div>
                        </div>
                        <div style="display:table-row;">
                            <div style="display:table-cell; padding:10px; border-top:1px solid rgba(255,255,255,0.05);">
                                <label style="color:#64748b; font-size:10px; text-transform:uppercase; display:block; margin-bottom:4px; letter-spacing:1px;">Communication Path</label>
                                <a href="mailto:${email}" style="color:#33ccff; font-size:14px; text-decoration:none;">${email}</a>
                            </div>
                            <div style="display:table-cell; padding:10px; border-top:1px solid rgba(255,255,255,0.05);">
                                <label style="color:#64748b; font-size:10px; text-transform:uppercase; display:block; margin-bottom:4px; letter-spacing:1px;">Inquiry Subject</label>
                                <strong style="color:#f472b6; font-size:14px;">${subject || 'General Inquiry'}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Message Body -->
                    <div style="background:rgba(51, 204, 255, 0.05); border-left:3px solid #33ccff; padding:25px; border-radius:8px; margin-bottom:30px;">
                        <label style="color:#64748b; font-size:10px; text-transform:uppercase; display:block; margin-bottom:12px; letter-spacing:1px;">Message Content</label>
                        <div style="color:#e2e8f0; line-height:1.7; font-size:15px; white-space: pre-wrap;">${message}</div>
                    </div>

                    <!-- Footer -->
                    <div style="text-align:center; border-top:1px solid #1e293b; padding-top:25px; margin-top:40px;">
                        <p style="font-size:11px; color:#475569; margin:0; font-family:monospace;">
                            AUTOMATED_SYSTEM_NOTIFICATION // AUTHENTICATED_LOG_ID: ${Date.now()}
                        </p>
                        <p style="font-size:10px; color:#334155; margin-top:8px;">
                            This transmission was generated by the MERN Portfolio Engine. 
                        </p>
                    </div>
                </div>
            `,
    };

    // Asynchronously send the email using the transporter and wait for the result
    const info = await transporter.sendMail(mailOptions);
    // Log a success message to the server console with the email's unique message ID
    console.log(`📧 [EMAIL_SERVICE] Contact alert dispatched: ${info.messageId}`);
    // Return true to indicate the contact message was sent successfully
    return true;
    // Catch any errors that occur during the email dispatch process
  } catch (error) {
    // Log the error details to the server console for debugging purposes
    console.error('❌ [CONTACT_ALERT_FAILURE]:', error);
    // Return false to indicate that the email sending failed
    return false;
  }
};
