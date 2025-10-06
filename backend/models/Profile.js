const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const profileSchema = new mongoose.Schema({
    // Basic Details
    name: { type: String, required: true, trim: true }, // Name @ Alias Name (Age)
    case: { type: String, trim: true }, // Case
    photos: { 
        front: { type: String }, 
        back: { type: String }, 
        side: { type: String } 
    }, // Photograph (Front/Back/Side)

    // Personal Information
    guardian: { type: String, trim: true }, // Guardian's Name & details
    placeOfBirth: { type: String, trim: true }, // Place of Birth
    dob: { type: Date, required: true }, // Date of Birth
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, // Gender
    maritalStatus: { type: String, trim: true }, // Marital status
    phone: { type: String, trim: true }, // Phone Number
    imeiNumbers: [{ type: String }], // IMEI No

    // Family Members
    father: { type: String, trim: true }, // Father
    mother: { type: String, trim: true }, // Mother
    brothers: { type: String, trim: true }, // Brother(s)
    sisters: { type: String, trim: true }, // Sister(s)
    uncles: { type: String, trim: true }, // Uncle(s)
    aunts: { type: String, trim: true }, // Aunt(s)
    wives: { type: String, trim: true }, // Wife/Wives
    children: [{ 
        gender: { type: String }, 
        name: { type: String } 
    }], // Children (Son/Daughter)
    closeFriends: { type: String, trim: true }, // Close friends
    relativesWifeSide: { type: String, trim: true }, // Relatives in wife side

    // Relatives & Associates
    relationsAbroad: { type: String, trim: true }, // Relations abroad
    relationsIndia: { type: String, trim: true }, // Relations in India
    associatesAbroad: { type: String, trim: true }, // Associates in Pakistan/Bangladesh/Myanmar/Nepal/Abroad
    relativesSecurity: { type: String, trim: true }, // Relatives in Security forces/Govt.

    // Background & Address
    occupationBefore: { type: String, trim: true }, // Occupation before joining Militancy
    presentAddress: { type: String, trim: true }, // Residential Address (Present)
    permanentAddress: { type: String, trim: true }, // Residential Address (Permanent)
    hideouts: { type: String, trim: true }, // Place of stay/hideout (last 10 years)
    nationality: { type: String, trim: true }, // Nationality
    religion: { type: String, trim: true }, // Religion & Sub-caste
    bloodGroup: { type: String, trim: true }, // Blood group
    education: [{ 
        level: { type: String }, 
        school: { type: String }, 
        year: { type: String } 
    }], // Educational qualification
    expertise: { type: String, trim: true }, // Expertise
    profession: { type: String, trim: true }, // Profession / Occupation/Address of work Telephone Number
    annualIncome: { type: String, trim: true }, // Annual Income
    bankDetails: { type: String, trim: true }, // Bank Name, Branch & Account details

    // Identity Cards
    dl: { type: String, trim: true }, // Driving License No. / Place of issue
    pan: { type: String, trim: true }, // PAN Number & Name details
    aadhar: { type: String, trim: true }, // Aadhar Number & Name details
    passport: { type: String, trim: true }, // Passport Number / Issued & Validity date
    voter: { type: String, trim: true }, // Voter ID Number & Name details
    ration: { type: String, trim: true }, // Ration Card details
    creditCard: { type: String, trim: true }, // Credit Card

    // Social Media IDs
    email: { type: String, trim: true }, // Email ID
    whatsapp: { type: String, trim: true }, // WhatsApp No.
    facebook: { type: String, trim: true }, // Facebook ID
    instagram: { type: String, trim: true }, // Instagram ID
    telegram: { type: String, trim: true }, // Telegram ID
    upi: { type: String, trim: true }, // UPI ID & Number
    youtube: { type: String, trim: true }, // Youtube

    // Physical & Facial Description
    height: { type: String, trim: true }, // Height (CM's)
    weight: { type: String, trim: true }, // Weight (KG's)
    bodyBuild: { type: String, trim: true }, // Body Build
    complexion: { type: String, trim: true }, // Colour Complexion
    hair: { type: String, trim: true }, // Hair Colour & length (CM's)
    eye: { type: String, trim: true }, // Eye Colour
    moustache: { type: String, trim: true }, // Moustache
    beard: { type: String, trim: true }, // Beard

    // Other Details
    languagesKnown: { type: String, trim: true }, // Languages Known (Read/Write/Speak)
    identificationMark: { type: String, trim: true }, // Identification Mark
    dress: { type: String, trim: true }, // Dress
    peculiarity: { type: String, trim: true }, // Any Specific features/signature mark/Peculiarity
    handed: { type: String, trim: true }, // Left handed /Right handed
    physicalPeculiarity: { type: String, trim: true }, // Specific Physical Peculiarities
    speechStyle: { type: String, trim: true }, // Style of Speech
    mannerism: { type: String, trim: true }, // Mannerism
    habits: { type: String, trim: true }, // Habits (Drinking/Smoking/Tobacco/etc..)
    whereabouts: { type: String, trim: true }, // Current where abouts
    illegalActivities: { type: String, trim: true }, // Illegal activities if any
    activitiesType: { type: String, trim: true }, // Type of activities / M.O
    prevOrg: { type: String, trim: true }, // Previous Organization Name & Post
    presentOrg: { type: String, trim: true }, // Present Organization Name & Post
    religiousActivities: { type: String, trim: true }, // Participation in religious activities
    radicalizationPotential: { type: String, trim: true }, // Whether potential to get radicalized / radicalize others?
    economicStatus: { type: String, trim: true }, // Economic status and source of funds
    mainFinancier: { type: String, trim: true }, // Main Financier(s)
    countriesVisited: { type: String, trim: true }, // Countries Visited, Period & Purpose
    illegalCrossings: { type: String, trim: true }, // Details of Illegal border crossings with routes adopted
    guides: { type: String, trim: true }, // Guides/intermediate places of stay used during such crossing
    properties: { type: String, trim: true }, // Properties details (Movable/Immovable)
    vehicles: { type: String, trim: true }, // Vehicle details with Reg.No
    hideoutPlace: { type: String, trim: true }, // Hide out Place
    advocate: { type: String, trim: true }, // Name of Advocate & Phone Number
    arrestDetails: { type: String, trim: true }, // Last/Previous/Recent arrest details
    jailActivities: { type: String, trim: true }, // Activities in jail
    associatesJail: { type: String, trim: true }, // Associates in jail
    casesInvolved: { type: String, trim: true }, // Total No. of Cases Involved
    securityProceedings: { type: String, trim: true }, // Security Proceedings details
    prisonStatus: { type: String, trim: true }, // Whether accused presently inside Prison or Out of prison?
    interrogatedBy: { type: String, trim: true }, // Previously Interrogated by which agencies?
    houseGPS: { type: String, trim: true }, // Photograph & GPS location of the House with remarks
    workGPS: { type: String, trim: true }, // Photograph & GPS location of the Workplace with remarks
    closeAssociates: [{ 
        name: { type: String }, 
        address: { type: String }, 
        phone: { type: String } 
    }], // Close Associates with Phone Number
    video: { type: String, trim: true }, // A Small video to be taken (3 min, certified by interrogator)
    verifiedBy: { type: String, trim: true }, // Verified by
    dateOfCreation: { type: Date }, // Date of Creation
    caseParticulars: { type: String, trim: true }, // Case Particulars and Stage of the Cases

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
    tags: [{ type: String }] // For search and categorization
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes for better search performance
profileSchema.index({ name: 'text', phone: 'text', email: 'text', aadhar: 'text', pan: 'text' });
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