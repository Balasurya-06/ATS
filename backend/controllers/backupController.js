const BackupManager = require('../utils/backupManager');
const AuditLogger = require('../utils/auditLogger');
const SecurityManager = require('../utils/security');

// Trigger manual backup
const triggerBackup = async (req, res) => {
    try {
        if (req.user.clearanceLevel !== 'Top Secret') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient clearance for backup operations'
            });
        }

        AuditLogger.logSystem('Manual backup triggered', 'info', { 
            userId: req.user.userId 
        });

        const result = await BackupManager.performFullBackup('manual');

        if (result.success) {
            res.json({
                success: true,
                message: 'Backup completed successfully',
                data: result
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Backup failed',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Backup trigger error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to trigger backup'
        });
    }
};

// Get backup status
const getBackupStatus = async (req, res) => {
    try {
        if (req.user.clearanceLevel !== 'Top Secret') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient clearance for backup information'
            });
        }

        const status = await BackupManager.getBackupStatus();
        
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Get backup status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve backup status'
        });
    }
};

// Restore from backup (extremely restricted)
const restoreBackup = async (req, res) => {
    try {
        if (req.user.clearanceLevel !== 'Top Secret') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient clearance for restore operations'
            });
        }

        const { backupId, confirmationCode } = req.body;
        
        if (!backupId || !confirmationCode) {
            return res.status(400).json({
                success: false,
                message: 'Backup ID and confirmation code required'
            });
        }

        // Require special confirmation code for restore operations
        const expectedCode = SecurityManager.createHash(`${backupId}_${req.user.userId}_RESTORE`).substring(0, 16);
        
        if (confirmationCode !== expectedCode) {
            AuditLogger.logEmergency('Unauthorized restore attempt', {
                userId: req.user.userId,
                backupId,
                ip: req.ip
            });
            
            return res.status(403).json({
                success: false,
                message: 'Invalid confirmation code'
            });
        }

        AuditLogger.logEmergency('RESTORE OPERATION INITIATED', {
            userId: req.user.userId,
            backupId,
            ip: req.ip,
            warning: 'This will overwrite existing data'
        });

        const result = await BackupManager.restoreFromBackup(backupId);

        res.json({
            success: true,
            message: 'Restore operation prepared - requires additional confirmation',
            data: result,
            warning: 'This operation is irreversible and will overwrite all current data'
        });

    } catch (error) {
        console.error('Restore backup error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to restore backup'
        });
    }
};

module.exports = {
    triggerBackup,
    getBackupStatus,
    restoreBackup
};