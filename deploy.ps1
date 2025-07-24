# Script de despliegue para la aplicación Iglesia Region Survey (PowerShell)

Write-Host "🚀 Iniciando despliegue de la aplicación..." -ForegroundColor Green

# Detener contenedores existentes
Write-Host "📦 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down

# Construir la imagen
Write-Host "🔨 Construyendo nueva imagen..." -ForegroundColor Yellow
docker-compose build --no-cache

# Iniciar la aplicación
Write-Host "▶️ Iniciando la aplicación..." -ForegroundColor Yellow
docker-compose up -d

# Verificar el estado
Write-Host "✅ Verificando el estado del contenedor..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "🎉 ¡Despliegue completado!" -ForegroundColor Green
Write-Host "📍 La aplicación está disponible en: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📊 Para ver los logs: docker-compose logs -f" -ForegroundColor Cyan
Write-Host "🛑 Para detener: docker-compose down" -ForegroundColor Cyan
