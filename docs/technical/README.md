# 📚 Documentación Técnica - Sistema MIA

Bienvenido a la documentación técnica completa del Sistema de Gestión Integral para Iglesias (MIA).

## 📑 Índice de Documentación

### 🏗️ Arquitectura y Diseño
- [**Arquitectura del Sistema**](architecture/system-architecture.md) - Estructura general, tecnologías y patrones
- [**Flujo de Datos**](architecture/data-flow.md) - Transformadores y gestión de estado
- [**Autenticación y Seguridad**](architecture/authentication.md) - Sistema de auth, permisos y roles

### 💻 Desarrollo
- [**Guía de Desarrollo**](development/development-guide.md) - Estándares, convenciones y mejores prácticas
- [**Componentes Principales**](development/core-components.md) - Documentación de componentes clave
- [**Hooks Personalizados**](development/custom-hooks.md) - Hooks reutilizables y su uso
- [**Gestión de Formularios**](development/form-management.md) - React Hook Form, validación y transformadores

### 🔧 Características
- [**Sistema de Encuestas**](features/survey-system.md) - Modo CREATE vs EDIT, etapas y validación
- [**Sistema Responsivo**](features/responsive-design.md) - Breakpoints, móvil, tablet y desktop
- [**Sistema de Reportes**](features/reports-system.md) - Generación y visualización de reportes

### 🐛 Resolución de Problemas
- [**Problemas Comunes**](troubleshooting/common-issues.md) - Errores frecuentes y soluciones
- [**Historial de Correcciones**](troubleshooting/bug-fixes.md) - Registro de bugs resueltos
- [**Debugging y Diagnóstico**](troubleshooting/debugging-guide.md) - Herramientas y técnicas

### 📊 Base de Datos y API
- [**Modelo de Datos**](api/data-model.md) - Estructura de datos y relaciones
- [**Endpoints API**](api/endpoints.md) - Documentación de endpoints backend
- [**Transformadores de Datos**](api/data-transformers.md) - Conversión entre API y formulario

### 🚀 Despliegue
- [**Guía de Deploy**](deployment/deployment-guide.md) - Docker, Nginx y configuración de producción
- [**Variables de Entorno**](deployment/environment-variables.md) - Configuración del sistema

## 🎯 Inicio Rápido

Para comenzar a trabajar en el proyecto:

1. **Leer primero**: [Arquitectura del Sistema](architecture/system-architecture.md)
2. **Configurar entorno**: [Guía de Desarrollo](development/development-guide.md)
3. **Entender autenticación**: [Autenticación y Seguridad](architecture/authentication.md)
4. **Explorar componentes**: [Componentes Principales](development/core-components.md)

## 📝 Documentos Históricos

Documentación de sesiones de desarrollo específicas:
- [Corrección de Campos en Modo EDIT](SESION-RESUMEN-COMPLETO.md)
- [Mejoras Responsive Design](IMPROVEMENTS-MOBILE-PERSONAS.md)
- [Flujo Dual-Mode CREATE vs EDIT](FLUJO-DUAL-MODE-COMPLETO.md)
- [Diagnóstico Disposición de Basura](DIAGNOSTICO-DISPOSICION-BASURA.md)
- [Auditoría de Campos](CAMPOS-VALIDACION.md)

## 🔍 Búsqueda Rápida

**Por tecnología:**
- React 18: [Componentes](development/core-components.md) | [Hooks](development/custom-hooks.md)
- TypeScript: [Guía de Desarrollo](development/development-guide.md)
- Formularios: [Gestión de Formularios](development/form-management.md)
- UI: [Sistema Responsivo](features/responsive-design.md)

**Por funcionalidad:**
- Encuestas: [Sistema de Encuestas](features/survey-system.md)
- Autenticación: [Auth y Seguridad](architecture/authentication.md)
- Reportes: [Sistema de Reportes](features/reports-system.md)

## 🆘 Soporte

Si encuentras un problema:
1. Revisa [Problemas Comunes](troubleshooting/common-issues.md)
2. Consulta [Debugging Guide](troubleshooting/debugging-guide.md)
3. Verifica [Historial de Correcciones](troubleshooting/bug-fixes.md)

## 📊 Estado del Proyecto

- **Versión**: 2.0
- **Estado**: ✅ Producción
- **Última actualización**: Enero 2026
- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS
