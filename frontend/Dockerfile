FROM node:18-alpine AS builder
WORKDIR /app

# Build args
ARG VITE_API_URL=http://77.222.105.3/api

# Copy package files and install deps
COPY package*.json ./
RUN npm ci

# Copy source and write production env for Vite
COPY . .
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env.production

# Build the app
RUN npm run build

### Serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config for SPA + /api proxy (the proxy target should be updated by docker-compose to 'http://backend:3000')
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
