const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Ensure log directories exist
const logDir = process.env.AUDIT_LOG_PATH || './audit_logs';
const securityLogDir = path.join(logDir, 'security');
const systemLogDir = path.join(logDir, 'system');
const accessLogDir = path.join(logDir, 'access');

[logDir, securityLogDir, systemLogDir, accessLogDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Custom log formats
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
            timestamp,
            level: level.toUpperCase(),
            message,
            ...meta,
            nodeId: process.env.NODE_ID || 'PRIMARY',
            pid: process.pid
        });
    })
);

// Security Logger - For authentication, authorization, and security events
const securityLogger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(securityLogDir, 'security-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            auditFile: path.join(securityLogDir, 'security-audit.json')
        }),
        new DailyRotateFile({
            filename: path.join(securityLogDir, 'security-error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '30d'
        })
    ]
});

// System Logger - For system operations and errors
const systemLogger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(systemLogDir, 'system-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            auditFile: path.join(systemLogDir, 'system-audit.json')
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Access Logger - For API access and user activities
const accessLogger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(accessLogDir, 'access-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            auditFile: path.join(accessLogDir, 'access-audit.json')
        })
    ]
});

class AuditLogger {
    // Log security events
    static logSecurity(event, details = {}) {
        securityLogger.info('SECURITY_EVENT', {
            event,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Log authentication events
    static logAuth(action, userId, ip, userAgent, success = true, details = {}) {
        securityLogger.info('AUTH_EVENT', {
            action,
            userId,
            ip,
            userAgent,
            success,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Log data access
    static logDataAccess(userId, action, resourceType, resourceId, ip, details = {}) {
        accessLogger.info('DATA_ACCESS', {
            userId,
            action,
            resourceType,
            resourceId,
            ip,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Log suspicious activity
    static logSuspicious(description, ip, userAgent, details = {}) {
        securityLogger.warn('SUSPICIOUS_ACTIVITY', {
            description,
            ip,
            userAgent,
            ...details,
            timestamp: new Date().toISOString(),
            severity: 'HIGH'
        });
    }

    // Log system events
    static logSystem(event, level = 'info', details = {}) {
        systemLogger.log(level, 'SYSTEM_EVENT', {
            event,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Log backup operations
    static logBackup(operation, status, details = {}) {
        systemLogger.info('BACKUP_EVENT', {
            operation,
            status,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Log file operations
    static logFileOperation(userId, operation, filename, ip, success = true, details = {}) {
        accessLogger.info('FILE_OPERATION', {
            userId,
            operation,
            filename,
            ip,
            success,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Log network events
    static logNetwork(event, ip, details = {}) {
        securityLogger.info('NETWORK_EVENT', {
            event,
            ip,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Log database operations
    static logDatabase(operation, collection, userId, success = true, details = {}) {
        systemLogger.info('DATABASE_EVENT', {
            operation,
            collection,
            userId,
            success,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Emergency alert logging
    static logEmergency(message, details = {}) {
        securityLogger.error('EMERGENCY_ALERT', {
            message,
            ...details,
            timestamp: new Date().toISOString(),
            severity: 'CRITICAL',
            requiresAttention: true
        });
        
        // Also log to console for immediate attention
        console.error('🚨 EMERGENCY ALERT:', message, details);
    }

    // Performance monitoring
    static logPerformance(operation, duration, details = {}) {
        systemLogger.info('PERFORMANCE_METRIC', {
            operation,
            duration,
            ...details,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = AuditLogger;