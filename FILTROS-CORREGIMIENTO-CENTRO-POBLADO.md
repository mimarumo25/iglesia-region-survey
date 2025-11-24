# 📍 Filtros de Corregimiento y Centro Poblado - Reportes Familias y Salud

## 📋 Resumen de Cambios

Se agregaron los filtros de **Corregimiento** y **Centro Poblado** a los reportes de **Familias** y **Salud** en `Reports.tsx`, manteniendo la consistencia con el reporte de Difuntos.

---

## ✅ Cambios Implementados

### 1. **Interfaces TypeScript Actualizadas**

#### `FamiliasFilters` Interface
```typescript
interface FamiliasFilters {
  parroquia: string;
  municipio: string;
  corregimiento: string;      // ✅ NUEVO
  centro_poblado: string;      // ✅ NUEVO
  sector: string;
  vereda: string;
  limite: number;
  offset: number;
}
```

#### `SaludFiltersUI` Interface
```typescript
interface SaludFiltersUI {
  enfermedad: string;
  edad_min: string;
  edad_max: string;
  sexo: string;
  parroquia: string;
  municipio: string;
  corregimiento: string;       // ✅ NUEVO
  centro_poblado: string;       // ✅ NUEVO
  sector: string;
  limite: number;
  offset: number;
}
```

---

### 2. **Estado Inicial Actualizado**

#### Estado de Familias
```typescript
const [familiasFilters, setFamiliasFilters] = useState<FamiliasFilters>({
  parroquia: "",
  municipio: "",
  corregimiento: "",           // ✅ NUEVO
  centro_poblado: "",          // ✅ NUEVO
  sector: "",
  vereda: "",
  limite: 50,
  offset: 0,
});
```

#### Estado de Salud
```typescript
const [saludFilters, setSaludFilters] = useState<SaludFiltersUI>({
  enfermedad: "",
  edad_min: "",
  edad_max: "",
  sexo: "",
  parroquia: "",
  municipio: "",
  corregimiento: "",           // ✅ NUEVO
  centro_poblado: "",          // ✅ NUEVO
  sector: "",
  limite: 50,
  offset: 0
});
```

---

### 3. **Funciones de Limpieza Actualizadas**

#### `clearFamiliasFilters()`
```typescript
const clearFamiliasFilters = () => {
  setFamiliasFilters({
    parroquia: "",
    municipio: "",
    corregimiento: "",         // ✅ NUEVO
    centro_poblado: "",        // ✅ NUEVO
    sector: "",
    vereda: "",
    limite: 50,
    offset: 0,
  });
  setFamiliasConsolidado([]);
  setFamiliasQueried(false);
};
```

#### `clearSaludFilters()`
```typescript
const clearSaludFilters = () => {
  setSaludFilters({
    enfermedad: "",
    edad_min: "",
    edad_max: "",
    sexo: "",
    parroquia: "",
    municipio: "",
    corregimiento: "",         // ✅ NUEVO
    centro_poblado: "",        // ✅ NUEVO
    sector: "",
    limite: 50,
    offset: 0
  });
  
  setSaludPersonas([]);
  setSaludQueried(false);
  setSaludCurrentPage(1);
};
```

---

### 4. **Funciones de Query API Actualizadas**

#### `handleQueryFamilias()`
```typescript
const filtrosAPI = {
  id_parroquia: familiasFilters.parroquia ? Number(familiasFilters.parroquia) : undefined,
  id_municipio: familiasFilters.municipio ? Number(familiasFilters.municipio) : undefined,
  id_corregimiento: familiasFilters.corregimiento ? Number(familiasFilters.corregimiento) : undefined,     // ✅ NUEVO
  id_centro_poblado: familiasFilters.centro_poblado ? Number(familiasFilters.centro_poblado) : undefined, // ✅ NUEVO
  id_sector: familiasFilters.sector ? Number(familiasFilters.sector) : undefined,
  id_vereda: familiasFilters.vereda ? Number(familiasFilters.vereda) : undefined,
  limite: familiasFilters.limite,
  offset: familiasFilters.offset
};
```

#### `handleExportFamiliasToExcel()`
```typescript
const filtrosAPI = {
  id_parroquia: familiasFilters.parroquia ? Number(familiasFilters.parroquia) : undefined,
  id_municipio: familiasFilters.municipio ? Number(familiasFilters.municipio) : undefined,
  id_corregimiento: familiasFilters.corregimiento ? Number(familiasFilters.corregimiento) : undefined,     // ✅ NUEVO
  id_centro_poblado: familiasFilters.centro_poblado ? Number(familiasFilters.centro_poblado) : undefined, // ✅ NUEVO
  id_sector: familiasFilters.sector ? Number(familiasFilters.sector) : undefined,
  id_vereda: familiasFilters.vereda ? Number(familiasFilters.vereda) : undefined,
  limite: familiasFilters.limite,
  offset: familiasFilters.offset
};
```

#### `handleQuerySalud()`
```typescript
const filtrosAPI: SaludFiltros = {
  id_enfermedad: saludFilters.enfermedad ? Number(saludFilters.enfermedad) : undefined,
  edad_min: saludFilters.edad_min ? Number(saludFilters.edad_min) : undefined,
  edad_max: saludFilters.edad_max ? Number(saludFilters.edad_max) : undefined,
  id_sexo: saludFilters.sexo ? Number(saludFilters.sexo) : undefined,
  id_parroquia: saludFilters.parroquia ? Number(saludFilters.parroquia) : undefined,
  id_municipio: saludFilters.municipio ? Number(saludFilters.municipio) : undefined,
  id_corregimiento: saludFilters.corregimiento ? Number(saludFilters.corregimiento) : undefined,           // ✅ NUEVO
  id_centro_poblado: saludFilters.centro_poblado ? Number(saludFilters.centro_poblado) : undefined,       // ✅ NUEVO
  id_sector: saludFilters.sector ? Number(saludFilters.sector) : undefined,
  limite: saludFilters.limite,
  offset: saludFilters.offset
};
```

#### `handleExportSaludToExcel()`
```typescript
const filtrosAPI: SaludFiltros = {
  id_enfermedad: saludFilters.enfermedad ? Number(saludFilters.enfermedad) : undefined,
  enfermedad: enfermedadNombre,
  edad_min: saludFilters.edad_min ? Number(saludFilters.edad_min) : undefined,
  edad_max: saludFilters.edad_max ? Number(saludFilters.edad_max) : undefined,
  id_sexo: saludFilters.sexo ? Number(saludFilters.sexo) : undefined,
  id_parroquia: saludFilters.parroquia ? Number(saludFilters.parroquia) : undefined,
  id_municipio: saludFilters.municipio ? Number(saludFilters.municipio) : undefined,
  id_corregimiento: saludFilters.corregimiento ? Number(saludFilters.corregimiento) : undefined,           // ✅ NUEVO
  id_centro_poblado: saludFilters.centro_poblado ? Number(saludFilters.centro_poblado) : undefined,       // ✅ NUEVO
  id_sector: saludFilters.sector ? Number(saludFilters.sector) : undefined,
  limite: 5000
};
```

---

### 5. **Componentes UI Agregados**

#### Tab de Familias

```tsx
{/* Corregimiento */}
<div className="space-y-2">
  <Label htmlFor="familia_corregimiento" className="text-sm font-medium">Corregimiento</Label>
  <Autocomplete
    options={configData.corregimientoOptions}
    value={familiasFilters.corregimiento}
    onValueChange={(value) => handleFamiliasFilterChange('corregimiento', value)}
    placeholder="Seleccionar corregimiento..."
    loading={configData.corregimientosLoading}
    emptyText="No se encontraron corregimientos"
  />
</div>

{/* Centro Poblado */}
<div className="space-y-2">
  <Label htmlFor="familia_centro_poblado" className="text-sm font-medium">Centro Poblado</Label>
  <Autocomplete
    options={configData.centroPobladoOptions}
    value={familiasFilters.centro_poblado}
    onValueChange={(value) => handleFamiliasFilterChange('centro_poblado', value)}
    placeholder="Seleccionar centro poblado..."
    loading={configData.centrosPobladosLoading}
    emptyText="No se encontraron centros poblados"
  />
</div>
```

#### Tab de Salud

```tsx
{/* Corregimiento */}
<div className="space-y-2">
  <Label htmlFor="salud_corregimiento" className="text-sm font-medium">Corregimiento</Label>
  <Autocomplete
    options={configData.corregimientoOptions}
    value={saludFilters.corregimiento}
    onValueChange={(value) => handleSaludFilterChange('corregimiento', value)}
    placeholder="Seleccionar corregimiento..."
    loading={configData.corregimientosLoading}
    emptyText="No se encontraron corregimientos"
  />
</div>

{/* Centro Poblado */}
<div className="space-y-2">
  <Label htmlFor="salud_centro_poblado" className="text-sm font-medium">Centro Poblado</Label>
  <Autocomplete
    options={configData.centroPobladoOptions}
    value={saludFilters.centro_poblado}
    onValueChange={(value) => handleSaludFilterChange('centro_poblado', value)}
    placeholder="Seleccionar centro poblado..."
    loading={configData.centrosPobladosLoading}
    emptyText="No se encontraron centros poblados"
  />
</div>
```

---

## 🔧 Dependencias Existentes Validadas

### Hook `useConfigurationData`
✅ Ya proporciona las siguientes opciones y estados:
- `corregimientoOptions: AutocompleteOption[]`
- `corregimientosLoading: boolean`
- `centroPobladoOptions: AutocompleteOption[]`
- `centrosPobladosLoading: boolean`

### Hooks de Servicios
✅ Importados y funcionando:
- `useCorregimientos()` - Hook para cargar corregimientos desde API
- `useCentrosPoblados()` - Hook para cargar centros poblados desde API

---

## 📊 Flujo de Datos

### Familias
```
Usuario selecciona filtros
    ↓
handleFamiliasFilterChange() actualiza estado local
    ↓
handleQueryFamilias() convierte strings → números
    ↓
getFamiliasConsolidado(filtrosAPI) envía parámetros a API
    ↓
Resultados se muestran en tabla
```

### Salud
```
Usuario selecciona filtros
    ↓
handleSaludFilterChange() actualiza estado local
    ↓
handleQuerySalud() convierte strings → números
    ↓
fetchSaludPersonas(filtrosAPI) envía parámetros a API
    ↓
Resultados se muestran en tabla paginada
```

---

## 🎯 Grid Responsive Aplicado

Todos los filtros utilizan el estándar responsive:
```tsx
className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
```

**Breakpoints:**
- **< 640px** (mobile): 1 columna
- **640px - 1280px** (tablets, laptops pequeños): 2 columnas
- **1280px - 1536px** (laptops grandes): 3 columnas
- **≥ 1536px** (monitores grandes): 4 columnas

---

## ✅ Verificación de Funcionalidad

### Checklist de Validación
- [x] Interfaces TypeScript actualizadas
- [x] Estado inicial incluye nuevos campos
- [x] Funciones de limpieza resetean nuevos filtros
- [x] Query functions envían parámetros a API
- [x] Export functions incluyen nuevos filtros
- [x] UI components configurados correctamente
- [x] Opciones y loading states disponibles en `useConfigurationData`
- [x] Grid responsive aplicado consistentemente
- [x] No hay errores de TypeScript

### Parámetros API Enviados

**Familias:**
- `id_parroquia` (number | undefined)
- `id_municipio` (number | undefined)
- `id_corregimiento` ✅ NUEVO (number | undefined)
- `id_centro_poblado` ✅ NUEVO (number | undefined)
- `id_sector` (number | undefined)
- `id_vereda` (number | undefined)
- `limite` (number)
- `offset` (number)

**Salud:**
- `id_enfermedad` (number | undefined)
- `edad_min` (number | undefined)
- `edad_max` (number | undefined)
- `id_sexo` (number | undefined)
- `id_parroquia` (number | undefined)
- `id_municipio` (number | undefined)
- `id_corregimiento` ✅ NUEVO (number | undefined)
- `id_centro_poblado` ✅ NUEVO (number | undefined)
- `id_sector` (number | undefined)
- `limite` (number)
- `offset` (number)

---

## 🧪 Pruebas Sugeridas

### Prueba 1: Filtrado por Corregimiento
1. Ir a tab "Familias" o "Salud"
2. Seleccionar un Corregimiento del dropdown
3. Hacer clic en "Consultar"
4. ✅ Verificar que la API recibe `id_corregimiento` con el ID numérico

### Prueba 2: Filtrado por Centro Poblado
1. Ir a tab "Familias" o "Salud"
2. Seleccionar un Centro Poblado del dropdown
3. Hacer clic en "Consultar"
4. ✅ Verificar que la API recibe `id_centro_poblado` con el ID numérico

### Prueba 3: Filtrado Combinado
1. Seleccionar Municipio + Corregimiento + Centro Poblado
2. Hacer clic en "Consultar"
3. ✅ Verificar que los 3 parámetros se envían correctamente

### Prueba 4: Limpiar Filtros
1. Seleccionar varios filtros incluyendo Corregimiento y Centro Poblado
2. Hacer clic en "Limpiar"
3. ✅ Verificar que todos los campos se resetean a ""

### Prueba 5: Exportar Excel
1. Aplicar filtros incluyendo Corregimiento/Centro Poblado
2. Hacer clic en "Descargar Excel"
3. ✅ Verificar que el Excel contiene datos filtrados correctamente

---

## 🎨 Estándares de Código Seguidos

✅ **TypeScript Strict**: Todas las props y estados tipados  
✅ **Naming Convention**: camelCase para variables, PascalCase para componentes  
✅ **Componentes shadcn/ui**: Uso de `<Autocomplete>` base  
✅ **Responsive Design**: Grid system con Tailwind breakpoints  
✅ **Consistencia**: Patrón idéntico a filtros existentes  
✅ **Accesibilidad**: Labels asociados con `htmlFor`  
✅ **Loading States**: Spinners mientras cargan opciones  
✅ **Empty States**: Mensajes cuando no hay datos  

---

## 📝 Notas Técnicas

### Conversión de Tipos
Los filtros en UI son **strings** pero la API espera **números**:
```typescript
id_corregimiento: familiasFilters.corregimiento ? Number(familiasFilters.corregimiento) : undefined
```

Si el string está vacío (`""`), se envía `undefined` a la API (no se aplica filtro).

### Opciones de Autocomplete
Las opciones provienen de `useConfigurationData` que carga datos desde:
```typescript
useCorregimientos()      // Hook que llama a la API de corregimientos
useCentrosPoblados()     // Hook que llama a la API de centros poblados
```

### Orden de Campos UI
Los nuevos campos se posicionaron **después de Municipio y antes de Sector** para seguir jerarquía geográfica:
```
Parroquia → Municipio → Corregimiento → Centro Poblado → Sector → Vereda
```

---

## 🚀 Próximos Pasos (Backend)

⚠️ **Importante**: El backend debe estar preparado para recibir estos nuevos parámetros:

### Endpoints a Verificar
- `GET /api/familias/consolidado` debe aceptar `id_corregimiento` y `id_centro_poblado`
- `GET /api/familias/excel` debe aceptar `id_corregimiento` y `id_centro_poblado`
- `GET /api/reportes/salud/personas` debe aceptar `id_corregimiento` y `id_centro_poblado`
- `GET /api/reportes/salud/excel` debe aceptar `id_corregimiento` y `id_centro_poblado`

### SQL Queries Backend
El backend debe incluir JOINs con las tablas:
- `cat_corregimientos`
- `cat_centros_poblados`

Y aplicar WHERE clauses cuando estos parámetros estén presentes.

---

## 📄 Archivo Modificado

**Archivo**: `src/pages/Reports.tsx`  
**Líneas modificadas**:
- Interfaces: ~líneas 70-95
- Estado inicial: ~líneas 120-140
- Clear functions: ~líneas 200-240
- Query functions: ~líneas 267-410
- UI components: ~líneas 540-650 (Familias), ~líneas 680-790 (Salud)

**Total de cambios**: ~8 secciones modificadas  
**Líneas agregadas**: ~100 líneas  
**TypeScript errors**: 0 ✅

---

## ✅ Conclusión

Los filtros de **Corregimiento** y **Centro Poblado** han sido implementados exitosamente en los reportes de **Familias** y **Salud**, manteniendo:

- ✅ Consistencia con el reporte de Difuntos
- ✅ Estándares de código del proyecto
- ✅ Grid responsive uniformado
- ✅ Integración completa con `useConfigurationData`
- ✅ Validación TypeScript sin errores
- ✅ Patrón de flujo de datos robusto

La funcionalidad está lista para ser probada una vez que el backend soporte los nuevos parámetros `id_corregimiento` e `id_centro_poblado` en sus endpoints.
