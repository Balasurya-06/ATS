const express = require('express');
const { 
    createProfile, 
    getProfiles, 
    getProfileById, 
    updateProfile, 
    deleteProfile, 
    searchProfiles 
} = require('../controllers/profileController');
const { auth, logActivity } = require('../middleware/auth');
const { validateProfile } = require('../middleware/validation');
const upload = require('../middleware/upload');
const { generateDossierPDF } = require('../utils/pdfGenerator');
const Profile = require('../models/Profile');

const router = express.Router();

// Optional auth middleware for profiles (works with or without token)
const optionalAuthMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Set default user with full access if no valid token
            req.user = { userId: 'system', clearanceLevel: 'Top Secret' };
        }
    } else {
        // Set default user with full access if no token provided
        req.user = { userId: 'system', clearanceLevel: 'Top Secret' };
    }
    
    next();
};

// All profile routes use optional authentication
router.use(optionalAuthMiddleware);

// POST /api/profiles - Create new profile
router.post('/', 
    upload.fields([
        { name: 'front', maxCount: 1 },
        { name: 'back', maxCount: 1 },
        { name: 'side', maxCount: 1 },
        { name: 'photos', maxCount: 10 }
    ]),
    validateProfile,
    logActivity('CREATE'),
    createProfile
);

// GET /api/profiles - Get all profiles with pagination
router.get('/', 
    logActivity('READ'),
    getProfiles
);

// GET /api/profiles/search - Search profiles
router.get('/search', 
    logActivity('SEARCH'),
    searchProfiles
);

// GET /api/profiles/:id/export-pdf - Export profile as PDF dossier
router.get('/:id/export-pdf', 
    logActivity('EXPORT'),
    async (req, res) => {
        try {
            const profile = await Profile.findById(req.params.id);
            if (!profile) {
                return res.status(404).json({ success: false, message: 'Profile not found' });
            }

            const pdfBuffer = await generateDossierPDF(profile);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${profile.name}_${profile.profileId}_Dossier.pdf"`);
            res.send(pdfBuffer);
        } catch (error) {
            console.error('PDF Export Error:', error);
            res.status(500).json({ success: false, message: 'Error generating PDF', error: error.message });
        }
    }
);

// GET /api/profiles/:id - Get profile by ID
router.get('/:id', 
    logActivity('READ'),
    getProfileById
);

// PUT /api/profiles/:id - Update profile
router.put('/:id', 
    upload.fields([
        { name: 'front', maxCount: 1 },
        { name: 'back', maxCount: 1 },
        { name: 'side', maxCount: 1 },
        { name: 'photos', maxCount: 10 }
    ]),
    validateProfile,
    logActivity('UPDATE'),
    updateProfile
);

// DELETE /api/profiles/:id - Delete profile (soft delete)
router.delete('/:id', 
    logActivity('DELETE'),
    deleteProfile
);

module.exports = router;