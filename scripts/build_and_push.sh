#!/usr/bin/env bash
set -euo pipefail

GH_USER=${GH_USER:-}
GHCR_TOKEN=${GHCR_TOKEN:-}
IMAGE_TAG=${IMAGE_TAG:-latest}

if [ -z "$GH_USER" ] || [ -z "$GHCR_TOKEN" ]; then
  echo "Please set GH_USER and GHCR_TOKEN environment variables to push to ghcr.io"
  echo "Example: GH_USER=youruser GHCR_TOKEN=ghp_xxx ./scripts/build_and_push.sh"
  exit 1
fi

echo "Building backend image"
docker build -t ghcr.io/${GH_USER}/derfreund-backend:${IMAGE_TAG} ./backend

echo "Building frontend image (with VITE_API_URL build-arg)"
docker build --build-arg VITE_API_URL=http://77.222.105.3/api -t ghcr.io/${GH_USER}/derfreund-frontend:${IMAGE_TAG} ./frontend

echo "Logging in to ghcr.io"
echo $GHCR_TOKEN | docker login ghcr.io -u $GH_USER --password-stdin

echo "Pushing images"
docker push ghcr.io/${GH_USER}/derfreund-backend:${IMAGE_TAG}
docker push ghcr.io/${GH_USER}/derfreund-frontend:${IMAGE_TAG}

echo "Done."
