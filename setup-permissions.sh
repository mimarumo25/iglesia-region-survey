#!/bin/bash

# Script para hacer todos los scripts ejecutables
# Ejecutar después de clonar el repositorio

echo "🔧 Configurando permisos de scripts..."

# Lista de scripts a hacer ejecutables
scripts=(
    "deploy.sh"
    "deploy-from-git.sh"
    "install-server.sh"
    "update.sh"
    "setup-permissions.sh"
)

# Hacer ejecutables todos los scripts
for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        chmod +x "$script"
        echo "✅ $script ahora es ejecutable"
    else
        echo "⚠️  $script no encontrado"
    fi
done

echo "🎉 Configuración de permisos completada"
