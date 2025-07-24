#!/bin/bash

# Script de instalación y configuración automática para servidor Linux
# Ejecutar como usuario con privilegios sudo

set -e

PROJECT_NAME="iglesia-region-survey"
REPO_URL="https://github.com/mimarumo25/iglesia-region-survey.git"
PROJECT_DIR="/opt/$PROJECT_NAME"
SERVICE_NAME="iglesia-survey"

echo "🔧 Configurando servidor para $PROJECT_NAME..."

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update

# Instalar Docker si no está instalado
if ! command_exists docker; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker instalado"
else
    echo "✅ Docker ya está instalado"
fi

# Instalar Docker Compose si no está instalado
if ! command_exists docker-compose; then
    echo "🐳 Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose instalado"
else
    echo "✅ Docker Compose ya está instalado"
fi

# Instalar Git si no está instalado
if ! command_exists git; then
    echo "📥 Instalando Git..."
    sudo apt install -y git
    echo "✅ Git instalado"
else
    echo "✅ Git ya está instalado"
fi

# Instalar curl si no está instalado
if ! command_exists curl; then
    echo "🌐 Instalando curl..."
    sudo apt install -y curl
    echo "✅ curl instalado"
else
    echo "✅ curl ya está instalado"
fi

# Crear directorio del proyecto
echo "📁 Configurando directorio del proyecto..."
sudo mkdir -p "$PROJECT_DIR"
sudo chown $USER:$USER "$PROJECT_DIR"

# Clonar o actualizar repositorio
cd "$PROJECT_DIR"
if [ -d ".git" ]; then
    echo "🔄 Actualizando repositorio..."
    git pull
else
    echo "📥 Clonando repositorio..."
    git clone "$REPO_URL" .
fi

# Hacer el script de despliegue ejecutable
chmod +x deploy-from-git.sh

# Instalar servicio systemd
echo "⚙️ Configurando servicio systemd..."
sudo cp iglesia-survey.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME

# Iniciar Docker si no está corriendo
echo "🐳 Asegurando que Docker esté corriendo..."
sudo systemctl start docker
sudo systemctl enable docker

# Ejecutar el primer despliegue
echo "🚀 Ejecutando primer despliegue..."
./deploy-from-git.sh

# Iniciar el servicio
echo "▶️ Iniciando servicio systemd..."
sudo systemctl start $SERVICE_NAME

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "=== INFORMACIÓN DEL SISTEMA ==="
echo "📍 Directorio del proyecto: $PROJECT_DIR"
echo "🔧 Servicio systemd: $SERVICE_NAME"
echo "🌐 URL de acceso: http://$(hostname -I | awk '{print $1}'):8080"
echo ""
echo "=== COMANDOS DE GESTIÓN ==="
echo "🔄 Redesplegar desde Git: cd $PROJECT_DIR && ./deploy-from-git.sh"
echo "▶️ Iniciar servicio: sudo systemctl start $SERVICE_NAME"
echo "🛑 Detener servicio: sudo systemctl stop $SERVICE_NAME"
echo "🔄 Reiniciar servicio: sudo systemctl restart $SERVICE_NAME"
echo "📊 Estado del servicio: sudo systemctl status $SERVICE_NAME"
echo "📊 Ver logs: sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "=== COMANDOS DOCKER DIRECTOS ==="
echo "📊 Ver contenedores: docker ps"
echo "📊 Ver logs de la app: docker-compose logs -f"
echo "🔄 Reiniciar contenedor: docker-compose restart"
echo ""
echo "⚠️  NOTA: Si ves errores de permisos de Docker, cierra sesión y vuelve a iniciar sesión"
echo "   o ejecuta: newgrp docker"
