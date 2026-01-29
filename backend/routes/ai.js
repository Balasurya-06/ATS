const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Linkage = require('../models/Linkage');

/**
 * POST /api/ai/query
 * Allow AI to query profiles and linkages
 */
router.post('/query', async (req, res) => {
    try {
        const { queryType, params } = req.body;
        
        let result;
        
        switch (queryType) {
            case 'suspicious_profiles':
                result = await Profile.find({
                    isSuspicious: true,
                    isActive: true
                })
                .select('name profileId suspicionScore linkageCount suspicionReasons radicalizationLevel')
                .sort({ suspicionScore: -1 })
                .limit(params?.limit || 10);
                break;
                
            case 'profile_linkages':
                const linkages = await Linkage.find({
                    $or: [
                        { profile1: params.profileId },
                        { profile2: params.profileId }
                    ],
                    isActive: true
                })
                .populate('profile1', 'name profileId')
                .populate('profile2', 'name profileId')
                .limit(20);
                result = linkages;
                break;
                
            case 'search_profiles':
                result = await Profile.find({
                    $or: [
                        { name: new RegExp(params.query, 'i') },
                        { profileId: new RegExp(params.query, 'i') }
                    ],
                    isActive: true
                })
                .select('name profileId suspicionScore radicalizationLevel address')
                .limit(10);
                break;
                
            case 'high_risk':
                result = await Profile.find({
                    radicalizationLevel: 'High',
                    isActive: true
                })
                .select('name profileId suspicionScore linkageCount threatCategory')
                .limit(20);
                break;
                
            case 'network_stats':
                const totalLinkages = await Linkage.countDocuments({ isActive: true });
                const highRiskLinkages = await Linkage.countDocuments({ 
                    suspicionScore: { $gte: 70 }, 
                    isActive: true 
                });
                const suspiciousProfiles = await Profile.countDocuments({ 
                    isSuspicious: true, 
                    isActive: true 
                });
                result = { totalLinkages, highRiskLinkages, suspiciousProfiles };
                break;
                
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Unknown query type'
                });
        }
        
        res.json({
            success: true,
            data: result
        });
        
    } catch (error) {
        console.error('AI query error:', error);
        res.status(500).json({
            success: false,
            message: 'Query failed',
            error: error.message
        });
    }
});

module.exports = router;
