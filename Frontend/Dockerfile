# Frontend Dockerfile for SurgeGuard Vite app

# 1) Build stage: build static assets with Node
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# 2) Runtime stage: serve static files with nginx
FROM nginx:1.27-alpine AS runtime

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Default nginx static site on port 80
EXPOSE 80

# Minimal healthcheck endpoint via nginx default index.html is enough here
CMD ["nginx", "-g", "daemon off;"]
