const express = require('express');
const { uploadFiles, handleUploadError } = require('../controllers/uploadController');
const { auth, logActivity } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All upload routes require authentication
router.use(auth);

// POST /api/upload - Upload files
router.post('/', 
    upload.array('files', 10),
    handleUploadError,
    logActivity('UPLOAD', 'File'),
    uploadFiles
);

module.exports = router;