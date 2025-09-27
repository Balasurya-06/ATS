const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    pin: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin', 'operator', 'viewer'] },
    fullName: { type: String, required: true },
    department: { type: String },
    clearanceLevel: { type: String, enum: ['Top Secret', 'Confidential', 'Restricted'], default: 'Restricted' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);