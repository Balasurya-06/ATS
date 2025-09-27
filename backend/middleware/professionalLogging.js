const ProfessionalLogger = require('../utils/professionalLogger');

// Professional API logging middleware
const professionalAPILogger = (req, res, next) => {
    const startTime = Date.now();
    const originalSend = res.send;
    const originalJson = res.json;

    // Override res.send to capture response
    res.send = function(data) {
        const duration = Date.now() - startTime;
        const userId = req.user?.userId || 'anonymous';
        
        // Extract useful information from request
        const details = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            contentLength: req.headers['content-length'],
            origin: req.headers['origin'],
            referer: req.headers['referer'],
            networkKey: req.headers['x-network-key'] ? '✓ Valid' : '✗ Missing',
            responseSize: typeof data === 'string' ? data.length : JSON.stringify(data).length,
            query: Object.keys(req.query).length > 0 ? req.query : undefined,
            body: req.method !== 'GET' && req.body ? Object.keys(req.body).join(', ') : undefined
        };

        // Log the API call with beautiful formatting
        ProfessionalLogger.logAPICall(
            req.method,
            req.path,
            res.statusCode,
            duration,
            userId,
            details
        );

        // Call original send
        originalSend.call(this, data);
    };

    // Override res.json to capture JSON responses
    res.json = function(data) {
        const duration = Date.now() - startTime;
        const userId = req.user?.userId || 'anonymous';
        
        const details = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            networkKey: req.headers['x-network-key'] ? '✓ Valid' : '✗ Missing',
            responseSize: (() => {
                try {
                    if (!data) return 0;
                    if (typeof data === 'string') return data.length;
                    const jsonString = JSON.stringify(data);
                    if (jsonString && jsonString.length > 1000000) {
                        return 'Large response (>1MB)';
                    }
                    return jsonString ? jsonString.length : 0;
                } catch (error) {
                    return 'Error calculating size';
                }
            })(),
            success: data.success !== undefined ? data.success : res.statusCode < 400,
            query: Object.keys(req.query).length > 0 ? req.query : undefined,
            body: req.method !== 'GET' && req.body ? Object.keys(req.body).join(', ') : undefined
        };

        ProfessionalLogger.logAPICall(
            req.method,
            req.path,
            res.statusCode,
            duration,
            userId,
            details
        );

        originalJson.call(this, data);
    };

    next();
};

// Enhanced security logging
const securityEventLogger = (eventType) => {
    return (req, res, next) => {
        const originalSend = res.send;
        const originalJson = res.json;

        res.send = res.json = function(data) {
            const success = res.statusCode < 400;
            const level = success ? 'info' : 'warn';

            ProfessionalLogger.logSecurity(eventType, level, {
                method: req.method,
                endpoint: req.path,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                userId: req.user?.userId || 'anonymous',
                statusCode: res.statusCode,
                success,
                timestamp: new Date().toISOString()
            });

            if (originalSend === res.send) {
                originalSend.call(this, data);
            } else {
                originalJson.call(this, data);
            }
        };

        next();
    };
};

// Performance monitoring middleware
const performanceLogger = (operationName) => {
    return (req, res, next) => {
        const startTime = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            
            if (duration > 1000) { // Log slow operations (>1s)
                ProfessionalLogger.logPerformance(operationName || req.path, duration, {
                    method: req.method,
                    statusCode: res.statusCode,
                    userId: req.user?.userId || 'anonymous',
                    warning: 'Slow operation detected'
                });
            }
        });
        
        next();
    };
};

// Enhanced authentication logging
const authLogger = (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;

    res.send = res.json = function(data) {
        const success = res.statusCode < 400;
        const action = req.path.includes('login') ? 'LOGIN' : 
                      req.path.includes('verify') ? 'TOKEN_VERIFY' : 
                      'AUTH_ACTION';

        ProfessionalLogger.logAuth(
            action,
            req.body?.userId || req.user?.userId || 'unknown',
            req.ip || req.connection.remoteAddress,
            req.headers['user-agent'],
            success,
            {
                endpoint: req.path,
                method: req.method,
                statusCode: res.statusCode,
                hasNetworkKey: !!req.headers['x-network-key']
            }
        );

        if (originalSend === res.send) {
            originalSend.call(this, data);
        } else {
            originalJson.call(this, data);
        }
    };

    next();
};

module.exports = {
    professionalAPILogger,
    securityEventLogger,
    performanceLogger,
    authLogger
};