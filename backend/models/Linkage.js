const mongoose = require('mongoose');

/**
 * Linkage Model
 * Stores detected connections between criminal profiles
 */
const linkageSchema = new mongoose.Schema({
    profile1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        index: true
    },
    profile2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        index: true
    },
    connectionType: {
        type: String,
        enum: ['Location', 'Contact', 'Family', 'Associate', 'Identity', 'Activity', 'Property', 'Pattern'],
        required: true,
        index: true
    },
    matchedFields: [{
        field: { type: String },
        value1: { type: String },
        value2: { type: String },
        similarity: { type: Number, min: 0, max: 1 } // 0-1 similarity score
    }],
    strength: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
        index: true
    }, // Connection strength (0-100)
    suspicionScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
        index: true
    }, // How suspicious this linkage is
    details: {
        type: String
    }, // Human-readable explanation
    lastAnalyzed: {
        type: Date,
        default: Date.now,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate linkages
linkageSchema.index({ profile1: 1, profile2: 1 }, { unique: true });

// Index for quick lookups of all linkages for a profile
linkageSchema.index({ profile1: 1, isActive: 1 });
linkageSchema.index({ profile2: 1, isActive: 1 });

// Index for suspicious linkages
linkageSchema.index({ suspicionScore: -1, isActive: 1 });

// Ensure profile1 is always the smaller ID to prevent duplicates
linkageSchema.pre('save', function(next) {
    if (this.profile1.toString() > this.profile2.toString()) {
        [this.profile1, this.profile2] = [this.profile2, this.profile1];
    }
    next();
});

const Linkage = mongoose.model('Linkage', linkageSchema);

module.exports = Linkage;
