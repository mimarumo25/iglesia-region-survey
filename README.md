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

### Instalación
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
npm run dev         # Servidor de desarrollo (puerto 8081)
npm run build       # Compilar para producción
npm run build:dev   # Compilar en modo desarrollo
npm run preview     # Vista previa de producción
npm run lint        # Verificar código con ESLint
```

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