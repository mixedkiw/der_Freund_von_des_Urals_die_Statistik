#!/usr/bin/env bash
# Server-side setup script for nginx + certbot
# Usage on server as root: ./nginx_setup.sh example.com
set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "Run as root or with sudo"
  exit 1
fi

DOMAIN=${1:-}
if [ -z "$DOMAIN" ]; then
  echo "Usage: $0 domain.example.com"
  exit 2
fi

REMOTE_DIR=${REMOTE_DIR:-/var/www/frontend}

# Install nginx, ufw, certbot
apt update
apt install -y nginx ufw software-properties-common

# Open firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable || true

# Ensure remote dir exists
mkdir -p "$REMOTE_DIR"
chown -R www-data:www-data "$REMOTE_DIR"
chmod -R 755 "$REMOTE_DIR"

# Create nginx site config
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
cat > "$NGINX_CONF" <<'NGINXCONF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;

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

# replace placeholder
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$NGINX_CONF"

ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/$DOMAIN"

# Test and reload nginx
nginx -t && systemctl reload nginx

# Install certbot (deb package) and obtain cert
apt install -y certbot python3-certbot-nginx

# Obtain certificate with nginx plugin
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@$DOMAIN || {
  echo "certbot failed. Check DNS (it must point to this server) and try again.";
  exit 3;
}

# After certbot, nginx config will have been updated with SSL; ensure proper permissions
systemctl reload nginx

# Optional: configure automatic renewal (certbot sets up systemd timer)
certbot renew --dry-run

echo "nginx + TLS setup complete for $DOMAIN"
exit 0
