const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const profileSchema = new mongoose.Schema({
    // Basic Identification
    fullName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    photos: [{ type: String }], // File paths
    physicalDesc: { type: String, trim: true },
    nationality: { type: String, trim: true },
    govtIds: { type: String, trim: true },

    // Contact & Address History
    currentAddress: { type: String, trim: true },
    permanentAddress: { type: String, trim: true },
    pastAddresses: { type: String, trim: true },
    safeHouses: { type: String, trim: true },
    contacts: { type: String, trim: true },

    // Criminal / Legal Background
    firNumbers: { type: String, trim: true },
    arrestHistory: { type: String, trim: true },
    bailStatus: { type: String, trim: true },
    courtStatus: { type: String, trim: true },
    caseCodes: { type: String, trim: true },

    // Affiliations & Networks
    knownAssociates: { type: String, trim: true },
    orgLinks: { type: String, trim: true },
    foreignLinks: { type: String, trim: true },
    familyInterest: { type: String, trim: true },

    // Activities & Operations
    recruitmentRole: { type: String, trim: true },
    financingChannels: { type: String, trim: true },
    procurementMethods: { type: String, trim: true },
    communicationPatterns: { type: String, trim: true },
    pastAttacks: { type: String, trim: true },

    // Digital & Technical Footprint
    socialMedia: { type: String, trim: true },
    messagingIDs: { type: String, trim: true },
    emailCloud: { type: String, trim: true },
    deviceIMEI: { type: String, trim: true },
    onlineHandles: { type: String, trim: true },

    // Travel & Movement
    travelHistory: { type: String, trim: true },
    borderCrossings: { type: String, trim: true },
    knownRoutes: { type: String, trim: true },
    vehicleDetails: { type: String, trim: true },

    // Financial Details
    bankAccounts: { type: String, trim: true },
    upiWallets: { type: String, trim: true },
    hawalaChannels: { type: String, trim: true },
    seizedAssets: { type: String, trim: true },
    fundingSources: { type: String, trim: true },

    // Risk & Threat Assessment
    radicalizationLevel: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
    threatCategory: { type: String, enum: ['Recruiter', 'Financier', 'Attacker', 'Propagandist', 'Other'] },
    intelligenceInputs: { type: String, trim: true },
    potentialTargets: { type: String, trim: true },

    // Evidence & Seizures
    weaponsSeized: { type: String, trim: true },
    electronicDevices: { type: String, trim: true },
    documents: { type: String, trim: true },
    forensicReports: { type: String, trim: true },

    // Surveillance & Monitoring
    surveillanceLogs: { type: String, trim: true },
    monitoringStatus: { type: String, enum: ['Active Monitoring', 'Closed', 'Dormant'] },
    informantReports: { type: String, trim: true },
    intelRecords: { type: String, trim: true },

    // Operational Notes
    leadOfficer: { type: String, trim: true },
    fieldReports: { type: String, trim: true },
    crossAgencyInputs: { type: String, trim: true },
    statusUpdates: { type: String, enum: ['Under Trial', 'Absconding', 'Convicted', 'Acquitted'] },

    // Classification & Access
    fileClassification: { type: String, required: true, enum: ['Top Secret', 'Confidential', 'Restricted'] },
    lastUpdatedBy: { type: String, trim: true },
    accessLog: { type: String, trim: true },

    // System fields
    profileId: { type: String, unique: true, required: true },
    createdBy: { type: String, default: 'system' },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }] // For search and categorization
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes for better search performance
profileSchema.index({ fullName: 'text', govtIds: 'text', contacts: 'text' });
// profileId unique index is created automatically
profileSchema.index({ radicalizationLevel: 1 });
profileSchema.index({ threatCategory: 1 });
profileSchema.index({ monitoringStatus: 1 });
profileSchema.index({ fileClassification: 1 });
profileSchema.index({ createdAt: -1 });

// Generate profile ID before saving
profileSchema.pre('save', async function(next) {
    if (!this.profileId) {
        const count = await this.constructor.countDocuments();
        this.profileId = `ACC-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Virtual for profile summary
profileSchema.virtual('summary').get(function() {
    return {
        id: this.profileId,
        name: this.fullName,
        age: this.age,
        riskLevel: this.radicalizationLevel,
        status: this.monitoringStatus,
        classification: this.fileClassification
    };
});

// Add pagination plugin
profileSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Profile', profileSchema);