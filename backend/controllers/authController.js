const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Initialize default admin user
const initializeAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ userId: 'admin' });
        if (!existingAdmin) {
            const hashedPin = await bcrypt.hash(process.env.ADMIN_PIN || '1425', 10);
            await User.create({
                userId: 'admin',
                pin: await bcrypt.hash('2815' + process.env.BCRYPT_PEPPER, 12),
                role: 'admin',
                fullName: 'System Administrator',
                department: 'ACCUST Management',
                clearanceLevel: 'Top Secret'
            });
            console.log('Default admin user created');
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
    }
};

const login = async (req, res) => {
    try {
        const { pin } = req.validatedData;
        const ipAddress = req.ip || req.connection.remoteAddress;
        
        // Find admin user
        const user = await User.findOne({ userId: 'admin', isActive: true });
        if (!user) {
            await ActivityLog.create({
                action: 'LOGIN',
                userId: 'unknown',
                details: 'Login attempt - user not found',
                ipAddress,
                userAgent: req.headers['user-agent'],
                success: false,
                errorMessage: 'User not found'
            });
            
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > Date.now()) {
            await ActivityLog.create({
                action: 'LOGIN',
                userId: user.userId,
                details: 'Login attempt - account locked',
                ipAddress,
                userAgent: req.headers['user-agent'],
                success: false,
                errorMessage: 'Account locked'
            });
            
            return res.status(423).json({
                success: false,
                message: 'Account temporarily locked due to failed attempts'
            });
        }

        // Verify PIN
        const isValidPin = await bcrypt.compare(pin, user.pin);
        if (!isValidPin) {
            // Increment login attempts
            user.loginAttempts += 1;
            
            // Lock account after 5 failed attempts for 15 minutes
            if (user.loginAttempts >= 5) {
                user.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
            }
            
            await user.save();
            
            await ActivityLog.create({
                action: 'LOGIN',
                userId: user.userId,
                details: 'Failed login attempt',
                ipAddress,
                userAgent: req.headers['user-agent'],
                success: false,
                errorMessage: 'Invalid PIN'
            });
            
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockedUntil = undefined;
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.userId,
                role: user.role,
                clearanceLevel: user.clearanceLevel
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        await ActivityLog.create({
            action: 'LOGIN',
            userId: user.userId,
            details: 'Successful login',
            ipAddress,
            userAgent: req.headers['user-agent'],
            success: true
        });

        res.json({
            success: true,
            message: 'Authentication successful',
            data: {
                token,
                user: {
                    userId: user.userId,
                    fullName: user.fullName,
                    role: user.role,
                    department: user.department,
                    clearanceLevel: user.clearanceLevel
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const verifyToken = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId, isActive: true });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    userId: user.userId,
                    fullName: user.fullName,
                    role: user.role,
                    department: user.department,
                    clearanceLevel: user.clearanceLevel
                }
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = { login, verifyToken, initializeAdminUser };