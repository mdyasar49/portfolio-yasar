const Proposal = require('../models/Proposal');
const Profile = require('../models/Profile');
const { sendProposalAlert } = require('../services/emailService');

exports.submitProposal = async (req, res) => {
    try {
        const { suggestedData } = req.body;
        
        let proposalId = 'SIMULATED_' + Date.now();
        const mongoose = require('mongoose');

        if (mongoose.connection.readyState === 1) {
            const proposal = new Proposal({
                suggestedData,
                clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            });
            await proposal.save();
            proposalId = proposal._id;
        } else {
            console.log(`📡 [PORTABLE_DISPATCH_PROTOCOL]: System is operating without active database. Dispatching to Telemetry.`);
        }

        // TRIGGER_LIVE_EMAIL_DISPATCH
        await sendProposalAlert(proposalId);
        
        console.log(`[SYSTEM_TELEMETRY] NEW_PROPOSAL_DISPATCHED: ${proposalId}`);

        console.log(`[SECURITY] APPROVE_LINK: ${process.env.CLIENT_URL}/admin/approve/${proposalId}`);

        res.status(201).json({ 
            success: true, 
            message: 'ARCHITECTURAL_PROPOSAL_DISPATCHED. Awaiting administrative approval.',
            proposalId: proposalId 
        });

    } catch (error) {
        console.error('❌ [PROPOSAL_SYSTEM_ERROR]:', error);
        res.status(500).json({ success: false, message: 'PROPOSAL_DISPATCH_FAILURE', error: error.message });
    }
};


exports.getProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);
        if (!proposal) return res.status(404).json({ success: false, message: 'PROPOSAL_NOT_FOUND' });
        res.json({ success: true, data: proposal });
    } catch (error) {
        res.status(500).json({ success: false, message: 'SERVER_ERROR', error: error.message });
    }
};

exports.approveProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);
        if (!proposal) return res.status(404).json({ success: false, message: 'PROPOSAL_NOT_FOUND' });

        if (proposal.status === 'approved') {
            return res.status(400).json({ success: false, message: 'PROPOSAL_ALREADY_APPROVED' });
        }

        // ATOMIC_PROFILE_SYNCHRONIZATION
        const profile = await Profile.findOne();
        if (!profile) return res.status(404).json({ success: false, message: 'PROFILE_NOT_FOUND' });

        // Update profile with suggested data
        Object.assign(profile, proposal.suggestedData);
        await profile.save();

        proposal.status = 'approved';
        await proposal.save();

        res.json({ success: true, message: 'ARCHITECTURAL_BLUEPRINT_SYNCHRONIZED_SUCCESSFULLY' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'APPROVAL_FAILURE', error: error.message });
    }
};

exports.rejectProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);
        if (!proposal) return res.status(404).json({ success: false, message: 'PROPOSAL_NOT_FOUND' });

        proposal.status = 'rejected';
        await proposal.save();

        res.json({ success: true, message: 'ARCHITECTURAL_PROPOSAL_REJECTED' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'REJECTION_FAILURE', error: error.message });
    }
};

