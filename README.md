# 🏛️ Sistema Parroquial - Caracterización Poblacional

## 📋 Descripción

Sistema web completo desarrollado para iglesias católicas en Colombia que permite realizar caracterización poblacional mediante encuestas estructuradas, gestión de familias y generación de reportes estadísticos. La aplicación está completamente funcional y optimizada para uso en parroquias.

## � Estado Actual: PROYECTO COMPLETO ✅

La aplicación está funcionando correctamente en: **http://localhost:8081**

## 🎯 Características Implementadas

### ✅ Sistema Completo de Encuestas
- **Formulario expandido completo** (50+ campos) basado en formato oficial Excel
- **6 etapas estructuradas** con navegación fluida
- **Guardado automático** en localStorage con recuperación de sesión
- **Validación completa** en tiempo real con mensajes claros
- **Gestión de familia completa** con 20+ campos por miembro

### ✅ Sistema de Fechas Moderno
- **ModernDatePicker** integrado en todos los campos de fecha
- **Calendario visual** con navegación mes/año
- **Localización en español** (date-fns + locale es)
- **Atajos útiles**: Botones "Hoy" y "Limpiar"
- **Alto contraste** y accesibilidad completa

### ✅ Interfaz de Usuario Avanzada
- **Sistema de autenticación** con login/logout
- **Dashboard interactivo** con widgets estadísticos 
- **Diseño responsivo** completamente optimizado
- **Sidebar navegable** con colapso automático
- **Sistema de notificaciones** (toast) integrado
- **Tipografía accesible** con alto contraste

### ✅ Arquitectura Técnica Robusta
- **React 18** + TypeScript + Vite
- **React Hook Form** + Zod para validación
- **Tailwind CSS** + shadcn/ui para diseño
- **Componentes modulares** completamente reutilizables
- **Código limpio** con separación de responsabilidades

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Azul católico tradicional (#1e40af) - Elementos principales
- **Secundario**: Dorado litúrgico (#d97706) - Acentos importantes  
- **Fondos**: Blanco puro con grises suaves para secciones
- **Textos**: Negro intenso para máximo contraste y legibilidad

### Principios de Diseño
- **Alto contraste** para máxima accesibilidad
- **Espaciado generoso** con mucho espacio en blanco
- **Tipografía clara** (Inter 16px+) para fácil lectura
- **Botones grandes** con bordes redondeados suaves
- **Animaciones sutiles** que mejoran la experiencia

## 🏗️ Estructura del Proyecto

```
src/
├── components/                    # Componentes reutilizables
│   ├── ui/                       # Componentes base de shadcn/ui
│   │   ├── modern-date-picker.tsx # DatePicker personalizado
│   │   ├── button.tsx            # Botones con variantes
│   │   ├── form.tsx              # Componentes de formulario
│   │   ├── input.tsx             # Inputs estilizados
│   │   ├── select.tsx            # Selectores dropdown
│   │   ├── dialog.tsx            # Modales y diálogos
│   │   ├── table.tsx             # Tablas responsivas
│   │   └── ...                   # Otros 30+ componentes UI
│   ├── survey/                   # Componentes específicos de encuesta
│   │   ├── FamilyGrid.tsx        # Gestión completa de familia
│   │   ├── FormField.tsx         # Campo de formulario dinámico
│   │   ├── SurveyControls.tsx    # Controles de navegación
│   │   └── SurveyHeader.tsx      # Header con progreso
│   ├── dashboard/                # Componentes del dashboard
│   │   ├── StatsCards.tsx        # Tarjetas estadísticas
│   │   ├── SectorProgress.tsx    # Progreso por sector
│   │   ├── HousingTypes.tsx      # Tipos de vivienda
│   │   └── RecentActivity.tsx    # Actividad reciente
│   ├── AppSidebar.tsx            # Navegación lateral principal
│   ├── Layout.tsx                # Layout principal con header
│   └── SurveyForm.tsx            # Formulario principal multi-etapa
├── pages/                        # Páginas principales
│   ├── Dashboard.tsx             # Panel de control con widgets
│   ├── Index.tsx                 # Página inicial con encuesta
│   ├── Login.tsx                 # Autenticación moderna
│   └── NotFound.tsx              # Página 404 estilizada
├── hooks/                        # Hooks personalizados
│   ├── use-toast.ts              # Sistema de notificaciones
│   └── use-mobile.tsx            # Detección responsive
├── lib/                          # Utilidades y configuración
│   └── utils.ts                  # Funciones auxiliares + cn()
├── types/                        # Definiciones TypeScript
│   ├── survey.ts                 # Tipos del formulario
│   └── dashboard.ts              # Tipos del dashboard
├── index.css                     # Sistema de diseño (tokens CSS)
└── App.tsx                       # Configuración de rutas
```

## 📱 Funcionalidades Detalladas

### 🔐 Página de Login
- **Ruta**: `/login`
- **Características**:
  - Formulario centrado con logo de iglesia
  - Validación en tiempo real
  - Diseño responsive y accesible
  - Transiciones suaves

### 📊 Dashboard Principal  
- **Ruta**: `/dashboard`
- **Widgets implementados**:
  - **Estadísticas generales**: Total encuestas, completadas, pendientes
  - **Progreso por sector**: Barras de progreso para cada sector geográfico
  - **Tipos de vivienda**: Distribución con gráfico de barras interactivo
  - **Actividad reciente**: Timeline de acciones del sistema
- **Características**:
  - Header con gradiente parroquial
  - Cards con sombras elegantes y hover effects
  - Colores semánticos (éxito, advertencia, info)
  - Responsive design completo

### 📋 Formulario de Caracterización Completo
- **Componente principal**: `SurveyForm.tsx`
- **Estado**: ✅ COMPLETADO AL 100%
- **6 Etapas estructuradas** basadas en formato oficial Excel:

#### Etapa 1: Información General (9 campos)
- Fecha, nombres, cédula, edad, teléfono
- Estado civil, ocupación, religión, nivel educativo

#### Etapa 2: Vivienda y Basuras (7 campos)
- Dirección completa, sector, tipo de vivienda
- Material de construcción, propiedad
- Manejo de basuras y recolección

#### Etapa 3: Acueducto y Aguas (7 campos)
- Tipo de abastecimiento de agua
- Calidad del agua, tratamiento
- Saneamiento básico y alcantarillado

#### Etapa 4: Información Familiar Completa
- **FamilyGrid avanzado** con 20+ campos por miembro:
  - Información personal: nombres, fechas, identificación
  - Situación civil (8 opciones), parentesco, sexo
  - Educación, comunidad cultural, liderazgo
  - Contacto: teléfono, email con validación
  - Salud: enfermedades, necesidades especiales
  - Tallas: camisa/blusa, pantalón, calzado
  - Profesión y fechas de celebración
  - Solicitud de comunión en casa

#### Etapa 5: Difuntos de la Familia (8 campos)
- Información de familiares fallecidos
- Fechas de aniversario con ModernDatePicker
- Detalles para misas de remembranza

#### Etapa 6: Observaciones y Consentimiento (3 campos)
- Observaciones generales
- Consentimiento informado
- Autorización de datos

### 🎨 Sistema de Fechas ModernDatePicker
- **Estado**: ✅ COMPLETAMENTE INTEGRADO
- **Ubicaciones**:
  - ✅ Campo "Fecha" principal (primera etapa)
  - ✅ Campo "fechaNacimiento" en FamilyGrid
  - ✅ Fechas de aniversario de difuntos
- **Características técnicas**:
  - Basado en react-day-picker v9
  - Localización completa en español (date-fns)
  - Navegación por flechas mes/año
  - Atajos: "Hoy" y "Limpiar"
  - Estilos de alto contraste
  - Completamente accesible (ARIA)
  - Integrado con React Hook Form
  - Validación con Zod
  - Soporte legacy para migración de datos

## 🛠️ Tecnologías y Dependencias

### Core Technologies
```json
{
  "react": "^18.3.1",           // Framework principal
  "typescript": "^5.6.2",      // Tipado estático
  "vite": "^5.4.10",          // Bundler y dev server
  "tailwindcss": "^3.4.14"    // CSS framework
}
```

### Form Management
```json
{
  "react-hook-form": "^7.54.0",        // Gestión de formularios
  "@hookform/resolvers": "^3.10.0",    // Validadores
  "zod": "^3.23.8"                     // Schema validation
}
```

### UI Components (shadcn/ui + Radix)
```json
{
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-select": "^2.1.1",
  "@radix-ui/react-label": "^2.1.0",
  "@radix-ui/react-toast": "^1.2.1",
  // ... 20+ componentes Radix UI
}
```

### Date Management
```json
{
  "react-day-picker": "^9.4.2",        // Calendario moderno
  "date-fns": "^3.6.0"                 // Utilidades de fecha
}
```

### Icons & Styling
```json
{
  "lucide-react": "^0.462.0",          // Iconos modernos
  "class-variance-authority": "^0.7.1", // Variantes CSS
  "clsx": "^2.1.1"                     // Utilidades CSS
}
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm/bun
- Git

### Instalación Local
```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd iglesia-region-survey

# Instalar dependencias (usa bun.lockb)
bun install
# o con npm
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
# DESARROLLO
npm run dev         # Servidor de desarrollo (puerto 8081)
npm run build       # Compilar para producción
npm run build:dev   # Compilar en modo desarrollo
npm run preview     # Vista previa de producción
npm run lint        # Verificar código con ESLint

# DESPLIEGUE - COMANDO PRINCIPAL 🚀
npm run deploy      # Deploy universal inteligente (RECOMENDADO)
npm run deploy:full # Deploy completo con lint + verificaciones

# DESPLIEGUE - COMANDOS ESPECÍFICOS
npm run deploy:docker   # Solo despliegue Docker
npm run deploy:windows  # Despliegue específico Windows (PowerShell)
npm run deploy:linux    # Despliegue específico Linux (Bash)
npm run deploy:server   # Despliegue desde Git en servidor
npm run deploy:status   # Ver estado del despliegue

# GESTIÓN DEL SERVIDOR
npm run server:start    # Iniciar contenedores
npm run server:stop     # Detener contenedores  
npm run server:restart  # Reiniciar contenedores
npm run server:logs     # Ver logs en tiempo real
npm run server:clean    # Limpiar contenedores e imágenes
npm run server:install  # Instalación completa en servidor Linux

# ACTUALIZACIÓN
npm run update          # Actualización rápida desde Git
```

## 🎯 **Comando Principal de Deploy**

**¡Nuevo!** Ahora tienes un comando principal que hace todo automáticamente:

```bash
# Comando más simple - hace todo el despliegue completo
npm run deploy
```

**¿Qué hace este comando?**
- ✅ **Detecta automáticamente** tu sistema operativo (Windows/Linux/Mac)
- ✅ **Verifica prerrequisitos** (Docker, Docker Compose, archivos necesarios)
- ✅ **Construye la aplicación** React con Vite
- ✅ **Detiene contenedores** existentes sin perder datos
- ✅ **Construye nueva imagen** Docker sin cache para frescura
- ✅ **Inicia los contenedores** en modo background
- ✅ **Verifica el despliegue** automáticamente
- ✅ **Muestra información útil** (URLs, comandos, logs)
- ✅ **Manejo inteligente de errores** con sugerencias de solución

### Ejemplo de uso:
```bash
# Desde el directorio del proyecto
npm run deploy

# Output esperado:
# 🚀 INICIANDO DESPLIEGUE DE IGLESIA REGION SURVEY
# 🔍 Verificando prerrequisitos...
# ✅ Docker encontrado  
# ✅ Docker Compose encontrado
# ✅ Todos los archivos requeridos están presentes
# 🖥️  Plataforma detectada: win32
# 
# 🔨 FASE 1: Construir aplicación
# 📋 Construcción de la aplicación React...
# ✅ Construcción de la aplicación React completado
# 
# 🐳 FASE 2: Despliegue Docker  
# 📋 Deteniendo contenedores existentes...
# ✅ Deteniendo contenedores existentes completado
# 📋 Construyendo nueva imagen Docker...
# ✅ Construyendo nueva imagen Docker completado
# 📋 Iniciando contenedores...
# ✅ Iniciando contenedores completado
# 
# ✅ FASE 3: Verificación del despliegue
# 📋 Verificando estado de contenedores...
# 
# 🎉 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!
# 
# 📊 INFORMACIÓN DEL DESPLIEGUE:
# 🌐 URL de la aplicación: http://localhost:8080
# 🐳 Contenedor: iglesia-survey
# 
# 📋 COMANDOS ÚTILES:
# 📊 Ver logs:           npm run server:logs
# 🔄 Reiniciar:          npm run server:restart
# ⏱️  Tiempo total de despliegue: 45 segundos
```

## 🐳 Deploy en Servidor con Docker

### Prerrequisitos del Servidor
- Sistema Linux (Ubuntu/Debian recomendado)
- Acceso root o usuario con sudo
- Conexión a internet

### 🔧 Instalación Automatizada en Servidor

Para una instalación completamente automatizada en un servidor Linux nuevo:

```bash
# 1. Descargar y ejecutar el script de instalación
curl -fsSL https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/install-server.sh | bash

# O descargar primero y luego ejecutar:
wget https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/install-server.sh
chmod +x install-server.sh
./install-server.sh
```

**¿Qué hace este script?**
- ✅ Instala Docker y Docker Compose automáticamente
- ✅ Instala Git y otras dependencias necesarias
- ✅ Crea el directorio del proyecto en `/opt/iglesia-region-survey`
- ✅ Clona el repositorio desde GitHub
- ✅ Configura el servicio systemd para inicio automático
- ✅ Ejecuta el primer deployment
- ✅ La aplicación queda disponible en `http://IP_DEL_SERVIDOR:8080`

### 📦 Deploy Manual con Docker

Si prefieres hacer el deploy manual paso a paso:

#### 1. Preparar el Servidor

```bash
# Actualizar sistema
sudo apt update

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sesión para aplicar permisos de Docker
exit
# (volver a conectar por SSH)
```

#### 2. Clonar y Desplegar

```bash
# Crear directorio del proyecto
sudo mkdir -p /opt/iglesia-region-survey
sudo chown $USER:$USER /opt/iglesia-region-survey

# Clonar repositorio
cd /opt/iglesia-region-survey
git clone https://github.com/mimarumo25/iglesia-region-survey.git .

# Ejecutar deployment
./deploy.sh   # Para Linux
# o en Windows PowerShell: ./deploy.ps1
```

### 🔄 Actualización Automática desde Git

Una vez instalado, para actualizar la aplicación con la última versión del repositorio:

```bash
# Actualización completa (recomendado)
cd /opt/iglesia-region-survey
./deploy-from-git.sh

# O actualización rápida
./update.sh
```

**¿Qué hace el script de actualización?**
- 🔄 Descarga la última versión desde GitHub (rama main)
- 🛑 Detiene los contenedores actuales
- 🔨 Construye nueva imagen con los últimos cambios  
- ▶️ Reinicia la aplicación
- ✅ Verifica que todo funcione correctamente
- 📊 Muestra logs y estado final

### ⚙️ Gestión del Servicio con Systemd

El sistema se instala como un servicio systemd para gestión automática:

```bash
# Iniciar el servicio
sudo systemctl start iglesia-survey

# Detener el servicio  
sudo systemctl stop iglesia-survey

# Reiniciar el servicio
sudo systemctl restart iglesia-survey

# Ver estado del servicio
sudo systemctl status iglesia-survey

# Habilitar inicio automático
sudo systemctl enable iglesia-survey

# Deshabilitar inicio automático
sudo systemctl disable iglesia-survey

# Ver logs del servicio
sudo journalctl -u iglesia-survey -f
```

### 🐳 Comandos Docker Directos

Para gestión directa de los contenedores:

```bash
cd /opt/iglesia-region-survey

# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar aplicación
docker-compose restart

# Detener aplicación  
docker-compose down

# Iniciar aplicación
docker-compose up -d

# Reconstruir imagen y reiniciar
docker-compose build --no-cache
docker-compose up -d

# Limpiar imágenes antiguas
docker image prune -f
```

### 🌐 Configuración de Red y Acceso

#### Puertos Utilizados
- **Puerto 8080**: Aplicación web principal
- **Puerto 80/443**: Para configurar con reverse proxy (opcional)

#### Acceso a la Aplicación
```bash
# Desde el servidor local
curl http://localhost:8080

# Desde navegador externo  
http://IP_DEL_SERVIDOR:8080
```

#### Configurar Dominio (Opcional)

Para usar un dominio personalizado con Nginx como reverse proxy:

```bash
# Instalar Nginx
sudo apt install nginx

# Crear configuración para tu dominio
sudo nano /etc/nginx/sites-available/iglesia-survey

# Ejemplo de configuración:
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/iglesia-survey /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 🔍 Resolución de Problemas

#### Verificar que Docker esté funcionando:
```bash
docker --version
docker-compose --version
sudo systemctl status docker
```

#### Si el contenedor no inicia:
```bash
# Ver logs detallados
docker-compose logs

# Verificar puertos ocupados
sudo netstat -tulpn | grep 8080

# Reconstruir imagen completa
docker-compose build --no-cache --pull
```

#### Si hay problemas de permisos:
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# O ejecutar con sudo
sudo docker-compose up -d
```

#### Liberar espacio en disco:
```bash
# Limpiar contenedores detenidos
docker container prune -f

# Limpiar imágenes sin usar
docker image prune -f

# Limpieza completa (cuidado!)
docker system prune -af
```

### 📊 Monitoreo y Logs

#### Ver logs de la aplicación:
```bash
# Logs en tiempo real
docker-compose logs -f

# Últimas 100 líneas
docker-compose logs --tail=100

# Logs de un período específico
docker-compose logs --since="2024-01-01T00:00:00"

# Logs solo de errores
docker-compose logs | grep -i error
```

#### Verificar salud del contenedor:
```bash
# Estado del contenedor
docker-compose ps

# Recursos utilizados
docker stats iglesia-survey

# Información detallada
docker inspect iglesia-survey
```

### 🔒 Consideraciones de Seguridad

#### Firewall (UFW):
```bash
# Permitir solo puerto 8080
sudo ufw allow 8080
sudo ufw enable

# O solo desde IPs específicas
sudo ufw allow from 192.168.1.0/24 to any port 8080
```

#### Actualización del Sistema:
```bash
# Mantener el servidor actualizado
sudo apt update && sudo apt upgrade -y

# Actualizar Docker
curl -fsSL https://get.docker.com | sh
```

### 📁 Estructura de Archivos en Servidor

```
/opt/iglesia-region-survey/
├── deploy-from-git.sh      # Script de deploy automático desde Git
├── deploy.sh              # Script de deploy básico  
├── update.sh              # Script de actualización rápida
├── install-server.sh      # Script de instalación inicial
├── docker-compose.yml     # Configuración de Docker Compose
├── Dockerfile             # Imagen Docker de la aplicación
├── nginx.conf             # Configuración del servidor web
├── iglesia-survey.service # Servicio systemd
└── ...                    # Resto del código fuente
```

### 🎯 Resumen de Comandos Principales

```bash
# ⚡ DEPLOY RÁPIDO (lo que necesitas el 90% del tiempo)
npm run deploy              # Deploy completo automático

# 🔧 GESTIÓN DIARIA  
npm run server:logs         # Ver qué está pasando
npm run server:restart      # Si algo va mal, reiniciar
npm run server:stop         # Detener todo
npm run server:start        # Iniciar de nuevo

# 🚀 INSTALACIÓN EN SERVIDOR LINUX (solo una vez)
curl -fsSL https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/install-server.sh | bash

# 🔄 ACTUALIZACIÓN DESDE GIT (en servidor)
npm run deploy:server       # o: ./deploy-from-git.sh

# 🧹 LIMPIEZA Y MANTENIMIENTO
npm run server:clean        # Limpiar espacio en disco
```

## 📋 **Guía de Comandos NPM Detallada**

### 🚀 **Comandos de Despliegue**

| Comando | Descripción | Cuándo usar |
|---------|-------------|-------------|
| `npm run deploy` | **Deploy universal automático** ⭐ | **Uso diario - RECOMENDADO** |
| `npm run deploy:full` | Deploy con linting y verificaciones extra | Antes de enviar a producción |
| `npm run deploy:docker` | Solo parte Docker (sin build de React) | Para pruebas rápidas de Docker |
| `npm run deploy:windows` | Usa script PowerShell específico | Solo en Windows, casos especiales |
| `npm run deploy:linux` | Usa script Bash específico | Solo en Linux, casos especiales |
| `npm run deploy:server` | Deploy desde Git en servidor | Actualización en producción |

### 🔧 **Comandos de Gestión del Servidor**

| Comando | Descripción | Cuándo usar |
|---------|-------------|-------------|
| `npm run server:start` | Iniciar contenedores | Después de detenerlos |
| `npm run server:stop` | Detener contenedores | Mantenimiento, cambios de config |
| `npm run server:restart` | Reiniciar contenedores | Problemas de rendimiento |
| `npm run server:logs` | Ver logs en tiempo real | Debugging, monitoreo |
| `npm run server:clean` | Limpiar contenedores/imágenes | Liberar espacio en disco |
| `npm run server:install` | Instalación completa en servidor | Solo primera vez en Linux |

### 📊 **Comandos de Estado y Monitoreo**

| Comando | Descripción | Información que muestra |
|---------|-------------|-------------------------|
| `npm run deploy:status` | Estado actual del deploy | Contenedores activos, URL de acceso |
| `docker-compose ps` | Estado detallado | ID, nombres, puertos, salud de contenedores |
| `docker stats iglesia-survey` | Recursos en tiempo real | CPU, RAM, red, disco |
| `docker-compose logs --tail=50` | Últimos 50 logs | Errores recientes, actividad |

### 🔄 **Comandos de Actualización**

| Comando | Descripción | Proceso |
|---------|-------------|---------|
| `npm run update` | Actualización rápida | Git pull + restart rápido |
| `npm run deploy:server` | Actualización completa desde Git | Git pull + rebuild completo + restart |
| `npm run deploy` | Actualización local | Build local + Docker rebuild |

## 🎯 **Flujos de Trabajo Recomendados**

### 🚀 **Desarrollo Diario**
```bash
# 1. Hacer cambios en el código
# 2. Probar localmente
npm run dev

# 3. Deploy a Docker local
npm run deploy

# 4. Verificar funcionamiento
# Abrir: http://localhost:8080
```

### 🔧 **Resolución de Problemas**
```bash
# 1. Ver qué está pasando
npm run server:logs

# 2. Si hay problemas, reiniciar
npm run server:restart

# 3. Si persiste, limpieza completa
npm run server:stop
npm run server:clean
npm run deploy
```

### 📦 **Deploy en Producción (Servidor)**
```bash
# Solo la primera vez - instalación completa
curl -fsSL https://raw.githubusercontent.com/mimarumo25/iglesia-region-survey/main/install-server.sh | bash

# Actualizaciones regulares
cd /opt/iglesia-region-survey
npm run deploy:server
# o directamente: ./deploy-from-git.sh
```

### 🧹 **Mantenimiento Regular**
```bash
# Cada semana - limpiar imágenes antiguas
npm run server:clean

# Cada mes - verificar logs
npm run server:logs | grep -i error

# Actualizar sistema (en servidor)
sudo apt update && sudo apt upgrade -y
```

¡Con estos comandos tendrás control completo del despliegue de manera simple y profesional! 🚀

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primario**: Azul católico tradicional (#1e40af) - Elementos principales
- **Secundario**: Dorado litúrgico (#d97706) - Acentos importantes  
- **Fondos**: Blanco puro con grises suaves para secciones
- **Textos**: Negro intenso para máximo contraste y legibilidad

### Principios de Diseño
- **Alto contraste** para máxima accesibilidad
- **Espaciado generoso** con mucho espacio en blanco
- **Tipografía clara** (Inter 16px+) para fácil lectura
- **Botones grandes** con bordes redondeados suaves
- **Animaciones sutiles** que mejoran la experiencia

### Tokens CSS (index.css)
```css
:root {
  /* Colores primarios */
  --primary: 213 94% 35%;          /* Azul católico */
  --secondary: 32 95% 44%;         /* Dorado litúrgico */
  
  /* Gradientes parroquiales */
  --gradient-primary: linear-gradient(135deg, 
    hsl(213 94% 35%) 0%, 
    hsl(213 84% 45%) 100%);
  
  /* Sombras elegantes */
  --shadow-glow: 0 0 20px hsl(var(--primary) / 0.15);
  --shadow-parish: 0 4px 20px rgba(30, 64, 175, 0.1);
}
```

### Configuración Tailwind (tailwind.config.ts)
- **Fuente**: Inter para máxima legibilidad
- **Colores extendidos**: primary-light, primary-dark, success, warning
- **Sombras personalizadas**: glow, parish, md, lg para depth visual
- **Gradientes**: primary, secondary, subtle para headers y fondos

## 🎯 Componentes Clave

### AppSidebar
```tsx
// Navegación lateral con colapso inteligente
<AppSidebar />
```
- **Menús**: Dashboard, Encuestas, Familias, Sectores, Reportes, Usuarios, Configuración
- **Estados**: Expandido/colapsado con tooltips automáticos
- **Perfil de usuario** con avatar y rol
- **Indicador de página activa** con highlighting
- **Responsive**: Se oculta automáticamente en móvil

### Layout Principal
```tsx
// Wrapper que incluye sidebar + header + contenido
<Layout>
  <YourPageContent />
</Layout>
```
- **Header superior** con búsqueda y notificaciones
- **Sidebar fijo** con toggle responsive
- **Área de contenido** con scroll automático
- **Breadcrumbs** automáticos según la ruta

### FamilyGrid - Gestión de Familia
```tsx
// Componente completamente refactorizado con React Hook Form
<FamilyGrid familyMembers={members} setFamilyMembers={setMembers} />
```
- **20+ campos por miembro** validados con Zod
- **Modal de edición** con formulario completo
- **Tabla responsive** con acciones inline
- **Migración automática** de datos legacy
- **Toast notifications** para todas las acciones

### ModernDatePicker
```tsx
// DatePicker personalizado completamente integrado
<ModernDatePicker 
  value={date} 
  onChange={setDate}
  placeholder="Seleccionar fecha" 
/>
```
- **react-day-picker v9** como base
- **Localización española** completa
- **Navegación rápida** por mes/año
- **Atajos útiles**: "Hoy" y "Limpiar"
- **Alto contraste** y accesibilidad
- **Integración perfecta** con React Hook Form

## 📊 Estructura de Datos y Validación

### Esquemas de Validación con Zod
```typescript
// FamilyGrid - Validación completa por miembro
const familyMemberSchema = z.object({
  nombres: z.string().min(2, "Mínimo 2 caracteres"),
  fechaNacimiento: z.date().optional().nullable(),
  tipoIdentificacion: z.string().optional(),
  numeroIdentificacion: z.string().optional(),
  sexo: z.string().optional(),
  situacionCivil: z.string().optional(),
  parentesco: z.string().optional(),
  talla: z.object({
    camisa: z.string().optional(),
    pantalon: z.string().optional(),
    calzado: z.string().optional(),
  }),
  correoElectronico: z.string().email().optional().or(z.literal("")),
  // ... 15+ campos más con validación específica
});
```

### Tipos de Campo Soportados
- **text/number**: Inputs básicos con validación en tiempo real
- **select**: Dropdowns con opciones predefinidas específicas
- **date**: ModernDatePicker con validación de fecha
- **email**: Validación de email con regex
- **checkbox**: Selección múltiple para listas
- **textarea**: Campos de texto largo para observaciones

### Gestión de Estado
- **localStorage**: Guardado automático cada cambio
- **Migración de datos**: Compatibilidad con formatos legacy
- **Recuperación de sesión**: Restaura datos al recargar
- **Validación progresiva**: Solo valida campos tocados

## 📋 Configuración de Formulario

### Etapas del Formulario (formStages)
```typescript
const formStages = [
  {
    id: 1,
    title: "Información General",
    fields: [
      { id: "fecha", type: "date", label: "Fecha", required: true },
      { id: "nombres", type: "text", label: "Nombres y Apellidos", required: true },
      // ... 7 campos más
    ]
  },
  {
    id: 2, 
    title: "Vivienda y Basuras",
    fields: [
      { id: "direccion", type: "text", label: "Dirección", required: true },
      { id: "sector", type: "select", label: "Sector", options: [...] },
      // ... 5 campos más
    ]
  },
  // ... 4 etapas más con 50+ campos total
];
```

### Opciones de Select Predefinidas
- **Estado Civil**: 8 opciones (Soltero, Casado Civil, etc.)
- **Tipo Identificación**: 6 tipos (RC, TI, CC, CE, PAS, NIT)
- **Nivel Estudios**: 5 niveles (Sin estudio a Universitaria)
- **Comunidad Cultural**: 3 opciones (LGTBIQ+, Indígena, Negritudes)
- **Parentesco**: 9 relaciones familiares
- **Sectores**: Configurable por parroquia

## 🎨 Guía de Desarrollo y Contribución

### Estándares de Código
- **TypeScript estricto** con configuración completa
- **Componentes funcionales** con hooks personalizados
- **Tailwind CSS puro** + tokens CSS personalizados
- **Naming consistente** con convenciones establecidas
- **ESLint configurado** para mantener calidad de código

### Arquitectura de Componentes
```typescript
// Estructura recomendada para nuevos componentes
interface ComponentProps {
  // Props tipadas con TypeScript
}

const Component = ({ ...props }: ComponentProps) => {
  // 1. Hooks de estado y efectos
  // 2. Funciones auxiliares
  // 3. Handlers de eventos
  // 4. Return JSX con clases Tailwind
};

export default Component;
```

### Nuevos Componentes UI
1. **Usar shadcn/ui** como base cuando sea posible
2. **Extender con tokens** CSS personalizados
3. **Implementar variantes** usando class-variance-authority
4. **Asegurar accesibilidad** (ARIA, contrast ratios)
5. **Incluir estados** responsive y interactivos

### Gestión de Formularios
```tsx
// Patrón establecido con React Hook Form + Zod
const schema = z.object({
  // Definir validaciones
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { ... }
});

// Usar FormField de shadcn/ui para consistencia
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Estilos y Clases CSS
```tsx
// ✅ Correcto - usar Tailwind + tokens
<div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-lg">

// ✅ Correcto - usar componentes shadcn/ui
<Card className="rounded-xl border-2">
  <CardContent className="p-6">

// ❌ Evitar - estilos inline o CSS-in-JS
<div style={{ backgroundColor: "white" }}>
```

## 🚀 Próximos Pasos de Desarrollo

### Fase 2: Backend y Persistencia
- [ ] **API REST** con FastAPI/Django para persistencia
- [ ] **Base de datos PostgreSQL** con modelos relacionales
- [ ] **Autenticación JWT** con roles y permisos
- [ ] **Endpoints CRUD** completos para todas las entidades
- [ ] **Validación backend** sincronizada con frontend
- [ ] **Sistema de backup** automático de encuestas

### Fase 3: Reportes y Analytics
- [ ] **Dashboard avanzado** con métricas en tiempo real
- [ ] **Gráficos interactivos** usando Chart.js/Recharts
- [ ] **Generación de reportes PDF** con datos filtrados
- [ ] **Exportación Excel** con múltiples hojas
- [ ] **Comparativas históricas** por períodos
- [ ] **Mapas de calor** por sectores geográficos

### Fase 4: Funcionalidades Avanzadas  
- [ ] **Gestión de sectores** con mapas interactivos (Leaflet)
- [ ] **Sistema de usuarios** completo (CRUD, roles)
- [ ] **Configuración parroquial** personalizable
- [ ] **Notificaciones email** automáticas
- [ ] **Sistema de recordatorios** para seguimiento
- [ ] **API pública** para integraciones externas

### Fase 5: Mobile y PWA
- [ ] **Progressive Web App** (PWA) completa
- [ ] **Modo offline** con sincronización automática
- [ ] **Aplicación móvil nativa** React Native/Flutter
- [ ] **Push notifications** para actualizaciones
- [ ] **Captura de fotos** para documentación
- [ ] **Geolocalización** automática de viviendas

### Optimizaciones Técnicas
- [ ] **Server-Side Rendering** (SSR) con Next.js
- [ ] **Lazy loading** de componentes pesados
- [ ] **Service Workers** para cache inteligente
- [ ] **Optimización de imágenes** automática
- [ ] **Testing suite** completa (Jest + Testing Library)
- [ ] **CI/CD pipeline** con GitHub Actions

## 🛡️ Seguridad y Compliance

### Medidas Implementadas
- **Validación client-side** con Zod schemas
- **Sanitización de inputs** automática
- **Encriptación localStorage** para datos sensibles
- **HTTPS enforcing** en producción

### Pendientes de Implementar
- **GDPR compliance** para protección de datos
- **Auditoría de acciones** con logs detallados
- **Backup encriptado** de información personal
- **Políticas de retención** de datos configurables

## 🤝 Soporte y Documentación

### Recursos Disponibles
- **README completo** con toda la documentación técnica
- **Comentarios en código** para funciones complejas
- **Tipos TypeScript** completamente definidos
- **Estructura modular** fácil de navegar

### Contacto y Contribuciones
Para dudas sobre implementación, personalización o despliegue del sistema:
- Revisar la documentación en código
- Seguir los patrones establecidos
- Mantener la consistencia del sistema de diseño
- Asegurar compatibilidad con navegadores modernos

---

**Sistema Parroquial v2.0** - Desarrollado con ❤️ para las comunidades católicas de Colombia

*Última actualización: Enero 2025*