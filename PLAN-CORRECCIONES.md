# 🔧 Plan de Correcciones Prioritarias - Sistema MIA

## 📋 Resumen de Problemas Identificados

**Total de issues de ESLint:** 647 (601 errores, 46 warnings)

### Clasificación por Prioridad

| Prioridad | Cantidad | Tipo | Impacto |
|-----------|----------|------|---------|
| 🔴 Alta | 2 | Hooks Condicionales | Puede causar crashes |
| 🟡 Media | 65 | Violaciones React Hooks | Comportamiento impredecible |
| 🟢 Baja | 580 | TypeScript `any` + Otros | Calidad de código |

---

## 🔴 PRIORIDAD ALTA - Correcciones Inmediatas

### 1. Hooks Condicionales (CRÍTICO)

**Archivo:** `src/components/ui/config-pagination.tsx`  
**Líneas:** 195, 200  
**Problema:** React Hooks llamados dentro de condicionales

#### Código Actual (INCORRECTO):
```typescript
// src/components/ui/config-pagination.tsx:195
if (totalItems > 0) {
  const sortedData = useMemo(() => {
    // lógica de sorting
  }, [data, sortKey]);
  
  const paginatedData = useMemo(() => {
    // lógica de paginación
  }, [sortedData, currentPage]);
}
```

#### Código Corregido:
```typescript
// Mover hooks FUERA del condicional
const sortedData = useMemo(() => {
  if (totalItems === 0) return [];
  
  // lógica de sorting solo si hay items
  return [...data].sort((a, b) => {
    // implementación
  });
}, [data, sortKey, totalItems]);

const paginatedData = useMemo(() => {
  if (totalItems === 0) return [];
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  return sortedData.slice(startIndex, startIndex + itemsPerPage);
}, [sortedData, currentPage, itemsPerPage, totalItems]);
```

**Acción:** ✅ **APLICAR INMEDIATAMENTE**

---

### 2. Hooks en Funciones No-React

**Archivo:** `src/hooks/useEncuestas.ts`  
**Líneas:** 44, 56, 68  
**Problema:** `useQuery` llamado en funciones regulares

#### Código Actual (INCORRECTO):
```typescript
// src/hooks/useEncuestas.ts
export const getEncuestas = (filters: EncuestaFilters) => {
  return useQuery({
    queryKey: ['encuestas', filters],
    queryFn: () => encuestasService.getEncuestas(filters),
  });
};

export const getEncuestaById = (id: string) => {
  return useQuery({
    queryKey: ['encuesta', id],
    queryFn: () => encuestasService.getEncuestaById(id),
  });
};
```

#### Solución 1: Convertir en Custom Hooks
```typescript
// Renombrar con prefijo 'use'
export const useEncuestas = (filters: EncuestaFilters) => {
  return useQuery({
    queryKey: ['encuestas', filters],
    queryFn: () => encuestasService.getEncuestas(filters),
  });
};

export const useEncuestaById = (id: string) => {
  return useQuery({
    queryKey: ['encuesta', id],
    queryFn: () => encuestasService.getEncuestaById(id),
  });
};
```

#### Solución 2: Eliminar useQuery (si no se usan como hooks)
```typescript
// Si realmente son funciones de servicio, eliminar useQuery
export const getEncuestas = async (filters: EncuestaFilters) => {
  return await encuestasService.getEncuestas(filters);
};

export const getEncuestaById = async (id: string) => {
  return await encuestasService.getEncuestaById(id);
};
```

**Acción:** ✅ **APLICAR ESTA SEMANA**

---

## 🟡 PRIORIDAD MEDIA - Correcciones Importantes

### 3. Dependencias Faltantes en useEffect

**Cantidad de warnings:** 20  
**Impacto:** Stale closures, comportamiento inesperado

#### Ejemplo 1: AuthContext
**Archivo:** `src/context/AuthContext.tsx:84`

```typescript
// ❌ ACTUAL
useEffect(() => {
  initializeAuth();
}, []); // Falta 'initializeAuth'

// ✅ CORRECCIÓN
const initializeAuth = useCallback(() => {
  // lógica de inicialización
}, []); // Define dependencias estables

useEffect(() => {
  initializeAuth();
}, [initializeAuth]); // Ahora incluye dependencia
```

#### Ejemplo 2: ThemeContext
**Archivo:** `src/context/ThemeContext.tsx:371`

```typescript
// ❌ ACTUAL
useEffect(() => {
  applyThemeColors();
}, [theme]); // Falta 'applyThemeColors'

// ✅ CORRECCIÓN
const applyThemeColors = useCallback(() => {
  // lógica de aplicación de colores
}, [theme]); // Depende de theme

useEffect(() => {
  applyThemeColors();
}, [applyThemeColors]); // Incluye función memoizada
```

#### Ejemplo 3: Login
**Archivo:** `src/pages/Login.tsx:50`

```typescript
// ❌ ACTUAL
useEffect(() => {
  if (error) {
    toast({
      title: "Error de autenticación",
      description: error,
      variant: "destructive"
    });
  }
}, [error]); // Falta 'toast'

// ✅ CORRECCIÓN
useEffect(() => {
  if (error) {
    toast({
      title: "Error de autenticación",
      description: error,
      variant: "destructive"
    });
  }
}, [error, toast]); // Incluye toast
```

**Acción:** ✅ **Corregir progresivamente**

---

### 4. Expresiones Complejas en Arrays de Dependencias

**Archivo:** `src/hooks/useDifuntosConsulta.ts`

```typescript
// ❌ ACTUAL
useCallback(() => {
  // lógica
}, [difuntos.length]); // Expresión compleja

// ✅ CORRECCIÓN
const difuntosCount = difuntos.length; // Extraer a variable

useCallback(() => {
  // lógica
}, [difuntosCount]); // Usar variable simple
```

---

### 5. Fast Refresh Warnings (26 warnings)

**Problema:** Exportar constantes junto con componentes

#### Ejemplo:
**Archivo:** `src/components/ui/badge.tsx`

```typescript
// ❌ ACTUAL - Todo en un archivo
export const badgeVariants = cva("...");

const Badge = ({ className, variant }) => {
  return <div className={cn(badgeVariants({ variant }), className)} />;
};

export { Badge, badgeVariants };

// ✅ CORRECCIÓN - Separar en archivos
// badge-variants.ts
export const badgeVariants = cva("...");

// badge.tsx
import { badgeVariants } from "./badge-variants";

const Badge = ({ className, variant }) => {
  return <div className={cn(badgeVariants({ variant }), className)} />;
};

export { Badge };
```

**Acción:** 🟢 **Opcional** (solo afecta desarrollo)

---

## 🟢 PRIORIDAD BAJA - Mejoras de Calidad

### 6. Reducir Uso de `any` (450+ instancias)

**Estrategia Gradual:**

#### Fase 1: Errores de Axios (100+ instancias)
```typescript
// ❌ ANTES
import { toast } from "sonner";

const handleError = (error: any) => {
  console.error(error);
  toast.error(error.message);
};

// ✅ DESPUÉS
import { AxiosError } from 'axios';
import { toast } from "sonner";

const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.error(error.response?.data);
    toast.error(error.response?.data?.message || error.message);
  } else if (error instanceof Error) {
    console.error(error.message);
    toast.error(error.message);
  } else {
    console.error('Error desconocido', error);
    toast.error('Error desconocido');
  }
};
```

#### Fase 2: Datos Dinámicos (200+ instancias)
```typescript
// ❌ ANTES
const transformData = (data: any) => {
  return {
    id: data.id,
    nombre: data.nombre
  };
};

// ✅ DESPUÉS
interface APIResponse {
  id: number;
  nombre: string;
}

const transformData = (data: APIResponse) => {
  return {
    id: data.id,
    nombre: data.nombre
  };
};

// O usar unknown para datos no confiables
const transformData = (data: unknown): TransformedData => {
  // Validar tipo antes de usar
  if (typeof data === 'object' && data !== null && 'id' in data) {
    return {
      id: (data as APIResponse).id,
      nombre: (data as APIResponse).nombre
    };
  }
  throw new Error('Invalid data format');
};
```

#### Fase 3: Callbacks de React Query (150+ instancias)
```typescript
// ❌ ANTES
const mutation = useMutation({
  mutationFn: createUser,
  onError: (error: any) => {
    toast.error(error.message);
  }
});

// ✅ DESPUÉS
const mutation = useMutation({
  mutationFn: createUser,
  onError: (error: AxiosError<APIError>) => {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
  }
});
```

**Acción:** 📅 **Plan a largo plazo** (1-2 meses)

---

### 7. Interfaces Vacías (20 instancias)

```typescript
// ❌ ANTES
export interface ProfesionesCreateData extends BaseProfesion {}

// ✅ DESPUÉS - Opción 1: Type alias
export type ProfesionesCreateData = BaseProfesion;

// ✅ DESPUÉS - Opción 2: Agregar propiedades si se necesitan
export interface ProfesionesCreateData extends BaseProfesion {
  // Propiedades adicionales específicas de creación
}
```

---

### 8. Caracteres de Escape Innecesarios (15 instancias)

**Archivos afectados:**
- `src/schemas/parroquias.ts`
- `src/schemas/corregimientos.ts`
- `src/pages/Users.tsx`

```typescript
// ❌ ANTES
const telefonoRegex = /^[\(\)\+\d\s\-]+$/;
const emailRegex = /^[\w\.\-]+@[\w\-]+\.[\w\-]+$/;

// ✅ DESPUÉS
const telefonoRegex = /^[()+ \d\s-]+$/;
const emailRegex = /^[\w.-]+@[\w-]+\.[\w-]+$/;
```

---

### 9. Caracteres Unicode Mal Manejados

**Archivo:** `src/hooks/useConfigurationData.ts:471`

```typescript
// ❌ PROBLEMA: Caracteres combinados (á, é, í, etc.)
const regex = /^[a-záéíóúñ\s]+$/i;

// ✅ SOLUCIÓN: Usar Unicode escapes o clase \p{L}
const regex = /^[\p{L}\s]+$/iu; // Acepta cualquier letra Unicode

// O específicamente español
const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
```

---

## 📅 Plan de Implementación

### Semana 1: Correcciones Críticas (🔴 Alta)
- [ ] **Día 1:** Corregir hooks condicionales en `config-pagination.tsx`
- [ ] **Día 2:** Refactorizar `useEncuestas.ts` (decidir estrategia)
- [ ] **Día 3:** Testing de cambios críticos
- [ ] **Día 4:** PR y merge de cambios críticos

### Semana 2: Correcciones Importantes (🟡 Media)
- [ ] **Días 1-2:** Corregir dependencias en `useEffect` (10 archivos)
- [ ] **Día 3:** Corregir expresiones complejas en arrays de dependencias
- [ ] **Día 4:** Testing y validación
- [ ] **Día 5:** PR y merge

### Semanas 3-4: Mejoras de Calidad (🟢 Baja)
- [ ] **Semana 3:** Reducir `any` en manejo de errores (50 instancias)
- [ ] **Semana 4:** Reducir `any` en servicios API (50 instancias)

### Mes 2: Mejoras Continuas
- [ ] Continuar reduciendo `any` gradualmente
- [ ] Implementar interfaces vacías
- [ ] Limpiar escapes innecesarios
- [ ] Optimizar Fast Refresh exports

---

## 🧪 Testing de Correcciones

### Checklist de Validación

Para cada corrección aplicada:

1. **Compilación**
   ```bash
   npm run build
   ```
   ✅ Sin errores de TypeScript

2. **Linting**
   ```bash
   npm run lint
   ```
   ✅ Errores reducidos

3. **Desarrollo**
   ```bash
   npm run dev
   ```
   ✅ Sin warnings en consola

4. **Funcionalidad**
   - [ ] Login funciona
   - [ ] Crear encuesta funciona
   - [ ] Dashboard carga correctamente

---

## 📊 Métricas de Progreso

### Estado Inicial
- Total Errores: 601
- Total Warnings: 46
- TypeScript `any`: ~450

### Objetivo Intermedio (Fin Semana 2)
- Total Errores: < 550 ✅ (-51 errores)
- Total Warnings: < 30 ✅ (-16 warnings)
- TypeScript `any`: ~450 (sin cambios aún)

### Objetivo Final (Fin Mes 2)
- Total Errores: < 300 ✅ (-301 errores)
- Total Warnings: < 20 ✅ (-26 warnings)
- TypeScript `any`: < 250 ✅ (-200 instancias)

---

## 🔄 Proceso de Aplicación

### Para Correcciones Críticas (🔴)

1. **Crear branch**
   ```bash
   git checkout -b fix/critical-hooks-violations
   ```

2. **Aplicar corrección**
   - Editar archivo
   - Verificar con linter
   - Probar funcionalidad

3. **Commit con mensaje descriptivo**
   ```bash
   git commit -m "fix: corregir hooks condicionales en config-pagination

   - Mover useMemo fuera de condicionales
   - Agregar validación interna en callbacks
   - Prevenir violación de reglas de hooks

   Resolves #<issue-number>"
   ```

4. **Testing local completo**
   ```bash
   npm run lint
   npm run build
   npm run dev
   # Probar manualmente funcionalidades afectadas
   ```

5. **Push y PR**
   ```bash
   git push origin fix/critical-hooks-violations
   # Crear PR en GitHub con descripción detallada
   ```

### Para Correcciones por Lotes (🟡🟢)

1. **Agrupar por tipo**
   - Branch por categoría (ej: `fix/useeffect-dependencies`)

2. **Aplicar correcciones similares juntas**
   - Usar scripts si es posible

3. **Testing por grupo**
   - Validar que el lote completo funciona

4. **PR con lista de cambios**
   ```markdown
   ## Correcciones de Dependencias useEffect
   
   - [x] AuthContext.tsx
   - [x] ThemeContext.tsx
   - [x] Login.tsx
   - [x] ...
   
   Total: 10 archivos corregidos
   ```

---

## 📝 Templates de PR

### Para Correcciones Críticas

```markdown
## 🔴 [CRÍTICO] Corregir hooks condicionales

### Problema
React Hooks siendo llamados dentro de condicionales, violando reglas de hooks y causando potenciales crashes.

### Archivos afectados
- `src/components/ui/config-pagination.tsx` (líneas 195, 200)

### Solución implementada
- Mover `useMemo` fuera de condicionales
- Implementar validaciones dentro de los callbacks
- Mantener la misma lógica funcional

### Testing
- [x] Compilación sin errores
- [x] Linting pasa
- [x] Funcionalidad preservada
- [x] Sin warnings en consola

### Impacto
- **Estabilidad:** ⬆️ Mejora significativa
- **Funcionalidad:** ➡️ Sin cambios
- **Performance:** ➡️ Sin cambios

### Checklist
- [x] Código revisado
- [x] Tests manuales realizados
- [x] Documentación actualizada si aplica
```

---

## 🚨 Riesgos y Mitigación

### Riesgo 1: Romper funcionalidad existente
**Mitigación:** Testing exhaustivo antes de merge

### Riesgo 2: Introducir nuevos bugs
**Mitigación:** Revisión de código y testing manual

### Riesgo 3: Conflictos en merge
**Mitigación:** Branches pequeños y frecuentes

---

*Documento de trabajo para implementación progresiva de correcciones*
