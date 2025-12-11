#!/usr/bin/env bash
# Server-side helper to install/run Caddy and place a Caddyfile
# Usage on server as root: ./caddy_setup.sh example.com
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

# Download + install caddy
apt update
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy

# Ensure remote dir
mkdir -p "$REMOTE_DIR"
chown -R www-data:www-data "$REMOTE_DIR"
chmod -R 755 "$REMOTE_DIR"

# Write Caddyfile
CADDYFILE="/etc/caddy/Caddyfile"
cat > "$CADDYFILE" <<CADDY
$DOMAIN {
    root * /var/www/frontend
    file_server

    handle_path /api/* {
        reverse_proxy 127.0.0.1:3000
    }

    # SPA fallback
    try_files {path} /index.html
}
CADDY

systemctl reload caddy

echo "Caddy setup complete for $DOMAIN. Caddy provides automatic TLS via Let's Encrypt."
exit 0
