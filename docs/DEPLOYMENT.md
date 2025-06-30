# Deployment Guide

## Website Pengaduan SMP PLUS AT-THAHIRIN

### 🚀 Production Deployment

#### Prerequisites

- Ubuntu 20.04+ or CentOS 8+ server
- Node.js v16+ installed
- PostgreSQL 12+ installed
- Nginx installed
- SSL certificate (Let's Encrypt recommended)
- Domain name configured

---

### 🔧 Server Setup

#### 1. System Updates

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

#### 2. Install Node.js

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### 3. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib -y

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE school_management;
CREATE USER school_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE school_management TO school_user;
\q
```

#### 4. Install Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx -y

# Start and enable service
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

### 📁 Application Deployment

#### 1. Clone Application

```bash
# Create application directory
sudo mkdir -p /var/www/school-app
sudo chown $USER:$USER /var/www/school-app

# Clone repository
cd /var/www/school-app
git clone <repository-url> .

# Install dependencies
npm ci --only=production

# Install frontend dependencies
cd frontend
npm ci --only=production
npm run build
cd ..
```

#### 2. Environment Configuration

```bash
# Create production environment file
sudo nano /var/www/school-app/.env
```

```env
# Production Environment Variables
NODE_ENV=production

# Database Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=school_user
PGPASSWORD=secure_password
PGDATABASE=school_management

# Server Configuration
HOST=0.0.0.0
PORT=5000

# JWT Configuration (Use strong random keys)
ACCESS_TOKEN_KEY=your_256_bit_secret_key_here_must_be_very_long_and_secure
REFRESH_TOKEN_KEY=your_256_bit_refresh_secret_key_here_also_very_long_secure
ACCESS_TOKEN_AGE=1800

# Security
BCRYPT_ROUNDS=12
```

#### 3. Database Migration

```bash
cd /var/www/school-app
npm run migrate up
```

#### 4. Create System User

```bash
# Create dedicated user for the application
sudo useradd --system --shell /bin/false --home /var/www/school-app school-app
sudo chown -R school-app:school-app /var/www/school-app
```

---

### 🔄 Process Management with PM2

#### 1. Install PM2

```bash
sudo npm install -g pm2
```

#### 2. Create PM2 Configuration

```bash
# Create ecosystem file
nano /var/www/school-app/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'school-complaints-api',
      script: './src/server.js',
      cwd: '/var/www/school-app',
      user: 'school-app',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: '/var/log/school-app/error.log',
      out_file: '/var/log/school-app/access.log',
      log_file: '/var/log/school-app/combined.log',
      time: true,
      max_memory_restart: '500M',
      node_args: '--max-old-space-size=500',
    },
  ],
};
```

#### 3. Create Log Directory

```bash
sudo mkdir -p /var/log/school-app
sudo chown school-app:school-app /var/log/school-app
```

#### 4. Start Application

```bash
cd /var/www/school-app
sudo -u school-app pm2 start ecosystem.config.js

# Save PM2 configuration
sudo -u school-app pm2 save

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u school-app --hp /var/www/school-app
```

---

### 🔒 Nginx Configuration

#### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/school-app
```

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/json application/xml+rss;

    # Frontend Static Files
    location / {
        root /var/www/school-app/frontend/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Endpoints
    location /api/ {
        # Apply rate limiting
        limit_req zone=api burst=20 nodelay;

        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Auth Endpoints (stricter rate limiting)
    location /api/auth/ {
        limit_req zone=auth burst=5 nodelay;

        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health Check
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
        access_log off;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /(\.env|\.git|node_modules) {
        deny all;
    }
}
```

#### 2. Enable Site

```bash
# Test configuration
sudo nginx -t

# Enable site
sudo ln -s /etc/nginx/sites-available/school-app /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Restart Nginx
sudo systemctl restart nginx
```

---

### 🔐 SSL Certificate (Let's Encrypt)

#### 1. Install Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Obtain Certificate

```bash
# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

#### 3. Setup Auto-renewal

```bash
# Add cron job for auto-renewal
sudo crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

### 🔥 Firewall Configuration

#### 1. UFW Setup (Ubuntu)

```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

#### 2. Fail2Ban (Optional but recommended)

```bash
# Install fail2ban
sudo apt install fail2ban -y

# Create custom configuration
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 1800
findtime = 600
maxretry = 3

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
```

---

### 📊 Monitoring & Logging

#### 1. Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/school-app
```

```bash
/var/log/school-app/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    postrotate
        pm2 reload school-complaints-api
    endscript
}
```

#### 2. System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Monitor PM2 processes
pm2 monit

# View logs
pm2 logs school-complaints-api
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

#### 3. Database Monitoring

```bash
# PostgreSQL logging configuration
sudo nano /etc/postgresql/12/main/postgresql.conf

# Enable logging
log_statement = 'all'
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d '

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

### 🔄 Backup Strategy

#### 1. Database Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-school-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/school-app"
DB_NAME="school_management"
DB_USER="school_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
PGPASSWORD="secure_password" pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-school-db.sh

# Add to crontab for daily backup at 2 AM
sudo crontab -e
0 2 * * * /usr/local/bin/backup-school-db.sh
```

#### 2. Application Backup

```bash
# Create application backup script
sudo nano /usr/local/bin/backup-school-app.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/school-app"
APP_DIR="/var/www/school-app"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files (excluding node_modules)
tar --exclude='node_modules' --exclude='frontend/node_modules' --exclude='frontend/dist' -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /var/www school-app

# Remove backups older than 7 days
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +7 -delete

echo "Application backup completed: app_backup_$DATE.tar.gz"
```

---

### 🚀 Deployment Updates

#### 1. Zero-Downtime Deployment Script

```bash
# Create deployment script
sudo nano /usr/local/bin/deploy-school-app.sh
```

```bash
#!/bin/bash
APP_DIR="/var/www/school-app"
BACKUP_DIR="/var/backups/school-app"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Starting deployment..."

# Navigate to app directory
cd $APP_DIR

# Create backup
echo "Creating backup..."
tar -czf $BACKUP_DIR/pre_deploy_backup_$DATE.tar.gz --exclude='node_modules' .

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm ci --only=production

# Build frontend
echo "Building frontend..."
cd frontend
npm ci --only=production
npm run build
cd ..

# Run migrations
echo "Running migrations..."
npm run migrate up

# Reload PM2 processes
echo "Reloading application..."
pm2 reload ecosystem.config.js

# Test health
echo "Checking application health..."
sleep 5
curl -f http://localhost:5000/health || {
    echo "Health check failed! Rolling back..."
    pm2 reload ecosystem.config.js
    exit 1
}

echo "Deployment completed successfully!"
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/deploy-school-app.sh
```

#### 2. Rollback Script

```bash
# Create rollback script
sudo nano /usr/local/bin/rollback-school-app.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/school-app"
APP_DIR="/var/www/school-app"

echo "Available backups:"
ls -la $BACKUP_DIR/pre_deploy_backup_*.tar.gz

read -p "Enter backup filename to rollback to: " BACKUP_FILE

if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "Rolling back to $BACKUP_FILE..."

    # Stop application
    pm2 stop school-complaints-api

    # Remove current files
    rm -rf $APP_DIR/*

    # Restore backup
    tar -xzf $BACKUP_DIR/$BACKUP_FILE -C $APP_DIR

    # Restart application
    pm2 start ecosystem.config.js

    echo "Rollback completed!"
else
    echo "Backup file not found!"
    exit 1
fi
```

---

### 🔍 Health Checks & Alerts

#### 1. Health Check Endpoint

Add to your backend:

```javascript
// src/server.js
server.route({
  method: 'GET',
  path: '/health',
  handler: async (request, h) => {
    try {
      // Check database connection
      await pool.query('SELECT 1');

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      };
    } catch (error) {
      return h
        .response({
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        })
        .code(500);
    }
  },
});
```

#### 2. Monitoring Script

```bash
# Create monitoring script
sudo nano /usr/local/bin/monitor-school-app.sh
```

```bash
#!/bin/bash
HEALTH_URL="http://localhost:5000/health"
EMAIL="admin@school.com"

# Check application health
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $HTTP_STATUS -ne 200 ]; then
    echo "Application health check failed! Status: $HTTP_STATUS"

    # Send alert email (requires mail command)
    echo "School App health check failed at $(date)" | mail -s "School App Alert" $EMAIL

    # Try to restart application
    pm2 restart school-complaints-api

    # Log incident
    echo "$(date): Health check failed, attempted restart" >> /var/log/school-app/incidents.log
fi
```

```bash
# Add to crontab for monitoring every 5 minutes
sudo crontab -e
*/5 * * * * /usr/local/bin/monitor-school-app.sh
```

---

### 📋 Production Checklist

#### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Backup system in place
- [ ] Monitoring configured

#### Post-Deployment

- [ ] Application health check passes
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Database connections working
- [ ] SSL certificate valid
- [ ] Logs are being written
- [ ] PM2 processes running
- [ ] Nginx serving correctly

#### Security Checklist

- [ ] Default passwords changed
- [ ] Firewall rules configured
- [ ] SSL/TLS properly configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] File permissions set correctly
- [ ] Sensitive files protected
- [ ] Database access restricted

This comprehensive deployment guide ensures a secure, scalable, and maintainable production environment for the Website Pengaduan SMP PLUS AT-THAHIRIN.
