# 🚀 Despliegue Automático en Servidor Linux

Esta guía te ayudará a desplegar la aplicación **Iglesia Region Survey** en un servidor Linux con reinicio automático y actualización desde repositorio Git.

## 📋 Requisitos del Servidor

- Ubuntu 18.04+ / Debian 9+ / CentOS 7+ / RHEL 7+
- Acceso root o usuario con privilegios sudo
- Conexión a internet
- Al menos 2GB de RAM
- Al menos 10GB de espacio libre

## 🔧 Instalación Inicial (Una sola vez)

### 1. Conectar al servidor
```bash
ssh usuario@tu-servidor.com
```

### 2. Descargar e ejecutar el script de instalación
```bash
# Descargar el script de instalación
curl -fsSL https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/install-server.sh -o install-server.sh

# Hacer ejecutable
chmod +x install-server.sh

# Ejecutar instalación
./install-server.sh
```

**¡Importante!** Después de la instalación, cierra sesión y vuelve a conectar para que los permisos de Docker tomen efecto.

## 🔄 Actualizaciones Posteriores

### Opción 1: Script de actualización rápida
```bash
curl -fsSL https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/update.sh | bash
```

### Opción 2: Actualización manual
```bash
cd /opt/iglesia-region-survey
./deploy-from-git.sh
```

## 🎛️ Gestión del Servicio

### Comandos del servicio systemd
```bash
# Ver estado
sudo systemctl status iglesia-survey

# Iniciar servicio
sudo systemctl start iglesia-survey

# Detener servicio
sudo systemctl stop iglesia-survey

# Reiniciar servicio
sudo systemctl restart iglesia-survey

# Ver logs del servicio
sudo journalctl -u iglesia-survey -f
```

### Comandos Docker directos
```bash
# Ver contenedores activos
docker ps

# Ver logs de la aplicación
cd /opt/iglesia-region-survey
docker-compose logs -f

# Reiniciar solo el contenedor
docker-compose restart

# Detener contenedores
docker-compose down

# Iniciar contenedores
docker-compose up -d
```

## 🌐 Acceso a la Aplicación

Una vez desplegada, la aplicación estará disponible en:
- **http://IP_DEL_SERVIDOR:8080**
- **http://localhost:8080** (desde el servidor)

### Obtener la IP del servidor
```bash
# IP pública
curl ifconfig.me

# IP privada
hostname -I | awk '{print $1}'
```

## ⚙️ Configuración de Firewall

### Ubuntu/Debian (UFW)
```bash
# Permitir puerto 8080
sudo ufw allow 8080

# Ver reglas activas
sudo ufw status
```

### CentOS/RHEL (firewalld)
```bash
# Permitir puerto 8080
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

# Ver reglas activas
sudo firewall-cmd --list-all
```

## 🔍 Monitoreo y Troubleshooting

### Verificar que todo funciona
```bash
# Verificar que el servicio está activo
sudo systemctl is-active iglesia-survey

# Verificar que el contenedor está corriendo
docker ps | grep iglesia-survey

# Hacer una petición HTTP
curl -I http://localhost:8080
```

### Logs importantes
```bash
# Logs del servicio systemd
sudo journalctl -u iglesia-survey --since "1 hour ago"

# Logs del contenedor Docker
cd /opt/iglesia-region-survey
docker-compose logs --tail=100

# Logs de Docker en general
sudo journalctl -u docker --since "1 hour ago"
```

### Problemas comunes

#### Error: "Permission denied" con Docker
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a conectar, o ejecutar:
newgrp docker
```

#### Puerto 8080 ya en uso
```bash
# Ver qué está usando el puerto
sudo netstat -tulpn | grep 8080

# O cambiar el puerto en docker-compose.yml
```

#### Falta de espacio en disco
```bash
# Limpiar contenedores e imágenes no utilizadas
docker system prune -a

# Ver uso de disco
df -h
du -sh /var/lib/docker
```

#### Problema de memoria
```bash
# Ver uso de memoria
free -h
htop

# Agregar swap si es necesario
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 🔄 Reinicio Automático

El sistema está configurado para:
- ✅ **Reiniciar automáticamente** cuando se reinicia el servidor
- ✅ **Reiniciar el contenedor** si falla
- ✅ **Monitorear la salud** de la aplicación

### Verificar configuración de reinicio automático
```bash
# Verificar que el servicio está habilitado
sudo systemctl is-enabled iglesia-survey

# Debería responder: "enabled"
```

### Probar reinicio automático
```bash
# Simular reinicio del servidor
sudo reboot

# Después de que el servidor reinicie, verificar:
sudo systemctl status iglesia-survey
docker ps
curl http://localhost:8080
```

## 📊 Arquitectura del Despliegue

```
┌─────────────────────────┐
│     Servidor Linux     │
│                         │
│  ┌─────────────────┐   │
│  │   Systemd       │   │
│  │   Service       │   │
│  └─────────────────┘   │
│           │             │
│  ┌─────────────────┐   │
│  │ Docker Compose  │   │
│  └─────────────────┘   │
│           │             │
│  ┌─────────────────┐   │
│  │ Nginx Container │   │
│  │   Puerto 8080   │   │
│  └─────────────────┘   │
└─────────────────────────┘
```

## 🔒 Seguridad

### Recomendaciones para producción:

1. **Usar HTTPS:**
```bash
# Instalar nginx como reverse proxy con Let's Encrypt
sudo apt install nginx certbot python3-certbot-nginx

# Configurar certificado SSL
sudo certbot --nginx -d tu-dominio.com
```

2. **Configurar firewall:**
```bash
# Solo permitir puertos necesarios
sudo ufw enable
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8080
```

3. **Actualizar regularmente:**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade

# Actualizar aplicación
cd /opt/iglesia-region-survey && ./deploy-from-git.sh
```

## 📱 Automatización Avanzada

### Configurar actualización automática (opcional)
```bash
# Crear cron job para actualizar cada noche a las 2 AM
echo "0 2 * * * cd /opt/iglesia-region-survey && ./deploy-from-git.sh >> /var/log/iglesia-survey-update.log 2>&1" | sudo crontab -
```

### Webhook para actualización automática en push (avanzado)
Puedes configurar un webhook en GitHub para que actualice automáticamente cuando hagas push al repositorio.

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs: `sudo journalctl -u iglesia-survey -f`
2. Verifica el estado: `sudo systemctl status iglesia-survey`
3. Prueba manualmente: `cd /opt/iglesia-region-survey && ./deploy-from-git.sh`
