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

const router = express.Router();

// All profile routes require authentication
router.use(auth);

// POST /api/profiles - Create new profile
router.post('/', 
    upload.array('photos', 10), // Allow up to 10 photo uploads
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

// GET /api/profiles/:id - Get profile by ID
router.get('/:id', 
    logActivity('READ'),
    getProfileById
);

// PUT /api/profiles/:id - Update profile
router.put('/:id', 
    upload.array('photos', 10),
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