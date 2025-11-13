# IndustriSense Deployment Guide

Complete guide for deploying IndustriSense to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Security Checklist](#security-checklist)
- [Monitoring](#monitoring)

## Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **PostgreSQL**: 17 or higher
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Storage**: 20GB minimum

### Required Services

- PostgreSQL database server
- Nginx or Apache web server
- SSL certificate (Let's Encrypt recommended)
- Domain name (optional but recommended)

## Environment Setup

### 1. Create Production Environment File

**Backend** (`backend/.env`):
```bash
# Django Settings
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com

# Database
DB_NAME=factory_maintenance_db
DB_USER=factory_user
DB_PASSWORD=strong-database-password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# JWT
ACCESS_TOKEN_LIFETIME=5  # hours
REFRESH_TOKEN_LIFETIME=7  # days
```

**Frontend** (`.env.production`):
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### 2. Generate Secret Key

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Database Configuration

### 1. Install PostgreSQL

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**CentOS/RHEL**:
```bash
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

```bash
sudo -u postgres psql

CREATE DATABASE factory_maintenance_db;
CREATE USER factory_user WITH PASSWORD 'strong-database-password';
ALTER ROLE factory_user SET client_encoding TO 'utf8';
ALTER ROLE factory_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE factory_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE factory_maintenance_db TO factory_user;
\q
```

### 3. Configure PostgreSQL for Remote Access (if needed)

Edit `/etc/postgresql/17/main/postgresql.conf`:
```
listen_addresses = 'localhost'  # or '*' for all interfaces
```

Edit `/etc/postgresql/17/main/pg_hba.conf`:
```
host    factory_maintenance_db    factory_user    127.0.0.1/32    md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## Backend Deployment

### 1. Install System Dependencies

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip nginx
```

### 2. Setup Application Directory

```bash
sudo mkdir -p /var/www/industrisense
sudo chown $USER:$USER /var/www/industrisense
cd /var/www/industrisense
```

### 3. Clone and Setup Backend

```bash
git clone https://github.com/AvishkarPatil/IndustriSense.git .
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

### 4. Run Migrations

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Setup Gunicorn

Create `/etc/systemd/system/industrisense.service`:
```ini
[Unit]
Description=IndustriSense Gunicorn daemon
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/industrisense/backend
Environment="PATH=/var/www/industrisense/backend/venv/bin"
ExecStart=/var/www/industrisense/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/var/www/industrisense/backend/gunicorn.sock \
          factory_maintenance.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start and enable service:
```bash
sudo systemctl start industrisense
sudo systemctl enable industrisense
sudo systemctl status industrisense
```

### 7. Configure Nginx

Create `/etc/nginx/sites-available/industrisense`:
```nginx
upstream industrisense_backend {
    server unix:/var/www/industrisense/backend/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 10M;

    location /static/ {
        alias /var/www/industrisense/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/industrisense/backend/media/;
    }

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://industrisense_backend;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/industrisense /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Frontend Deployment

### 1. Build Frontend

```bash
cd /var/www/industrisense/frontend
npm install
npm run build
```

### 2. Setup PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start npm --name "industrisense-frontend" -- start
pm2 save
pm2 startup
```

### 3. Configure Nginx for Frontend

Create `/etc/nginx/sites-available/industrisense-frontend`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/industrisense-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Security Checklist

### Django Security

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags:
  ```python
  SESSION_COOKIE_SECURE = True
  CSRF_COOKIE_SECURE = True
  SECURE_SSL_REDIRECT = True
  ```
- [ ] Configure CORS properly
- [ ] Enable security middleware
- [ ] Set up rate limiting

### Database Security

- [ ] Use strong database passwords
- [ ] Restrict database access to localhost
- [ ] Enable SSL for database connections
- [ ] Regular backups configured
- [ ] Limit user privileges

### Server Security

- [ ] Configure firewall (UFW/firewalld)
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Keep system updated
- [ ] Configure fail2ban
- [ ] Regular security audits

### Application Security

- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Implement rate limiting
- [ ] Use HTTPS everywhere
- [ ] Regular dependency updates
- [ ] Security headers configured

## Monitoring

### 1. Setup Logging

**Django Logging** (`settings.py`):
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/industrisense/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

### 2. Monitor Services

```bash
# Check backend status
sudo systemctl status industrisense

# Check frontend status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# View logs
sudo journalctl -u industrisense -f
pm2 logs industrisense-frontend
sudo tail -f /var/log/nginx/error.log
```

### 3. Database Backups

Create backup script `/usr/local/bin/backup-industrisense.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/industrisense"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U factory_user factory_maintenance_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup media files
tar -czf $BACKUP_DIR/media_$DATE.tar.gz /var/www/industrisense/backend/media/

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

Setup cron job:
```bash
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-industrisense.sh
```

## Troubleshooting

### Backend Issues

**502 Bad Gateway**:
- Check Gunicorn status: `sudo systemctl status industrisense`
- Check socket file: `ls -l /var/www/industrisense/backend/gunicorn.sock`
- Check logs: `sudo journalctl -u industrisense -n 50`

**Static Files Not Loading**:
- Run: `python manage.py collectstatic --noinput`
- Check Nginx configuration
- Verify file permissions

### Frontend Issues

**Application Not Starting**:
- Check PM2 status: `pm2 status`
- View logs: `pm2 logs industrisense-frontend`
- Verify environment variables

### Database Issues

**Connection Refused**:
- Check PostgreSQL status: `sudo systemctl status postgresql`
- Verify credentials in `.env`
- Check `pg_hba.conf` configuration

## Performance Optimization

### Database

```sql
-- Create indexes
CREATE INDEX idx_machine_status ON machines(status);
CREATE INDEX idx_reading_timestamp ON machine_readings(timestamp);
CREATE INDEX idx_workorder_status ON work_orders(status);
```

### Nginx Caching

```nginx
# Add to server block
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Gunicorn Workers

Calculate optimal workers:
```
workers = (2 x CPU cores) + 1
```

Update in systemd service file.

---

For additional support, refer to the main [README.md](README.md) or open an issue on GitHub.
