const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const profileSchema = new mongoose.Schema({
    // Basic Details (Header)
    name: { type: String, required: true, trim: true },
    alias: { type: String, trim: true },
    case: { type: String, trim: true },
    photos: {
        front: { type: String },
        back: { type: String },
        side: { type: String }
    },

    // 1. Personal Information
    guardian: { type: String, trim: true },
    placeOfBirth: { type: String, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    maritalStatus: { type: String, trim: true },
    phone: { type: String, trim: true },
    imeiNumbers: [{ type: String }],

    // 9. Family Members
    family: {
        father: { type: String, trim: true },
        mother: { type: String, trim: true },
        brothers: { type: String, trim: true },
        sisters: { type: String, trim: true },
        uncles: { type: String, trim: true },
        aunts: { type: String, trim: true },
        wives: { type: String, trim: true },
        children: [{
            type: { type: String, enum: ['Son', 'Daughter'] },
            name: { type: String }
        }],
        closeFriends: { type: String, trim: true },
        relativesWifeSide: {
            fatherInLaw: { type: String, trim: true },
            motherInLaw: { type: String, trim: true },
            others: { type: String, trim: true }
        }
    },

    // 10-13. Relatives & Associates
    relationsAbroad: { type: String, trim: true },
    relationsIndia: { type: String, trim: true },
    associatesAbroad: { type: String, trim: true },
    relativesSecurity: { type: String, trim: true },

    // 14-15. Background & Address
    occupationBefore: { type: String, trim: true },
    address: {
        present: {
            doorNo: { type: String, trim: true },
            streetName: { type: String, trim: true },
            villageWard: { type: String, trim: true },
            district: { type: String, trim: true },
            statePinCode: { type: String, trim: true },
            policeStation: { type: String, trim: true }
        },
        permanent: {
            doorNo: { type: String, trim: true },
            streetName: { type: String, trim: true },
            villageWard: { type: String, trim: true },
            district: { type: String, trim: true },
            statePinCode: { type: String, trim: true },
            policeStation: { type: String, trim: true }
        }
    },

    // 16-20. Nationality, Religion, Education
    hideouts: { type: String, trim: true },
    nationality: { type: String, trim: true, default: 'Indian' },
    religion: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    education: [{
        level: { type: String },
        schoolCollege: { type: String },
        year: { type: String }
    }],

    // 22-25. Profession & Finance
    expertise: { type: String, trim: true },
    profession: { type: String, trim: true },
    annualIncome: { type: String, trim: true },
    bankDetails: {
        bankName: { type: String, trim: true },
        accountNo: { type: String, trim: true },
        ifscCode: { type: String, trim: true },
        branch: { type: String, trim: true }
    },

    // 26. Identity Cards
    identityCards: {
        drivingLicense: { type: String, trim: true },
        pan: { type: String, trim: true },
        aadhar: { type: String, trim: true },
        passport: { type: String, trim: true },
        voterId: { type: String, trim: true },
        rationCard: { type: String, trim: true },
        creditCard: { type: String, trim: true }
    },

    // 27. Social Media IDs
    socialMedia: {
        email: { type: String, trim: true },
        whatsapp: { type: String, trim: true },
        facebook: { type: String, trim: true },
        instagram: { type: String, trim: true },
        telegram: { type: String, trim: true },
        upi: { type: String, trim: true },
        youtube: { type: String, trim: true }
    },

    // 28. Physical & Facial Description
    physicalDescription: {
        height: { type: String, trim: true },
        weight: { type: String, trim: true },
        bodyBuild: { type: String, trim: true },
        complexion: { type: String, trim: true },
        hairColor: { type: String, trim: true },
        eyeColor: { type: String, trim: true },
        moustache: { type: String, trim: true },
        beard: { type: String, trim: true }
    },

    // 29. Languages Known
    languages: [{
        language: { type: String },
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        speak: { type: Boolean, default: false }
    }],

    // 30-37. Identification & Behavior
    identificationMark: { type: String, trim: true },
    dress: { type: String, trim: true },
    specificFeatures: { type: String, trim: true },
    handed: { type: String, trim: true, enum: ['Left handed', 'Right handed', 'Ambidextrous'] },
    physicalPeculiarities: { type: String, trim: true },
    speechStyle: { type: String, trim: true },
    mannerism: { type: String, trim: true },
    habits: { type: String, trim: true },

    // 38-46. Activities & Organization
    whereabouts: { type: String, trim: true },
    illegalActivities: { type: String, trim: true },
    activitiesType: { type: String, trim: true },
    prevOrganization: { type: String, trim: true },
    presentOrganization: { type: String, trim: true },
    religiousActivities: { type: String, trim: true },
    radicalizationPotential: { type: String, trim: true },
    economicStatus: { type: String, trim: true },
    mainFinancier: { type: String, trim: true },

    // 47-49. Travel & Crossings
    countriesVisited: { type: String, trim: true },
    illegalCrossings: { type: String, trim: true },
    guides: { type: String, trim: true },

    // 50-51. Properties
    properties: {
        movable: { type: String, trim: true },
        immovable: { type: String, trim: true },
        vehicles: { type: String, trim: true }
    },
    hideoutPlace: { type: String, trim: true },

    // 52-53. Legal
    fingerPrintAttached: { type: String, trim: true },
    advocate: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true }
    },

    // 54-55. Arrest Details
    arrestDetails: {
        policeStation: { type: String, trim: true },
        crimeNoAndSec: { type: String, trim: true },
        datePlace: { type: String, trim: true },
        arrestedBy: { type: String, trim: true },
        bailOrder: { type: String, trim: true },
        coAccused: { type: String, trim: true },
        recoveries: { type: String, trim: true },
        category: { type: String, trim: true }
    },

    // 56-62. Jail & Interrogation
    jailActivities: { type: String, trim: true },
    associatesJail: { type: String, trim: true },
    casesInvolved: {
        ui: { type: String, trim: true },
        pt: { type: String, trim: true },
        conviction: { type: String, trim: true },
        acquittal: { type: String, trim: true }
    },
    securityProceedings: { type: String, trim: true },
    prisonStatus: { type: String, trim: true },
    interrogatedBy: { type: String, trim: true },

    // 62-63. GPS & Photos
    houseGPS: {
        photo: { type: String },
        gpsLocation: { type: String, trim: true },
        remarks: { type: String, trim: true }
    },
    workplaceGPS: {
        photo: { type: String },
        gpsLocation: { type: String, trim: true },
        remarks: { type: String, trim: true }
    },

    // 64. Close Associates
    closeAssociates: [{
        name: { type: String },
        address: { type: String },
        phone: { type: String }
    }],

    // 65-67. Verification
    video: { type: String, trim: true },
    verifiedBy: { type: String, trim: true },
    dateOfCreation: { type: Date },

    // 65. Case Particulars
    caseParticulars: [{
        district: { type: String },
        policeStation: { type: String },
        crimeNo: { type: String },
        section: { type: String },
        investigationAgency: { type: String },
        courtName: { type: String },
        caseNo: { type: String },
        caseStatus: { type: String },
        remarks: { type: String }
    }],

    // Risk & Classification (calculated/assigned fields)
    radicalizationLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    threatCategory: { type: String, enum: ['Recruiter', 'Financier', 'Attacker', 'Propagandist', 'Other'] },
    monitoringStatus: { type: String, enum: ['Active Monitoring', 'Closed', 'Dormant'], default: 'Active Monitoring' },
    fileClassification: { type: String, enum: ['Top Secret', 'Confidential', 'Restricted'], default: 'Restricted' },

    // System fields
    profileId: { type: String, unique: true },
    createdBy: { type: String, default: 'system' },
    lastUpdatedBy: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],

    // AI Network Analysis (NEW)
    suspicionScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        index: true
    },
    isSuspicious: {
        type: Boolean,
        default: false,
        index: true
    },
    linkageCount: {
        type: Number,
        default: 0
    },
    lastAnalyzed: {
        type: Date
    },
    suspicionReasons: [{
        type: String
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes for better search performance
profileSchema.index({ name: 'text', 'socialMedia.email': 'text', 'identityCards.aadhar': 'text', 'identityCards.pan': 'text' });
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

// Calculate age from DOB
profileSchema.virtual('age').get(function() {
    if (!this.dob) return null;
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Virtual for profile summary
profileSchema.virtual('summary').get(function() {
    return {
        id: this.profileId,
        name: this.name,
        age: this.age,
        riskLevel: this.radicalizationLevel,
        status: this.monitoringStatus,
        classification: this.fileClassification
    };
});

// Add pagination plugin
profileSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Profile', profileSchema);