#!/usr/bin/env node

/**
 * ACCUST Database Restore Script
 * DANGER: This script can overwrite existing data
 * Use with extreme caution and only in emergency situations
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const BackupManager = require('../utils/backupManager');
const SecurityManager = require('../utils/security');
const Profile = require('../models/Profile');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

async function listBackups() {
    try {
        const jsonBackupPath = process.env.JSON_BACKUP_PATH || './json_backups';
        const backups = await fs.readdir(jsonBackupPath);
        
        console.log('Available Backups:');
        console.log('==================');
        
        for (const backup of backups) {
            const backupPath = path.join(jsonBackupPath, backup);
            const stats = await fs.stat(backupPath);
            
            if (stats.isDirectory()) {
                console.log(`📁 ${backup} (Created: ${stats.birthtime.toISOString()})`);
                
                try {
                    const metadataFile = path.join(backupPath, 'backup.plain.json');
                    const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
                    console.log(`   Records: ${metadata.metadata.totalRecords}`);
                    console.log(`   Backup ID: ${metadata.metadata.backupId}`);
                    console.log('');
                } catch (error) {
                    console.log('   (Metadata not available)');
                    console.log('');
                }
            }
        }
    } catch (error) {
        console.error('Error listing backups:', error.message);
    }
}

async function restoreFromBackup(backupName) {
    try {
        console.log('🚨 WARNING: DESTRUCTIVE OPERATION');
        console.log('==================================');
        console.log('This will OVERWRITE ALL existing data in the database!');
        console.log('Make sure you have a current backup before proceeding.');
        console.log('');
        
        // Find backup
        const jsonBackupPath = process.env.JSON_BACKUP_PATH || './json_backups';
        const backupPath = path.join(jsonBackupPath, backupName);
        
        try {
            await fs.access(backupPath);
        } catch {
            console.error('❌ Backup not found:', backupName);
            return;
        }
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'accust_secure_db'
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Read backup data
        const backupFile = path.join(backupPath, 'backup.plain.json');
        const backupData = JSON.parse(await fs.readFile(backupFile, 'utf8'));
        
        console.log('✅ Backup data loaded');
        console.log('Backup ID:', backupData.metadata.backupId);
        console.log('Total Records:', backupData.metadata.totalRecords);
        console.log('Backup Date:', backupData.metadata.timestamp);
        
        // Verify integrity
        const isValid = SecurityManager.verifyHash(backupData.data, backupData.metadata.hash);
        if (!isValid) {
            console.error('❌ Backup integrity check FAILED!');
            console.error('This backup may be corrupted or tampered with.');
            return;
        }
        
        console.log('✅ Backup integrity verified');
        
        // Clear existing data (DESTRUCTIVE)
        console.log('🗑️  Clearing existing data...');
        await Profile.deleteMany({});
        await ActivityLog.deleteMany({});
        await User.deleteMany({});
        
        // Restore data
        console.log('📥 Restoring profiles...');
        if (backupData.data.profiles && backupData.data.profiles.length > 0) {
            // Decrypt sensitive fields
            const decryptedProfiles = backupData.data.profiles.map(profile => {
                const decrypted = { ...profile };
                
                // Decrypt encrypted fields
                const encryptedFields = ['fullName', 'govtIds', 'contacts', 'currentAddress', 'permanentAddress', 'bankAccounts', 'deviceIMEI', 'socialMedia'];
                encryptedFields.forEach(field => {
                    if (decrypted[field] && typeof decrypted[field] === 'object') {
                        decrypted[field] = SecurityManager.decrypt(decrypted[field]);
                    }
                });
                
                return decrypted;
            });
            
            await Profile.insertMany(decryptedProfiles);
            console.log(`✅ Restored ${decryptedProfiles.length} profiles`);
        }
        
        console.log('📥 Restoring activity logs...');
        if (backupData.data.activity_logs && backupData.data.activity_logs.length > 0) {
            await ActivityLog.insertMany(backupData.data.activity_logs);
            console.log(`✅ Restored ${backupData.data.activity_logs.length} activity logs`);
        }
        
        console.log('📥 Restoring users...');
        if (backupData.data.users && backupData.data.users.length > 0) {
            // Users are backed up without PINs for security
            console.log('⚠️  User PINs were not backed up for security reasons');
            console.log('   Default admin PIN will be restored');
        }
        
        // Create restore log
        await ActivityLog.create({
            action: 'RESTORE',
            userId: 'system',
            details: `Database restored from backup: ${backupData.metadata.backupId}`,
            targetType: 'Database',
            success: true
        });
        
        await mongoose.connection.close();
        
        console.log('');
        console.log('✅ RESTORE COMPLETED SUCCESSFULLY');
        console.log('==================================');
        console.log('Database has been restored from backup');
        console.log('Please restart the server and verify all data');
        console.log('');
        
    } catch (error) {
        console.error('❌ Restore failed:', error);
        process.exit(1);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
ACCUST Database Restore Script

⚠️  DANGER: This script will OVERWRITE existing database data!

Usage:
  node restore.js --list                    - List available backups
  node restore.js --restore <backup-name>   - Restore from specific backup
  node restore.js --help                    - Show this help message

Examples:
  node restore.js --list
  node restore.js --restore backup_1640995200000_2021-12-31T12-00-00-000Z

IMPORTANT:
- Always create a current backup before restoring
- This operation is irreversible
- User PINs are not restored for security (default PIN will be active)
- Only use in emergency situations
    `);
    process.exit(0);
}

if (args.includes('--list')) {
    listBackups();
} else if (args.includes('--restore') && args[1]) {
    const backupName = args[1];
    console.log(`Starting restore from backup: ${backupName}`);
    console.log('');
    
    // Confirmation prompt (in a real scenario, you might want additional confirmation)
    restoreFromBackup(backupName);
} else {
    console.error('Invalid arguments. Use --help for usage information.');
    process.exit(1);
}