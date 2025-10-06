const Profile = require('../models/Profile');
const ActivityLog = require('../models/ActivityLog');

const getStats = async (req, res) => {
    try {
        // Check user clearance level (skip if no user auth)
        // Allow viewing all profiles if no user authentication
        const clearanceFilter = { isActive: true };
        
        if (req.user && req.user.clearanceLevel) {
            const userClearance = req.user.clearanceLevel;
            const clearanceHierarchy = {
                'Restricted': ['Restricted'],
                'Confidential': ['Restricted', 'Confidential'],
                'Top Secret': ['Restricted', 'Confidential', 'Top Secret']
            };
            clearanceFilter.fileClassification = { $in: clearanceHierarchy[userClearance] || ['Restricted'] };
        }
        
        console.log('📊 Stats query filter:', clearanceFilter);

        // Parallel execution of all statistics queries
        const [
            totalProfiles,
            highRiskProfiles,
            underSurveillance,
            recentUpdates,
            riskDistribution,
            statusDistribution,
            classificationDistribution,
            recentActivity
        ] = await Promise.all([
            // Total profiles
            Profile.countDocuments(clearanceFilter),
            
            // High risk subjects
            Profile.countDocuments({ 
                ...clearanceFilter, 
                radicalizationLevel: 'High' 
            }),
            
            // Under surveillance
            Profile.countDocuments({ 
                ...clearanceFilter, 
                monitoringStatus: 'Active Monitoring' 
            }),
            
            // Recent updates (last 7 days)
            Profile.countDocuments({
                ...clearanceFilter,
                updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }),
            
            // Risk level distribution
            Profile.aggregate([
                { $match: clearanceFilter },
                { $group: { _id: '$radicalizationLevel', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            
            // Monitoring status distribution
            Profile.aggregate([
                { $match: clearanceFilter },
                { $group: { _id: '$monitoringStatus', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            
            // Classification distribution
            Profile.aggregate([
                { $match: clearanceFilter },
                { $group: { _id: '$fileClassification', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            
            // Recent activity logs (last 24 hours) - skip if no user
            req.user ? ActivityLog.find({
                userId: req.user.userId,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('action targetType createdAt success') : []
        ]);

        // Calculate changes (mock data for demo - in production, you'd compare with previous period)
        const changes = {
            newProfiles: Math.floor(Math.random() * 20),
            highRisk: Math.floor(Math.random() * 10),
            surveillance: Math.floor(Math.random() * 15),
            updates: Math.floor(Math.random() * 12)
        };

        // Get threat categories distribution
        const threatCategories = await Profile.aggregate([
            { $match: { ...clearanceFilter, threatCategory: { $exists: true, $ne: null } } },
            { $group: { _id: '$threatCategory', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get monthly profile creation trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyTrend = await Profile.aggregate([
            { 
                $match: { 
                    ...clearanceFilter,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Return data matching frontend expectations
        res.json({
            success: true,
            data: {
                totalProfiles: totalProfiles,
                highRiskCount: highRiskProfiles,
                activeMonitoring: underSurveillance,
                recentUpdates: recentUpdates,
                recentChanges: changes,
                distributions: {
                    riskLevels: riskDistribution,
                    monitoringStatus: statusDistribution,
                    classifications: classificationDistribution,
                    threatCategories: threatCategories
                },
                trends: {
                    monthly: monthlyTrend
                },
                recentActivity: recentActivity,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve statistics'
        });
    }
};

const getSystemHealth = async (req, res) => {
    try {
        // Only allow Top Secret clearance to access system health
        if (req.user.clearanceLevel !== 'Top Secret') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient clearance level'
            });
        }

        const [
            totalUsers,
            activeUsers,
            totalLogs,
            errorLogs,
            dbStats
        ] = await Promise.all([
            // These would be implemented with proper user management
            1, // Mock data
            1, // Mock data
            ActivityLog.countDocuments(),
            ActivityLog.countDocuments({ success: false }),
            // Database statistics would require proper implementation
            { size: '0 MB', collections: 3 }
        ]);

        res.json({
            success: true,
            data: {
                system: {
                    status: 'operational',
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    nodeVersion: process.version
                },
                database: {
                    connected: true,
                    stats: dbStats
                },
                users: {
                    total: totalUsers,
                    active: activeUsers
                },
                logs: {
                    total: totalLogs,
                    errors: errorLogs,
                    errorRate: totalLogs > 0 ? (errorLogs / totalLogs * 100).toFixed(2) + '%' : '0%'
                },
                lastCheck: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Get system health error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve system health'
        });
    }
};

module.exports = { getStats, getSystemHealth };