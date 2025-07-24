#!/bin/bash

# Script de actualización rápida
# Para actualizar la aplicación sin reinstalar todo el sistema

PROJECT_DIR="/opt/iglesia-region-survey"

echo "🔄 Actualizando aplicación desde repositorio..."

# Verificar que estamos en el directorio correcto
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Error: Directorio del proyecto no encontrado en $PROJECT_DIR"
    echo "💡 Ejecuta primero el script install-server.sh"
    exit 1
fi

cd "$PROJECT_DIR"

# Verificar que es un repositorio git
if [ ! -d ".git" ]; then
    echo "❌ Error: No es un repositorio git válido"
    exit 1
fi

# Ejecutar despliegue
if [ -f "deploy-from-git.sh" ]; then
    ./deploy-from-git.sh
else
    echo "❌ Error: Script de despliegue no encontrado"
    exit 1
fi

echo "✅ Actualización completada"
