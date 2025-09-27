const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const forge = require('node-forge');

class SecurityManager {
    constructor() {
        this.encryptionKey = process.env.ENCRYPTION_KEY || 'default_32_byte_key_change_in_prod!!';
        this.backupEncryptionKey = process.env.BACKUP_ENCRYPTION_KEY || 'backup_32_byte_key_change_prod!!!';
        this.algorithm = 'aes-256-gcm';
    }

    // AES-256-GCM Encryption for sensitive data
    encrypt(text) {
        if (!text) return text;
        
        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
            cipher.setAAD(Buffer.from('ACCUST_SECURITY', 'utf8'));
            
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const authTag = cipher.getAuthTag();
            
            return {
                encrypted,
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex')
            };
        } catch (error) {
            console.error('Encryption error:', error);
            return text;
        }
    }

    // AES-256-GCM Decryption
    decrypt(encryptedData) {
        if (!encryptedData || typeof encryptedData === 'string') return encryptedData;
        
        try {
            const { encrypted, iv, authTag } = encryptedData;
            const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
            
            decipher.setAAD(Buffer.from('ACCUST_SECURITY', 'utf8'));
            decipher.setAuthTag(Buffer.from(authTag, 'hex'));
            
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            console.error('Decryption error:', error);
            return encryptedData;
        }
    }

    // Enhanced Password Hashing with Salt and Pepper
    async hashPassword(password, salt = null) {
        const bcrypt = require('bcryptjs');
        const pepper = 'ACCUST_PEPPER_SECRET_2025'; // Additional security layer
        
        if (!salt) {
            salt = await bcrypt.genSalt(parseInt(process.env.ADMIN_PIN_HASH_ROUNDS) || 15);
        }
        
        const pepperedPassword = password + pepper;
        return await bcrypt.hash(pepperedPassword, salt);
    }

    // Verify Password with Pepper
    async verifyPassword(password, hash) {
        const bcrypt = require('bcryptjs');
        const pepper = 'ACCUST_PEPPER_SECRET_2025';
        const pepperedPassword = password + pepper;
        
        return await bcrypt.compare(pepperedPassword, hash);
    }

    // Generate secure random tokens
    generateSecureToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    // RSA Key Generation for additional security
    generateRSAKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        
        return { publicKey, privateKey };
    }

    // Encrypt large data with RSA + AES hybrid
    hybridEncrypt(data, publicKey) {
        // Generate random AES key
        const aesKey = crypto.randomBytes(32);
        
        // Encrypt data with AES
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher('aes-256-cbc', aesKey);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Encrypt AES key with RSA
        const encryptedKey = crypto.publicEncrypt(publicKey, aesKey);
        
        return {
            data: encrypted,
            key: encryptedKey.toString('base64'),
            iv: iv.toString('hex')
        };
    }

    // Hash for integrity checking
    createHash(data) {
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    // Verify data integrity
    verifyHash(data, hash) {
        const currentHash = this.createHash(data);
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(currentHash));
    }

    // Network IP validation
    isValidIP(ip, allowedIPs) {
        const ipRangeCheck = require('ip-range-check');
        const allowed = (process.env.ALLOWED_IPS || '127.0.0.1').split(',');
        
        return allowed.some(allowedRange => 
            ipRangeCheck(ip, allowedRange.trim())
        );
    }

    // Generate digital signature
    createDigitalSignature(data, privateKey) {
        const sign = crypto.createSign('SHA256');
        sign.update(JSON.stringify(data));
        return sign.sign(privateKey, 'hex');
    }

    // Verify digital signature
    verifyDigitalSignature(data, signature, publicKey) {
        const verify = crypto.createVerify('SHA256');
        verify.update(JSON.stringify(data));
        return verify.verify(publicKey, signature, 'hex');
    }

    // Secure data sanitization
    sanitizeData(data) {
        if (typeof data === 'string') {
            return data.replace(/<[^>]*>?/gm, '') // Remove HTML tags
                      .replace(/[<>\"'%;()&+]/g, '') // Remove dangerous characters
                      .trim();
        }
        
        if (typeof data === 'object' && data !== null) {
            const sanitized = {};
            for (const [key, value] of Object.entries(data)) {
                sanitized[key] = this.sanitizeData(value);
            }
            return sanitized;
        }
        
        return data;
    }
}

module.exports = new SecurityManager();