# 🏗️ Arquitectura del Sistema MIA

## 📋 Visión General

Sistema MIA (Gestión Integral para Iglesias) es una aplicación web moderna construida con arquitectura de componentes modulares y separación clara de responsabilidades.

## 🎯 Stack Tecnológico

### Frontend Core
- **React 18.3.1** - Biblioteca UI con Hooks y Suspense
- **TypeScript 5.x** - Tipado estático para mayor seguridad
- **Vite 7.3.0** - Build tool ultra-rápido con HMR

### UI & Styling
- **Tailwind CSS 3.4.1** - Framework utility-first
- **shadcn/ui** - Componentes accesibles basados en Radix UI
- **Radix UI** - Primitivos accesibles sin estilos
- **Lucide React** - Iconografía moderna y consistente

### Gestión de Estado
- **React Context API** - Estado global (Auth, Theme)
- **React Hook Form 7.x** - Gestión de formularios
- **Zod 3.x** - Validación de schemas TypeScript-first

### Routing & Navegación
- **React Router DOM v6** - Routing declarativo
- **Lazy Loading** - Carga diferida de rutas

### Utilidades
- **date-fns 4.x** - Manipulación de fechas
- **Axios 1.x** - Cliente HTTP con interceptores
- **Sonner** - Sistema de notificaciones toast

## 📁 Estructura del Proyecto

```
iglesia-region-survey/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes base shadcn/ui (30+)
│   │   ├── survey/          # Componentes específicos de encuesta
│   │   ├── dashboard/       # Widgets del dashboard
│   │   ├── auth/            # Componentes de autenticación
│   │   ├── familias/        # Gestión de familias
│   │   ├── personas/        # Gestión de personas
│   │   └── [modules]/       # Módulos específicos por entidad
│   │
│   ├── pages/              # Páginas principales (routing)
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Surveys.tsx
│   │   ├── SurveyDetails.tsx
│   │   └── [routes]/
│   │
│   ├── hooks/              # Custom hooks reutilizables
│   │   ├── useAuth.ts
│   │   ├── usePermissions.ts
│   │   ├── useFamilyGrid.ts
│   │   ├── useEncuestas.ts
│   │   └── [30+ hooks]/
│   │
│   ├── context/            # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── GlobalSearchContext.tsx
│   │
│   ├── services/           # Servicios de API
│   │   ├── auth.ts
│   │   ├── encuestas.ts
│   │   ├── familias.ts
│   │   └── [services]/
│   │
│   ├── utils/              # Utilidades y helpers
│   │   ├── encuestaToFormTransformer.ts
│   │   ├── surveyAPITransformer.ts
│   │   ├── sessionDataTransformer.ts
│   │   └── [transformers]/
│   │
│   ├── types/              # Definiciones TypeScript
│   │   ├── auth.ts
│   │   ├── survey.ts
│   │   ├── familia.ts
│   │   └── [types]/
│   │
│   ├── config/             # Configuraciones
│   │   ├── api.ts
│   │   ├── routes.ts
│   │   └── auth.ts
│   │
│   ├── interceptors/       # Interceptores Axios
│   │   └── axios.ts
│   │
│   ├── lib/                # Librerías y utilidades base
│   │   └── utils.ts        # cn() y helpers
│   │
│   └── schemas/            # Schemas de validación Zod
│       └── [schemas]/
│
├── public/                 # Assets estáticos
├── docs/                   # Documentación técnica
├── docker/                 # Configuración Docker
└── deploy/                 # Scripts de despliegue
```

## 🔧 Patrones de Arquitectura

### 1. Component-Based Architecture
Toda la UI está construida con componentes React reutilizables siguiendo el principio de responsabilidad única.

### 2. Presentational vs Container Components
- **Presentational**: Componentes puros que reciben props y renderizan UI
- **Container**: Componentes que manejan lógica de negocio y estado

### 3. Custom Hooks Pattern
Toda la lógica reutilizable está encapsulada en custom hooks:
```typescript
useAuth() → Autenticación
useFamilyGrid() → Gestión de familias
useEncuestas() → Lógica de encuestas
usePermissions() → Verificación de permisos
```

### 4. Context Pattern
Estado global compartido a través de React Context:
- `AuthContext` - Usuario, autenticación, sesión
- `ThemeContext` - Temas visuales y personalización
- `GlobalSearchContext` - Búsqueda global del sistema

### 5. Transformer Pattern
Capa de transformación entre API y formularios:
- `encuestaToFormTransformer` - API → Formulario
- `surveyAPITransformer` - Formulario → API
- `sessionDataTransformer` - FormData → SurveySessionData

### 6. Service Layer Pattern
Servicios centralizados para comunicación con API:
```typescript
AuthService → Login, logout, refresh token
EncuestasService → CRUD de encuestas
FamiliasService → Gestión de familias
```

## 🔄 Flujo de Datos

### Flujo de Autenticación
```
Login Component
    ↓
useAuth Hook
    ↓
AuthService.login()
    ↓
API Backend
    ↓
TokenManager (localStorage)
    ↓
AuthContext (global state)
    ↓
App Components (isAuthenticated)
```

### Flujo de Encuestas (CREATE)
```
SurveyForm Component
    ↓
React Hook Form (validation)
    ↓
sessionDataTransformer.transformFormDataToSurveySession()
    ↓
SurveySubmissionService.submitSurvey()
    ↓
API POST /encuesta
    ↓
Success → Toast notification
```

### Flujo de Encuestas (EDIT)
```
surveyId en URL
    ↓
useEncuestas.getEncuestaCompleta(id)
    ↓
API GET /encuesta/:id
    ↓
encuestaToFormTransformer.transformEncuestaToFormData()
    ↓
SurveyForm (pre-filled)
    ↓
User edits
    ↓
sessionDataTransformer → API PUT /encuesta/:id
```

## 🎨 Sistema de Diseño

### Design Tokens (CSS Variables)
Definidos en `src/index.css`:
```css
:root {
  --primary: 213 94% 35%;        /* Azul católico */
  --secondary: 32 95% 44%;       /* Dorado litúrgico */
  --background: 0 0% 100%;       /* Blanco */
  --foreground: 222.2 84% 4.9%;  /* Negro texto */
  --muted: 210 40% 98%;          /* Gris claro */
  --border: 214.3 31.8% 91.4%;   /* Bordes suaves */
  --radius: 0.5rem;              /* Bordes redondeados */
}
```

### Breakpoints Responsivos
```typescript
Very Small: < 480px  (móviles pequeños)
Mobile: 480px - 768px (móviles estándar)
Tablet: 768px - 1280px (tablets y pantallas medianas)
Desktop: > 1280px (escritorio)
```

### Tipografía
- **Font**: Inter (Google Fonts)
- **Base size**: 16px
- **Escala**: xs(12px), sm(14px), base(16px), lg(18px), xl(20px)

## 🔐 Capas de Seguridad

### 1. Autenticación JWT
- **Access Token**: 15 minutos (httpOnly cookie)
- **Refresh Token**: 7 días (httpOnly cookie)
- **Token Manager**: Gestión segura en memoria

### 2. Interceptores Axios
```typescript
// Request Interceptor
- Agrega Bearer token automáticamente
- Refresca token si está expirado

// Response Interceptor  
- Maneja errores 401 (no autorizado)
- Renueva tokens automáticamente
- Redirige a login si es necesario
```

### 3. PrivateRoute Component
Protección de rutas basada en autenticación y roles:
```tsx
<PrivateRoute requiredRole="admin">
  <UsersManagement />
</PrivateRoute>
```

### 4. Permisos Granulares
Hook `usePermissions()` verifica permisos específicos:
- `canManageUsers` - Gestión de usuarios
- `canViewReports` - Ver reportes
- `canManageSettings` - Configuración del sistema

## 📦 Gestión de Dependencias

### Instalación
```bash
npm install  # Instala todas las dependencias
```

### Principales Dependencias
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "~5.6.2",
  "vite": "^7.3.0",
  "tailwindcss": "^3.4.1",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "axios": "^1.7.9",
  "react-router-dom": "^6.28.0",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.468.0"
}
```

## 🚀 Comandos de Desarrollo

```bash
# Desarrollo local
npm run dev          # Servidor en localhost:8081

# Build para producción
npm run build        # Genera carpeta dist/

# Linting
npm run lint         # ESLint verification

# Deploy completo
npm run deploy       # Build + Docker + Deploy automático
```

## 🔧 Variables de Entorno

### Desarrollo (.env.development)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_LOG_LEVEL=debug
```

### Producción (.env.production)
```env
VITE_API_BASE_URL=https://api.parroquia.com/api
VITE_LOG_LEVEL=error
```

## 📊 Métricas de Performance

### Build
- **Tiempo de build**: ~8-10 segundos
- **Tamaño de bundle**: ~2.5 MB (gzipped)
- **Módulos**: ~3600 transformados

### Runtime
- **Time to Interactive (TTI)**: < 2s
- **First Contentful Paint (FCP)**: < 1s
- **Lazy Loading**: Rutas cargadas bajo demanda

## 🎯 Principios de Desarrollo

1. **TypeScript First** - Todo debe estar tipado
2. **Component Composition** - Reutilización sobre duplicación
3. **Single Responsibility** - Una función, un propósito
4. **DRY (Don't Repeat Yourself)** - Abstraer lógica común
5. **Accessibility First** - WCAG 2.1 AA compliance
6. **Mobile First** - Diseño responsive desde móvil
7. **Performance** - Lazy loading y optimización de bundle

## 🔍 Debugging y Monitoreo

### Console Logs Estructurados
```typescript
console.log('🔄 Transformando encuesta...', data)
console.log('✅ Guardado exitoso:', response)
console.error('❌ Error en validación:', errors)
```

### React DevTools
- Inspección de componentes
- Profiler para performance
- Context inspection

### Network Tab
- Monitoreo de requests API
- Verificación de tokens
- Tiempos de respuesta

## 📚 Referencias Adicionales

- [Flujo de Datos](data-flow.md) - Transformadores y gestión de estado
- [Autenticación](authentication.md) - Sistema de auth detallado
- [Guía de Desarrollo](../development/development-guide.md) - Estándares de código

