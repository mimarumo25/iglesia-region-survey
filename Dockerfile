# =============================================================================
# Dockerfile Multi-stage — MIA System (React + Vite → Nginx)
# Uso local:  docker build -t mia-system .
# Uso en CI:  ver Dockerfile.ci (build hecho por GitHub Actions)
# =============================================================================

# -----------------------------------------------------------------------------
# ETAPA 1: Build — Node.js 20 LTS Alpine
# Solo se usa cuando se construye localmente (sin CI pre-compilado).
# -----------------------------------------------------------------------------
# Build-only stage: vulnerabilities here do NOT reach the final production image.
# hadolint ignore=DL3007
FROM node:22-slim AS builder

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
FROM cgr.dev/chainguard/nginx:latest AS production

# COPY sobreescribe el contenido por defecto — no necesita RUN rm -rf
# --chown evita RUN chown (Chainguard es distroless, sin shell)
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (SPA routing + gzip + seguridad)
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
