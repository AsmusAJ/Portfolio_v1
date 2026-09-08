# Production Deployment Guide

This guide covers deploying the portfolio backend to a DigitalOcean droplet and configuring Cloudflare Pages for the frontend.

## Architecture

```
Cloudflare Pages (Frontend)
    ↓ api.<domain>
Cloudflare DNS
    ↓
DigitalOcean Droplet
    ├─ Nginx (reverse proxy, TLS termination)
    └─ Kestrel (ASP.NET Core, internal)
    
SQLite Database: /var/lib/portfolio/app.db
```

## Prerequisites

- DigitalOcean droplet with Ubuntu 24.04 LTS or similar
- SSH key-based access configured
- Domain configured with Cloudflare DNS
- Frontend already deployed on Cloudflare Pages

## Step 1: Prepare the DigitalOcean Droplet

### 1.1 Initial Security Configuration

```bash
# SSH into the droplet as root
ssh root@<droplet-ip>

# Update system
apt update && apt upgrade -y

# Install basic utilities
apt install -y curl wget git unzip htop

# Install UFW and configure firewall
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Disable root login and password authentication
sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### 1.2 Create Deployment User

```bash
# Create non-root user for deployment
adduser --disabled-password --gecos "Portfolio Service" portfolio

# Add SSH key for the deployment user
su - portfolio
mkdir -p ~/.ssh
# Paste your public key into ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
exit

# Give portfolio user sudo without password for systemctl
echo "portfolio ALL=(ALL) NOPASSWD: /bin/systemctl" >> /etc/sudoers.d/portfolio
```

### 1.3 Install .NET Runtime and Dependencies

```bash
# Install .NET 8 ASP.NET Core Runtime
wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0 --runtime aspnetcore --install-dir /opt/dotnet

# Add to PATH
echo 'export PATH="/opt/dotnet:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
/opt/dotnet/dotnet --version
```

### 1.4 Install and Configure Nginx

```bash
# Install Nginx
apt install -y nginx

# Install Certbot for HTTPS
apt install -y certbot python3-certbot-nginx

# Create Nginx configuration for the API
cat > /etc/nginx/sites-available/api.anthonyasmus.com << 'NGINX_CONFIG'
upstream kestrel {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.anthonyasmus.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.anthonyasmus.com;

    # SSL certificates will be added by Certbot
    ssl_certificate /etc/letsencrypt/live/api.anthonyasmus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.anthonyasmus.com/privkey.pem;

    # Recommended SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/api.access.log;
    error_log /var/log/nginx/api.error.log;

    # Proxy settings
    location / {
        proxy_pass http://kestrel;
        proxy_http_version 1.1;
        
        # Pass headers for reverse proxy detection
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX_CONFIG

# Enable the site
ln -s /etc/nginx/sites-available/api.anthonyasmus.com /etc/nginx/sites-enabled/

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx
```

### 1.5 Create Application Directories

```bash
# Create application directory
mkdir -p /opt/portfolio/server
chown portfolio:portfolio /opt/portfolio

# Create data directory for SQLite database
mkdir -p /var/lib/portfolio
chown portfolio:portfolio /var/lib/portfolio
chmod 755 /var/lib/portfolio
```

## Step 2: Deploy the Backend

### 2.1 Initial Deployment

From your local machine:

```bash
cd Portfolio_v1
chmod +x scripts/deploy.sh
./scripts/deploy.sh api.anthonyasmus.com portfolio 22
```

The deployment script will:
- Build the release locally
- Archive and upload to the server
- Extract to `/opt/portfolio/server`
- Backup the current release
- Start the service

### 2.2 Create Systemd Service

On the droplet:

```bash
cat > /etc/systemd/system/portfolio-api.service << 'SYSTEMD_CONFIG'
[Unit]
Description=Portfolio API Service
After=network.target

[Service]
Type=simple
User=portfolio
WorkingDirectory=/opt/portfolio/server
ExecStart=/opt/dotnet/dotnet /opt/portfolio/server/server.dll
Restart=on-failure
RestartSec=10
Environment="ASPNETCORE_ENVIRONMENT=Production"
Environment="ASPNETCORE_URLS=http://127.0.0.1:5000"

[Install]
WantedBy=multi-user.target
SYSTEMD_CONFIG

# Enable and start the service
systemctl daemon-reload
systemctl enable portfolio-api
systemctl start portfolio-api

# Check status
systemctl status portfolio-api

# Check logs
journalctl -u portfolio-api -n 50 -f
```

## Step 3: Configure SSL/TLS

### 3.1 Obtain SSL Certificate

```bash
certbot certonly --nginx -d api.anthonyasmus.com
```

### 3.2 Auto-Renewal

```bash
# Certbot auto-renewal is typically enabled by default
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal
certbot renew --dry-run
```

## Step 4: Update Cloudflare DNS

1. Log in to Cloudflare
2. Go to your domain's DNS settings
3. Create an `A` record for `api.<domain>` pointing to your droplet's IP
4. Set SSL/TLS encryption mode to "Full (strict)"
5. Ensure the API record is proxied through Cloudflare or not, depending on your firewall setup

## Step 5: Configure Cloudflare Pages

### 5.1 Update Frontend Environment Variables

In Cloudflare Pages project settings:

- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_BASE_URL` = `https://api.anthonyasmus.com`

### 5.2 Configure Custom Domain

- Add your custom domain (e.g., `anthonyasmus.com`) to Pages
- Ensure Cloudflare DNS is set to proxy Pages requests

## Monitoring and Maintenance

### Health Checks

```bash
# Test from the droplet
curl http://127.0.0.1:5000/api/health

# Test from the internet (if firewall allows)
curl https://api.anthonyasmus.com/api/health
```

### Logs

```bash
# View service logs
journalctl -u portfolio-api -f

# View Nginx access logs
tail -f /var/log/nginx/api.access.log

# View Nginx error logs
tail -f /var/log/nginx/api.error.log
```

### Disk Usage

```bash
# Monitor disk usage
df -h
du -sh /var/lib/portfolio
du -sh /var/backups/portfolio

# If SQLite database grows too large, consider:
# 1. Archiving old backups
# 2. Migrating to PostgreSQL
# 3. Implementing data retention policies
```

## Deployment Updates

To deploy a new version:

```bash
# From your local machine
./scripts/deploy.sh api.anthonyasmus.com portfolio 22
```

The script will:
1. Build a new release
2. Back up the current release
3. Extract the new version
4. Restart the service
5. Verify the health check

To rollback to the previous version:

```bash
# On the droplet
ls -la /opt/portfolio/releases-backup/

# Restore previous version
sudo systemctl stop portfolio-api
sudo rm -rf /opt/portfolio/server/*
sudo cp -r /opt/portfolio/releases-backup/release-<timestamp>/* /opt/portfolio/server/
sudo systemctl start portfolio-api
```

## Troubleshooting

### Service won't start

```bash
# Check logs
journalctl -u portfolio-api -n 100

# Check if port is in use
sudo lsof -i :5000

# Verify .NET runtime
/opt/dotnet/dotnet --version
```

### Database connection errors

```bash
# Verify database file exists
ls -la /var/lib/portfolio/app.db

# Check database integrity
sqlite3 /var/lib/portfolio/app.db "PRAGMA integrity_check;"

# Restore from backup if corrupted
sudo systemctl stop portfolio-api
sudo cp /var/backups/portfolio/app.db.backup.*.sqlite /var/lib/portfolio/app.db
sudo systemctl start portfolio-api
```

### CORS errors in browser

1. Verify the frontend origin is in `appsettings.Production.json`
2. Check Nginx is passing required headers (X-Forwarded-Proto, etc.)
3. Verify Cloudflare SSL mode matches your certificate setup

## Security Considerations

- Monitor disk usage; SQLite can grow with usage over time
- Keep the OS and .NET runtime updated
- Use strong SSH keys and disable password authentication
- Monitor failed health checks and set up alerts

## Further Reading

- [.NET Deployment on Linux](https://learn.microsoft.com/en-us/dotnet/core/runtime-config/run-time-options)
- [Nginx Reverse Proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [SQLite Backup Strategy](https://www.sqlite.org/backup.html)
- [Cloudflare Pages Configuration](https://developers.cloudflare.com/pages/)
