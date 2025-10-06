const Joi = require('joi');

const profileValidation = Joi.object({
    // Basic Details - Required fields
    name: Joi.string().min(2).max(200).required(),
    dob: Joi.date().max('now').required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    
    // Basic Details - Optional
    case: Joi.string().max(500).allow('', null),
    
    // Personal Information
    guardian: Joi.string().max(200).allow('', null),
    placeOfBirth: Joi.string().max(200).allow('', null),
    maritalStatus: Joi.string().max(100).allow('', null),
    phone: Joi.string().max(50).allow('', null),
    imeiNumbers: Joi.alternatives().try(
        Joi.array().items(Joi.string().max(50)),
        Joi.string()
    ).allow('', null),
    
    // Family Members
    father: Joi.string().max(200).allow('', null),
    mother: Joi.string().max(200).allow('', null),
    brothers: Joi.string().max(500).allow('', null),
    sisters: Joi.string().max(500).allow('', null),
    uncles: Joi.string().max(500).allow('', null),
    aunts: Joi.string().max(500).allow('', null),
    wives: Joi.string().max(500).allow('', null),
    children: Joi.alternatives().try(
        Joi.array().items(Joi.object({
            gender: Joi.string().allow('', null),
            name: Joi.string().allow('', null)
        })),
        Joi.string()
    ).allow('', null),
    closeFriends: Joi.string().max(1000).allow('', null),
    relativesWifeSide: Joi.string().max(1000).allow('', null),
    
    // Relatives & Associates
    relationsAbroad: Joi.string().max(1000).allow('', null),
    relationsIndia: Joi.string().max(1000).allow('', null),
    associatesAbroad: Joi.string().max(1000).allow('', null),
    relativesSecurity: Joi.string().max(1000).allow('', null),
    
    // Background & Address
    occupationBefore: Joi.string().max(500).allow('', null),
    presentAddress: Joi.string().max(1000).allow('', null),
    permanentAddress: Joi.string().max(1000).allow('', null),
    hideouts: Joi.string().max(2000).allow('', null),
    nationality: Joi.string().max(100).allow('', null),
    religion: Joi.string().max(200).allow('', null),
    bloodGroup: Joi.string().max(10).allow('', null),
    education: Joi.alternatives().try(
        Joi.array().items(Joi.object({
            level: Joi.string().allow('', null),
            school: Joi.string().allow('', null),
            year: Joi.string().allow('', null)
        })),
        Joi.string()
    ).allow('', null),
    expertise: Joi.string().max(1000).allow('', null),
    profession: Joi.string().max(1000).allow('', null),
    annualIncome: Joi.string().max(100).allow('', null),
    bankDetails: Joi.string().max(1000).allow('', null),
    
    // Identity Cards
    dl: Joi.string().max(200).allow('', null),
    pan: Joi.string().max(100).allow('', null),
    aadhar: Joi.string().max(100).allow('', null),
    passport: Joi.string().max(200).allow('', null),
    voter: Joi.string().max(200).allow('', null),
    ration: Joi.string().max(200).allow('', null),
    creditCard: Joi.string().max(200).allow('', null),
    
    // Social Media IDs
    email: Joi.string().email().max(200).allow('', null),
    whatsapp: Joi.string().max(50).allow('', null),
    facebook: Joi.string().max(200).allow('', null),
    instagram: Joi.string().max(200).allow('', null),
    telegram: Joi.string().max(200).allow('', null),
    upi: Joi.string().max(200).allow('', null),
    youtube: Joi.string().max(200).allow('', null),
    
    // Physical & Facial Description
    height: Joi.string().max(20).allow('', null),
    weight: Joi.string().max(20).allow('', null),
    bodyBuild: Joi.string().max(100).allow('', null),
    complexion: Joi.string().max(100).allow('', null),
    hair: Joi.string().max(200).allow('', null),
    eye: Joi.string().max(100).allow('', null),
    moustache: Joi.string().max(200).allow('', null),
    beard: Joi.string().max(200).allow('', null),
    
    // Other Details
    languagesKnown: Joi.string().max(1000).allow('', null),
    identificationMark: Joi.string().max(1000).allow('', null),
    dress: Joi.string().max(500).allow('', null),
    peculiarity: Joi.string().max(1000).allow('', null),
    handed: Joi.string().max(50).allow('', null),
    physicalPeculiarity: Joi.string().max(1000).allow('', null),
    speechStyle: Joi.string().max(500).allow('', null),
    mannerism: Joi.string().max(500).allow('', null),
    habits: Joi.string().max(1000).allow('', null),
    whereabouts: Joi.string().max(1000).allow('', null),
    illegalActivities: Joi.string().max(2000).allow('', null),
    activitiesType: Joi.string().max(1000).allow('', null),
    prevOrg: Joi.string().max(500).allow('', null),
    presentOrg: Joi.string().max(500).allow('', null),
    religiousActivities: Joi.string().max(1000).allow('', null),
    radicalizationPotential: Joi.string().max(1000).allow('', null),
    economicStatus: Joi.string().max(1000).allow('', null),
    mainFinancier: Joi.string().max(500).allow('', null),
    countriesVisited: Joi.string().max(1000).allow('', null),
    illegalCrossings: Joi.string().max(2000).allow('', null),
    guides: Joi.string().max(1000).allow('', null),
    properties: Joi.string().max(2000).allow('', null),
    vehicles: Joi.string().max(1000).allow('', null),
    hideoutPlace: Joi.string().max(1000).allow('', null),
    advocate: Joi.string().max(500).allow('', null),
    arrestDetails: Joi.string().max(2000).allow('', null),
    jailActivities: Joi.string().max(2000).allow('', null),
    associatesJail: Joi.string().max(1000).allow('', null),
    casesInvolved: Joi.string().max(100).allow('', null),
    securityProceedings: Joi.string().max(2000).allow('', null),
    prisonStatus: Joi.string().max(200).allow('', null),
    interrogatedBy: Joi.string().max(1000).allow('', null),
    houseGPS: Joi.string().max(500).allow('', null),
    workGPS: Joi.string().max(500).allow('', null),
    closeAssociates: Joi.alternatives().try(
        Joi.array().items(Joi.object({
            name: Joi.string().allow('', null),
            address: Joi.string().allow('', null),
            phone: Joi.string().allow('', null)
        })),
        Joi.string()
    ).allow('', null),
    video: Joi.string().max(500).allow('', null),
    verifiedBy: Joi.string().max(200).allow('', null),
    dateOfCreation: Joi.date().allow('', null),
    caseParticulars: Joi.string().max(5000).allow('', null),
    
    // Risk & Classification
    radicalizationLevel: Joi.string().valid('Low', 'Medium', 'High').allow('', null),
    threatCategory: Joi.string().valid('Recruiter', 'Financier', 'Attacker', 'Propagandist', 'Other').allow('', null),
    monitoringStatus: Joi.string().valid('Active Monitoring', 'Closed', 'Dormant').allow('', null),
    fileClassification: Joi.string().valid('Top Secret', 'Confidential', 'Restricted').allow('', null),
    
    // System fields
    photos: Joi.alternatives().try(
        Joi.object({
            front: Joi.string().allow('', null),
            back: Joi.string().allow('', null),
            side: Joi.string().allow('', null)
        }),
        Joi.string()
    ).allow('', null),
    tags: Joi.array().items(Joi.string().max(50)).max(20).allow(null)
}).options({ stripUnknown: false }); // Allow unknown fields to pass through

const validateProfile = (req, res, next) => {
    // Skip validation for multipart form data with files
    if (req.is('multipart/form-data')) {
        return next();
    }

    const { error, value } = profileValidation.validate(req.body, {
        abortEarly: false,
        stripUnknown: false // Don't strip unknown fields
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    req.validatedData = value;
    next();
};

const loginValidation = Joi.object({
    pin: Joi.string().length(4).pattern(/^[0-9]+$/).required()
});

const validateLogin = (req, res, next) => {
    const { error, value } = loginValidation.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid PIN format'
        });
    }

    req.validatedData = value;
    next();
};

module.exports = { validateProfile, validateLogin };