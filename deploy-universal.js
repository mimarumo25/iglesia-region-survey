#!/usr/bin/env node

/**
 * Script universal de despliegue para Iglesia Region Survey
 * Detecta automáticamente el SO y ejecuta el comando apropiado
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para terminal
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`\n${colors.blue}📋 ${description}...${colors.reset}`);
  try {
    const result = execSync(command, { stdio: 'inherit', encoding: 'utf8' });
    log(`${colors.green}✅ ${description} completado${colors.reset}`);
    return result;
  } catch (error) {
    log(`${colors.red}❌ Error en: ${description}${colors.reset}`);
    log(`${colors.red}${error.message}${colors.reset}`);
    process.exit(1);
  }
}

function checkPrerequisites() {
  log(`${colors.bold}🔍 Verificando prerrequisitos...${colors.reset}`);
  
  // Verificar Docker
  try {
    execSync('docker --version', { stdio: 'pipe' });
    log(`${colors.green}✅ Docker encontrado${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Docker no está instalado o no está en el PATH${colors.reset}`);
    log(`${colors.yellow}💡 Instala Docker desde: https://docs.docker.com/get-docker/${colors.reset}`);
    process.exit(1);
  }

  // Verificar Docker Compose
  try {
    execSync('docker-compose --version', { stdio: 'pipe' });
    log(`${colors.green}✅ Docker Compose encontrado${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Docker Compose no está instalado${colors.reset}`);
    log(`${colors.yellow}💡 Instala Docker Compose desde: https://docs.docker.com/compose/install/${colors.reset}`);
    process.exit(1);
  }

  // Verificar archivos necesarios
  const requiredFiles = ['docker-compose.yml', 'Dockerfile', 'nginx.conf'];
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      log(`${colors.red}❌ Archivo requerido no encontrado: ${file}${colors.reset}`);
      process.exit(1);
    }
  }
  log(`${colors.green}✅ Todos los archivos requeridos están presentes${colors.reset}`);
}

function detectPlatform() {
  const platform = process.platform;
  log(`${colors.blue}🖥️  Plataforma detectada: ${platform}${colors.reset}`);
  return platform;
}

function buildApplication() {
  log(`${colors.bold}\n🔨 FASE 1: Construir aplicación${colors.reset}`);
  execCommand('npm run build', 'Construcción de la aplicación React');
}

function deployDocker() {
  log(`${colors.bold}\n🐳 FASE 2: Despliegue Docker${colors.reset}`);
  
  execCommand('docker-compose down', 'Deteniendo contenedores existentes');
  execCommand('docker-compose build --no-cache', 'Construyendo nueva imagen Docker');
  execCommand('docker-compose up -d', 'Iniciando contenedores');
}

function verifyDeployment() {
  log(`${colors.bold}\n✅ FASE 3: Verificación del despliegue${colors.reset}`);
  
  execCommand('docker-compose ps', 'Verificando estado de contenedores');
  
  // Esperar un momento para que el servicio esté listo
  log(`${colors.yellow}⏳ Esperando a que el servicio esté listo...${colors.reset}`);
  
  setTimeout(() => {
    try {
      // Verificar que el servicio responda (solo en sistemas con curl)
      if (process.platform !== 'win32') {
        execSync('curl -f http://localhost:8080 >/dev/null 2>&1');
        log(`${colors.green}✅ Servicio respondiendo correctamente${colors.reset}`);
      }
    } catch (error) {
      log(`${colors.yellow}⚠️  No se pudo verificar la respuesta del servicio automáticamente${colors.reset}`);
      log(`${colors.yellow}   Verifica manualmente en: http://localhost:8080${colors.reset}`);
    }

    // Mostrar información final
    showDeploymentInfo();
  }, 3000);
}

function showDeploymentInfo() {
  log(`\n${colors.bold}${colors.green}🎉 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!${colors.reset}\n`);
  
  log(`${colors.bold}📊 INFORMACIÓN DEL DESPLIEGUE:${colors.reset}`);
  log(`🌐 URL de la aplicación: ${colors.blue}http://localhost:8080${colors.reset}`);
  log(`🐳 Contenedor: iglesia-survey`);
  log(`📁 Directorio: ${process.cwd()}`);
  
  log(`\n${colors.bold}📋 COMANDOS ÚTILES:${colors.reset}`);
  log(`📊 Ver logs:           ${colors.yellow}npm run server:logs${colors.reset}`);
  log(`🔄 Reiniciar:          ${colors.yellow}npm run server:restart${colors.reset}`);
  log(`🛑 Detener:            ${colors.yellow}npm run server:stop${colors.reset}`);
  log(`▶️  Iniciar:            ${colors.yellow}npm run server:start${colors.reset}`);
  log(`🧹 Limpiar:            ${colors.yellow}npm run server:clean${colors.reset}`);
  log(`📊 Ver estado:         ${colors.yellow}docker-compose ps${colors.reset}`);
  
  log(`\n${colors.bold}🔧 GESTIÓN AVANZADA:${colors.reset}`);
  log(`🔄 Redesplegar:        ${colors.yellow}npm run deploy${colors.reset}`);
  log(`🔍 Despliegue completo: ${colors.yellow}npm run deploy:full${colors.reset}`);
  log(`📈 Actualizar desde Git: ${colors.yellow}npm run deploy:server${colors.reset} (solo Linux)`);
}

function main() {
  const startTime = Date.now();
  
  log(`${colors.bold}${colors.blue}🚀 INICIANDO DESPLIEGUE DE IGLESIA REGION SURVEY${colors.reset}\n`);
  log(`📅 Fecha: ${new Date().toLocaleString()}`);
  
  // Verificar prerrequisitos
  checkPrerequisites();
  
  // Detectar plataforma
  const platform = detectPlatform();
  
  try {
    // Ejecutar fases del despliegue
    buildApplication();
    deployDocker();
    verifyDeployment();
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    log(`\n${colors.green}⏱️  Tiempo total de despliegue: ${duration} segundos${colors.reset}`);
    
  } catch (error) {
    log(`\n${colors.red}💥 Error durante el despliegue:${colors.reset}`);
    log(`${colors.red}${error.message}${colors.reset}`);
    
    log(`\n${colors.yellow}🔧 SUGERENCIAS PARA SOLUCIONAR PROBLEMAS:${colors.reset}`);
    log(`1. Verifica que Docker esté corriendo: ${colors.yellow}docker ps${colors.reset}`);
    log(`2. Revisa los logs: ${colors.yellow}docker-compose logs${colors.reset}`);
    log(`3. Limpia contenedores: ${colors.yellow}npm run server:clean${colors.reset}`);
    log(`4. Verifica puertos ocupados: ${colors.yellow}netstat -tulpn | grep 8080${colors.reset} (Linux/Mac)`);
    
    process.exit(1);
  }
}

// Ejecutar script principal
if (require.main === module) {
  main();
}

module.exports = { main, log, colors };
