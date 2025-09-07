# 🚀 Guía de Instalación en Servidor - Sistema MIA

## 📋 Requisitos del Servidor

### Sistema Operativo
- **Ubuntu 20.04+ / Debian 11+** (recomendado)
- **CentOS 8+ / RHEL 8+** (alternativo)
- Mínimo **2GB RAM**, **2 CPU cores**, **20GB espacio**

### Puertos Requeridos
- **Puerto 8080**: Frontend (aplicación web)
- **Puerto 3001**: Backend API (ya configurado en tu servidor)

## 🔄 Método 1: Instalación Automática (Recomendado)

### Paso 1: Conectar al Servidor
```bash
# Conectar por SSH a tu servidor
ssh usuario@206.62.139.100
```

### Paso 2: Descargar Script de Instalación
```bash
# Descargar el script directamente desde GitHub
curl -fsSL https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/install-server.sh -o install-server.sh

# Hacer ejecutable
chmod +x install-server.sh

# Ejecutar instalación (se ejecutará como root/sudo automáticamente)
./install-server.sh
```

### Paso 3: Verificar Instalación
```bash
# Verificar que el servicio esté activo
sudo systemctl status iglesia-survey

# Verificar contenedores Docker
docker ps

# Ver logs del contenedor
docker-compose logs -f
```

## 🛠️ Método 2: Instalación Manual

### Paso 1: Preparar Servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias básicas
sudo apt install -y curl git wget

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sesión para aplicar permisos Docker
newgrp docker
```

### Paso 2: Clonar y Configurar Proyecto
```bash
# Crear directorio del proyecto
sudo mkdir -p /opt/iglesia-region-survey
sudo chown $USER:$USER /opt/iglesia-region-survey
cd /opt/iglesia-region-survey

# Clonar repositorio
git clone https://github.com/mimarumo25/iglesia-region-survey.git .

# Verificar que el archivo .env tiene la configuración correcta
cat .env
```

### Paso 3: Desplegar Aplicación
```bash
# Hacer ejecutable el script de despliegue
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh
```

### Paso 4: Configurar Servicio Systemd (Opcional)
```bash
# Copiar archivo de servicio
sudo cp iglesia-survey.service /etc/systemd/system/

# Habilitar y iniciar servicio
sudo systemctl daemon-reload
sudo systemctl enable iglesia-survey
sudo systemctl start iglesia-survey
```

## 🔍 Verificación y Diagnóstico

### Verificar Estado de la Aplicación
```bash
# Estado del servicio systemd
sudo systemctl status iglesia-survey

# Estado de contenedores Docker
docker ps
docker-compose ps

# Logs de la aplicación
docker-compose logs -f iglesia-survey-app

# Verificar puertos abiertos
sudo netstat -tlnp | grep :8080
```

### Verificar Conectividad
```bash
# Desde el servidor (localhost)
curl http://localhost:8080

# Desde tu máquina local
curl http://206.62.139.100:8080
```

## 🐛 Solución de Problemas Comunes

### 1. Puerto 8080 ya en uso
```bash
# Ver qué proceso usa el puerto
sudo lsof -i :8080

# Detener proceso si es necesario
sudo kill -9 <PID>

# O cambiar puerto en docker-compose.yml
# Cambiar "8080:8080" por "8081:8080"
```

### 2. Error de permisos Docker
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker

# Verificar permisos
docker run hello-world
```

### 3. Fallo en Build de la aplicación
```bash
# Limpiar caché de Docker
docker system prune -a

# Rebuildar sin caché
docker-compose build --no-cache

# Verificar memoria disponible
free -h
```

### 4. Variables de entorno incorrectas
```bash
# Verificar archivo .env
cat .env

# Debe contener:
# VITE_BASE_URL_SERVICES=http://206.62.139.100:3001
# VITE_SKIP_AUTH=false
```

## 🔄 Comandos de Gestión

### Redespliegue desde Git
```bash
cd /opt/iglesia-region-survey
git pull
./deploy.sh
```

### Gestión del Servicio
```bash
# Iniciar
sudo systemctl start iglesia-survey

# Detener
sudo systemctl stop iglesia-survey

# Reiniciar
sudo systemctl restart iglesia-survey

# Ver estado
sudo systemctl status iglesia-survey

# Ver logs
sudo journalctl -u iglesia-survey -f
```

### Gestión Docker Directa
```bash
# Ver contenedores
docker ps

# Ver logs
docker-compose logs -f

# Reiniciar contenedor
docker-compose restart

# Detener todo
docker-compose down

# Iniciar todo
docker-compose up -d
```

## 🌐 URLs de Acceso

Después de la instalación exitosa:

- **Frontend**: `http://206.62.139.100:8080`
- **Backend**: `http://206.62.139.100:3001`
- **Swagger Docs**: `http://206.62.139.100:3001/api-docs`

## 📊 Monitoreo

### Healthcheck del Contenedor
```bash
# Docker ejecuta healthcheck automáticamente cada 30 segundos
docker inspect iglesia-survey | grep -A 20 Health
```

### Logs en Tiempo Real
```bash
# Logs del contenedor
docker-compose logs -f iglesia-survey-app

# Logs del servicio systemd
sudo journalctl -u iglesia-survey -f

# Logs del sistema
tail -f /var/log/syslog | grep docker
```

## 🔐 Configuración de Seguridad (Opcional)

### Firewall
```bash
# Permitir puerto 8080
sudo ufw allow 8080/tcp

# Verificar reglas
sudo ufw status
```

### SSL/HTTPS con Nginx Proxy (Avanzado)
```bash
# Instalar Nginx
sudo apt install nginx

# Configurar proxy reverso
sudo nano /etc/nginx/sites-available/iglesia-survey

# Contenido sugerido para SSL:
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name tu-dominio.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🆘 Soporte

Si encuentras problemas durante la instalación:

1. **Revisar logs**: `docker-compose logs -f`
2. **Verificar conectividad**: `curl http://localhost:8080`
3. **Validar configuración**: Verificar archivo `.env`
4. **Reinstalar**: Ejecutar `./install-server.sh` nuevamente

**Contacto**: El sistema está configurado para ser autocontenido y debería funcionar inmediatamente después de la instalación.
