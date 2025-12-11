# Docker deployment (frontend + backend)

This document explains how to build Docker images for the frontend and backend and run them on your server at IP 77.222.105.3.

Summary:
- Frontend image builds the Vite app and serves it with Nginx. Nginx proxies `/api/*` to the `backend` service in Docker Compose.
- Backend image uses the existing `backend/Dockerfile` (Node/Express) and stores DB under `/app/data` (mounted to host `./backend/data`).
- `docker-compose.yml` is provided to run both services together and expose port 80 on the host.

Steps (local) — build and push images to GitHub Container Registry (GHCR):

1. Create a Personal Access Token or use `GITHUB_TOKEN` from Actions. To push from local you can use a PAT with `write:packages` scope.

2. Build and push images manually (example using docker buildx):

```bash
# backend
docker build -t ghcr.io/<YOUR_GH_USER>/derfreund-backend:latest ./backend
docker push ghcr.io/<YOUR_GH_USER>/derfreund-backend:latest

# frontend (include build-arg to set production API url)
docker build --build-arg VITE_API_URL=http://77.222.105.3/api -t ghcr.io/<YOUR_GH_USER>/derfreund-frontend:latest ./frontend
docker push ghcr.io/<YOUR_GH_USER>/derfreund-frontend:latest
```

3. Alternatively, enable the GitHub Actions workflow `.github/workflows/docker-build-push.yml` — it will build and push images on push to `main` (workflow uses `GITHUB_TOKEN` for GHCR; ensure repository permissions for `packages: write`).

Deploy on the server (77.222.105.3):

1. Install Docker and Docker Compose.

2. Pull images or build on server.

If you pushed to GHCR:
```bash
docker login ghcr.io -u <YOUR_GH_USER> -p <PERSONAL_ACCESS_TOKEN>
docker pull ghcr.io/<YOUR_GH_USER>/derfreund-backend:latest
docker pull ghcr.io/<YOUR_GH_USER>/derfreund-frontend:latest
```

3. Copy `docker-compose.yml` to the server (already in this repo) and run:
```bash
docker compose up -d
```

This will start both services and bind port 80 on the host to the frontend container which will reverse-proxy `/api` to the backend.

Notes:
- Because you're accessing the site by IP (http://77.222.105.3/), both frontend and backend will be same-origin and CORS/mixed-content issues are avoided.
- If in future you add a domain, update the `VITE_API_URL` to `https://your-domain/api` and consider enabling TLS (Let's Encrypt / Caddy / nginx + certbot).
