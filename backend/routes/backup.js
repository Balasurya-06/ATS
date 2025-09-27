const express = require('express');
const { triggerBackup, getBackupStatus, restoreBackup } = require('../controllers/backupController');
const { auth, logActivity } = require('../middleware/auth');

const router = express.Router();

// All backup routes require authentication
router.use(auth);

// GET /api/backup/status - Get backup status (Top Secret only)
router.get('/status', 
    logActivity('READ', 'BackupStatus'),
    getBackupStatus
);

// POST /api/backup/trigger - Trigger manual backup (Top Secret only)
router.post('/trigger', 
    logActivity('CREATE', 'Backup'),
    triggerBackup
);

// POST /api/backup/restore - Restore from backup (Top Secret only, extreme caution)
router.post('/restore', 
    logActivity('RESTORE', 'Backup'),
    restoreBackup
);

module.exports = router;