const Profile = require('../models/Profile');
const ActivityLog = require('../models/ActivityLog');

// Create new profile
const createProfile = async (req, res) => {
    try {
        const profileData = {
            ...req.validatedData,
            createdBy: req.user.userId,
            lastUpdatedBy: req.user.userId
        };

        // Handle file uploads if present
        if (req.files && req.files.length > 0) {
            profileData.photos = req.files.map(file => file.path);
        }

        const profile = new Profile(profileData);
        await profile.save();

        res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            data: {
                profile: profile.summary,
                profileId: profile.profileId
            }
        });
    } catch (error) {
        console.error('Create profile error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Profile with this ID already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all profiles with pagination and filtering
const getProfiles = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sort = '-createdAt',
            search,
            riskLevel,
            status,
            classification
        } = req.query;

        // Build query
        const query = { isActive: true };
        
        if (search) {
            query.$text = { $search: search };
        }
        
        if (riskLevel) {
            query.radicalizationLevel = riskLevel;
        }
        
        if (status) {
            query.monitoringStatus = status;
        }
        
        if (classification) {
            query.fileClassification = classification;
        }

        // Check user clearance level
        const userClearance = req.user.clearanceLevel;
        const clearanceHierarchy = {
            'Restricted': ['Restricted'],
            'Confidential': ['Restricted', 'Confidential'],
            'Top Secret': ['Restricted', 'Confidential', 'Top Secret']
        };
        
        query.fileClassification = { $in: clearanceHierarchy[userClearance] || ['Restricted'] };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort,
            select: 'profileId fullName age gender radicalizationLevel monitoringStatus fileClassification createdAt lastUpdatedBy'
        };

        const profiles = await Profile.paginate(query, options);

        res.json({
            success: true,
            data: {
                profiles: profiles.docs,
                pagination: {
                    current: profiles.page,
                    pages: profiles.totalPages,
                    total: profiles.totalDocs,
                    limit: profiles.limit
                }
            }
        });
    } catch (error) {
        console.error('Get profiles error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profiles'
        });
    }
};

// Get profile by ID
const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const profile = await Profile.findOne({
            $or: [{ _id: id }, { profileId: id }],
            isActive: true
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Check clearance level
        const userClearance = req.user.clearanceLevel;
        const clearanceHierarchy = {
            'Restricted': 1,
            'Confidential': 2,
            'Top Secret': 3
        };
        
        if (clearanceHierarchy[userClearance] < clearanceHierarchy[profile.fileClassification]) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient clearance level'
            });
        }

        res.json({
            success: true,
            data: { profile }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile'
        });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        const profile = await Profile.findOne({
            $or: [{ _id: id }, { profileId: id }],
            isActive: true
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Check clearance level
        const userClearance = req.user.clearanceLevel;
        const clearanceHierarchy = {
            'Restricted': 1,
            'Confidential': 2,
            'Top Secret': 3
        };
        
        if (clearanceHierarchy[userClearance] < clearanceHierarchy[profile.fileClassification]) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient clearance level'
            });
        }

        const updateData = {
            ...req.validatedData,
            lastUpdatedBy: req.user.userId
        };

        // Handle file uploads if present
        if (req.files && req.files.length > 0) {
            const newPhotos = req.files.map(file => file.path);
            updateData.photos = [...(profile.photos || []), ...newPhotos];
        }

        const updatedProfile = await Profile.findByIdAndUpdate(
            profile._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { profile: updatedProfile }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// Delete profile (soft delete)
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        const profile = await Profile.findOne({
            $or: [{ _id: id }, { profileId: id }],
            isActive: true
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Only Top Secret clearance can delete profiles
        if (req.user.clearanceLevel !== 'Top Secret') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient clearance level for deletion'
            });
        }

        await Profile.findByIdAndUpdate(profile._id, {
            isActive: false,
            lastUpdatedBy: req.user.userId
        });

        res.json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete profile'
        });
    }
};

// Search profiles
const searchProfiles = async (req, res) => {
    try {
        const { q, type = 'general' } = req.query;
        
        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters'
            });
        }

        let searchQuery = { isActive: true };
        
        // Check user clearance level
        const userClearance = req.user.clearanceLevel;
        const clearanceHierarchy = {
            'Restricted': ['Restricted'],
            'Confidential': ['Restricted', 'Confidential'],
            'Top Secret': ['Restricted', 'Confidential', 'Top Secret']
        };
        
        searchQuery.fileClassification = { $in: clearanceHierarchy[userClearance] || ['Restricted'] };

        switch (type) {
            case 'name':
                searchQuery.fullName = { $regex: q, $options: 'i' };
                break;
            case 'id':
                searchQuery.govtIds = { $regex: q, $options: 'i' };
                break;
            case 'contact':
                searchQuery.contacts = { $regex: q, $options: 'i' };
                break;
            default:
                searchQuery.$text = { $search: q };
                break;
        }

        const profiles = await Profile.find(searchQuery)
            .select('profileId fullName age gender radicalizationLevel monitoringStatus fileClassification')
            .limit(50)
            .sort({ score: { $meta: 'textScore' } });

        res.json({
            success: true,
            data: {
                profiles,
                count: profiles.length,
                query: q,
                type
            }
        });
    } catch (error) {
        console.error('Search profiles error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed'
        });
    }
};

module.exports = {
    createProfile,
    getProfiles,
    getProfileById,
    updateProfile,
    deleteProfile,
    searchProfiles
};