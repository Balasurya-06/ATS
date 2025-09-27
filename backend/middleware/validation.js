const Joi = require('joi');

const profileValidation = Joi.object({
    // Required fields
    fullName: Joi.string().min(2).max(100).required(),
    dob: Joi.date().max('now').required(),
    age: Joi.number().integer().min(1).max(120).required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    radicalizationLevel: Joi.string().valid('Low', 'Medium', 'High').required(),
    fileClassification: Joi.string().valid('Top Secret', 'Confidential', 'Restricted').required(),

    // Optional fields
    physicalDesc: Joi.string().max(1000).allow(''),
    nationality: Joi.string().max(100).allow(''),
    govtIds: Joi.string().max(500).allow(''),
    currentAddress: Joi.string().max(500).allow(''),
    permanentAddress: Joi.string().max(500).allow(''),
    pastAddresses: Joi.string().max(1000).allow(''),
    safeHouses: Joi.string().max(1000).allow(''),
    contacts: Joi.string().max(1000).allow(''),
    firNumbers: Joi.string().max(500).allow(''),
    arrestHistory: Joi.string().max(2000).allow(''),
    bailStatus: Joi.string().max(200).allow(''),
    courtStatus: Joi.string().max(1000).allow(''),
    caseCodes: Joi.string().max(500).allow(''),
    knownAssociates: Joi.string().max(1000).allow(''),
    orgLinks: Joi.string().max(1000).allow(''),
    foreignLinks: Joi.string().max(1000).allow(''),
    familyInterest: Joi.string().max(1000).allow(''),
    recruitmentRole: Joi.string().max(1000).allow(''),
    financingChannels: Joi.string().max(1000).allow(''),
    procurementMethods: Joi.string().max(1000).allow(''),
    communicationPatterns: Joi.string().max(1000).allow(''),
    pastAttacks: Joi.string().max(2000).allow(''),
    socialMedia: Joi.string().max(1000).allow(''),
    messagingIDs: Joi.string().max(500).allow(''),
    emailCloud: Joi.string().max(500).allow(''),
    deviceIMEI: Joi.string().max(500).allow(''),
    onlineHandles: Joi.string().max(500).allow(''),
    travelHistory: Joi.string().max(1000).allow(''),
    borderCrossings: Joi.string().max(1000).allow(''),
    knownRoutes: Joi.string().max(1000).allow(''),
    vehicleDetails: Joi.string().max(500).allow(''),
    bankAccounts: Joi.string().max(1000).allow(''),
    upiWallets: Joi.string().max(500).allow(''),
    hawalaChannels: Joi.string().max(1000).allow(''),
    seizedAssets: Joi.string().max(1000).allow(''),
    fundingSources: Joi.string().max(1000).allow(''),
    threatCategory: Joi.string().valid('Recruiter', 'Financier', 'Attacker', 'Propagandist', 'Other').allow(''),
    intelligenceInputs: Joi.string().max(2000).allow(''),
    potentialTargets: Joi.string().max(1000).allow(''),
    weaponsSeized: Joi.string().max(1000).allow(''),
    electronicDevices: Joi.string().max(1000).allow(''),
    documents: Joi.string().max(1000).allow(''),
    forensicReports: Joi.string().max(2000).allow(''),
    surveillanceLogs: Joi.string().max(2000).allow(''),
    monitoringStatus: Joi.string().valid('Active Monitoring', 'Closed', 'Dormant').allow(''),
    informantReports: Joi.string().max(2000).allow(''),
    intelRecords: Joi.string().max(2000).allow(''),
    leadOfficer: Joi.string().max(100).allow(''),
    fieldReports: Joi.string().max(2000).allow(''),
    crossAgencyInputs: Joi.string().max(2000).allow(''),
    statusUpdates: Joi.string().valid('Under Trial', 'Absconding', 'Convicted', 'Acquitted').allow(''),
    lastUpdatedBy: Joi.string().max(100).allow(''),
    accessLog: Joi.string().max(2000).allow(''),
    photos: Joi.array().items(Joi.string()).max(10),
    tags: Joi.array().items(Joi.string().max(50)).max(20)
});

const validateProfile = (req, res, next) => {
    const { error, value } = profileValidation.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
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