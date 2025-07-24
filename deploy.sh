#!/bin/bash

# Script de despliegue para la aplicación Iglesia Region Survey

echo "🚀 Iniciando despliegue de la aplicación..."

# Detener contenedores existentes
echo "📦 Deteniendo contenedores existentes..."
docker-compose down

# Construir la imagen
echo "🔨 Construyendo nueva imagen..."
docker-compose build --no-cache

# Iniciar la aplicación
echo "▶️ Iniciando la aplicación..."
docker-compose up -d

# Verificar el estado
echo "✅ Verificando el estado del contenedor..."
docker-compose ps

echo ""
echo "🎉 ¡Despliegue completado!"
echo "📍 La aplicación está disponible en: http://localhost:8080"
echo "📊 Para ver los logs: docker-compose logs -f"
echo "🛑 Para detener: docker-compose down"
