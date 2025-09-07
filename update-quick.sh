#!/bin/bash

# Script de actualización rápida para la aplicación
# Ejecutar cuando solo necesites actualizar el código desde Git

echo "🔄 ACTUALIZACIÓN RÁPIDA - Iglesia Region Survey"
echo "=============================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encontraron archivos del proyecto"
    echo "💡 Ejecutar desde el directorio del proyecto o usar la ruta completa:"
    echo "   cd /opt/iglesia-region-survey && ./update-quick.sh"
    exit 1
fi

# Detener la aplicación temporalmente
echo "⏸️  Deteniendo aplicación..."
docker-compose down

# Actualizar código desde Git
echo "📥 Obteniendo últimos cambios desde Git..."
git fetch origin
git reset --hard origin/main

# Reconstruir y levantar
echo "🔨 Reconstruyendo aplicación..."
docker-compose build --no-cache

echo "▶️ Iniciando aplicación..."
docker-compose up -d

# Esperar un momento y verificar
echo "⏳ Esperando que la aplicación inicie..."
sleep 15

# Verificar estado
echo "🔍 Verificando estado..."
if docker ps | grep -q "iglesia-survey"; then
    echo "✅ Aplicación actualizada exitosamente"
    
    # Mostrar info de acceso
    LOCAL_IP=$(hostname -I | awk '{print $1}')
    echo ""
    echo "🌐 Acceso a la aplicación:"
    echo "   Local: http://localhost:8080"
    echo "   Red: http://$LOCAL_IP:8080"
    
    # Mostrar logs recientes
    echo ""
    echo "📊 Logs recientes:"
    docker-compose logs --tail=5 iglesia-survey-app
    
else
    echo "❌ Error: La aplicación no se inició correctamente"
    echo "📊 Logs del error:"
    docker-compose logs --tail=20
    echo ""
    echo "💡 Ejecutar diagnóstico: ./diagnostico-servidor.sh"
fi

echo ""
echo "=============================================="
echo "🔗 Comandos útiles:"
echo "   Ver logs completos: docker-compose logs -f"
echo "   Reiniciar: docker-compose restart"
echo "   Diagnóstico: ./diagnostico-servidor.sh"
echo "=============================================="
