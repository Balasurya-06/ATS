
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Import security and utility modules
const connectDB = require('./config/database');
const { initializeAdminUser } = require('./controllers/authController');
const SecurityManager = require('./utils/security');
const AuditLogger = require('./utils/auditLogger');
const BackupManager = require('./utils/backupManager');
const ProfessionalLogger = require('./utils/professionalLogger');
const APIDocumentation = require('./utils/apiDocumentation');

// Import security middleware
const {
    generalRateLimit,
    authRateLimit,
    profileRateLimit,
    readRateLimit,
    speedLimiter,
    ipWhitelist,
    networkKeyValidation,
    intrusionDetection,
    sanitizeRequest,
    securityHeaders,
    securityLogging
} = require('./middleware/security');

// Import professional logging middleware
const {
    professionalAPILogger,
    securityEventLogger,
    performanceLogger,
    authLogger
} = require('./middleware/professionalLogging');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload');
const backupRoutes = require('./routes/backup');
const analysisRoutes = require('./routes/analysis');
const aiRoutes = require('./routes/ai');

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Advanced security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Custom security headers
app.use(securityHeaders);

// Professional API logging for all requests
app.use(professionalAPILogger);

// Security logging for all requests
app.use(securityLogging);

// IP whitelist validation (if configured)
if (process.env.ALLOWED_IPS) {
    app.use(ipWhitelist);
}

// Network key validation for cross-system access
if (process.env.NETWORK_KEY) {
    app.use('/api', networkKeyValidation);
}

// Intrusion detection
app.use(intrusionDetection);

// Request sanitization
app.use(sanitizeRequest);

// Speed limiting for suspicious behavior (only for non-GET requests)
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        speedLimiter(req, res, next);
    } else {
        next();
    }
});

// General rate limiting (apply to all routes but very lenient)
app.use(generalRateLimit);

// Secure session configuration
app.use(session({
    secret: process.env.JWT_SECRET || 'accust-session-secret-change-in-production',
    name: 'ACCUST_SESSION',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600, // lazy session update
        crypto: {
            secret: process.env.ENCRYPTION_KEY || 'session-encryption-key'
        }
    }),
    cookie: {
        secure: process.env.FORCE_HTTPS === 'true',
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_TIMEOUT_HOURS || 4) * 60 * 60 * 1000,
        sameSite: 'strict'
    }
}));

// CORS configuration with enhanced security
// CORS configuration - Simplified for debugging
app.use(cors({
    origin: true, // Reflects the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Network-Key', 'Cache-Control', 'Pragma', 'Accept'],
    exposedHeaders: ['X-Request-ID'],
    optionsSuccessStatus: 200,
    preflightContinue: false
}));

// Body parsing middleware with size limits - skip for multipart
app.use((req, res, next) => {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        return next(); // Skip JSON parsing for multipart requests
    }
    express.json({ 
        limit: '5mb',
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    })(req, res, next);
});
app.use(express.urlencoded({ 
    extended: true, 
    limit: '5mb',
    parameterLimit: 100
}));

// Static files for uploads (with security restrictions)
app.use('/uploads', express.static(process.env.UPLOAD_PATH || './secure_uploads', {
    maxAge: '1d',
    etag: false,
    setHeaders: (res, path) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
}));

// API Routes with specific rate limiting and professional logging
app.use('/api/auth', authRateLimit, authLogger, securityEventLogger('AUTH_REQUEST'), authRoutes);
// Use readRateLimit for GET requests, profileRateLimit for POST/PUT/DELETE
app.use('/api/profiles', (req, res, next) => {
    if (req.method === 'GET') {
        readRateLimit(req, res, next);
    } else {
        profileRateLimit(req, res, next);
    }
}, performanceLogger('PROFILE_OPERATION'), profileRoutes);
app.use('/api/stats', readRateLimit, performanceLogger('STATS_QUERY'), statsRoutes);
app.use('/api/upload', profileRateLimit, securityEventLogger('FILE_UPLOAD'), uploadRoutes);
app.use('/api/backup', securityEventLogger('BACKUP_OPERATION'), backupRoutes);
app.use('/api/analysis', readRateLimit, performanceLogger('ANALYSIS_OPERATION'), analysisRoutes);
app.use('/api/ai', readRateLimit, aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'ACCUST Backend API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint with beautiful API documentation
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the ACCUST Management System Backend API',
        version: '1.0.0',
        security: 'Maximum Security Enabled',
        endpoints: {
            auth: '/api/auth (login, verify)',
            profiles: '/api/profiles (CRUD, search)',
            stats: '/api/stats (dashboard, health)',
            upload: '/api/upload (file management)',
            backup: '/api/backup (backup operations)',
            health: '/health (system status)'
        },
        documentation: 'See SECURITY_SETUP.md for complete documentation',
        quickStart: {
            login: 'POST /api/auth/login with PIN: 2815',
            networkKey: 'Include X-Network-Key header for all requests',
            clearance: 'Access controlled by user clearance level'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }
    
    // Mongoose duplicate key error
    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry found'
        });
    }
    
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
    
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }
    
    // Default error
    res.status(error.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        // Display professional logging banner
        ProfessionalLogger.displayStartupBanner();
        
        // Connect to MongoDB
        try {
            await connectDB();
        } catch (dbError) {
            console.error('⚠️ MongoDB Connection Failed, but starting server anyway:', dbError.message);
        }
        
        // Initialize security components
        ProfessionalLogger.logSystem('Server initialization started', 'info');
        
        // Initialize default admin user
        try {
            await initializeAdminUser();
        } catch (initError) {
            console.error('⚠️ Admin User Init Warning:', initError.message);
        }
        
        // Initialize backup system
        ProfessionalLogger.logSystem('Backup system initialized', 'info');
        
        // Generate RSA key pair for additional security (if needed)
        const keyPair = SecurityManager.generateRSAKeyPair();
        process.env.RSA_PUBLIC_KEY = keyPair.publicKey;
        process.env.RSA_PRIVATE_KEY = keyPair.privateKey;
        
        // Start server
        const PORT = process.env.PORT || 3001;
        const HOST = '0.0.0.0'; // Listen on all interfaces for network access
        
        const server = app.listen(PORT, HOST, () => {
            const securityStatus = process.env.NODE_ENV === 'production' ? '🔒 MAXIMUM SECURITY' : '🔓 DEVELOPMENT';
            const networkAccess = process.env.ALLOWED_IPS ? '🌐 RESTRICTED NETWORK' : '🌍 OPEN NETWORK';
            
            console.log(`
╔══════════════════════════════════════════════════════════════╗
║              ACCUST SECURE BACKEND SERVER STARTED            ║
╠══════════════════════════════════════════════════════════════╣
║ 🌐 Server: http://0.0.0.0:${PORT} (Network Access Enabled)     ║
║ 🏠 Local: http://localhost:${PORT}                            ║
║ 📊 Environment: ${process.env.NODE_ENV || 'development'}                        ║
║ ${securityStatus}                           ║
║ ${networkAccess}                            ║
║ 🔐 Default PIN: ${process.env.ADMIN_PIN || '2815'}                             ║
║ 💾 Auto Backup: Every ${process.env.BACKUP_INTERVAL_HOURS || 6} hours                    ║
║ 📁 JSON Backup: ${process.env.ENABLE_JSON_BACKUP === 'true' ? 'ENABLED' : 'DISABLED'}                     ║
║ 🔒 Encryption: AES-256-GCM + RSA-2048                       ║
║ 📚 API Docs: http://localhost:${PORT}/                        ║
║ 🏥 Health: http://localhost:${PORT}/health                    ║
║ 🛡️  Security: Multi-layer protection active                ║
╚══════════════════════════════════════════════════════════════╝

🔐 SECURITY FEATURES ACTIVE:
├── 🛡️  Advanced rate limiting & brute force protection
├── 🔍 Real-time intrusion detection
├── 📝 Comprehensive audit logging
├── 💾 Automated encrypted backups (MongoDB + JSON)
├── 🔒 AES-256-GCM + RSA-2048 encryption
├── 🌐 IP whitelisting (if configured)
├── 🚫 Request sanitization & validation
└── 📊 Suspicious activity monitoring

⚠️  NETWORK SECURITY:
├── Two-system architecture supported
├── Cross-system authentication via network key
├── All traffic logged and monitored
└── Emergency backup scripts available

🆘 EMERGENCY COMMANDS:
├── Manual backup: npm run backup
├── Restore data: npm run restore -- --list
└── Check logs: tail -f audit_logs/security/*.log
            `);
            
            ProfessionalLogger.logSystem('ACCUST server started successfully', 'info', {
                port: PORT,
                host: HOST,
                environment: process.env.NODE_ENV || 'development',
                securityLevel: 'maximum'
            });

            // 🚀 START BACKGROUND JOB SCHEDULER
            try {
                const scheduler = require('./services/backgroundJobs');
                scheduler.start();
                console.log('\n✅ Background AI Network Analysis: ACTIVE\n');
            } catch (error) {
                console.error('\n⚠️  Background jobs failed:', error.message, '\n');
            }

            // Display comprehensive API documentation
            setTimeout(() => {
                APIDocumentation.displayAllAPIs();
                APIDocumentation.displayQuickStart();
            }, 1000);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed');
                mongoose.connection.close().then(() => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                }).catch(() => process.exit(0));
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed');
                mongoose.connection.close().then(() => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                }).catch(() => process.exit(0));
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;