# =============================================================================
# Dockerfile Multi-stage — MIA System (React + Vite → Nginx)
# Uso local:  docker build -t mia-system .
# Uso en CI:  ver Dockerfile.ci (build hecho por GitHub Actions)
# =============================================================================

# -----------------------------------------------------------------------------
# ETAPA 1: Build — Node.js 20 LTS Alpine
# Solo se usa cuando se construye localmente (sin CI pre-compilado).
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifests primero para aprovechar el cache de capas de Docker:
# Si package*.json no cambia, npm ci se saltea en builds subsiguientes.
COPY package.json package-lock.json ./

# npm ci: instalación determinista basada en package-lock.json
RUN npm ci --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Build de producción (genera /app/dist)
RUN npm run build

# -----------------------------------------------------------------------------
# ETAPA 2: Producción — Nginx Alpine (imagen final, sin Node.js)
# Solo contiene los archivos estáticos del dist + Nginx configurado.
# Imagen resultante: ~25 MB vs ~350 MB con Node.
# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

# Remover la configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar únicamente los artefactos del build desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (SPA routing + gzip + seguridad)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx corre como root por defecto; lo bloqueamos al usuario nginx
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 8080

# Healthcheck integrado en la imagen
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1

CMD ["nginx", "-g", "daemon off;"]
