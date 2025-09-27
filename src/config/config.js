/**
 * ACCUST Frontend Configuration
 * Secure configuration for frontend-backend communication
 */

const config = {
    // Backend API configuration
    api: {
        baseURL: 'http://localhost:3001/api',
        healthURL: 'http://localhost:3001/health',
        networkKey: 'ACCUST_NETWORK_ACCESS_KEY_CHANGE_IN_PRODUCTION_2025_SECRET',
        timeout: 30000, // 30 seconds
        retryAttempts: 3
    },

    // Security configuration
    security: {
        tokenStorageKey: 'accust_token',
        sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxFilesPerUpload: 10
    },

    // UI configuration
    ui: {
        preloadDuration: 5000, // 5 seconds
        notificationDuration: 5000, // 5 seconds
        autoLogoutWarning: 15 * 60 * 1000, // 15 minutes before logout
        dashboardRefreshInterval: 5 * 60 * 1000 // 5 minutes
    },

    // Application metadata
    app: {
        name: 'ACCUST Management Console',
        version: '2.1.0',
        description: 'Secure intelligence database for law enforcement operations',
        environment: process.env.NODE_ENV || 'development'
    },

    // Rate limiting (frontend-side awareness)
    rateLimits: {
        login: {
            attempts: 5,
            windowMs: 15 * 60 * 1000 // 15 minutes
        },
        profileCreation: {
            attempts: 10,
            windowMs: 60 * 60 * 1000 // 1 hour
        },
        general: {
            attempts: 50,
            windowMs: 5 * 60 * 1000 // 5 minutes
        }
    }
};

export default config;