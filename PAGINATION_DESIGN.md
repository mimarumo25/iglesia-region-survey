# 📋 Diseño del Componente Pagination Reutilizable

## 🎯 Objetivo
Crear un componente de paginación estandarizado que unifique todos los patrones encontrados en los componentes de configuración, siguiendo el sistema de diseño del proyecto.

## 🏗️ Arquitectura del Componente

### Props Interface
```typescript
interface PaginationProps {
  // Datos de paginación (requeridos)
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  
  // Eventos (requeridos)
  onPageChange: (page: number) => void;
  
  // Configuración visual
  variant?: 'simple' | 'complete' | 'compact';
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  
  // Estados
  loading?: boolean;
  disabled?: boolean;
  
  // Personalización
  className?: string;
  infoText?: string;
  size?: 'sm' | 'md' | 'lg';
  
  // Responsive
  hideInfoOnMobile?: boolean;
}
```

### Variantes del Componente

#### 1. **Simple** (por defecto)
- Botones Anterior/Siguiente
- Información "Página X de Y"
- Indicador de elementos mostrados
- **Uso**: DisposicionBasura, SectoresConfig, Veredas

#### 2. **Complete**  
- Botones Anterior/Siguiente
- Números de página con elipsis (...)
- Botones Primera/Última página
- Información detallada de elementos
- **Uso**: Parentescos, Profesiones con muchas páginas

#### 3. **Compact**
- Solo botones Anterior/Siguiente
- Sin información adicional
- **Uso**: Modales, espacios reducidos

## 🎨 Sistema de Diseño

### Estructura Visual
```
┌─────────────────────────────────────────────────────────────┐
│ Mostrando 1-10 de 150 elementos        [◀] Página 2 de 15 [▶] │
│                                     [1] [2] [3] ... [15]    │
└─────────────────────────────────────────────────────────────┘
```

### Paleta de Colores
- **Botón activo**: `bg-primary text-primary-foreground`
- **Botón inactivo**: `border-input bg-background hover:bg-accent`
- **Botón deshabilitado**: `opacity-50 cursor-not-allowed`
- **Texto información**: `text-muted-foreground`

### Responsive Design
- **Desktop**: Información completa + botones
- **Tablet**: Información compacta + botones
- **Mobile**: Solo botones esenciales

## 🔧 Implementación Técnica

### Helpers Internos
```typescript
// Generar array de números de página con elipsis
const generatePageNumbers = (current: number, total: number, maxVisible: number): (number | 'ellipsis')[]

// Calcular rangos de elementos mostrados  
const calculateItemRange = (page: number, itemsPerPage: number, totalItems: number): { start: number; end: number }

// Validar si una página es navegable
const canNavigate = (targetPage: number, totalPages: number, loading: boolean): boolean
```

### Integración con Existing Code
```typescript
// El componente debe ser drop-in replacement para:
// ✅ Patrón DisposicionBasura (simple)
// ✅ Patrón Parentescos (complete) 
// ✅ Patrón ConfigurationTable (integrado)
```

## 📱 Casos de Uso por Componente

| Componente | Variante | Props Específicas |
|------------|----------|------------------|
| DisposicionBasura | `simple` | `showInfo=true` |
| Parentescos | `complete` | `maxVisiblePages=5, showFirstLast=true` |
| SectoresConfig | `simple` | `showInfo=true` |
| Veredas | `simple` | `size="sm"` |
| ConfigurationTable | `simple` | `hideInfoOnMobile=true` |

## 🚀 Plan de Migración

### Fase 1: Implementación Base
- Crear `/src/components/ui/pagination.tsx`
- Implementar variante `simple` (más común)
- Agregar tipos TypeScript completos

### Fase 2: Variantes Avanzadas  
- Implementar variante `complete` con números de página
- Agregar variante `compact` para espacios reducidos
- Testing responsive en diferentes dispositivos

### Fase 3: Migración Progresiva
1. DisposicionBasura.tsx (actual)
2. SectoresConfig.tsx (patrón similar)
3. Parentescos.tsx (patrón complex)
4. Resto de componentes de configuración

### Fase 4: Validación
- Consistency checks visuales
- Testing de edge cases
- Performance optimization