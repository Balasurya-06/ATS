#!/usr/bin/env node

/**
 * ACCUST Emergency Backup Script
 * Run this script manually in case of emergency or system failure
 */

require('dotenv').config();
const mongoose = require('mongoose');
const BackupManager = require('../utils/backupManager');
const AuditLogger = require('../utils/auditLogger');

async function emergencyBackup() {
    try {
        console.log('🚨 EMERGENCY BACKUP INITIATED');
        console.log('================================');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'accust_secure_db'
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Perform backup
        const result = await BackupManager.performFullBackup('emergency');
        
        if (result.success) {
            console.log('✅ Emergency backup completed successfully');
            console.log('Backup ID:', result.backupId);
            console.log('Timestamp:', result.timestamp);
            console.log('Results:', JSON.stringify(result.results, null, 2));
        } else {
            console.error('❌ Emergency backup failed:', result.error);
            process.exit(1);
        }
        
        await mongoose.connection.close();
        console.log('✅ Emergency backup process completed');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Emergency backup error:', error);
        process.exit(1);
    }
}

// Handle script arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
ACCUST Emergency Backup Script

Usage:
  node backup.js                 - Perform emergency backup
  node backup.js --help         - Show this help message

This script will:
1. Connect to MongoDB
2. Export all data to encrypted JSON files
3. Create compressed backup archives
4. Verify backup integrity

Backup files will be stored in:
- MongoDB exports: ${process.env.BACKUP_PATH || './secure_backups'}/mongodb/
- JSON backups: ${process.env.JSON_BACKUP_PATH || './json_backups'}/
- Encrypted archives: ${process.env.BACKUP_PATH || './secure_backups'}/encrypted/
    `);
    process.exit(0);
}

// Run emergency backup
emergencyBackup();