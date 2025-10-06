const express = require('express');
const { getStats, getSystemHealth } = require('../controllers/statsController');
const { auth, logActivity, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Optional auth middleware for stats (works with or without token)
const optionalAuthMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Continue without auth if token is invalid
            req.user = null;
        }
    }
    
    next();
};

// GET /api/stats - Get dashboard statistics (optional auth)
router.get('/', 
    optionalAuthMiddleware,
    logActivity('READ', 'Stats'),
    getStats
);

// GET /api/stats/health - Get system health (Top Secret only)
router.get('/health', 
    auth,
    logActivity('READ', 'SystemHealth'),
    getSystemHealth
);

module.exports = router;