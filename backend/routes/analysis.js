const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Linkage = require('../models/Linkage');
const linkageDetector = require('../services/linkageDetector');

/**
 * POST /api/analysis/detect-linkages
 * Run full linkage detection analysis
 */
router.post('/detect-linkages', async (req, res) => {
    try {
        const result = await linkageDetector.analyzeAllProfiles();
        res.json({
            success: true,
            message: 'Linkage analysis completed',
            data: result
        });
    } catch (error) {
        console.error('Error in linkage detection:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze linkages',
            error: error.message
        });
    }
});

/**
 * GET /api/analysis/linkages/:profileId
 * Get all linkages for a specific profile
 */
router.get('/linkages/:profileId', async (req, res) => {
    try {
        const { profileId } = req.params;
        
        const linkages = await Linkage.find({
            $or: [{ profile1: profileId }, { profile2: profileId }],
            isActive: true
        })
        .populate('profile1', 'name profileId suspicionScore')
        .populate('profile2', 'name profileId suspicionScore')
        .sort({ suspicionScore: -1 });
        
        res.json({
            success: true,
            data: {
                linkages,
                count: linkages.length
            }
        });
    } catch (error) {
        console.error('Error getting linkages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get linkages',
            error: error.message
        });
    }
});

/**
 * GET /api/analysis/all
 * Get all linkages (flattened list)
 */
router.get('/all', async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        
        const linkages = await Linkage.find({ isActive: true })
            .populate('profile1', 'name profileId suspicionScore')
            .populate('profile2', 'name profileId suspicionScore')
            .sort({ suspicionScore: -1 })
            .limit(parseInt(limit));
            
        res.json({
            success: true,
            data: linkages
        });
    } catch (error) {
        console.error('Error getting all linkages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all linkages',
            error: error.message
        });
    }
});

/**
 * GET /api/analysis/network/:profileId
 * Get network graph data for a profile
 */
router.get('/network/:profileId', async (req, res) => {
    try {
        const { profileId } = req.params;
        const { depth = 2 } = req.query;
        
        const networkData = await linkageDetector.getProfileNetwork(profileId, parseInt(depth));
        
        res.json({
            success: true,
            data: networkData
        });
    } catch (error) {
        console.error('Error getting network:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get network data',
            error: error.message
        });
    }
});

/**
 * GET /api/analysis/suspicious
 * Get all suspicious profiles
 */
router.get('/suspicious', async (req, res) => {
    try {
        const { minScore = 30, limit = 100 } = req.query;
        
        const profiles = await Profile.find({
            isSuspicious: true,
            suspicionScore: { $gte: parseInt(minScore) },
            isActive: true
        })
        .select('name profileId suspicionScore linkageCount suspicionReasons radicalizationLevel')
        .sort({ suspicionScore: -1 })
        .limit(parseInt(limit));
        
        res.json({
            success: true,
            data: {
                profiles,
                count: profiles.length
            }
        });
    } catch (error) {
        console.error('Error getting suspicious profiles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get suspicious profiles',
            error: error.message
        });
    }
});

/**
 * GET /api/analysis/stats
 * Get analysis statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const totalProfiles = await Profile.countDocuments({ isActive: true });
        const suspiciousProfiles = await Profile.countDocuments({ isSuspicious: true, isActive: true });
        const totalLinkages = await Linkage.countDocuments({ isActive: true });
        const highRiskLinkages = await Linkage.countDocuments({ suspicionScore: { $gte: 70 }, isActive: true });
        
        // Connection type breakdown
        const linkageTypes = await Linkage.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$connectionType', count: { $sum: 1 } } }
        ]);
        
        // Top connected profiles
        const topConnected = await Profile.find({ isActive: true })
            .select('name profileId linkageCount suspicionScore')
            .sort({ linkageCount: -1 })
            .limit(10);
        
        res.json({
            success: true,
            data: {
                totalProfiles,
                suspiciousProfiles,
                totalLinkages,
                highRiskLinkages,
                suspiciousPercentage: ((suspiciousProfiles / totalProfiles) * 100).toFixed(1),
                linkageTypes,
                topConnected
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
});

/**
 * PUT /api/analysis/refresh
 * Trigger manual re-analysis
 */
router.put('/refresh', async (req, res) => {
    try {
        // Run analysis asynchronously
        linkageDetector.analyzeAllProfiles()
            .then(result => console.log('✅ Background analysis completed:', result))
            .catch(err => console.error('❌ Background analysis failed:', err));
        
        res.json({
            success: true,
            message: 'Analysis started in background'
        });
    } catch (error) {
        console.error('Error starting analysis:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start analysis',
            error: error.message
        });
    }
});

module.exports = router;
