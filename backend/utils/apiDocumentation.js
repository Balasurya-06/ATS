const chalk = require('chalk');
const ProfessionalLogger = require('./professionalLogger');

class APIDocumentation {
    static displayAllAPIs() {
        console.log(`
${chalk.cyan.bold('╔══════════════════════════════════════════════════════════════════════════════════════╗')}
${chalk.cyan.bold('║')}                    ${chalk.white.bold('🌐 ACCUST BACKEND API ENDPOINTS DOCUMENTATION 🌐')}                   ${chalk.cyan.bold('║')}
${chalk.cyan.bold('╚══════════════════════════════════════════════════════════════════════════════════════╝')}

${chalk.yellow.bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${chalk.yellow.bold('┃')}                              ${chalk.white.bold('🔐 AUTHENTICATION ENDPOINTS')}                                ${chalk.yellow.bold('┃')}
${chalk.yellow.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}

${chalk.green.bold('POST')} ${chalk.cyan('/api/auth/login')}                    ${chalk.white('🔓 Authenticate with PIN')}
   ${chalk.gray('├─')} ${chalk.white('Body:')} { "pin": "2815" }
   ${chalk.gray('├─')} ${chalk.white('Headers:')} X-Network-Key, Content-Type
   ${chalk.gray('├─')} ${chalk.white('Response:')} JWT token + user info
   ${chalk.gray('└─')} ${chalk.white('Rate Limit:')} 5 requests per 15 minutes

${chalk.blue.bold('GET ')} ${chalk.cyan('/api/auth/verify')}                     ${chalk.white('🔍 Verify JWT token validity')}
   ${chalk.gray('├─')} ${chalk.white('Headers:')} Authorization: Bearer <token>
   ${chalk.gray('├─')} ${chalk.white('Response:')} User information
   ${chalk.gray('└─')} ${chalk.white('Rate Limit:')} Standard

${chalk.yellow.bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${chalk.yellow.bold('┃')}                              ${chalk.white.bold('👤 PROFILE MANAGEMENT ENDPOINTS')}                           ${chalk.yellow.bold('┃')}
${chalk.yellow.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}

${chalk.green.bold('POST')} ${chalk.cyan('/api/profiles')}                      ${chalk.white('➕ Create new accused profile')}
   ${chalk.gray('├─')} ${chalk.white('Body:')} Profile data (all 13 sections)
   ${chalk.gray('├─')} ${chalk.white('Files:')} photos[] (multipart/form-data)
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Required (JWT token)
   ${chalk.gray('├─')} ${chalk.white('Validation:')} Comprehensive field validation
   ${chalk.gray('├─')} ${chalk.white('Encryption:')} Sensitive fields encrypted
   ${chalk.gray('└─')} ${chalk.white('Rate Limit:')} 10 profiles per hour

${chalk.blue.bold('GET ')} ${chalk.cyan('/api/profiles')}                       ${chalk.white('📄 Get all profiles (paginated)')}
   ${chalk.gray('├─')} ${chalk.white('Query:')} page, limit, sort, search, riskLevel, status
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Required + clearance level check
   ${chalk.gray('├─')} ${chalk.white('Response:')} Paginated profile list
   ${chalk.gray('└─')} ${chalk.white('Filtering:')} By clearance level

${chalk.blue.bold('GET ')} ${chalk.cyan('/api/profiles/:id')}                   ${chalk.white('🔍 Get specific profile by ID')}
   ${chalk.gray('├─')} ${chalk.white('Params:')} profileId or MongoDB _id
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Required + clearance level check
   ${chalk.gray('├─')} ${chalk.white('Response:')} Complete profile data
   ${chalk.gray('└─')} ${chalk.white('Decryption:')} Sensitive fields decrypted

${chalk.yellow.bold('PUT ')} ${chalk.cyan('/api/profiles/:id')}                  ${chalk.white('✏️  Update existing profile')}
   ${chalk.gray('├─')} ${chalk.white('Body:')} Updated profile data
   ${chalk.gray('├─')} ${chalk.white('Files:')} Additional photos (optional)
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Required + clearance level check
   ${chalk.gray('└─')} ${chalk.white('Audit:')} All changes logged

${chalk.red.bold('DEL ')} ${chalk.cyan('/api/profiles/:id')}                    ${chalk.white('🗑️  Delete profile (soft delete)')}
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Top Secret clearance required
   ${chalk.gray('├─')} ${chalk.white('Action:')} Sets isActive = false
   ${chalk.gray('└─')} ${chalk.white('Audit:')} Deletion logged with user info

${chalk.blue.bold('GET ')} ${chalk.cyan('/api/profiles/search')}                ${chalk.white('🔎 Search profiles')}
   ${chalk.gray('├─')} ${chalk.white('Query:')} q (search term), type (name/id/contact/general)
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Required + clearance level check
   ${chalk.gray('├─')} ${chalk.white('Response:')} Matching profiles (limit 50)
   ${chalk.gray('└─')} ${chalk.white('Text Search:')} Full-text search capability

${chalk.yellow.bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${chalk.yellow.bold('┃')}                              ${chalk.white.bold('📊 STATISTICS & MONITORING ENDPOINTS')}                      ${chalk.yellow.bold('┃')}
${chalk.yellow.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}

${chalk.blue.bold('GET ')} ${chalk.cyan('/api/stats')}                          ${chalk.white('📈 Dashboard statistics')}
   ${chalk.gray('├─')} ${chalk.white('Response:')} Profile counts, risk distribution, trends
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Required + clearance level filtering
   ${chalk.gray('├─')} ${chalk.white('Real-time:')} Current system metrics
   ${chalk.gray('└─')} ${chalk.white('Caching:')} Optimized for performance

${chalk.blue.bold('GET ')} ${chalk.cyan('/api/stats/health')}                   ${chalk.white('🏥 System health check')}
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Top Secret clearance required
   ${chalk.gray('├─')} ${chalk.white('Response:')} Server status, DB health, memory usage
   ${chalk.gray('└─')} ${chalk.white('Monitoring:')} System performance metrics

${chalk.yellow.bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${chalk.yellow.bold('┃')}                              ${chalk.white.bold('📁 FILE MANAGEMENT ENDPOINTS')}                               ${chalk.yellow.bold('┃')}
${chalk.yellow.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}

${chalk.green.bold('POST')} ${chalk.cyan('/api/upload')}                        ${chalk.white('📤 Upload files (photos/documents)')}
   ${chalk.gray('├─')} ${chalk.white('Files:')} files[] (max 10 files, 10MB each)
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Required (JWT token)
   ${chalk.gray('├─')} ${chalk.white('Validation:')} File type & size validation
   ${chalk.gray('├─')} ${chalk.white('Storage:')} Secure upload directory
   ${chalk.gray('└─')} ${chalk.white('Response:')} File paths & metadata

${chalk.blue.bold('GET ')} ${chalk.cyan('/uploads/:filename')}                  ${chalk.white('📁 Access uploaded files')}
   ${chalk.gray('├─')} ${chalk.white('Security:')} Secure static file serving
   ${chalk.gray('├─')} ${chalk.white('Headers:')} Cache control & security headers
   ${chalk.gray('└─')} ${chalk.white('Access:')} Controlled file access

${chalk.yellow.bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${chalk.yellow.bold('┃')}                              ${chalk.white.bold('💾 BACKUP & RECOVERY ENDPOINTS')}                            ${chalk.yellow.bold('┃')}
${chalk.yellow.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}

${chalk.green.bold('POST')} ${chalk.cyan('/api/backup/trigger')}                ${chalk.white('🚀 Trigger manual backup')}
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Top Secret clearance required
   ${chalk.gray('├─')} ${chalk.white('Process:')} Full backup (MongoDB + JSON + Files)
   ${chalk.gray('├─')} ${chalk.white('Encryption:')} AES-256 encrypted archives
   ${chalk.gray('└─')} ${chalk.white('Response:')} Backup ID & status

${chalk.blue.bold('GET ')} ${chalk.cyan('/api/backup/status')}                  ${chalk.white('📊 Get backup system status')}
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Top Secret clearance required
   ${chalk.gray('├─')} ${chalk.white('Response:')} Backup counts, last backup info
   ${chalk.gray('└─')} ${chalk.white('Monitoring:')} Backup system health

${chalk.red.bold('POST')} ${chalk.cyan('/api/backup/restore')}                  ${chalk.white('⚠️  Restore from backup (DANGEROUS)')}
   ${chalk.gray('├─')} ${chalk.white('Body:')} { "backupId": "...", "confirmationCode": "..." }
   ${chalk.gray('├─')} ${chalk.white('Auth:')} Top Secret clearance + confirmation code
   ${chalk.gray('├─')} ${chalk.white('Warning:')} Destructive operation - overwrites data
   ${chalk.gray('└─')} ${chalk.white('Audit:')} Emergency-level logging

${chalk.yellow.bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${chalk.yellow.bold('┃')}                              ${chalk.white.bold('🏥 SYSTEM HEALTH ENDPOINTS')}                                ${chalk.yellow.bold('┃')}
${chalk.yellow.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}

${chalk.blue.bold('GET ')} ${chalk.cyan('/health')}                             ${chalk.white('❤️  Basic health check')}
   ${chalk.gray('├─')} ${chalk.white('Response:')} Server status, version, environment
   ${chalk.gray('├─')} ${chalk.white('Public:')} No authentication required
   ${chalk.gray('└─')} ${chalk.white('Monitoring:')} Basic system information

${chalk.blue.bold('GET ')} ${chalk.cyan('/')}                                   ${chalk.white('📚 API documentation root')}
   ${chalk.gray('├─')} ${chalk.white('Response:')} API overview & endpoints list
   ${chalk.gray('├─')} ${chalk.white('Public:')} No authentication required
   ${chalk.gray('└─')} ${chalk.white('Documentation:')} Quick reference guide

${chalk.green.bold('╔══════════════════════════════════════════════════════════════════════════════════════╗')}
${chalk.green.bold('║')}                              ${chalk.white.bold('🔒 SECURITY FEATURES SUMMARY')}                              ${chalk.green.bold('║')}
${chalk.green.bold('╚══════════════════════════════════════════════════════════════════════════════════════╝')}

${chalk.cyan('🛡️  Rate Limiting:')} ${chalk.white('Multiple tiers - Auth (5/15min), Profiles (10/hr), General (50/5min)')}
${chalk.cyan('🔐 Encryption:')} ${chalk.white('AES-256-GCM for sensitive fields, RSA-2048 for key exchange')}
${chalk.cyan('🌐 Network Security:')} ${chalk.white('IP whitelisting, network key authentication')}
${chalk.cyan('📝 Audit Logging:')} ${chalk.white('All operations logged with user tracking')}
${chalk.cyan('🚫 Input Validation:')} ${chalk.white('Joi validation, request sanitization, intrusion detection')}
${chalk.cyan('💾 Automated Backups:')} ${chalk.white('Every 6 hours - MongoDB + JSON + Files')}
${chalk.cyan('🔒 Session Security:')} ${chalk.white('Encrypted sessions, secure cookies, timeout controls')}
${chalk.cyan('⚡ Performance:')} ${chalk.white('Response caching, pagination, optimized queries')}

${chalk.red.bold('╔══════════════════════════════════════════════════════════════════════════════════════╗')}
${chalk.red.bold('║')}                              ${chalk.white.bold('⚠️  IMPORTANT SECURITY NOTES')}                               ${chalk.red.bold('║')}
${chalk.red.bold('╚══════════════════════════════════════════════════════════════════════════════════════╝')}

${chalk.yellow('🔑 Authentication:')} ${chalk.white('All protected endpoints require valid JWT token')}
${chalk.yellow('🏷️  Network Key:')} ${chalk.white('X-Network-Key header required for cross-system access')}
${chalk.yellow('🎚️  Clearance Levels:')} ${chalk.white('Restricted < Confidential < Top Secret')}
${chalk.yellow('📊 Data Access:')} ${chalk.white('Users can only access data within their clearance level')}
${chalk.yellow('🚨 Emergency Ops:')} ${chalk.white('Backup/restore operations require Top Secret clearance')}
${chalk.yellow('🔒 Audit Trail:')} ${chalk.white('All data access and modifications are logged')}
${chalk.yellow('💻 Two-System:')} ${chalk.white('Designed for secure two-system architecture')}

${chalk.magenta.bold('Server Running:')} ${chalk.cyan.bold('http://localhost:3001')} ${chalk.gray('(Local)')} | ${chalk.cyan.bold('http://0.0.0.0:3001')} ${chalk.gray('(Network)')}
        `);
    }

    static displayQuickStart() {
        console.log(`
${chalk.cyan.bold('╔══════════════════════════════════════════════════════════════════════════════════════╗')}
${chalk.cyan.bold('║')}                              ${chalk.white.bold('🚀 QUICK START GUIDE')}                                       ${chalk.cyan.bold('║')}
${chalk.cyan.bold('╚══════════════════════════════════════════════════════════════════════════════════════╝')}

${chalk.green.bold('1. Test Authentication:')}
   curl -X POST http://localhost:3001/api/auth/login \\
     -H "Content-Type: application/json" \\
     -H "X-Network-Key: ACCUST_NETWORK_ACCESS_KEY_CHANGE_IN_PRODUCTION_2025_SECRET" \\
     -d '{"pin": "2815"}'

${chalk.blue.bold('2. Get Dashboard Stats:')}
   curl -X GET http://localhost:3001/api/stats \\
     -H "Authorization: Bearer <your_jwt_token>" \\
     -H "X-Network-Key: ACCUST_NETWORK_ACCESS_KEY_CHANGE_IN_PRODUCTION_2025_SECRET"

${chalk.yellow.bold('3. Create Profile:')}
   curl -X POST http://localhost:3001/api/profiles \\
     -H "Authorization: Bearer <your_jwt_token>" \\
     -H "X-Network-Key: ACCUST_NETWORK_ACCESS_KEY_CHANGE_IN_PRODUCTION_2025_SECRET" \\
     -H "Content-Type: application/json" \\
     -d '{"fullName": "Test Subject", "age": 30, "gender": "Male", ...}'

${chalk.magenta.bold('4. Frontend Integration:')}
   const API_BASE_URL = 'http://localhost:3001/api';
   const NETWORK_KEY = 'ACCUST_NETWORK_ACCESS_KEY_CHANGE_IN_PRODUCTION_2025_SECRET';
        `);
    }
}

module.exports = APIDocumentation;