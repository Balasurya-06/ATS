# ACCUST Backend - Ultra-Secure Installation Guide

## 🔒 Security Overview

This backend implements **maximum security** protocols for the ACCUST Management System:

- **Multiple Encryption Layers**: AES-256-GCM + RSA-2048 + bcrypt with pepper
- **Automated Backups**: MongoDB exports + JSON backups + encrypted archives
- **Real-time Monitoring**: Intrusion detection, audit logging, suspicious activity tracking
- **Network Security**: IP whitelisting, cross-system authentication, rate limiting
- **Data Protection**: Field-level encryption, integrity verification, secure deletion

## 🚀 Quick Setup (Local Secure MongoDB)

### 1. Install MongoDB Locally (Recommended for Maximum Security)

```bash
# Ubuntu/Debian
sudo apt-get install mongodb-server

# Start MongoDB with authentication
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create secure database
mongosh
use accust_secure_db
db.createUser({
  user: "accust_admin",
  pwd: "your_very_secure_password_here",
  roles: ["readWrite", "dbAdmin"]
})
```

### 2. Install Dependencies

```bash
cd /home/kingpin/Projects/ATS/backend
npm install
```

### 3. Security Configuration

```bash
# Copy and customize security config
cp .env.secure .env

# Edit .env file with your settings
nano .env
```

**Critical Environment Variables:**
```env
# Local MongoDB (Most Secure)
MONGODB_URI=mongodb://accust_admin:your_password@localhost:27017/accust_secure_db

# Security Keys (CHANGE THESE!)
JWT_SECRET=CHANGE_THIS_TO_VERY_LONG_RANDOM_STRING_FOR_PRODUCTION
ENCRYPTION_KEY=CHANGE_THIS_32_BYTE_KEY_FOR_AES_256_ENCRYPTION_NOW
BACKUP_ENCRYPTION_KEY=ANOTHER_32_BYTE_KEY_FOR_BACKUP_ENCRYPTION_CHANGE

# Network Security (Add your system IPs)
ALLOWED_IPS=127.0.0.1,192.168.1.100,192.168.1.101
NETWORK_KEY=SHARED_SECRET_KEY_BETWEEN_SYSTEMS_CHANGE_THIS

# Backup Configuration
ENABLE_JSON_BACKUP=true
BACKUP_INTERVAL_HOURS=6
MAX_BACKUP_RETENTION_DAYS=90
```

### 4. Create Secure Directories

```bash
mkdir -p secure_uploads secure_backups json_backups audit_logs
chmod 700 secure_uploads secure_backups json_backups audit_logs
```

### 5. Start Server

```bash
# Development mode
npm run dev

# Production mode (Maximum Security)
npm run secure
```

## 🌐 Two-System Network Setup

### System 1 (Primary Server)
```bash
# Configure as primary server
echo "NODE_ID=PRIMARY" >> .env
echo "ALLOWED_IPS=192.168.1.100,192.168.1.101" >> .env
echo "NETWORK_KEY=your_shared_secret_key" >> .env

# Start server
npm run secure
```

### System 2 (Client System)
Frontend connects to System 1 via network IP:
```javascript
// In your frontend API configuration
const API_BASE_URL = '10.123.5.63/api';
const NETWORK_KEY = 'your_shared_secret_key';

// Add network key to all requests
headers: {
  'X-Network-Key': NETWORK_KEY,
  'Authorization': `Bearer ${token}`
}
```

## 🔐 Security Features

### 1. Multi-Layer Encryption
- **Database**: Field-level encryption for sensitive data
- **Backups**: AES-256 encrypted JSON files
- **Sessions**: Encrypted session storage
- **Files**: Secure upload directory with access controls

### 2. Automated Backup System
```bash
# Manual backup
npm run backup

# List available backups
npm run restore -- --list

# Emergency restore (DANGEROUS!)
npm run restore -- --restore backup_name_here
```

### 3. Real-time Security Monitoring
- **Audit Logs**: `audit_logs/security/`
- **Access Logs**: `audit_logs/access/`
- **System Logs**: `audit_logs/system/`

### 4. Intrusion Detection
- SQL injection detection
- XSS attempt blocking
- Path traversal prevention
- Suspicious pattern recognition
- Rate limiting & brute force protection

## 🛡️ API Security

### Authentication
```bash
# Login (with rate limiting)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Network-Key: your_network_key" \
  -d '{"pin": "1425"}'
```

### Profile Operations (Encrypted)
```bash
# Create profile (with file uploads)
curl -X POST http://localhost:3000/api/profiles \
  -H "Authorization: Bearer your_jwt_token" \
  -H "X-Network-Key: your_network_key" \
  -F "fullName=John Doe" \
  -F "photos=@photo.jpg"
```

### Backup Operations (Top Secret Only)
```bash
# Trigger backup
curl -X POST http://localhost:3000/api/backup/trigger \
  -H "Authorization: Bearer top_secret_token" \
  -H "X-Network-Key: your_network_key"

# Get backup status
curl -X GET http://localhost:3000/api/backup/status \
  -H "Authorization: Bearer top_secret_token" \
  -H "X-Network-Key: your_network_key"
```

## 📊 Monitoring & Maintenance

### Security Log Monitoring
```bash
# Watch security events in real-time
tail -f audit_logs/security/security-$(date +%Y-%m-%d).log

# Check for suspicious activities
grep "SUSPICIOUS" audit_logs/security/*.log

# Monitor failed logins
grep "AUTH_EVENT.*false" audit_logs/security/*.log
```

### Database Health
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Monitor database size
du -sh /var/lib/mongodb/

# Check backup integrity
ls -la secure_backups/encrypted/
```

### Performance Monitoring
```bash
# Check server resources
htop

# Monitor network connections
netstat -tulpn | grep :3000

# Check log file sizes
du -sh audit_logs/
```

## 🚨 Emergency Procedures

### 1. System Compromise Detected
```bash
# Immediate shutdown
sudo systemctl stop your-app-service

# Create emergency backup
node scripts/backup.js

# Review security logs
grep -i "emergency\|suspicious\|failed" audit_logs/security/*.log
```

### 2. Data Recovery
```bash
# List all available backups
node scripts/restore.js --list

# Restore from specific backup (DESTRUCTIVE!)
node scripts/restore.js --restore backup_name_here
```

### 3. Network Security Breach
```bash
# Enable maximum restrictions
echo "ALLOWED_IPS=127.0.0.1" >> .env

# Change all security keys
echo "NETWORK_KEY=$(openssl rand -hex 32)" >> .env
echo "JWT_SECRET=$(openssl rand -hex 64)" >> .env

# Restart with new config
npm run secure
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongodb
   
   # Restart MongoDB
   sudo systemctl restart mongodb
   ```

2. **Permission Denied on Directories**
   ```bash
   # Fix permissions
   chmod -R 700 secure_uploads secure_backups json_backups audit_logs
   chown -R $USER:$USER secure_uploads secure_backups json_backups audit_logs
   ```

3. **Network Access Issues**
   ```bash
   # Check firewall
   sudo ufw status
   
   # Allow port (if needed)
   sudo ufw allow 3000
   ```

4. **High Memory Usage**
   ```bash
   # Check backup size
   du -sh secure_backups/
   
   # Clean old backups
   find secure_backups/ -type f -mtime +90 -delete
   ```

## 📋 Security Checklist

- [ ] MongoDB running locally with authentication
- [ ] All environment variables changed from defaults  
- [ ] IP whitelist configured for network access
- [ ] Backup system tested and verified
- [ ] Audit logs being generated and stored
- [ ] File permissions set correctly (700)
- [ ] Network key shared securely between systems
- [ ] SSL/TLS enabled (for production)
- [ ] Firewall configured to allow only necessary ports
- [ ] Regular backup verification scheduled

## ⚠️ Important Security Notes

1. **Never use default passwords/keys in production**
2. **Regularly rotate encryption keys and network keys**
3. **Monitor audit logs daily for suspicious activity**
4. **Test backup/restore procedures monthly**
5. **Keep the system isolated from public internet**
6. **Use VPN for remote access if required**
7. **Implement physical security for server systems**
8. **Regular security updates for OS and dependencies**

## 📞 Emergency Contacts

In case of security incident:
1. Immediately isolate the system from network
2. Create emergency backup using: `node scripts/backup.js`
3. Document all suspicious activities
4. Contact system administrator immediately