const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const ExpressBrute = require('express-brute');
const SecurityManager = require('../utils/security');
const AuditLogger = require('../utils/auditLogger');

// Advanced rate limiting with different tiers
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => {
    return rateLimit({
        windowMs,
        limit: max, // Updated from 'max' to 'limit'
        message: {
            success: false,
            message,
            retryAfter: windowMs / 1000
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        handler: (req, res) => {
            AuditLogger.logSuspicious('Rate limit exceeded', req.ip, req.headers['user-agent'], {
                endpoint: req.path,
                method: req.method
            });
            res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

// General API rate limiting
const generalRateLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later.'
);

// Strict rate limiting for authentication
const authRateLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 requests per 15 minutes
    'Too many authentication attempts, please try again later.',
    true // Skip successful requests
);

// Profile creation limiting
const profileRateLimit = createRateLimit(
    60 * 60 * 1000, // 1 hour
    10, // limit each IP to 10 profile creations per hour
    'Too many profile creation attempts, please try again later.'
);

// Speed limiting for suspicious behavior
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 10, // allow 10 requests per 15 minutes at full speed
    delayMs: () => 500, // slow down subsequent requests by 500ms per request
    maxDelayMs: 20000, // maximum delay of 20 seconds
    skipSuccessfulRequests: true,
    validate: { delayMs: false } // Disable warning
});

// Brute force protection for login attempts
const bruteForceStore = new ExpressBrute.MemoryStore();

const bruteForce = new ExpressBrute(bruteForceStore, {
    freeRetries: 3, // Allow 3 attempts
    minWait: 5 * 60 * 1000, // 5 minutes minimum wait
    maxWait: 60 * 60 * 1000, // 1 hour maximum wait
    lifetime: 24 * 60 * 60, // 24 hours lifetime
    failCallback: (req, res, next, nextValidRequestDate) => {
        AuditLogger.logSuspicious('Brute force detected', req.ip, req.headers['user-agent'], {
            nextValidRequest: nextValidRequestDate,
            userId: req.body?.userId || 'unknown'
        });
        
        res.status(423).json({
            success: false,
            message: 'Account temporarily locked due to too many failed attempts',
            retryAfter: Math.ceil((nextValidRequestDate.getTime() - Date.now()) / 1000)
        });
    }
});

// IP whitelist validation
const ipWhitelist = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const forwardedFor = req.headers['x-forwarded-for'];
    const realIP = forwardedFor ? forwardedFor.split(',')[0].trim() : clientIP;

    if (!SecurityManager.isValidIP(realIP)) {
        AuditLogger.logSuspicious('Unauthorized IP access attempt', realIP, req.headers['user-agent'], {
            endpoint: req.path,
            forwardedFor
        });
        
        return res.status(403).json({
            success: false,
            message: 'Access denied from this network'
        });
    }

    req.clientIP = realIP;
    next();
};

// Network key validation for cross-system access
const networkKeyValidation = (req, res, next) => {
    // Skip validation for OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
        return next();
    }

    const networkKey = req.headers['x-network-key'];
    const expectedKey = process.env.NETWORK_KEY;

    if (!networkKey || !expectedKey || networkKey !== expectedKey) {
        AuditLogger.logSuspicious('Invalid network key', req.ip, req.headers['user-agent'], {
            endpoint: req.path,
            hasKey: !!networkKey
        });
        
        return res.status(403).json({
            success: false,
            message: 'Invalid network authentication'
        });
    }

    next();
};

// Intrusion detection middleware
const intrusionDetection = (req, res, next) => {
    const suspiciousPatterns = [
        /(\.\.|\/etc\/|\/bin\/|\/usr\/|\/var\/)/i, // Path traversal
        /(union|select|insert|update|delete|drop|create|alter)/i, // SQL injection
        /(<script|javascript:|vbscript:|onload|onerror)/i, // XSS attempts
        /(eval\(|exec\(|system\(|passthru\()/i, // Code injection
        /(\${|<%|<\?php)/i // Template/PHP injection
    ];

    const userAgent = req.headers['user-agent'] || '';
    const url = req.url;
    const body = JSON.stringify(req.body || {});

    const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(url) || pattern.test(body) || pattern.test(userAgent)
    );

    if (isSuspicious) {
        AuditLogger.logSuspicious('Potential intrusion attempt detected', req.ip, userAgent, {
            endpoint: req.path,
            method: req.method,
            body: body.substring(0, 500) // Log first 500 chars only
        });

        return res.status(400).json({
            success: false,
            message: 'Malicious request detected'
        });
    }

    next();
};

// Request sanitization
const sanitizeRequest = (req, res, next) => {
    // Sanitize query parameters
    if (req.query) {
        req.query = SecurityManager.sanitizeData(req.query);
    }

    // Sanitize body data
    if (req.body) {
        req.body = SecurityManager.sanitizeData(req.body);
    }

    next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Additional security headers beyond helmet
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    
    // Custom security headers
    res.setHeader('X-ACCUST-Security', 'enabled');
    res.setHeader('X-Request-ID', SecurityManager.generateSecureToken(16));

    next();
};

// Request logging for security audit
const securityLogging = (req, res, next) => {
    const startTime = Date.now();
    
    // Log request
    AuditLogger.logNetwork('REQUEST', req.ip, {
        method: req.method,
        endpoint: req.path,
        userAgent: req.headers['user-agent'],
        contentLength: req.headers['content-length'],
        timestamp: new Date().toISOString()
    });

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        
        AuditLogger.logNetwork('RESPONSE', req.ip, {
            method: req.method,
            endpoint: req.path,
            statusCode: res.statusCode,
            duration,
            timestamp: new Date().toISOString()
        });

        originalEnd.apply(this, args);
    };

    next();
};

module.exports = {
    generalRateLimit,
    authRateLimit,
    profileRateLimit,
    speedLimiter,
    bruteForce,
    ipWhitelist,
    networkKeyValidation,
    intrusionDetection,
    sanitizeRequest,
    securityHeaders,
    securityLogging
};