const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
    suggestedData: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    clientIp: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Proposals expire after 7 days
    }
});

module.exports = mongoose.model('Proposal', ProposalSchema);
