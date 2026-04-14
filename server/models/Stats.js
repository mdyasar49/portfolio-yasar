const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    visitors: {
        type: Number,
        default: 0
    },
    history: [{
        date: { type: String, required: true }, // YYYY-MM-DD
        count: { type: Number, default: 0 }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Stats', statsSchema);
