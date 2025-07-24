# 🚀 GUÍA RÁPIDA DE DESPLIEGUE

## 📋 Pasos para desplegar en servidor Linux

### 1️⃣ SUBIR AL REPOSITORIO
```bash
# En tu máquina local (Windows)
git add .
git commit -m "Agregar configuración Docker y scripts de despliegue"
git push origin main
```

### 2️⃣ CONECTAR AL SERVIDOR
```bash
ssh usuario@tu-servidor-linux.com
```

### 3️⃣ INSTALACIÓN AUTOMÁTICA (Solo la primera vez)
```bash
# Descargar e instalar todo automáticamente
curl -fsSL https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/install-server.sh -o install-server.sh
chmod +x install-server.sh
./install-server.sh
```

### 4️⃣ VERIFICAR QUE FUNCIONA
```bash
# Ver estado
sudo systemctl status iglesia-survey

# Probar la aplicación
curl http://localhost:8080
```

### 5️⃣ ABRIR FIREWALL (si es necesario)
```bash
# Ubuntu/Debian
sudo ufw allow 8080

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

## 🔄 ACTUALIZACIONES FUTURAS

Cada vez que hagas cambios:
```bash
# 1. Push en tu máquina local
git push origin main

# 2. Actualizar en el servidor
ssh usuario@tu-servidor.com
curl -fsSL https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/update.sh | bash
```

## 🌐 ACCESO
- URL: **http://IP_DEL_SERVIDOR:8080**
- La aplicación se reinicia automáticamente si el servidor se reinicia

## ✅ LO QUE SE CONFIGURA AUTOMÁTICAMENTE
- ✅ Docker y Docker Compose
- ✅ Clonado del repositorio
- ✅ Build del contenedor
- ✅ Servicio systemd para reinicio automático
- ✅ Healthcheck del contenedor
- ✅ Logs y monitoreo

## 🆘 COMANDOS ÚTILES
```bash
# Ver logs en tiempo real
sudo journalctl -u iglesia-survey -f

# Reiniciar aplicación
sudo systemctl restart iglesia-survey

# Ver estado de contenedores
docker ps

# Actualizar desde Git
cd /opt/iglesia-region-survey && ./deploy-from-git.sh
```
