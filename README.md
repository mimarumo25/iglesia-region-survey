# Sistema Parroquial - Caracterización Poblacional

## 📋 Descripción

Sistema web desarrollado para iglesias católicas en Colombia que permite caracterizar la población de una región mediante encuestas estructuradas, gestión de usuarios y generación de reportes estadísticos.

## 🎯 Características Principales

### ✅ Implementadas
- **Sistema de autenticación** con login/logout
- **Dashboard interactivo** con widgets estadísticos 
- **Diseño responsivo** con modo claro/oscuro
- **Sidebar navegable** con colapso automático
- **Formulario multi-etapa** con guardado automático
- **Sistema de diseño consistente** usando Tailwind CSS + shadcn/ui
- **Tipografía accesible** con alto contraste
- **Componentes reutilizables** con variantes personalizadas

### 🚧 Módulos Planificados
- Gestión completa de usuarios (CRUD)
- Reportes avanzados con gráficos
- Gestión de sectores geográficos
- Panel de configuración de parroquia
- Sistema de recuperación de contraseña
- Exportación de datos (PDF, Excel)
- Mapas interactivos con Leaflet
- Modo offline PWA

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
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base de shadcn/ui
│   ├── AppSidebar.tsx   # Navegación lateral principal
│   ├── Layout.tsx       # Layout principal con header
│   └── SurveyForm.tsx   # Formulario multi-etapa
├── pages/               # Páginas principales
│   ├── Login.tsx        # Autenticación
│   ├── Dashboard.tsx    # Panel de control
│   └── NotFound.tsx     # Página 404
├── hooks/               # Hooks personalizados
│   └── use-toast.ts     # Sistema de notificaciones
├── lib/                 # Utilidades
│   └── utils.ts         # Funciones auxiliares
├── index.css           # Sistema de diseño (tokens CSS)
└── App.tsx             # Configuración de rutas
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Git

### Instalación
```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd sistema-parroquial

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Vista previa de producción
npm run lint     # Verificar código
```

## 📱 Páginas y Funcionalidades

### 🔐 Página de Login
- **Ruta**: `/login`
- **Características**:
  - Formulario centrado con logo de iglesia
  - Validación en tiempo real
  - Enlace de recuperación de contraseña
  - Diseño responsive y accesible

### 📊 Dashboard Principal  
- **Ruta**: `/dashboard`
- **Widgets implementados**:
  - **Estadísticas generales**: Total encuestas, completadas, pendientes
  - **Progreso por sector**: Barras de progreso para cada sector
  - **Tipos de vivienda**: Distribución con gráfico de barras
  - **Actividad reciente**: Timeline de acciones del sistema
- **Características**:
  - Header con gradiente parroquial
  - Cards con sombras elegantes
  - Colores semánticos (éxito, advertencia, info)

### 📋 Formulario Multi-Etapa
- **Componente**: `SurveyForm.tsx`
- **5 Etapas estructuradas**:
  1. **Datos Personales**: Nombres, cédula, edad, estado civil
  2. **Ubicación y Vivienda**: Dirección, sector, tipo vivienda, servicios
  3. **Información Familiar**: Composición del hogar
  4. **Actividades Parroquiales**: Participación en la vida de la iglesia
  5. **Necesidades y Observaciones**: Requerimientos especiales
- **Características avanzadas**:
  - **Barra de progreso visual** (1 de 5, 40% completado)
  - **Guardado automático** en localStorage
  - **Navegación fluida** entre etapas
  - **Validaciones inline** con mensajes claros
  - **Recuperación de borradores** al recargar página

## 🎯 Componentes Clave

### AppSidebar
```tsx
// Navegación lateral con colapso inteligente
<AppSidebar />
```
- **Menús**: Dashboard, Encuestas, Familias, Sectores, Reportes, Usuarios, Configuración
- **Estados**: Expandido/colapsado con tooltips
- **Perfil de usuario** con avatar y rol
- **Indicador de página activa**

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

### Sistema de Diseño
```css
/* Clases utilitarias personalizadas */
.parish-card           /* Cards con estilo parroquial */
.parish-button-primary /* Botón principal azul */
.parish-input         /* Inputs con bordes suaves */
.parish-gradient-header /* Header con gradiente */
```

## 🔧 Configuración del Sistema de Diseño

### Tokens CSS (index.css)
```css
:root {
  /* Colores primarios */
  --primary: 213 94% 35%;          /* Azul católico */
  --secondary: 32 95% 44%;         /* Dorado litúrgico */
  
  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, ...);
  
  /* Sombras elegantes */
  --shadow-glow: 0 0 20px hsl(var(--primary) / 0.15);
}
```

### Configuración Tailwind (tailwind.config.ts)
- **Fuente**: Inter para máxima legibilidad
- **Colores extendidos**: primary-light, primary-dark, success, warning
- **Sombras personalizadas**: glow, md, lg para depth visual
- **Gradientes**: primary, secondary, subtle para headers y fondos

## 📊 Estructura de Datos del Formulario

### Etapas Definidas
```typescript
const formStages = [
  {
    id: 1,
    title: "Datos Personales",
    fields: [
      { id: "nombres", type: "text", required: true },
      { id: "estado_civil", type: "select", options: [...] }
    ]
  },
  // ... 4 etapas más
]
```

### Tipos de Campo Soportados
- **text/number**: Inputs básicos con validación
- **select**: Dropdowns con opciones predefinidas  
- **checkbox**: Selección múltiple para listas
- **textarea**: Campos de texto largo para observaciones

## 🎨 Guía de Contribución

### Estándares de Código
- **TypeScript estricto** para type safety
- **Componentes funcionales** con hooks
- **CSS-in-JS evitado** - usar solo Tailwind + tokens CSS
- **Naming consistente** con prefijo `parish-` para clases custom

### Nuevos Componentes
1. Usar **tokens de diseño** definidos en `index.css`
2. Implementar **variantes** en lugar de overrides
3. Asegurar **accesibilidad** (ARIA labels, contrast ratios)
4. Incluir **estados responsivos** para mobile/desktop

### Colores y Estilos
```tsx
// ❌ Evitar - colores hardcodeados
<Button className="bg-blue-500 text-white">

// ✅ Correcto - usar tokens semánticos  
<Button className="parish-button-primary">
<Button variant="primary">  // Si existe variante
```

## 🚀 Próximos Pasos de Desarrollo

### Fase 2 - Backend Integration
- [ ] API FastAPI con autenticación JWT
- [ ] Base de datos PostgreSQL 
- [ ] Endpoints REST para CRUD completo
- [ ] Sistema de roles y permisos

### Fase 3 - Funcionalidades Avanzadas  
- [ ] Generación de reportes PDF
- [ ] Mapas interactivos con sectores
- [ ] Sistema de notificaciones email
- [ ] Backup automático de datos

### Fase 4 - Mobile y PWA
- [ ] Aplicación móvil nativa
- [ ] Modo offline para capturistas
- [ ] Sincronización automática 
- [ ] Push notifications

## 🤝 Soporte y Contacto

Para dudas sobre implementación, personalización o despliegue del sistema, contactar al equipo de desarrollo.

---

**Sistema Parroquial v1.0** - Desarrollado con ❤️ para las comunidades católicas de Colombia