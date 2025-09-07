---
applyTo: '**'
---

# 📋 Instrucciones de Desarrollo - Sistema MIA (Gestión Integral de Iglesias)

## 🎯 Contexto del Proyecto

Este es un **Sistema de Gestión Integral para Iglesias Católicas** desarrollado con **React 18**, **TypeScript**, **Vite** y **Tailwind CSS**. El sistema permite realizar caracterización poblacional mediante encuestas estructuradas, gestión de familias y generación de reportes estadísticos.

### 🏗️ Arquitectura Técnica
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui + Radix UI
- **Form Management**: React Hook Form + Zod
- **Estado**: Context API + Custom Hooks
- **Routing**: React Router DOM v6
- **Deploy**: Docker + Docker Compose
- **Patrón de diseño**: Componentes modulares + Custom Hooks

## 🎨 Sistema de Diseño y Estándares

### Paleta de Colores Oficial
```css
:root {
  --primary: 213 94% 35%;          /* Azul católico (#1e40af) */
  --secondary: 32 95% 44%;         /* Dorado litúrgico (#d97706) */
  --background: 0 0% 100%;         /* Blanco puro */
  --foreground: 222.2 84% 4.9%;    /* Negro para texto */
  --muted: 210 40% 98%;            /* Gris claro para fondos */
}
```

### Principios de UI/UX
- **Alto contraste** para máxima accesibilidad
- **Espaciado generoso** con sistema de grillas 8px
- **Tipografía clara** (Inter font-family, mínimo 16px)
- **Botones grandes** con estados hover/focus visibles
- **Animaciones sutiles** usando Tailwind transitions

### Naming Conventions
```typescript
// ✅ Componentes en PascalCase
const FamilyGrid = () => {}
const ModernDatePicker = () => {}

// ✅ Hooks con prefijo "use"
const useAuth = () => {}
const useFamilyGrid = () => {}

// ✅ Variables en camelCase
const familyMembers = []
const currentStage = 1

// ✅ Constantes en SCREAMING_SNAKE_CASE
const FORM_STAGES = []
const API_ENDPOINTS = {}

// ✅ Archivos y directorios en kebab-case
// components/family-grid/
// hooks/use-family-data.ts
```

## 📁 Estructura de Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base shadcn/ui
│   ├── survey/          # Componentes específicos de encuesta
│   ├── dashboard/       # Componentes del dashboard
│   └── [feature]/       # Componentes por funcionalidad
├── hooks/               # Custom hooks reutilizables
├── lib/                 # Utilidades y configuraciones
├── pages/              # Páginas principales (routing)
├── types/              # Definiciones TypeScript
├── services/           # Servicios API y lógica de negocio
├── context/            # React Context providers
└── utils/              # Funciones auxiliares puras
```

## 🔧 Estándares de Codificación

### Componentes React
```typescript
// ✅ Estructura estándar para componentes
interface ComponentNameProps {
  // Props tipadas con TypeScript
  data: SomeType[]
  onAction?: (id: string) => void
  className?: string
}

const ComponentName = ({ data, onAction, className }: ComponentNameProps) => {
  // 1. Hooks de estado y efectos (React)
  const [isLoading, setIsLoading] = useState(false)
  
  // 2. Custom hooks
  const { user } = useAuth()
  
  // 3. Funciones auxiliares
  const handleSubmit = (data: FormData) => {
    // Lógica del handler
  }
  
  // 4. Effects (useEffect al final de hooks)
  useEffect(() => {
    // Effect logic
  }, [dependency])
  
  // 5. Early returns
  if (isLoading) return <LoadingSpinner />
  
  // 6. JSX Return
  return (
    <div className={cn("default-classes", className)}>
      {/* JSX content */}
    </div>
  )
}

export default ComponentName
```

### Custom Hooks Pattern
```typescript
// ✅ Patrón estándar para hooks personalizados
interface UseFamilyDataResult {
  familyMembers: FamilyMember[]
  isLoading: boolean
  error: string | null
  addMember: (member: Partial<FamilyMember>) => void
  updateMember: (id: string, updates: Partial<FamilyMember>) => void
  deleteMember: (id: string) => void
}

export const useFamilyData = (surveyId?: string): UseFamilyDataResult => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Funciones del hook
  const addMember = useCallback((member: Partial<FamilyMember>) => {
    // Implementation
  }, [])
  
  return {
    familyMembers,
    isLoading,
    error,
    addMember,
    updateMember,
    deleteMember
  }
}
```

### Form Management con React Hook Form + Zod
```typescript
// ✅ Patrón estándar para formularios
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  nombres: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  fechaNacimiento: z.date().optional().nullable(),
})

type FormData = z.infer<typeof formSchema>

const FormComponent = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: "",
      email: "",
      fechaNacimiento: null,
    }
  })
  
  const onSubmit = (data: FormData) => {
    // Handle form submission
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="nombres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres y Apellidos</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Más campos... */}
      </form>
    </Form>
  )
}
```

## 🎯 Componentes Clave del Sistema

### 1. FamilyGrid - Gestión de Familia
- **Ubicación**: `src/components/survey/FamilyGrid.tsx`
- **Funcionalidad**: Tabla de miembros de familia con CRUD completo
- **Tecnologías**: React Hook Form + Zod + shadcn/ui Table
- **Características**: Modal de edición, validación en tiempo real, persistencia local

### 2. ModernDatePicker - Selector de Fechas
- **Ubicación**: `src/components/ui/modern-date-picker.tsx`
- **Funcionalidad**: Selector de fechas moderno y accesible
- **Tecnologías**: react-day-picker v9 + date-fns + localización española
- **Características**: Navegación rápida, atajos "Hoy"/"Limpiar", alto contraste

### 3. SurveyForm - Formulario Principal
- **Ubicación**: `src/components/SurveyForm.tsx`
- **Funcionalidad**: Formulario multi-etapa con 50+ campos
- **Características**: 6 etapas, navegación, guardado automático, validación progresiva

### 4. AppSidebar - Navegación
- **Ubicación**: `src/components/AppSidebar.tsx`
- **Funcionalidad**: Navegación lateral colapsible
- **Características**: Responsive, tooltips automáticos, indicador de página activa

## 🔧 Integración con shadcn/ui

### Instalación de Nuevos Componentes
```bash
# Para agregar un nuevo componente shadcn/ui
npx shadcn-ui@latest add [component-name]

# Ejemplo: agregar calendario
npx shadcn-ui@latest add calendar
```

### Personalización de Componentes shadcn/ui
```typescript
// ✅ Extender componentes base en lugar de modificar directamente
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ParishButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "parish" | "liturgical"
}

const ParishButton = ({ className, variant = "parish", ...props }: ParishButtonProps) => {
  return (
    <Button 
      className={cn(
        // Clases base
        "font-semibold transition-all duration-200",
        // Variantes personalizadas
        {
          "bg-primary hover:bg-primary/90 text-white": variant === "parish",
          "bg-secondary hover:bg-secondary/90 text-white": variant === "liturgical"
        },
        className
      )} 
      {...props} 
    />
  )
}
```

## 🎯 Patrones de Desarrollo Específicos

### Manejo de Estados Complejos
```typescript
// ✅ Usar useReducer para estados complejos
interface SurveyState {
  currentStage: number
  formData: Record<string, any>
  familyMembers: FamilyMember[]
  isLoading: boolean
  errors: Record<string, string>
}

type SurveyAction = 
  | { type: 'SET_STAGE'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Record<string, any> }
  | { type: 'ADD_FAMILY_MEMBER'; payload: FamilyMember }
  | { type: 'SET_LOADING'; payload: boolean }

const surveyReducer = (state: SurveyState, action: SurveyAction): SurveyState => {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, currentStage: action.payload }
    // ... otros cases
    default:
      return state
  }
}

const useSurveyForm = () => {
  const [state, dispatch] = useReducer(surveyReducer, initialState)
  
  return {
    ...state,
    setStage: (stage: number) => dispatch({ type: 'SET_STAGE', payload: stage }),
    updateFormData: (data: Record<string, any>) => 
      dispatch({ type: 'UPDATE_FORM_DATA', payload: data }),
  }
}
```

### Persistencia Local con Migración
```typescript
// ✅ Sistema de migración para LocalStorage
const STORAGE_VERSION = "2.0"
const STORAGE_KEY = "survey-data"

interface StorageData {
  version: string
  formData: any
  timestamp: number
}

export const saveToStorage = (data: any) => {
  const storageData: StorageData = {
    version: STORAGE_VERSION,
    formData: data,
    timestamp: Date.now()
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData))
}

export const loadFromStorage = (): any => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const parsedData: StorageData = JSON.parse(stored)
    
    // Migración de versiones antiguas
    if (parsedData.version !== STORAGE_VERSION) {
      return migrateStorageData(parsedData)
    }
    
    return parsedData.formData
  } catch (error) {
    console.error('Error loading from storage:', error)
    return null
  }
}

const migrateStorageData = (oldData: StorageData) => {
  // Lógica de migración específica
  return oldData.formData
}
```

## 🚀 Desarrollo de Nuevas Funcionalidades

### Checklist para Nuevos Componentes
- [ ] **TypeScript**: Tipos y interfaces definidas
- [ ] **Props interface**: Documentadas con JSDoc
- [ ] **Accesibilidad**: ARIA labels y roles
- [ ] **Responsive**: Funciona en mobile/tablet/desktop
- [ ] **Estados**: Loading, error, empty states
- [ ] **Tailwind**: Solo clases Tailwind, no estilos inline
- [ ] **shadcn/ui**: Usar componentes base cuando sea posible
- [ ] **Testing**: Casos de prueba básicos

### Flujo para Nuevas Features
1. **Análisis**: Entender requirements y diseño
2. **Planning**: Identificar componentes y hooks necesarios
3. **Tipos**: Definir interfaces TypeScript
4. **Componentes**: Crear componentes base reutilizables
5. **Lógica**: Implementar custom hooks
6. **Integración**: Conectar con formularios/estado global
7. **Styling**: Aplicar sistema de diseño
8. **Testing**: Pruebas funcionales
9. **Documentación**: Comentarios y README

## 🎯 Mejores Prácticas Específicas del Proyecto

### Gestión de Formularios
- **Siempre usar React Hook Form** + Zod para validación
- **Validación progresiva**: Solo validar campos "touched"
- **Guardado automático**: Persistir en localStorage en cada cambio
- **Recuperación de sesión**: Restaurar datos al recargar página
- **Mensajes claros**: Toast notifications para feedback

### Componentes de UI
- **Reutilización**: Crear variantes en lugar de duplicar
- **Composición**: Preferir composition over inheritance  
- **Props spreading**: Usar `{...props}` para flexibilidad
- **ClassName merging**: Usar `cn()` utility para combinar clases
- **Responsive design**: Mobile-first approach

### Performance
- **Lazy loading**: `React.lazy()` para componentes grandes
- **Memoización**: `useMemo`/`useCallback` solo cuando sea necesario
- **Evitar re-renders**: Optimizar dependencias de useEffect
- **Bundle size**: Imports nombrados en lugar de default cuando sea posible

### Integración de Fechas
- **Solo usar ModernDatePicker** para consistencia
- **Format ISO**: Siempre trabajar con ISO strings internamente
- **Localización**: date-fns con locale español
- **Validación**: Zod schemas para rangos de fechas
- **Fallback**: Manejar fechas nulas/inválidas gracefully

## 📚 Recursos y Referencias

### Documentación Oficial
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)

### Utilidades del Proyecto
```typescript
// cn() - Combinar clases CSS
import { cn } from "@/lib/utils"
const className = cn("base-class", condition && "conditional-class", props.className)

// formatDate() - Formatear fechas consistentemente  
import { formatDate } from "@/utils/dateFormat"
const formattedDate = formatDate(new Date(), "dd/MM/yyyy")

// generateId() - IDs únicos para elementos
import { generateId } from "@/utils/helpers" 
const uniqueId = generateId("family-member")
```

### Comandos de Desarrollo
```bash
# Desarrollo
npm run dev              # Servidor desarrollo (localhost:8081)
npm run build           # Build para producción
npm run lint            # Verificar código con ESLint

# Deploy
npm run deploy          # Deploy completo automático ⭐
npm run deploy:full     # Deploy con linting completo
npm run server:logs     # Ver logs del servidor
npm run server:restart  # Reiniciar aplicación

# Testing
npm run test            # Ejecutar tests (cuando se implementen)
```

## ⚠️ Consideraciones Importantes

### Datos Sensibles
- **Nunca hardcodear** credenciales o URLs de producción
- **Usar variables de entorno** para configuración sensible
- **Validar datos** tanto en frontend como backend
- **Logs seguros**: No loggear información personal

### Compatibilidad
- **Navegadores modernos**: Chrome 90+, Firefox 90+, Safari 14+
- **Dispositivos**: Responsive design para móviles y tablets
- **Accesibilidad**: WCAG 2.1 AA compliance mínimo

### Deploy y Producción
- **Docker**: Siempre usar contenedores para consistencia
- **Nginx**: Proxy reverso para servir archivos estáticos
- **SSL/TLS**: HTTPS obligatorio en producción
- **Monitoreo**: Logs estructurados para debugging

---

## 🎯 Instrucciones para AI/Copilot

Cuando generes código, modifiques archivos, o respondas preguntas sobre este proyecto:

### ✅ SIEMPRE hacer:
- Usar **TypeScript** con tipos estrictos
- Seguir los **patrones establecidos** (hooks, componentes, naming)
- Usar **React Hook Form + Zod** para formularios
- Aplicar **sistema de diseño** (colores, espaciado, tipografía)
- Usar **componentes shadcn/ui** como base
- Implementar **accesibilidad** (ARIA, contraste, navegación por teclado)
- Crear código **modular y reutilizable**
- Incluir **manejo de errores** y estados de loading
- Escribir **comentarios explicativos** para lógica compleja
- Seguir **convenciones de naming** del proyecto

### ❌ NUNCA hacer:
- Usar `any` como tipo TypeScript
- Crear estilos inline o CSS-in-JS  
- Duplicar lógica que ya existe en hooks/utils
- Ignorar responsive design
- Hardcodear strings que deberían ser configurables
- Usar `var` en lugar de `const`/`let`
- Crear componentes sin props tipadas
- Obviar validación de formularios
- Usar bibliotecas diferentes para fechas (solo date-fns)
- Romper la estructura de carpetas establecida

### 📋 Preguntas de contexto antes de generar código:
1. **¿Es un componente nuevo o modificación?** Para determinar si usar patrón base o extender existente
2. **¿Necesita formulario?** Para aplicar React Hook Form + Zod pattern
3. **¿Es reutilizable?** Para ubicarlo en la carpeta correcta
4. **¿Maneja fechas?** Para usar ModernDatePicker
5. **¿Tiene estados complejos?** Para considerar useReducer o Context

### 🚀 Al sugerir mejoras:
- **Priorizar modularidad** y separación de responsabilidades
- **Proponer hooks reutilizables** para lógica repetitiva  
- **Sugerir optimizaciones** de performance cuando sea relevante
- **Mencionar consideraciones** de accesibilidad
- **Explicar decisiones** de arquitectura y design patterns

---

Este documento es la **fuente de verdad** para el desarrollo del proyecto. Manténlo actualizado cuando se implementen nuevas funcionalidades o cambios arquitectónicos importantes.