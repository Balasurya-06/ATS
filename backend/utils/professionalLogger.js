const chalk = require('chalk');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Ensure log directories exist
const logDir = process.env.AUDIT_LOG_PATH || './audit_logs';
const securityLogDir = path.join(logDir, 'security');
const systemLogDir = path.join(logDir, 'system');
const accessLogDir = path.join(logDir, 'access');
const apiLogDir = path.join(logDir, 'api');

[logDir, securityLogDir, systemLogDir, accessLogDir, apiLogDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Professional console formatter with colors and icons
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const colors = {
            error: chalk.red.bold,
            warn: chalk.yellow.bold,
            info: chalk.blue.bold,
            debug: chalk.green.bold,
            verbose: chalk.cyan.bold
        };

        const icons = {
            error: '❌',
            warn: '⚠️ ',
            info: 'ℹ️ ',
            debug: '🐛',
            verbose: '📝'
        };

        const color = colors[level] || chalk.white;
        const icon = icons[level] || '📄';
        
        let logLine = `${chalk.gray('[')}${chalk.white.bold(timestamp)}${chalk.gray(']')} ${icon} ${color(level.toUpperCase().padEnd(7))} ${message}`;
        
        if (Object.keys(meta).length > 0) {
            logLine += `\n${chalk.gray('└─')} ${chalk.dim(JSON.stringify(meta, null, 2))}`;
        }
        
        return logLine;
    })
);

// File format for structured logging
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
            timestamp,
            level: level.toUpperCase(),
            message,
            ...meta,
            nodeId: process.env.NODE_ID || 'PRIMARY',
            pid: process.pid,
            environment: process.env.NODE_ENV || 'development'
        });
    })
);

// Security Logger
const securityLogger = winston.createLogger({
    level: 'info',
    format: fileFormat,
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

// System Logger with beautiful console output
const systemLogger = winston.createLogger({
    level: 'info',
    transports: [
        new DailyRotateFile({
            filename: path.join(systemLogDir, 'system-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            format: fileFormat
        }),
        new winston.transports.Console({
            format: consoleFormat
        })
    ]
});

// API Access Logger
const apiLogger = winston.createLogger({
    level: 'info',
    format: fileFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(apiLogDir, 'api-access-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d'
        })
    ]
});

// Access Logger
const accessLogger = winston.createLogger({
    level: 'info',
    format: fileFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(accessLogDir, 'access-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d'
        })
    ]
});

class ProfessionalLogger {
    // Beautiful API call logging
    static logAPICall(method, endpoint, statusCode, duration, userId = 'anonymous', details = {}) {
        const statusIcon = statusCode < 300 ? '✅' : statusCode < 400 ? '⚠️' : '❌';
        const methodColor = {
            'GET': chalk.green.bold,
            'POST': chalk.blue.bold,
            'PUT': chalk.yellow.bold,
            'DELETE': chalk.red.bold,
            'PATCH': chalk.magenta.bold
        };

        const color = methodColor[method] || chalk.white.bold;
        
        console.log(`
${chalk.gray('┌─────────────────────────────────────────────────────────────┐')}
${chalk.gray('│')} ${statusIcon} ${color(method.padEnd(6))} ${chalk.cyan.bold(endpoint.padEnd(35))} ${chalk.gray('│')}
${chalk.gray('│')} ${chalk.white('Status:')} ${statusCode < 300 ? chalk.green.bold(statusCode) : statusCode < 400 ? chalk.yellow.bold(statusCode) : chalk.red.bold(statusCode)} ${chalk.gray('│')} ${chalk.white('Duration:')} ${chalk.magenta.bold(duration + 'ms')} ${chalk.gray('│')} ${chalk.white('User:')} ${chalk.blue.bold(userId.substring(0, 12))} ${chalk.gray('│')}
${Object.keys(details).length > 0 ? `${chalk.gray('│')} ${chalk.dim(JSON.stringify(details).substring(0, 55))}... ${chalk.gray('│')}` : ''}
${chalk.gray('└─────────────────────────────────────────────────────────────┘')}
        `);

        // Log to file
        apiLogger.info('API_CALL', {
            method,
            endpoint,
            statusCode,
            duration,
            userId,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Security event logging with visual emphasis
    static logSecurity(event, level = 'info', details = {}) {
        const securityIcons = {
            'LOGIN_SUCCESS': '🔓',
            'LOGIN_FAILED': '🔒',
            'UNAUTHORIZED_ACCESS': '🚫',
            'SUSPICIOUS_ACTIVITY': '🚨',
            'INTRUSION_DETECTED': '⚠️',
            'RATE_LIMIT_EXCEEDED': '🛑',
            'BRUTE_FORCE_DETECTED': '🔨',
            'IP_BLOCKED': '🌐',
            'NETWORK_SECURITY': '🛡️'
        };

        const icon = securityIcons[event] || '🔐';
        
        console.log(`
${chalk.red.bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${chalk.red.bold('┃')} ${icon} ${chalk.white.bold('SECURITY EVENT:')} ${chalk.yellow.bold(event.padEnd(30))} ${chalk.red.bold('┃')}
${chalk.red.bold('┃')} ${chalk.white('Level:')} ${level === 'error' ? chalk.red.bold(level.toUpperCase()) : chalk.yellow.bold(level.toUpperCase())} ${chalk.red.bold('┃')} ${chalk.white('Time:')} ${chalk.cyan.bold(new Date().toLocaleTimeString())} ${chalk.red.bold('┃')}
${Object.keys(details).length > 0 ? `${chalk.red.bold('┃')} ${chalk.dim(JSON.stringify(details, null, 2).substring(0, 55))}... ${chalk.red.bold('┃')}` : ''}
${chalk.red.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}
        `);

        securityLogger[level]('SECURITY_EVENT', {
            event,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // System event logging
    static logSystem(event, level = 'info', details = {}) {
        systemLogger[level]('SYSTEM_EVENT', {
            event,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Authentication logging with beautiful formatting
    static logAuth(action, userId, ip, userAgent, success = true, details = {}) {
        const authIcon = success ? '✅' : '❌';
        const actionColor = success ? chalk.green.bold : chalk.red.bold;
        
        console.log(`
${chalk.blue.bold('╔═══════════════════════════════════════════════════════════════╗')}
${chalk.blue.bold('║')} ${authIcon} ${actionColor('AUTHENTICATION')} ${chalk.blue.bold('║')}
${chalk.blue.bold('║')} ${chalk.white('Action:')} ${chalk.cyan.bold(action.padEnd(15))} ${chalk.blue.bold('║')} ${chalk.white('User:')} ${chalk.yellow.bold(userId.padEnd(12))} ${chalk.blue.bold('║')}
${chalk.blue.bold('║')} ${chalk.white('IP:')} ${chalk.magenta.bold(ip.padEnd(15))} ${chalk.blue.bold('║')} ${chalk.white('Status:')} ${success ? chalk.green.bold('SUCCESS') : chalk.red.bold('FAILED')} ${chalk.blue.bold('║')}
${chalk.blue.bold('╚═══════════════════════════════════════════════════════════════╝')}
        `);

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

    // Data access logging
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

    // Backup operations logging
    static logBackup(operation, status, details = {}) {
        const backupIcon = status === 'SUCCESS' ? '💾' : status === 'ERROR' ? '❌' : '⚠️';
        
        console.log(`
${chalk.cyan.bold('╭─────────────────────────────────────────────────────────────────╮')}
${chalk.cyan.bold('│')} ${backupIcon} ${chalk.white.bold('BACKUP OPERATION:')} ${chalk.yellow.bold(operation.padEnd(20))} ${chalk.cyan.bold('│')}
${chalk.cyan.bold('│')} ${chalk.white('Status:')} ${status === 'SUCCESS' ? chalk.green.bold(status) : chalk.red.bold(status)} ${chalk.cyan.bold('│')} ${chalk.white('Time:')} ${chalk.magenta.bold(new Date().toLocaleTimeString())} ${chalk.cyan.bold('│')}
${chalk.cyan.bold('╰─────────────────────────────────────────────────────────────────╯')}
        `);

        systemLogger.info('BACKUP_EVENT', {
            operation,
            status,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Emergency alerts with maximum visibility
    static logEmergency(message, details = {}) {
        console.log(`
${chalk.red.bold.bgWhite('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${chalk.red.bold.bgWhite('┃')} 🚨🚨🚨 ${chalk.red.bold('EMERGENCY ALERT')} 🚨🚨🚨 ${chalk.red.bold.bgWhite('┃')}
${chalk.red.bold.bgWhite('┃')} ${chalk.black.bold(message.padEnd(65))} ${chalk.red.bold.bgWhite('┃')}
${chalk.red.bold.bgWhite('┃')} ${chalk.black.bold('IMMEDIATE ATTENTION REQUIRED'.padEnd(65))} ${chalk.red.bold.bgWhite('┃')}
${chalk.red.bold.bgWhite('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}
        `);

        securityLogger.error('EMERGENCY_ALERT', {
            message,
            ...details,
            timestamp: new Date().toISOString(),
            severity: 'CRITICAL',
            requiresAttention: true
        });
    }

    // Performance monitoring
    static logPerformance(operation, duration, details = {}) {
        const performanceColor = duration < 100 ? chalk.green : duration < 500 ? chalk.yellow : chalk.red;
        
        systemLogger.info('PERFORMANCE_METRIC', {
            operation,
            duration,
            ...details,
            timestamp: new Date().toISOString()
        });
    }

    // Beautiful startup banner
    static displayStartupBanner() {
        console.log(`
${chalk.cyan.bold('╔══════════════════════════════════════════════════════════════════════════════════════╗')}
${chalk.cyan.bold('║')}                        ${chalk.white.bold('🔒 ACCUST PROFESSIONAL LOGGING SYSTEM 🔒')}                        ${chalk.cyan.bold('║')}
${chalk.cyan.bold('╠══════════════════════════════════════════════════════════════════════════════════════╣')}
${chalk.cyan.bold('║')} ${chalk.green('✅ Security Logging:')} ${chalk.white('Advanced threat monitoring & audit trails')}          ${chalk.cyan.bold('║')}
${chalk.cyan.bold('║')} ${chalk.blue('📊 API Logging:')} ${chalk.white('Real-time request/response tracking')}                   ${chalk.cyan.bold('║')}
${chalk.cyan.bold('║')} ${chalk.yellow('🔐 Auth Logging:')} ${chalk.white('Authentication & authorization events')}               ${chalk.cyan.bold('║')}
${chalk.cyan.bold('║')} ${chalk.magenta('💾 Backup Logging:')} ${chalk.white('Data protection & recovery operations')}             ${chalk.cyan.bold('║')}
${chalk.cyan.bold('║')} ${chalk.red('🚨 Emergency Logging:')} ${chalk.white('Critical alerts & incident response')}            ${chalk.cyan.bold('║')}
${chalk.cyan.bold('╚══════════════════════════════════════════════════════════════════════════════════════╝')}
        `);
    }
}

module.exports = ProfessionalLogger;