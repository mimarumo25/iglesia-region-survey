# 📊 Sistema de Paginación - Guía Rápida

## 🎯 Visión General

Sistema de paginación completo, modular y reutilizable implementado en el **Sistema MIA** para gestionar listados grandes con navegación eficiente.

## ✨ Características

- ✅ **Navegación completa**: Primera, anterior, siguiente, última página
- ✅ **Selector de límite**: 5, 10, 20, 50, 100 items por página
- ✅ **Información detallada**: Totales, rangos, página actual
- ✅ **Responsive**: Modo compacto automático en móviles
- ✅ **Estados UI**: Loading, deshabilitado en límites
- ✅ **TypeScript**: Completamente tipado
- ✅ **Reutilizable**: Un componente para todos los módulos

## 🚀 Uso Rápido

```typescript
import { PaginationControls } from "@/components/ui/PaginationControls";

// En tu componente
<PaginationControls
  pagination={data?.pagination}
  onPageChange={(page) => setPage(page)}
  onItemsPerPageChange={(limit) => setLimit(limit)}
  isLoading={isLoading}
/>
```

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── pagination.ts              # Tipos TypeScript
├── components/
│   └── ui/
│       └── PaginationControls.tsx # Componente principal
└── pages/
    └── Surveys.tsx                # Ejemplo de implementación

docs/
├── pagination-implementation.md   # Documentación completa
└── pagination-examples.md         # Ejemplos de código
```

## 🎨 Componentes Disponibles

### 1. PaginationControls (Completo)
Control completo con todas las funcionalidades.

```typescript
<PaginationControls
  pagination={paginationData}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
  isLoading={isLoading}
  options={{
    showPageInfo: true,
    showItemsPerPage: true,
    showTotalItems: true,
    compact: isMobile
  }}
/>
```

### 2. SimplePaginationControls
Solo navegación anterior/siguiente (sin selector de límite).

```typescript
<SimplePaginationControls
  pagination={paginationData}
  onPageChange={handlePageChange}
  isLoading={isLoading}
/>
```

## 📊 Formato de Datos (API)

```typescript
interface PaginationInfo {
  currentPage: number;     // Página actual (1-indexed)
  totalPages: number;      // Total de páginas
  totalItems: number;      // Total de registros
  itemsPerPage: number;    // Items por página
  hasNextPage: boolean;    // Tiene siguiente
  hasPrevPage: boolean;    // Tiene anterior
}

interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  pagination: PaginationInfo;
}
```

## 🔧 Implementación Paso a Paso

### 1. Agregar Estado de Paginación

```typescript
const [queryParams, setQueryParams] = useState({
  page: 1,
  limit: 10
});
```

### 2. Usar React Query

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['items', queryParams],
  queryFn: () => api.getItems(queryParams)
});
```

### 3. Crear Handlers

```typescript
const handlePageChange = (page: number) => {
  setQueryParams(prev => ({ ...prev, page }));
};

const handleItemsPerPageChange = (limit: number) => {
  setQueryParams(prev => ({ ...prev, page: 1, limit }));
};
```

### 4. Renderizar Componente

```typescript
{data?.pagination.totalPages > 1 && (
  <PaginationControls
    pagination={data.pagination}
    onPageChange={handlePageChange}
    onItemsPerPageChange={handleItemsPerPageChange}
    isLoading={isLoading}
  />
)}
```

## 💡 Mejores Prácticas

### ✅ DO (Hacer)

```typescript
// 1. Resetear a página 1 al cambiar filtros
setQueryParams(prev => ({ ...prev, search: value, page: 1 }))

// 2. Usar React Query para caché
const { data } = useQuery({
  queryKey: ['items', queryParams],
  queryFn: () => api.getItems(queryParams)
})

// 3. Renderizado condicional
{pagination.totalPages > 1 && <PaginationControls />}

// 4. Modo compacto en móviles
options={{ compact: isMobile }}
```

### ❌ DON'T (No hacer)

```typescript
// 1. No olvidar resetear página al filtrar
setQueryParams(prev => ({ ...prev, search: value })) // ❌

// 2. No manipular página manualmente sin actualizar query
setPage(2) // sin actualizar queryParams ❌

// 3. No mostrar paginación si hay 1 o 0 páginas
<PaginationControls /> // siempre visible ❌
```

## 🎯 Casos de Uso

### Con Filtros

```typescript
const handleFilterChange = (newFilter: any) => {
  setQueryParams(prev => ({
    ...prev,
    ...newFilter,
    page: 1 // Importante: resetear a página 1
  }));
};
```

### Con Búsqueda (Debounced)

```typescript
useEffect(() => {
  const timeout = setTimeout(() => {
    setQueryParams(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  }, 500);
  
  return () => clearTimeout(timeout);
}, [searchTerm]);
```

### Modo Responsive

```typescript
const isMobile = window.innerWidth < 768;

<PaginationControls
  {...props}
  options={{ compact: isMobile }}
/>
```

## 📱 Diseño Responsive

### Desktop (≥768px)
```
┌────────────────────────────────────────────────┐
│ Mostrando 1-10 de 156 registros               │
│                                                │
│  ⏮️ ◀️ Anterior | Página 1 de 16 | Siguiente ▶️ ⏭️│
│                                                │
│  Mostrar: [10 ▼] por página                   │
└────────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│ 1-10 de 156          │
│ ◀️ Pág 1/16  [10▼]  │
└──────────────────────┘
```

## 🧪 Testing

```bash
# 1. Navegación
- Clic en "Siguiente" → cambia a página 2
- Clic en "Anterior" → vuelve a página 1
- Clic en ⏭️ → va a última página
- Clic en ⏮️ → va a primera página

# 2. Límite
- Cambiar a 20 items → resetea a página 1
- Verificar actualización de totales

# 3. Estados
- Botón "Anterior" deshabilitado en página 1
- Botón "Siguiente" deshabilitado en última página
- Todos los controles deshabilitados durante loading

# 4. Responsive
- Reducir ventana → modo compacto se activa
- Ampliar ventana → modo completo se restaura
```

## 📚 Documentación Adicional

- **Documentación completa**: `docs/pagination-implementation.md`
- **Ejemplos de código**: `docs/pagination-examples.md`
- **Resumen de implementación**: `PAGINATION_IMPLEMENTATION_SUMMARY.md`

## 🎓 Recursos

- [React Query - Paginated Queries](https://tanstack.com/query/latest/docs/react/guides/paginated-queries)
- [shadcn/ui - Button](https://ui.shadcn.com/docs/components/button)
- [shadcn/ui - Select](https://ui.shadcn.com/docs/components/select)

## 🚀 Próximos Módulos

Lista de módulos pendientes para implementar paginación:

- [ ] Difuntos
- [ ] Familias Consolidadas
- [ ] Usuarios
- [ ] Configuraciones
- [ ] Reportes

---

**Versión**: 1.0.0  
**Autor**: Sistema MIA Development Team  
**Última actualización**: 2025-10-05
