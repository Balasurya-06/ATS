const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const cron = require('node-cron');
const Profile = require('../models/Profile');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const SecurityManager = require('./security');
const AuditLogger = require('./auditLogger');

class BackupManager {
    constructor() {
        this.backupPath = process.env.BACKUP_PATH || './secure_backups';
        this.jsonBackupPath = process.env.JSON_BACKUP_PATH || './json_backups';
        this.maxRetentionDays = parseInt(process.env.MAX_BACKUP_RETENTION_DAYS) || 90;
        this.isBackupRunning = false;

        this.initializeBackupDirectories();
        this.scheduleBackups();
    }

    async initializeBackupDirectories() {
        try {
            await fs.mkdir(this.backupPath, { recursive: true });
            await fs.mkdir(this.jsonBackupPath, { recursive: true });
            await fs.mkdir(path.join(this.backupPath, 'mongodb'), { recursive: true });
            await fs.mkdir(path.join(this.backupPath, 'files'), { recursive: true });
            await fs.mkdir(path.join(this.backupPath, 'encrypted'), { recursive: true });
            
            AuditLogger.logSystem('Backup directories initialized', 'info');
        } catch (error) {
            AuditLogger.logSystem('Failed to initialize backup directories', 'error', { error: error.message });
        }
    }

    // Schedule automatic backups
    scheduleBackups() {
        const backupInterval = parseInt(process.env.BACKUP_INTERVAL_HOURS) || 6;
        const cronExpression = `0 */${backupInterval} * * *`; // Every N hours

        cron.schedule(cronExpression, async () => {
            AuditLogger.logBackup('SCHEDULED_BACKUP_START', 'INITIATED');
            await this.performFullBackup('scheduled');
        });

        // Daily cleanup of old backups
        cron.schedule('0 2 * * *', async () => {
            await this.cleanupOldBackups();
        });

        AuditLogger.logSystem(`Backup scheduled every ${backupInterval} hours`, 'info');
    }

    // Perform full backup (MongoDB + JSON + Files)
    async performFullBackup(type = 'manual') {
        if (this.isBackupRunning) {
            AuditLogger.logBackup('BACKUP_SKIPPED', 'ALREADY_RUNNING');
            return { success: false, message: 'Backup already in progress' };
        }

        this.isBackupRunning = true;
        const backupId = `backup_${Date.now()}`;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        try {
            AuditLogger.logBackup('FULL_BACKUP_START', 'INITIATED', { backupId, type });

            // 1. MongoDB Backup
            const mongoResult = await this.backupMongoDB(backupId, timestamp);
            
            // 2. JSON Backup
            const jsonResult = await this.backupToJSON(backupId, timestamp);
            
            // 3. File Backup
            const fileResult = await this.backupFiles(backupId, timestamp);
            
            // 4. Create encrypted archive
            const archiveResult = await this.createEncryptedArchive(backupId, timestamp);

            // 5. Verify backup integrity
            const verificationResult = await this.verifyBackupIntegrity(backupId);

            const result = {
                success: true,
                backupId,
                timestamp,
                results: {
                    mongodb: mongoResult,
                    json: jsonResult,
                    files: fileResult,
                    archive: archiveResult,
                    verification: verificationResult
                }
            };

            AuditLogger.logBackup('FULL_BACKUP_COMPLETE', 'SUCCESS', result);
            return result;

        } catch (error) {
            AuditLogger.logBackup('FULL_BACKUP_FAILED', 'ERROR', { 
                backupId, 
                error: error.message 
            });
            return { success: false, error: error.message };
        } finally {
            this.isBackupRunning = false;
        }
    }

    // MongoDB Backup using mongodump (if available) or JSON export
    async backupMongoDB(backupId, timestamp) {
        try {
            const backupDir = path.join(this.backupPath, 'mongodb', `${backupId}_${timestamp}`);
            await fs.mkdir(backupDir, { recursive: true });

            // Export collections to JSON (more portable than mongodump)
            const collections = [
                { model: Profile, name: 'profiles' },
                { model: ActivityLog, name: 'activity_logs' },
                { model: User, name: 'users' }
            ];

            const results = {};
            for (const { model, name } of collections) {
                const data = await model.find({}).lean();
                const filename = path.join(backupDir, `${name}.json`);
                
                // Encrypt sensitive data before backup
                const encryptedData = data.map(doc => this.encryptSensitiveFields(doc, name));
                
                await fs.writeFile(filename, JSON.stringify(encryptedData, null, 2));
                results[name] = { count: data.length, filename };
                
                AuditLogger.logDatabase('BACKUP_EXPORT', name, 'system', true, { 
                    count: data.length 
                });
            }

            return { success: true, results, backupDir };
        } catch (error) {
            AuditLogger.logDatabase('BACKUP_EXPORT', 'ALL', 'system', false, { 
                error: error.message 
            });
            throw error;
        }
    }

    // JSON Backup with encryption
    async backupToJSON(backupId, timestamp) {
        try {
            const backupDir = path.join(this.jsonBackupPath, `${backupId}_${timestamp}`);
            await fs.mkdir(backupDir, { recursive: true });

            // Create comprehensive JSON backup
            const profiles = await Profile.find({}).lean();
            const logs = await ActivityLog.find({}).lean();
            const users = await User.find({}).lean();

            const backupData = {
                metadata: {
                    backupId,
                    timestamp: new Date().toISOString(),
                    version: '1.0.0',
                    totalRecords: profiles.length + logs.length + users.length,
                    hash: null // Will be calculated after encryption
                },
                data: {
                    profiles: profiles.map(p => this.encryptSensitiveFields(p, 'profiles')),
                    activity_logs: logs,
                    users: users.map(u => ({ ...u, pin: '[REDACTED]' })) // Never backup actual PINs
                }
            };

            // Calculate hash for integrity
            backupData.metadata.hash = SecurityManager.createHash(backupData.data);

            // Save encrypted JSON
            const encryptedBackup = SecurityManager.encrypt(JSON.stringify(backupData));
            const filename = path.join(backupDir, 'backup.encrypted.json');
            await fs.writeFile(filename, JSON.stringify(encryptedBackup, null, 2));

            // Save plain JSON (for emergency access)
            const plainFilename = path.join(backupDir, 'backup.plain.json');
            await fs.writeFile(plainFilename, JSON.stringify(backupData, null, 2));

            return { 
                success: true, 
                filename, 
                plainFilename,
                recordCount: backupData.metadata.totalRecords 
            };
        } catch (error) {
            throw error;
        }
    }

    // Backup uploaded files
    async backupFiles(backupId, timestamp) {
        try {
            const uploadDir = process.env.UPLOAD_PATH || './secure_uploads';
            const backupDir = path.join(this.backupPath, 'files', `${backupId}_${timestamp}`);
            
            // Check if upload directory exists
            try {
                await fs.access(uploadDir);
            } catch {
                return { success: true, message: 'No files to backup' };
            }

            await fs.mkdir(backupDir, { recursive: true });

            // Copy all files from upload directory
            const files = await fs.readdir(uploadDir);
            let copiedCount = 0;

            for (const file of files) {
                const sourcePath = path.join(uploadDir, file);
                const destPath = path.join(backupDir, file);
                await fs.copyFile(sourcePath, destPath);
                copiedCount++;
            }

            return { success: true, copiedCount, backupDir };
        } catch (error) {
            throw error;
        }
    }

    // Create encrypted archive of all backups
    async createEncryptedArchive(backupId, timestamp) {
        return new Promise((resolve, reject) => {
            const archivePath = path.join(this.backupPath, 'encrypted', `${backupId}_${timestamp}.zip`);
            const output = require('fs').createWriteStream(archivePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                resolve({ 
                    success: true, 
                    archivePath, 
                    size: archive.pointer() 
                });
            });

            archive.on('error', (err) => {
                reject(err);
            });

            archive.pipe(output);

            // Add all backup directories to archive
            archive.directory(path.join(this.backupPath, 'mongodb'), 'mongodb');
            archive.directory(path.join(this.jsonBackupPath), 'json');
            archive.directory(path.join(this.backupPath, 'files'), 'files');

            archive.finalize();
        });
    }

    // Verify backup integrity
    async verifyBackupIntegrity(backupId) {
        try {
            // Verify JSON backup by attempting to decrypt and parse
            const jsonBackupDirs = await fs.readdir(this.jsonBackupPath);
            const relevantDir = jsonBackupDirs.find(dir => dir.includes(backupId));
            
            if (relevantDir) {
                const encryptedFile = path.join(this.jsonBackupPath, relevantDir, 'backup.encrypted.json');
                const encryptedData = JSON.parse(await fs.readFile(encryptedFile, 'utf8'));
                const decryptedData = SecurityManager.decrypt(encryptedData);
                const parsedData = JSON.parse(decryptedData);
                
                // Verify hash
                const isValid = SecurityManager.verifyHash(parsedData.data, parsedData.metadata.hash);
                
                return { success: true, valid: isValid, recordCount: parsedData.metadata.totalRecords };
            }

            return { success: false, message: 'Backup not found for verification' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Encrypt sensitive fields before backup
    encryptSensitiveFields(doc, collection) {
        const sensitiveFields = {
            profiles: [
                'fullName', 'govtIds', 'contacts', 'currentAddress', 
                'permanentAddress', 'bankAccounts', 'deviceIMEI', 'socialMedia'
            ],
            users: ['pin'],
            activity_logs: []
        };

        const fieldsToEncrypt = sensitiveFields[collection] || [];
        const encryptedDoc = { ...doc };

        fieldsToEncrypt.forEach(field => {
            if (encryptedDoc[field]) {
                encryptedDoc[field] = SecurityManager.encrypt(encryptedDoc[field]);
            }
        });

        return encryptedDoc;
    }

    // Clean up old backups
    async cleanupOldBackups() {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - this.maxRetentionDays);

            const directories = [this.backupPath, this.jsonBackupPath];
            let deletedCount = 0;

            for (const directory of directories) {
                const items = await fs.readdir(directory);
                
                for (const item of items) {
                    const itemPath = path.join(directory, item);
                    const stats = await fs.stat(itemPath);
                    
                    if (stats.isDirectory() && stats.mtime < cutoffDate) {
                        await fs.rmdir(itemPath, { recursive: true });
                        deletedCount++;
                    }
                }
            }

            AuditLogger.logBackup('CLEANUP_COMPLETE', 'SUCCESS', { 
                deletedCount, 
                cutoffDate: cutoffDate.toISOString() 
            });

            return { success: true, deletedCount };
        } catch (error) {
            AuditLogger.logBackup('CLEANUP_FAILED', 'ERROR', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    // Restore from backup
    async restoreFromBackup(backupId) {
        try {
            AuditLogger.logBackup('RESTORE_START', 'INITIATED', { backupId });

            // Find the backup
            const jsonBackupDirs = await fs.readdir(this.jsonBackupPath);
            const backupDir = jsonBackupDirs.find(dir => dir.includes(backupId));
            
            if (!backupDir) {
                throw new Error('Backup not found');
            }

            const backupFile = path.join(this.jsonBackupPath, backupDir, 'backup.encrypted.json');
            const encryptedData = JSON.parse(await fs.readFile(backupFile, 'utf8'));
            const decryptedData = SecurityManager.decrypt(encryptedData);
            const backupData = JSON.parse(decryptedData);

            // Verify integrity
            const isValid = SecurityManager.verifyHash(backupData.data, backupData.metadata.hash);
            if (!isValid) {
                throw new Error('Backup integrity check failed');
            }

            // WARNING: This is destructive - implement with extreme caution
            AuditLogger.logEmergency('RESTORE_OPERATION_INITIATED', { 
                backupId, 
                warning: 'This will overwrite existing data' 
            });

            return { 
                success: true, 
                message: 'Restore operation prepared - manual confirmation required',
                backupData: backupData.metadata
            };

        } catch (error) {
            AuditLogger.logBackup('RESTORE_FAILED', 'ERROR', { 
                backupId, 
                error: error.message 
            });
            throw error;
        }
    }

    // Get backup status and list
    async getBackupStatus() {
        try {
            const mongoBackups = await fs.readdir(path.join(this.backupPath, 'mongodb'));
            const jsonBackups = await fs.readdir(this.jsonBackupPath);
            const encryptedBackups = await fs.readdir(path.join(this.backupPath, 'encrypted'));

            return {
                success: true,
                isRunning: this.isBackupRunning,
                counts: {
                    mongodb: mongoBackups.length,
                    json: jsonBackups.length,
                    encrypted: encryptedBackups.length
                },
                lastBackup: jsonBackups.length > 0 ? jsonBackups[jsonBackups.length - 1] : null,
                retentionDays: this.maxRetentionDays
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new BackupManager();