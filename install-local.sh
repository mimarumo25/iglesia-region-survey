#!/bin/bash

# Script de instalación simplificado para cuando ya estás en el directorio del proyecto
# Ejecutar desde el directorio donde ya tienes el código

set -e

PROJECT_NAME="iglesia-region-survey"
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
    $SUDO apt install -y git curl wget
    echo "✅ Git instalado"
else
    echo "✅ Git ya está instalado"
fi

# Hacer scripts ejecutables
echo "🔧 Configurando permisos de scripts..."
chmod +x *.sh 2>/dev/null || true

# Iniciar Docker si no está corriendo
echo "🐳 Asegurando que Docker esté corriendo..."
$SUDO systemctl start docker
$SUDO systemctl enable docker

# Detener contenedores existentes si los hay
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down --remove-orphans 2>/dev/null || true

# Construir e iniciar
echo "🔨 Construyendo imagen..."
docker-compose build --no-cache

echo "▶️ Iniciando aplicación..."
docker-compose up -d

# Verificar que funciona
echo "⏳ Esperando a que el servicio esté listo..."
timeout=60
counter=0
while [ $counter -lt $timeout ]; do
    if curl -f http://localhost:8080 >/dev/null 2>&1; then
        echo "✅ Servicio está funcionando correctamente"
        break
    fi
    sleep 2
    counter=$((counter + 2))
done

if [ $counter -ge $timeout ]; then
    echo "❌ El servicio no respondió en $timeout segundos"
    echo "📊 Mostrando logs del contenedor:"
    docker-compose logs --tail=50
    exit 1
fi

# Instalar servicio systemd si el archivo existe
if [ -f "iglesia-survey.service" ]; then
    echo "⚙️ Configurando servicio systemd..."
    $SUDO cp iglesia-survey.service /etc/systemd/system/
    $SUDO systemctl daemon-reload
    $SUDO systemctl enable $SERVICE_NAME
    $SUDO systemctl start $SERVICE_NAME
    echo "✅ Servicio systemd configurado"
fi

# Verificar estado final
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "🎉 ¡Instalación completada exitosamente!"
echo "🌐 Aplicación disponible en: http://$(hostname -I | awk '{print $1}'):8080"
echo "🌐 También disponible en: http://localhost:8080"

echo ""
echo "=== COMANDOS ÚTILES ==="
echo "📊 Ver logs en tiempo real: docker-compose logs -f"
echo "🔄 Reiniciar aplicación: docker-compose restart"
echo "🛑 Detener aplicación: docker-compose down"
echo "🔍 Ver estado: docker-compose ps"

if [ -f "iglesia-survey.service" ]; then
    echo "📊 Estado del servicio: $SUDO systemctl status $SERVICE_NAME"
    echo "📊 Ver logs del servicio: $SUDO journalctl -u $SERVICE_NAME -f"
fi
