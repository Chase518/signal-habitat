# Build context is the repo root (see docker-compose.yml).
FROM node:20-slim AS build

WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /build/dist /usr/share/nginx/html

EXPOSE 80
