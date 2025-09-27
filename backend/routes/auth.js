const express = require('express');
const { login, verifyToken } = require('../controllers/authController');
const { validateLogin } = require('../middleware/validation');
const { logActivity } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Authenticate with PIN
router.post('/login', 
    validateLogin, 
    logActivity('LOGIN', 'Auth'), 
    login
);

// GET /api/auth/verify - Verify JWT token
router.get('/verify', verifyToken);

module.exports = router;