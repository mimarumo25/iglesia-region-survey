#!/bin/bash

# Script de diagnóstico para la aplicación Iglesia Region Survey
# Ejecutar este script para identificar problemas comunes

echo "🔍 DIAGNÓSTICO DEL SISTEMA - Iglesia Region Survey"
echo "=================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar status
show_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Función para mostrar warning
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para mostrar info
show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "1. 🖥️  INFORMACIÓN DEL SISTEMA"
echo "----------------------------"
echo "OS: $(lsb_release -d 2>/dev/null | cut -f2 || uname -a)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo "Memory: $(free -h | grep Mem | awk '{print $2 " total, " $3 " used, " $7 " available"}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $2 " total, " $3 " used, " $4 " available"}')"
echo ""

echo "2. 🐳 VERIFICACIÓN DE DOCKER"
echo "----------------------------"
if command -v docker >/dev/null 2>&1; then
    show_status 0 "Docker está instalado"
    echo "   Versión: $(docker --version)"
    
    # Verificar si Docker está corriendo
    if docker ps >/dev/null 2>&1; then
        show_status 0 "Docker daemon está corriendo"
    else
        show_status 1 "Docker daemon NO está corriendo"
        show_warning "Ejecutar: sudo systemctl start docker"
    fi
    
    # Verificar permisos
    if docker ps >/dev/null 2>&1; then
        show_status 0 "Permisos de Docker correctos"
    else
        show_status 1 "Sin permisos para Docker"
        show_warning "Ejecutar: sudo usermod -aG docker \$USER && newgrp docker"
    fi
else
    show_status 1 "Docker NO está instalado"
    show_warning "Ejecutar el script install-server.sh"
fi

if command -v docker-compose >/dev/null 2>&1; then
    show_status 0 "Docker Compose está instalado"
    echo "   Versión: $(docker-compose --version)"
else
    show_status 1 "Docker Compose NO está instalado"
fi
echo ""

echo "3. 📁 VERIFICACIÓN DEL PROYECTO"
echo "-------------------------------"
PROJECT_DIR="/opt/iglesia-region-survey"
CURRENT_DIR="$(pwd)"

# Verificar si estamos en el directorio correcto
if [ -f "package.json" ] && [ -f "docker-compose.yml" ]; then
    show_status 0 "Directorio del proyecto válido: $CURRENT_DIR"
    PROJECT_DIR="$CURRENT_DIR"
elif [ -d "$PROJECT_DIR" ] && [ -f "$PROJECT_DIR/package.json" ]; then
    show_status 0 "Proyecto encontrado en: $PROJECT_DIR"
    cd "$PROJECT_DIR"
else
    show_status 1 "Proyecto NO encontrado"
    show_warning "Clonar repositorio: git clone https://github.com/mimarumo25/iglesia-region-survey.git"
fi

# Verificar archivos clave
for file in "package.json" "docker-compose.yml" "Dockerfile" "nginx.conf" ".env"; do
    if [ -f "$file" ]; then
        show_status 0 "Archivo $file existe"
    else
        show_status 1 "Archivo $file NO existe"
    fi
done

# Verificar contenido del .env
if [ -f ".env" ]; then
    echo ""
    show_info "Contenido del archivo .env:"
    cat .env | sed 's/^/   /'
fi
echo ""

echo "4. 🔌 VERIFICACIÓN DE PUERTOS"
echo "-----------------------------"
# Verificar puerto 8080
if netstat -tlnp 2>/dev/null | grep -q ":8080 "; then
    PORT_8080_PROCESS=$(netstat -tlnp 2>/dev/null | grep ":8080 " | awk '{print $7}')
    show_warning "Puerto 8080 está en uso por: $PORT_8080_PROCESS"
else
    show_status 0 "Puerto 8080 disponible"
fi

# Verificar puerto 3001 (backend)
if nc -z 206.62.139.100 3001 2>/dev/null; then
    show_status 0 "Backend accesible en puerto 3001"
else
    show_status 1 "Backend NO accesible en puerto 3001"
fi
echo ""

echo "5. 🐋 ESTADO DE CONTENEDORES"
echo "----------------------------"
if command -v docker-compose >/dev/null 2>&1 && [ -f "docker-compose.yml" ]; then
    if docker-compose ps | grep -q "iglesia-survey"; then
        show_info "Estado de contenedores:"
        docker-compose ps | sed 's/^/   /'
        echo ""
        
        # Verificar healthcheck
        if docker inspect iglesia-survey 2>/dev/null | grep -q '"Health"'; then
            HEALTH_STATUS=$(docker inspect iglesia-survey 2>/dev/null | grep -A 1 '"Status"' | tail -1 | cut -d'"' -f4)
            if [ "$HEALTH_STATUS" = "healthy" ]; then
                show_status 0 "Healthcheck: $HEALTH_STATUS"
            else
                show_status 1 "Healthcheck: $HEALTH_STATUS"
            fi
        fi
    else
        show_status 1 "Contenedor iglesia-survey NO está corriendo"
        show_warning "Ejecutar: docker-compose up -d"
    fi
else
    show_warning "No se puede verificar contenedores (falta docker-compose o docker-compose.yml)"
fi
echo ""

echo "6. 🌐 VERIFICACIÓN DE CONECTIVIDAD"
echo "----------------------------------"
# Test local
if curl -s http://localhost:8080 >/dev/null 2>&1; then
    show_status 0 "Aplicación responde en localhost:8080"
else
    show_status 1 "Aplicación NO responde en localhost:8080"
fi

# Test externo (solo si estamos en el servidor)
EXTERNAL_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
if [ "$EXTERNAL_IP" != "unknown" ]; then
    echo "   IP externa: $EXTERNAL_IP"
    if curl -s --connect-timeout 5 http://$EXTERNAL_IP:8080 >/dev/null 2>&1; then
        show_status 0 "Aplicación accesible externamente"
    else
        show_status 1 "Aplicación NO accesible externamente"
        show_warning "Verificar firewall: sudo ufw allow 8080/tcp"
    fi
fi
echo ""

echo "7. 📊 LOGS RECIENTES"
echo "------------------"
if [ -f "docker-compose.yml" ] && docker-compose ps | grep -q "iglesia-survey"; then
    show_info "Últimas 10 líneas de logs:"
    docker-compose logs --tail=10 iglesia-survey-app 2>/dev/null | sed 's/^/   /' || echo "   No se pudieron obtener logs"
else
    show_warning "No hay contenedores corriendo para mostrar logs"
fi
echo ""

echo "8. 🔧 SERVICIOS SYSTEMD"
echo "----------------------"
if systemctl list-unit-files | grep -q "iglesia-survey.service"; then
    SERVICE_STATUS=$(systemctl is-active iglesia-survey 2>/dev/null || echo "inactive")
    if [ "$SERVICE_STATUS" = "active" ]; then
        show_status 0 "Servicio systemd activo"
    else
        show_status 1 "Servicio systemd: $SERVICE_STATUS"
        show_warning "Ejecutar: sudo systemctl start iglesia-survey"
    fi
else
    show_warning "Servicio systemd no configurado"
    show_info "Para configurar: sudo cp iglesia-survey.service /etc/systemd/system/"
fi
echo ""

echo "9. 🎯 RECOMENDACIONES"
echo "-------------------"
echo ""

# Análisis y recomendaciones
ISSUES=()

if ! command -v docker >/dev/null 2>&1; then
    ISSUES+=("Instalar Docker")
fi

if ! command -v docker-compose >/dev/null 2>&1; then
    ISSUES+=("Instalar Docker Compose")
fi

if ! docker ps >/dev/null 2>&1; then
    ISSUES+=("Iniciar Docker daemon: sudo systemctl start docker")
fi

if [ ! -f "docker-compose.yml" ]; then
    ISSUES+=("Clonar repositorio del proyecto")
fi

if netstat -tlnp 2>/dev/null | grep -q ":8080 "; then
    ISSUES+=("Liberar puerto 8080 o cambiar configuración")
fi

if [ ${#ISSUES[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 No se detectaron problemas críticos!${NC}"
    echo ""
    echo "✅ La aplicación debería estar funcionando correctamente."
    echo "🌐 Acceder a: http://$(hostname -I | awk '{print $1}'):8080"
else
    echo -e "${RED}⚠️  Se detectaron los siguientes problemas:${NC}"
    echo ""
    for issue in "${ISSUES[@]}"; do
        echo -e "${YELLOW}   • $issue${NC}"
    done
    echo ""
    echo -e "${BLUE}💡 Solución rápida: Ejecutar ./install-server.sh${NC}"
fi

echo ""
echo "=================================================="
echo "🔗 Comandos útiles:"
echo "   Ver logs: docker-compose logs -f"
echo "   Reiniciar: docker-compose restart"
echo "   Redesplegar: ./deploy.sh"
echo "   Estado completo: docker-compose ps"
echo "=================================================="
