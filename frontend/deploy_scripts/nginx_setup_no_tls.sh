#!/usr/bin/env bash
# Server-side setup script for nginx without TLS (listen on HTTP only)
# Usage on server as root: ./nginx_setup_no_tls.sh
# This will: install nginx, open firewall, create /var/www/frontend, place a site config
# that serves the SPA and proxies /api to 127.0.0.1:3000.
set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "Run as root or with sudo"
  exit 1
fi

REMOTE_DIR=${REMOTE_DIR:-/var/www/frontend}

apt update
apt install -y nginx ufw

# Open firewall for SSH and HTTP
ufw allow OpenSSH || true
ufw allow 80/tcp || true
ufw --force enable || true

# Ensure remote dir exists
mkdir -p "$REMOTE_DIR"
chown -R www-data:www-data "$REMOTE_DIR"
chmod -R 755 "$REMOTE_DIR"

# Create nginx site config for HTTP (no TLS)
NGINX_CONF="/etc/nginx/sites-available/frontend"
cat > "$NGINX_CONF" <<'NGINXCONF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/frontend;
    index index.html;

    # Serve static files and fallback to index.html for SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to local backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXCONF

ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/frontend"

# Remove default site to avoid conflicts
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm -f /etc/nginx/sites-enabled/default
fi

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "nginx (HTTP) setup complete. Serving /var/www/frontend on port 80 and proxying /api -> 127.0.0.1:3000"
exit 0
