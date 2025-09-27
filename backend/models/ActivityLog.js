const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'SEARCH', 'EXPORT']
    },
    userId: { type: String, required: true },
    targetId: { type: String }, // Profile ID or other resource ID
    targetType: { type: String, default: 'Profile' },
    details: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    sessionId: { type: String },
    success: { type: Boolean, default: true },
    errorMessage: { type: String }
}, {
    timestamps: true
});

// Index for efficient querying
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ targetId: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);