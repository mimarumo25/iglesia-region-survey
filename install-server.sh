#!/bin/bash

# Script de instalación y configuración automática para servidor Linux
# Ejecutar como root o usuario con privilegios sudo

set -e

PROJECT_NAME="iglesia-region-survey"
REPO_URL="https://github.com/mimarumo25/iglesia-region-survey.git"
PROJECT_DIR="/opt/$PROJECT_NAME"
SERVICE_NAME="iglesia-survey"

# Detectar si estamos ejecutando como root
if [ "$EUID" -eq 0 ]; then
    SUDO=""
    echo "🔧 Configurando servidor para $PROJECT_NAME (ejecutando como root)..."
else
    SUDO="sudo"
    echo "🔧 Configurando servidor para $PROJECT_NAME (usando sudo)..."
fi

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Actualizar sistema
echo "📦 Actualizando sistema..."
$SUDO apt update

# Instalar Docker si no está instalado
if ! command_exists docker; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    $SUDO sh get-docker.sh
    if [ "$EUID" -ne 0 ]; then
        $SUDO usermod -aG docker $USER
    fi
    rm get-docker.sh
    echo "✅ Docker instalado"
else
    echo "✅ Docker ya está instalado"
fi

# Instalar Docker Compose si no está instalado
if ! command_exists docker-compose; then
    echo "🐳 Instalando Docker Compose..."
    $SUDO curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    $SUDO chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose instalado"
else
    echo "✅ Docker Compose ya está instalado"
fi

# Instalar Git si no está instalado
if ! command_exists git; then
    echo "📥 Instalando Git..."
    $SUDO apt install -y git
    echo "✅ Git instalado"
else
    echo "✅ Git ya está instalado"
fi

# Instalar curl si no está instalado
if ! command_exists curl; then
    echo "🌐 Instalando curl..."
    $SUDO apt install -y curl
    echo "✅ curl instalado"
else
    echo "✅ curl ya está instalado"
fi

# Crear directorio del proyecto
echo "📁 Configurando directorio del proyecto..."
$SUDO mkdir -p "$PROJECT_DIR"
if [ "$EUID" -ne 0 ]; then
    $SUDO chown $USER:$USER "$PROJECT_DIR"
fi

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
$SUDO cp iglesia-survey.service /etc/systemd/system/
$SUDO systemctl daemon-reload
$SUDO systemctl enable $SERVICE_NAME

# Iniciar Docker si no está corriendo
echo "🐳 Asegurando que Docker esté corriendo..."
$SUDO systemctl start docker
$SUDO systemctl enable docker

# Ejecutar el primer despliegue
echo "🚀 Ejecutando primer despliegue..."
./deploy-from-git.sh

# Iniciar el servicio
echo "▶️ Iniciando servicio systemd..."
$SUDO systemctl start $SERVICE_NAME

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
echo "▶️ Iniciar servicio: $SUDO systemctl start $SERVICE_NAME"
echo "🛑 Detener servicio: $SUDO systemctl stop $SERVICE_NAME"
echo "🔄 Reiniciar servicio: $SUDO systemctl restart $SERVICE_NAME"
echo "📊 Estado del servicio: $SUDO systemctl status $SERVICE_NAME"
echo "📊 Ver logs: $SUDO journalctl -u $SERVICE_NAME -f"
echo ""
echo "=== COMANDOS DOCKER DIRECTOS ==="
echo "📊 Ver contenedores: docker ps"
echo "📊 Ver logs de la app: docker-compose logs -f"
echo "🔄 Reiniciar contenedor: docker-compose restart"
echo ""
echo "⚠️  NOTA: Si ves errores de permisos de Docker y NO estás ejecutando como root,"
echo "   cierra sesión y vuelve a iniciar sesión o ejecuta: newgrp docker"
