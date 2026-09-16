# =====================================================
# Frontend Production Image
# =====================================================

# =====================================================
# Build Stage
# =====================================================

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# =====================================================
# Production Stage
# =====================================================

FROM nginx:alpine

# Remove default content and configuration
RUN rm -rf /usr/share/nginx/html/* \
    /etc/nginx/conf.d/default.conf

# Copy frontend build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy production Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Prepare Nginx runtime directories for non-root user
RUN mkdir -p \
        /var/cache/nginx \
        /var/log/nginx \
        /var/run \
        /var/run/nginx \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx \
        /usr/share/nginx/html \
        /var/cache/nginx \
        /var/log/nginx \
        /var/run/nginx.pid \
        /var/run/nginx

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --spider -q http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
