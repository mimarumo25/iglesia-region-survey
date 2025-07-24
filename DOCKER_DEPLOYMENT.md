# 🐳 Despliegue con Docker

Este documento describe cómo desplegar la aplicación **Iglesia Region Survey** usando Docker.

## 📋 Requisitos Previos

- Docker instalado y funcionando
- Docker Compose instalado
- Acceso a internet para descargar las imágenes base

## 🚀 Despliegue Rápido

### Opción 1: Usando Docker Compose

```bash
# Construir y ejecutar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Opción 2: Usando Scripts de Despliegue

**En Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**En Windows (PowerShell):**
```powershell
.\deploy.ps1
```

### Opción 3: Comandos Docker Manuales

```bash
# Construir la imagen
docker build -t iglesia-survey:latest .

# Ejecutar el contenedor
docker run -d \
  --name iglesia-survey \
  -p 8080:8080 \
  --restart unless-stopped \
  iglesia-survey:latest
```

## 🌐 Acceso a la Aplicación

Una vez desplegada, la aplicación estará disponible en:
- **URL Local:** http://localhost:8080
- **Puerto:** 8080

## 🔧 Configuración

### Variables de Entorno

Puedes personalizar la configuración modificando el archivo `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - CUSTOM_VAR=value
```

### Puerto Personalizado

Para cambiar el puerto, modifica el mapeo en `docker-compose.yml`:

```yaml
ports:
  - "3000:8080"  # Acceso en puerto 3000
```

## 📊 Monitoreo y Gestión

### Ver logs en tiempo real
```bash
docker-compose logs -f iglesia-survey-app
```

### Ver estado de contenedores
```bash
docker-compose ps
```

### Reiniciar la aplicación
```bash
docker-compose restart
```

### Actualizar la aplicación
```bash
# Detener, reconstruir e iniciar
docker-compose down
docker-compose up -d --build
```

## 🛠️ Troubleshooting

### Problema: Puerto ya en uso
```bash
# Verificar qué está usando el puerto 8080
netstat -tulpn | grep 8080

# O cambiar el puerto en docker-compose.yml
```

### Problema: Falta de espacio en disco
```bash
# Limpiar contenedores e imágenes no utilizadas
docker system prune -a
```

### Problema: Permisos en Linux
```bash
# Ejecutar con sudo si es necesario
sudo docker-compose up -d --build
```

## 🏗️ Arquitectura del Contenedor

El Dockerfile utiliza una estrategia multi-etapa:

1. **Etapa de Build:** Compila la aplicación React con Node.js
2. **Etapa de Producción:** Sirve los archivos estáticos con Nginx

### Características de Producción

- ✅ Compresión gzip habilitada
- ✅ Cache de archivos estáticos
- ✅ Configuración SPA (Single Page Application)
- ✅ Headers de seguridad
- ✅ Reinicio automático en caso de fallo

## 🔒 Consideraciones de Seguridad

Para despliegue en producción, considera:

1. **Usar HTTPS:** Configura un reverse proxy (nginx/traefik) con SSL
2. **Firewall:** Asegúrate de que solo los puertos necesarios estén expuestos
3. **Actualizaciones:** Mantén las imágenes base actualizadas
4. **Logs:** Configura rotación de logs para evitar llenado de disco

## 📈 Escalabilidad

Para escalar la aplicación:

```yaml
# En docker-compose.yml
services:
  iglesia-survey-app:
    scale: 3  # Múltiples instancias
```

O usar un orquestador como Kubernetes para mayor control.
