# 📊 Implementación de Paginación - Sistema MIA

## 🎯 Resumen de Implementación

Se ha implementado un sistema completo de paginación reutilizable para el módulo de encuestas, con soporte para navegación avanzada y configuración dinámica de items por página.

## 📁 Archivos Creados/Modificados

### ✅ Archivos Nuevos

1. **`src/types/pagination.ts`**
   - Interfaces TypeScript para paginación
   - Tipos reutilizables en todo el sistema
   - Documentación de contratos de la API

2. **`src/components/ui/PaginationControls.tsx`**
   - Componente principal de paginación
   - Variante compacta para móviles
   - Variante simple (SimplePaginationControls)
   - Configuración flexible mediante opciones

### ✅ Archivos Modificados

1. **`src/pages/Surveys.tsx`**
   - Integración del componente PaginationControls
   - Handlers para cambio de página y límite
   - Soporte responsive (compact mode en móvil)

## 🏗️ Arquitectura

### Flujo de Datos

```
┌─────────────────┐
│  Surveys.tsx    │
│                 │
│ - queryParams   │◄─────┐
│ - handlePageChange     │
│ - handleLimitChange    │
└────────┬────────┘      │
         │               │
         │ params        │ onChange
         ▼               │
┌─────────────────┐      │
│ useEncuestasList│      │
│   (React Query) │      │
└────────┬────────┘      │
         │               │
         │ GET request   │
         ▼               │
┌─────────────────┐      │
│ API Backend     │      │
│ /api/encuesta   │      │
│ ?page=X&limit=Y │      │
└────────┬────────┘      │
         │               │
         │ response      │
         ▼               │
┌─────────────────┐      │
│ EncuestasResponse     │
│ - data[]        │      │
│ - pagination    │      │
└────────┬────────┘      │
         │               │
         │               │
         ▼               │
┌─────────────────┐      │
│PaginationControls──────┘
│ - Botones nav   │
│ - Selector limit│
│ - Info totales  │
└─────────────────┘
```

## 🎨 Características Implementadas

### 1. Navegación Completa

- **Primera página** (ChevronsLeft icon)
- **Anterior** (ChevronLeft icon)
- **Siguiente** (ChevronRight icon)
- **Última página** (ChevronsRight icon)

### 2. Selector de Items por Página

Opciones configurables: `[5, 10, 20, 50, 100]`

```typescript
// Al cambiar el límite, automáticamente vuelve a página 1
handleItemsPerPageChange(newLimit) {
  setQueryParams({ page: 1, limit: newLimit })
}
```

### 3. Información de Totales

```
Mostrando 1-10 de 156 registros
Página 1 de 16
```

### 4. Modo Responsive

**Desktop (completo):**
- Todos los controles visibles
- Selector de items por página con label
- Botones de primera/última página

**Mobile (compact):**
- Solo botones anterior/siguiente
- Información condensada
- Selector de límite sin label

### 5. Estados de UI

- Botones deshabilitados en extremos (no hay anterior/siguiente)
- Loading state (deshabilita todos los controles)
- Texto adaptado (singular/plural automático)

## 🔧 Uso del Componente

### Ejemplo Básico

```typescript
import { PaginationControls } from "@/components/ui/PaginationControls";

<PaginationControls
  pagination={paginationData}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
  isLoading={isLoading}
/>
```

### Ejemplo con Opciones Personalizadas

```typescript
<PaginationControls
  pagination={paginationFromAPI}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
  isLoading={encuestasLoading}
  options={{
    showPageInfo: true,
    showItemsPerPage: true,
    showTotalItems: true,
    itemsPerPageOptions: [10, 25, 50, 100],
    compact: isMobile // Activar en móviles
  }}
/>
```

### Ejemplo Simple (Solo Navegación)

```typescript
import { SimplePaginationControls } from "@/components/ui/PaginationControls";

<SimplePaginationControls
  pagination={paginationData}
  onPageChange={handlePageChange}
  isLoading={isLoading}
/>
```

## 📋 Props del Componente

### PaginationControlsProps

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `pagination` | `PaginationInfo` | ✅ | Información de paginación de la API |
| `onPageChange` | `(page: number) => void` | ✅ | Callback al cambiar página |
| `onItemsPerPageChange` | `(limit: number) => void` | ❌ | Callback al cambiar límite |
| `isLoading` | `boolean` | ❌ | Estado de carga (deshabilita controles) |
| `options` | `PaginationOptions` | ❌ | Configuración de visualización |
| `className` | `string` | ❌ | Clases CSS adicionales |

### PaginationOptions

```typescript
interface PaginationOptions {
  showPageInfo?: boolean;         // default: true
  showItemsPerPage?: boolean;     // default: true
  showTotalItems?: boolean;       // default: true
  itemsPerPageOptions?: number[]; // default: [5, 10, 20, 50, 100]
  compact?: boolean;              // default: false
}
```

### PaginationInfo (de la API)

```typescript
interface PaginationInfo {
  currentPage: number;     // Página actual (1-indexed)
  totalPages: number;      // Total de páginas
  totalItems: number;      // Total de registros
  itemsPerPage: number;    // Items por página actual
  hasNextPage: boolean;    // Hay página siguiente
  hasPrevPage: boolean;    // Hay página anterior
}
```

## 🎯 Integración en Surveys.tsx

### 1. Estado de Paginación

```typescript
const [queryParams, setQueryParams] = useState<EncuestasSearchParams>({
  page: 1,
  limit: 10,
  search: searchTerm,
  estado: statusFilter !== 'all' ? statusFilter : undefined,
  sector: sectorFilter || undefined,
});
```

### 2. Handlers

```typescript
const handlePageChange = (page: number) => {
  setQueryParams(prev => ({ ...prev, page }));
};

const handleItemsPerPageChange = (limit: number) => {
  setQueryParams(prev => ({ ...prev, page: 1, limit }));
};
```

### 3. Renderizado Condicional

```typescript
{paginationFromAPI.totalPages > 1 && (
  <PaginationControls
    pagination={paginationFromAPI}
    onPageChange={handlePageChange}
    onItemsPerPageChange={handleItemsPerPageChange}
    isLoading={encuestasLoading}
    options={{
      compact: shouldUseMobileView
    }}
  />
)}
```

## 🚀 Mejoras Implementadas

### ✅ Respecto a la versión anterior

**Antes:**
```typescript
// Controles manuales básicos
<Button onClick={() => setPage(prev => prev - 1)}>Anterior</Button>
<span>Página {page} de {totalPages}</span>
<Button onClick={() => setPage(prev => prev + 1)}>Siguiente</Button>
```

**Ahora:**
- ✅ Componente reutilizable y tipado
- ✅ Navegación completa (primera/última página)
- ✅ Selector de items por página
- ✅ Modo responsive automático
- ✅ Estados de loading integrados
- ✅ Validación de límites (no permite ir más allá)
- ✅ Información detallada de totales
- ✅ Diseño consistente con shadcn/ui

### ✅ Performance

- **React Query caching**: No se hacen requests duplicados
- **Debounce en filtros**: 500ms antes de actualizar
- **Invalidación inteligente**: Solo queries afectadas
- **Estado optimizado**: Cambios mínimos en re-renders

## 📱 Responsive Design

### Desktop (≥768px)

```
┌─────────────────────────────────────────────────────────┐
│ Mostrando 1-10 de 156 registros                        │
│                                                          │
│  ⏮️ ◀️ Anterior  |  Página 1 de 16  |  Siguiente ▶️ ⏭️  │
│                                                          │
│  Mostrar: [10 ▼] por página                            │
└─────────────────────────────────────────────────────────┘
```

### Mobile (<768px)

```
┌────────────────────────────┐
│ Mostrando 1-10 de 156      │
│                            │
│  ◀️   Página 1 de 16   [10▼]│
└────────────────────────────┘
```

## 🧪 Testing Recomendado

### Casos de prueba sugeridos:

1. **Navegación básica**
   - ✅ Ir a siguiente página
   - ✅ Ir a página anterior
   - ✅ Ir a primera página
   - ✅ Ir a última página

2. **Límites**
   - ✅ Botón "Anterior" deshabilitado en página 1
   - ✅ Botón "Siguiente" deshabilitado en última página

3. **Selector de límite**
   - ✅ Cambiar de 10 a 20 items
   - ✅ Verificar que vuelve a página 1
   - ✅ Verificar que se actualiza el total de páginas

4. **Responsive**
   - ✅ Verificar modo compacto en móvil
   - ✅ Verificar modo completo en desktop

5. **Loading state**
   - ✅ Controles deshabilitados durante carga
   - ✅ Re-habilitación después de carga

## 🔄 Migración a Otros Módulos

Para agregar paginación a otros listados (difuntos, familias, etc.):

### 1. Importar tipos

```typescript
import { PaginationInfo, PaginationParams } from "@/types/pagination";
```

### 2. Actualizar interfaz de servicio

```typescript
interface MiResponse {
  data: MiItem[];
  pagination: PaginationInfo;
}
```

### 3. Agregar estado de paginación

```typescript
const [queryParams, setQueryParams] = useState<MiSearchParams>({
  page: 1,
  limit: 10,
  // otros filtros...
});
```

### 4. Usar componente

```typescript
<PaginationControls
  pagination={response.pagination}
  onPageChange={(page) => setQueryParams(prev => ({ ...prev, page }))}
  onItemsPerPageChange={(limit) => setQueryParams(prev => ({ ...prev, page: 1, limit }))}
/>
```

## 📚 Recursos Adicionales

- **Documentación shadcn/ui**: [Select](https://ui.shadcn.com/docs/components/select), [Button](https://ui.shadcn.com/docs/components/button)
- **React Query**: [Pagination Guide](https://tanstack.com/query/latest/docs/react/guides/paginated-queries)
- **Icons**: Lucide React (ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight)

## ⚠️ Consideraciones Importantes

1. **Page es 1-indexed**: La API usa `page=1` para primera página (no 0)
2. **Invalidación de caché**: Al cambiar límite, se resetea a página 1
3. **Debounce en filtros**: Los filtros tienen 500ms de delay antes de aplicar
4. **Compact mode**: Se activa automáticamente con `shouldUseMobileView` hook

---

**Autor**: Sistema MIA Development Team  
**Fecha**: 2025-10-05  
**Versión**: 1.0.0
