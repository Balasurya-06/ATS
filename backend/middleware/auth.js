const jwt = require('jsonwebtoken');
const ActivityLog = require('../models/ActivityLog');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Invalid token.' 
        });
    }
};

const logActivity = (action, targetType = 'Profile') => {
    return async (req, res, next) => {
        const originalSend = res.send;
        
        res.send = function(data) {
            // Log the activity after response
            const logData = {
                action,
                userId: req.user?.userId || 'anonymous',
                targetId: req.params?.id || req.body?.profileId,
                targetType,
                details: `${action} ${targetType}`,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                sessionId: req.sessionID,
                success: res.statusCode < 400
            };

            if (res.statusCode >= 400) {
                logData.errorMessage = typeof data === 'string' ? data : JSON.stringify(data);
            }

            ActivityLog.create(logData).catch(err => 
                console.error('Activity logging error:', err)
            );

            originalSend.call(this, data);
        };

        next();
    };
};

module.exports = { auth, logActivity };