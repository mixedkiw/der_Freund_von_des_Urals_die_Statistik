#!/usr/bin/env bash
# Local helper: rsync dist to server and optionally run remote setup
# Usage: DOMAIN=example.com ./local_deploy.sh
set -euo pipefail

SSH_USER=${SSH_USER:-root}
SSH_HOST=${SSH_HOST:-144.31.68.248}
SSH_PORT=${SSH_PORT:-1124}
DIST_DIR=${DIST_DIR:-./dist}
REMOTE_DIR=${REMOTE_DIR:-/var/www/frontend}
DOMAIN=${DOMAIN:-}

if [ ! -d "$DIST_DIR" ]; then
  echo "Error: dist directory not found: $DIST_DIR"
  exit 1
fi

if [ -z "$DOMAIN" ]; then
  echo "WARNING: No DOMAIN specified. Let's Encrypt cannot issue certs for bare IPs."
  echo "If you don't have a domain, the script will still upload files but you will need to use a self-signed cert or configure other TLS means."
  read -p "Continue? [y/N] " yn
  case $yn in
    [Yy]*) ;;
    *) echo "Aborted."; exit 1;;
  esac
fi

RSYNC_OPTS="-avz --delete --exclude='.git'"

echo "Uploading $DIST_DIR to $SSH_USER@$SSH_HOST:$REMOTE_DIR (port $SSH_PORT)"
rsync $RSYNC_OPTS -e "ssh -p $SSH_PORT" "$DIST_DIR/" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

if [ -n "$DOMAIN" ]; then
  echo "Running remote nginx setup (will install nginx/certbot and enable site)"
  ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "bash -s" < ./deploy_scripts/nginx_setup.sh -- $DOMAIN
  echo "Remote nginx setup triggered."
else
  echo "No domain provided; skipping remote TLS configuration. You may still want to run deploy_scripts/nginx_setup.sh on the server manually (and replace CERT steps)."
fi

echo "Done. After DNS+TLS is ready, test with:"
echo "  curl -I https://$DOMAIN/"
echo "  curl -v -X POST https://$DOMAIN/api/save -H 'Content-Type: application/json' -d '{\"name\":\"test\"}'"

exit 0
