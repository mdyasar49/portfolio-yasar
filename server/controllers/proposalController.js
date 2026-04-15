const Proposal = require('../models/Proposal');
const Profile = require('../models/Profile');
const asyncHandler = require('../middleware/asyncHandler');
const { sendProposalAlert } = require('../services/emailService');
const fs = require('fs');
const path = require('path');

exports.submitProposal = asyncHandler(async (req, res) => {
    const { suggestedData } = req.body;
    
    if (!suggestedData) {
        return res.status(400).json({ success: false, message: 'ARCHITECTURAL_DATA_REQUIRED' });
    }

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
    // We don't await this to keep the API response ultra-fast, 
    // but the service internally handles errors.
    sendProposalAlert(proposalId).catch(err => console.error('LATENT_EMAIL_ERROR:', err));
    
    console.log(`[SYSTEM_TELEMETRY] NEW_PROPOSAL_DISPATCHED: ${proposalId}`);

    res.status(201).json({ 
        success: true, 
        message: 'ARCHITECTURAL_PROPOSAL_DISPATCHED. Awaiting administrative approval.',
        proposalId: proposalId 
    });
});


exports.getProposal = asyncHandler(async (req, res) => {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'PROPOSAL_NOT_FOUND' });
    res.json({ success: true, data: proposal });
});

exports.approveProposal = asyncHandler(async (req, res) => {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'PROPOSAL_NOT_FOUND' });

    if (proposal.status === 'approved') {
        return res.status(400).json({ success: false, message: 'PROPOSAL_ALREADY_APPROVED' });
    }

    // ATOMIC_PROFILE_SYNCHRONIZATION
    // 1. Update MongoDB if connected
    let profileData = null;
    const mongoose = require('mongoose');

    if (mongoose.connection.readyState === 1) {
        const profile = await Profile.findOne();
        if (profile) {
            Object.assign(profile, proposal.suggestedData);
            await profile.save();
            profileData = profile.toObject();
        }
    }

    // 2. Always synchronize with Local JSON (Master Failover)
    try {
        const dataPath = path.join(__dirname, '../data.json');
        const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const updatedData = { ...currentData, ...proposal.suggestedData };
        fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
        console.log("💾 [Proposal] Local JSON synchronized with approved blueprint.");
    } catch (err) {
        console.error("LOCAL_SYNC_ERROR_DURING_APPROVAL:", err.message);
    }

    proposal.status = 'approved';
    await proposal.save();

    res.json({ success: true, message: 'ARCHITECTURAL_BLUEPRINT_SYNCHRONIZED_SUCCESSFULLY' });
});

exports.rejectProposal = asyncHandler(async (req, res) => {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'PROPOSAL_NOT_FOUND' });

    proposal.status = 'rejected';
    await proposal.save();

    res.json({ success: true, message: 'ARCHITECTURAL_PROPOSAL_REJECTED' });
});

