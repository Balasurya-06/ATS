const express = require('express');
const { getStats, getSystemHealth } = require('../controllers/statsController');
const { auth, logActivity } = require('../middleware/auth');

const router = express.Router();

// All stats routes require authentication
router.use(auth);

// GET /api/stats - Get dashboard statistics
router.get('/', 
    logActivity('READ', 'Stats'),
    getStats
);

// GET /api/stats/health - Get system health (Top Secret only)
router.get('/health', 
    logActivity('READ', 'SystemHealth'),
    getSystemHealth
);

module.exports = router;