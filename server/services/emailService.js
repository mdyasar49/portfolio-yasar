const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * [SEND_PROPOSAL_DISPATCH]
 * Dispatches a high-fidelity architectural notification to the administrator.
 */
exports.sendProposalAlert = async (proposalId) => {
    try {
        // Construct the Secure Approval Link
        // Use the first valid URL from CLIENT_URL for the link
        const clientBase = (process.env.CLIENT_URL || '').split(',')[0];
        const approveLink = `${clientBase}/admin/management?tab=0&approve=${proposalId}`;
        const rejectLink = `${clientBase}/admin/management?tab=0&reject=${proposalId}`;

        const mailOptions = {
            from: `"ARCHITECTURAL_LOGISTICS" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: '🚨 NEW_ARCHITECTURAL_PROPOSAL_DISPATCHED',
            html: `
                <div style="background:#010409; color:#ffffff; padding:40px; font-family:sans-serif; border:1px solid #33ccff; border-radius:12px;">
                    <h2 style="color:#33ccff; font-family:monospace; margin-bottom:20px;">[NEW_SYSTEM_PROPOSAL]</h2>
                    <p style="color:#64748b; line-height:1.6;">A visitor has submitted an architectural refinement for your portfolio system.</p>
                    
                    <div style="background:rgba(51, 204, 255, 0.05); border:1px solid rgba(51, 204, 255, 0.2); padding:20px; border-radius:8px; margin:30px 0;">
                        <span style="color:#444; font-size:12px; display:block; margin-bottom:8px;">PROPOSAL_ID:</span>
                        <code style="color:#00ffcc; font-weight:bold;">${proposalId}</code>
                    </div>

                    <div style="margin-top:20px;">
                        <a href="${approveLink}" style="display:inline-block; background:#33ccff; color:#000; text-decoration:none; padding:12px 25px; border-radius:6px; font-weight:bold; font-family:sans-serif; margin-right:10px;">APPROVE_CHANGES</a>
                        <a href="${rejectLink}" style="display:inline-block; background:#ff3366; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:6px; font-weight:bold; font-family:sans-serif;">REJECT_PROPOSAL</a>
                    </div>
                    
                    <p style="margin-top:30px; font-size:12px; color:#444;">This is an automated system dispatch from your MERN Portfolio Architecture.</p>
                </div>
            `
        };


        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 [EMAIL_SERVICE] Proposal alert dispatched: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ [EMAIL_SERVICE_FAILURE]:', error);
        return false;
    }
};

/**
 * [SEND_CONTACT_ALERT]
 * Dispatches a high-fidelity contact inquiry notification.
 */
exports.sendContactAlert = async (contactData) => {
    try {
        const { name, email, subject, message } = contactData;
        const mailOptions = {
            from: `"CONTACT_LOGISTICS" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: `🌐 PORTFOLIO_INQUIRY: ${name} [${subject || 'No Subject'}]`,
            html: `
                <div style="background:#010409; color:#ffffff; padding:40px; font-family:sans-serif; border:1px solid #33ccff; border-radius:12px;">
                    <h2 style="color:#33ccff; font-family:monospace; margin-bottom:20px;">[NEW_CONTACT_INQUIRY]</h2>
                    
                    <div style="margin-bottom:20px;">
                        <label style="color:#444; font-size:10px; display:block; text-transform:uppercase;">Origin_Identity</label>
                        <strong style="color:#ffffff;">${name}</strong> (${email})
                    </div>

                    <div style="margin-bottom:20px;">
                        <label style="color:#444; font-size:10px; display:block; text-transform:uppercase;">Protocol_Subject</label>
                        <strong style="color:#33ccff;">${subject || 'General Inquiry'}</strong>
                    </div>

                    <div style="background:rgba(255,255,255,0.02); border-left:4px solid #33ccff; padding:20px; border-radius:4px; margin:20px 0;">
                        <label style="color:#444; font-size:10px; display:block; text-transform:uppercase; margin-bottom:10px;">Payload_Message</label>
                        <div style="color:#cbd5e1; line-height:1.6; font-size:14px; white-space: pre-wrap;">${message}</div>
                    </div>
                    
                    <p style="margin-top:30px; font-size:10px; color:#444;">This is an automated transmission from your portfolio's backend system.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 [EMAIL_SERVICE] Contact alert dispatched: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ [CONTACT_ALERT_FAILURE]:', error);
        return false;
    }
};

