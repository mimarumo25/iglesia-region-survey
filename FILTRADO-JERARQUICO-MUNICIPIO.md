# 🏘️ Filtrado Jerárquico por Municipio - Reportes Familias y Salud

## 📋 Resumen de Implementación

Se implementó un **sistema de filtrado jerárquico** donde el **Municipio** es el filtro principal y todos los demás filtros geográficos (Parroquia, Sector, Vereda, Corregimiento y Centro Poblado) se filtran automáticamente según el municipio seleccionado.

---

## ✅ Cambios Implementados

### 1. **Interfaz ConfigurationItem Actualizada**

**Archivo**: `src/types/survey.ts`

Se agregó el campo opcional `id_municipio` para soportar filtrado jerárquico:

```typescript
export interface ConfigurationItem {
  id: string | number;
  nombre: string;
  id_municipio?: string | number | null; // ✅ NUEVO - Para filtrado jerárquico
}
```

---

### 2. **Hook useConfigurationData Actualizado**

**Archivo**: `src/hooks/useConfigurationData.ts`

#### Cambios realizados:

##### A) **Sectores - Items con id_municipio**
```typescript
const sectorItems = useMemo((): ConfigurationItem[] => {
  if (!sectoresData?.data) {
    return [];
  }
  
  let sectores: any[] = [];
  
  // Extraer sectores desde la estructura de datos
  if (typeof sectoresData.data === 'object' && 'data' in sectoresData.data && Array.isArray(sectoresData.data.data)) {
    sectores = sectoresData.data.data;
  } else if (typeof sectoresData.data === 'object' && 'sectors' in sectoresData.data && Array.isArray(sectoresData.data.sectors)) {
    sectores = sectoresData.data.sectors;
  } else if (Array.isArray(sectoresData.data)) {
    sectores = sectoresData.data;
  }
  
  // Mapear sectores incluyendo id_municipio ✅
  return sectores.map(sector => ({
    id: sector.id_sector,
    nombre: sector.nombre,
    id_municipio: sector.id_municipio || sector.municipio_id || null
  }));
}, [sectoresData]);
```

##### B) **Parroquias - Items con id_municipio**
```typescript
const parroquiaItems = useMemo((): ConfigurationItem[] => {
  if (!parroquiasData?.data || !Array.isArray(parroquiasData.data)) {
    return [];
  }
  return parroquiasData.data.map(parroquia => ({
    id: parroquia.id_parroquia?.toString() || '',
    nombre: parroquia.nombre || 'Sin nombre',
    id_municipio: parroquia.id_municipio || parroquia.municipio?.id_municipio || null // ✅
  }));
}, [parroquiasData]);
```

##### C) **Veredas - Items con id_municipio**
```typescript
const veredaItems = useMemo((): ConfigurationItem[] => {
  if (!veredasData?.data || !Array.isArray(veredasData.data)) {
    return [];
  }
  return veredasData.data.map(vereda => ({
    id: vereda.id_vereda?.toString() || '',
    nombre: vereda.nombre || 'Sin nombre',
    id_municipio: vereda.id_municipio || vereda.municipio_id || null // ✅
  }));
}, [veredasData]);
```

##### D) **Corregimientos - Items con id_municipio**
```typescript
const corregimientoItems = useMemo((): ConfigurationItem[] => {
  let corregimientosArray: any[] = [];
  
  if (corregimientosData) {
    if (Array.isArray(corregimientosData)) {
      corregimientosArray = corregimientosData;
    } else if (corregimientosData.data && Array.isArray(corregimientosData.data)) {
      corregimientosArray = corregimientosData.data;
    }
  }
  
  if (!corregimientosArray || corregimientosArray.length === 0) {
    return [];
  }
  
  return corregimientosArray.map((corregimiento: any) => ({
    id: corregimiento.id_corregimiento?.toString() || '',
    nombre: corregimiento.nombre || 'Sin nombre',
    id_municipio: corregimiento.id_municipio || corregimiento.municipio_id || null // ✅
  }));
}, [corregimientosData]);
```

##### E) **Centros Poblados - Items con id_municipio**
```typescript
const centroPobladoItems = useMemo((): ConfigurationItem[] => {
  let centrosPobladosArray: any[] = [];
  
  if (centrosPobladosData) {
    if (Array.isArray(centrosPobladosData)) {
      centrosPobladosArray = centrosPobladosData;
    } else if (centrosPobladosData.data && Array.isArray(centrosPobladosData.data)) {
      centrosPobladosArray = centrosPobladosData.data;
    }
  }
  
  if (!centrosPobladosArray || centrosPobladosArray.length === 0) {
    return [];
  }
  
  return centrosPobladosArray.map((centroPoblado: any) => ({
    id: centroPoblado.id_centro_poblado?.toString() || '',
    nombre: centroPoblado.nombre || 'Sin nombre',
    id_municipio: centroPoblado.id_municipio || centroPoblado.municipio_id || null // ✅
  }));
}, [centrosPobladosData]);
```

##### F) **Return Statement Actualizado**
```typescript
return {
  // ... otros campos ...
  
  parroquiaItems: parroquiaItems || [], // ✅ Usando items con id_municipio
  veredaItems: veredaItems || [],       // ✅ Usando items con id_municipio
  corregimientoItems: corregimientoItems || [], // ✅ Usando items con id_municipio
  centroPobladoItems: centroPobladoItems || [], // ✅ Usando items con id_municipio
  
  // ... otros campos ...
};
```

---

### 3. **Componente Reports.tsx Actualizado**

**Archivo**: `src/pages/Reports.tsx`

#### A) **Import de useMemo**
```typescript
import { useState, useEffect, useMemo } from "react"; // ✅ Agregado useMemo
```

#### B) **Handlers de Filtros Actualizados**

##### Handler de Familias con Reset Automático
```typescript
const handleFamiliasFilterChange = (key: keyof FamiliasFilters, value: any) => {
  setFamiliasFilters(prev => {
    // Si cambió el municipio, resetear todos los filtros dependientes ✅
    if (key === 'municipio') {
      return {
        ...prev,
        municipio: value,
        parroquia: "",
        sector: "",
        vereda: "",
        corregimiento: "",
        centro_poblado: ""
      };
    }
    
    return { ...prev, [key]: value };
  });
};
```

##### Handler de Salud con Reset Automático
```typescript
const handleSaludFilterChange = (key: keyof SaludFiltersUI, value: any) => {
  setSaludFilters(prev => {
    // Si cambió el municipio, resetear todos los filtros dependientes ✅
    if (key === 'municipio') {
      return {
        ...prev,
        municipio: value,
        parroquia: "",
        sector: "",
        corregimiento: "",
        centro_poblado: ""
      };
    }
    
    return { ...prev, [key]: value };
  });
};
```

#### C) **useMemo para Filtrado Jerárquico - FAMILIAS**

```typescript
// ============================================================
// 🔍 FILTRADO JERÁRQUICO POR MUNICIPIO - FAMILIAS
// ============================================================

/**
 * Filtrar opciones de Parroquia basadas en el municipio seleccionado
 */
const filteredFamiliasParroquiaOptions = useMemo(() => {
  if (!familiasFilters.municipio) return configData.parroquiaOptions;
  
  return configData.parroquiaOptions.filter(option => {
    const parroquia = configData.parroquiaItems?.find(p => p.id === option.value);
    return parroquia?.id_municipio?.toString() === familiasFilters.municipio;
  });
}, [familiasFilters.municipio, configData.parroquiaOptions, configData.parroquiaItems]);

/**
 * Filtrar opciones de Sector basadas en el municipio seleccionado
 */
const filteredFamiliasSectorOptions = useMemo(() => {
  if (!familiasFilters.municipio) return configData.sectorOptions;
  
  return configData.sectorOptions.filter(option => {
    const sector = configData.sectorItems?.find(s => s.id === option.value);
    return sector?.id_municipio?.toString() === familiasFilters.municipio;
  });
}, [familiasFilters.municipio, configData.sectorOptions, configData.sectorItems]);

/**
 * Filtrar opciones de Vereda basadas en el municipio seleccionado
 */
const filteredFamiliasVeredaOptions = useMemo(() => {
  if (!familiasFilters.municipio) return configData.veredaOptions;
  
  return configData.veredaOptions.filter(option => {
    const vereda = configData.veredaItems?.find(v => v.id === option.value);
    return vereda?.id_municipio?.toString() === familiasFilters.municipio;
  });
}, [familiasFilters.municipio, configData.veredaOptions, configData.veredaItems]);

/**
 * Filtrar opciones de Corregimiento basadas en el municipio seleccionado
 */
const filteredFamiliasCorregimientoOptions = useMemo(() => {
  if (!familiasFilters.municipio) return configData.corregimientoOptions;
  
  return configData.corregimientoOptions.filter(option => {
    const corregimiento = configData.corregimientoItems?.find(c => c.id === option.value);
    return corregimiento?.id_municipio?.toString() === familiasFilters.municipio;
  });
}, [familiasFilters.municipio, configData.corregimientoOptions, configData.corregimientoItems]);

/**
 * Filtrar opciones de Centro Poblado basadas en el municipio seleccionado
 */
const filteredFamiliasCentroPobladoOptions = useMemo(() => {
  if (!familiasFilters.municipio) return configData.centroPobladoOptions;
  
  return configData.centroPobladoOptions.filter(option => {
    const centroPoblado = configData.centroPobladoItems?.find(cp => cp.id === option.value);
    return centroPoblado?.id_municipio?.toString() === familiasFilters.municipio;
  });
}, [familiasFilters.municipio, configData.centroPobladoOptions, configData.centroPobladoItems]);
```

#### D) **useMemo para Filtrado Jerárquico - SALUD**

```typescript
// ============================================================
// 🔍 FILTRADO JERÁRQUICO POR MUNICIPIO - SALUD
// ============================================================

/**
 * Filtrar opciones de Parroquia basadas en el municipio seleccionado (Salud)
 */
const filteredSaludParroquiaOptions = useMemo(() => {
  if (!saludFilters.municipio) return configData.parroquiaOptions;
  
  return configData.parroquiaOptions.filter(option => {
    const parroquia = configData.parroquiaItems?.find(p => p.id === option.value);
    return parroquia?.id_municipio?.toString() === saludFilters.municipio;
  });
}, [saludFilters.municipio, configData.parroquiaOptions, configData.parroquiaItems]);

// ... Similar para Sector, Corregimiento y Centro Poblado (Salud)
```

#### E) **UI Actualizado - Tab Familias**

```tsx
<CardContent className="space-y-4">
  {/* Campos de filtros - Ubicación geográfica */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
    
    {/* Municipio - FILTRO PRINCIPAL ⭐ */}
    <div className="space-y-2">
      <Label htmlFor="familia_municipio" className="text-sm font-medium">
        Municipio <span className="text-primary">⭐</span>
      </Label>
      <Autocomplete
        options={configData.municipioOptions}
        value={familiasFilters.municipio}
        onValueChange={(value) => handleFamiliasFilterChange('municipio', value)}
        placeholder="Seleccionar municipio..."
        loading={configData.municipiosLoading}
        emptyText="No se encontraron municipios"
      />
    </div>

    {/* Parroquia - Filtrada por municipio ✅ */}
    <div className="space-y-2">
      <Label htmlFor="familia_parroquia" className="text-sm font-medium">Parroquia</Label>
      <Autocomplete
        options={filteredFamiliasParroquiaOptions} {/* ✅ Opciones filtradas */}
        value={familiasFilters.parroquia}
        onValueChange={(value) => handleFamiliasFilterChange('parroquia', value)}
        placeholder={familiasFilters.municipio ? "Seleccionar parroquia..." : "Primero seleccione municipio"}
        loading={configData.parroquiasLoading}
        disabled={!familiasFilters.municipio} {/* ✅ Deshabilitado sin municipio */}
        emptyText="No hay parroquias en este municipio"
      />
    </div>

    {/* Sector - Filtrado por municipio ✅ */}
    <div className="space-y-2">
      <Label htmlFor="familia_sector" className="text-sm font-medium">Sector</Label>
      <Autocomplete
        options={filteredFamiliasSectorOptions} {/* ✅ Opciones filtradas */}
        value={familiasFilters.sector}
        onValueChange={(value) => handleFamiliasFilterChange('sector', value)}
        placeholder={familiasFilters.municipio ? "Seleccionar sector..." : "Primero seleccione municipio"}
        loading={configData.sectoresLoading}
        disabled={!familiasFilters.municipio} {/* ✅ Deshabilitado sin municipio */}
        emptyText="No hay sectores en este municipio"
      />
    </div>

    {/* Similar para Vereda, Corregimiento y Centro Poblado */}
  </div>
</CardContent>
```

#### F) **UI Actualizado - Tab Salud**

Misma estructura que Familias, usando `filteredSalud*Options` y `saludFilters.municipio`.

---

## 🎯 Flujo de Funcionamiento

### 1. **Carga Inicial**
```
useConfigurationData carga todos los datos
    ↓
Municipios: Se muestran todos
Otros filtros: Se muestran todos (sin municipio seleccionado)
```

### 2. **Usuario Selecciona Municipio**
```
handleFamiliasFilterChange('municipio', '5') llamado
    ↓
Estado actualizado: { municipio: '5', parroquia: '', sector: '', ... }
    ↓
useMemo recalcula opciones filtradas
    ↓
filteredFamiliasParroquiaOptions → Solo parroquias con id_municipio = '5'
filteredFamiliasSectorOptions → Solo sectores con id_municipio = '5'
filteredFamiliasVeredaOptions → Solo veredas con id_municipio = '5'
filteredFamiliasCorregimientoOptions → Solo corregimientos con id_municipio = '5'
filteredFamiliasCentroPobladoOptions → Solo centros poblados con id_municipio = '5'
    ↓
UI actualiza dropdowns con opciones filtradas
Campos dependientes quedan habilitados (disabled={false})
```

### 3. **Usuario Cambia de Municipio**
```
handleFamiliasFilterChange('municipio', '8') llamado
    ↓
⚠️ RESET AUTOMÁTICO ⚠️
Estado actualizado: { 
  municipio: '8', 
  parroquia: '',      ← Resetado
  sector: '',         ← Resetado
  vereda: '',         ← Resetado
  corregimiento: '',  ← Resetado
  centro_poblado: '' ← Resetado
}
    ↓
useMemo recalcula con nuevo municipio '8'
    ↓
UI muestra nuevas opciones filtradas por municipio '8'
```

### 4. **Consulta con Filtros**
```
handleQueryFamilias() o handleQuerySalud() ejecutado
    ↓
Convierte filtros a formato API:
{
  id_municipio: Number(familiasFilters.municipio),
  id_parroquia: Number(familiasFilters.parroquia),
  id_sector: Number(familiasFilters.sector),
  id_vereda: Number(familiasFilters.vereda),
  id_corregimiento: Number(familiasFilters.corregimiento),
  id_centro_poblado: Number(familiasFilters.centro_poblado)
}
    ↓
API recibe parámetros filtrados correctamente
```

---

## 📊 Ejemplos Visuales

### Antes (Sin Filtrado)
```
Municipio: [ ] <-- Usuario puede seleccionar cualquiera
Parroquia: [Lista de TODAS las parroquias] ❌ Confuso
Sector: [Lista de TODOS los sectores] ❌ Demasiadas opciones
Vereda: [Lista de TODAS las veredas] ❌ No relevante
```

### Después (Con Filtrado Jerárquico)
```
Municipio: [Bucaramanga] ⭐ <-- Usuario selecciona primero
    ↓
Parroquia: [Solo parroquias de Bucaramanga] ✅
Sector: [Solo sectores de Bucaramanga] ✅
Vereda: [Solo veredas de Bucaramanga] ✅
Corregimiento: [Solo corregimientos de Bucaramanga] ✅
Centro Poblado: [Solo centros poblados de Bucaramanga] ✅
```

---

## ⚡ Optimizaciones Implementadas

### 1. **useMemo para Performance**
- Las opciones filtradas se recalculan **solo cuando cambia el municipio**
- Evita re-filtrados innecesarios en cada render

### 2. **Estados Deshabilitados**
```tsx
disabled={!familiasFilters.municipio}
```
- Campos dependientes están deshabilitados hasta seleccionar municipio
- Previene selecciones inconsistentes

### 3. **Placeholders Informativos**
```tsx
placeholder={
  familiasFilters.municipio 
    ? "Seleccionar parroquia..." 
    : "Primero seleccione municipio"
}
```
- Usuario recibe instrucciones claras sobre el flujo

### 4. **Reset Automático**
- Al cambiar municipio, todos los campos dependientes se limpian
- Garantiza coherencia de datos

---

## 🧪 Casos de Prueba

### Prueba 1: Seleccionar Municipio
**Pasos:**
1. Abrir tab "Familias" o "Salud"
2. Hacer clic en "Municipio"
3. Seleccionar "Bucaramanga"

**Resultado Esperado:**
✅ Municipio seleccionado: "Bucaramanga"
✅ Parroquia muestra solo parroquias de Bucaramanga
✅ Sector muestra solo sectores de Bucaramanga
✅ Vereda muestra solo veredas de Bucaramanga
✅ Corregimiento muestra solo corregimientos de Bucaramanga
✅ Centro Poblado muestra solo centros poblados de Bucaramanga
✅ Todos los campos quedan habilitados

### Prueba 2: Cambiar de Municipio
**Pasos:**
1. Seleccionar Municipio: "Bucaramanga"
2. Seleccionar Parroquia: "Sagrada Familia"
3. Seleccionar Sector: "Centro"
4. Cambiar Municipio a: "Floridablanca"

**Resultado Esperado:**
✅ Municipio actualizado: "Floridablanca"
✅ Parroquia reseteada: ""
✅ Sector reseteado: ""
✅ Vereda reseteada: ""
✅ Corregimiento reseteado: ""
✅ Centro Poblado reseteado: ""
✅ Nuevas opciones filtradas por "Floridablanca"

### Prueba 3: Consultar con Filtros
**Pasos:**
1. Seleccionar Municipio: "Bucaramanga"
2. Seleccionar Parroquia: "Sagrada Familia"
3. Hacer clic en "Consultar"

**Resultado Esperado:**
✅ API recibe `id_municipio: 5`
✅ API recibe `id_parroquia: 12`
✅ Resultados filtrados correctamente

### Prueba 4: Sin Municipio Seleccionado
**Pasos:**
1. No seleccionar ningún municipio
2. Intentar seleccionar Parroquia

**Resultado Esperado:**
✅ Dropdown de Parroquia está deshabilitado
✅ Placeholder dice "Primero seleccione municipio"
✅ No es posible seleccionar

### Prueba 5: Limpiar Filtros
**Pasos:**
1. Seleccionar varios filtros
2. Hacer clic en "Limpiar"

**Resultado Esperado:**
✅ Municipio reseteado: ""
✅ Todos los campos dependientes reseteados
✅ Campos dependientes quedan deshabilitados
✅ Resultados limpiados

---

## 📝 Notas Técnicas

### Manejo de id_municipio
El filtrado compara `id_municipio` como **strings**:
```typescript
return parroquia?.id_municipio?.toString() === familiasFilters.municipio;
```

Esto asegura compatibilidad independientemente de si el backend envía números o strings.

### Estructura de Datos Esperada

Los endpoints del backend deben retornar `id_municipio` en:
- **Parroquias**: `{ id_parroquia, nombre, id_municipio }`
- **Sectores**: `{ id_sector, nombre, id_municipio }`
- **Veredas**: `{ id_vereda, nombre, id_municipio }`
- **Corregimientos**: `{ id_corregimiento, nombre, id_municipio }`
- **Centros Poblados**: `{ id_centro_poblado, nombre, id_municipio }`

### Fallback para Datos Sin id_municipio
Si algún registro no tiene `id_municipio`, se asigna `null`:
```typescript
id_municipio: sector.id_municipio || sector.municipio_id || null
```

Estos registros aparecerán cuando **no hay municipio seleccionado**, pero se filtrarán cuando sí lo haya.

---

## 🎯 Beneficios Implementados

✅ **UX Mejorada**: Usuario no ve opciones irrelevantes  
✅ **Prevención de Errores**: No se pueden seleccionar combinaciones inválidas  
✅ **Performance Optimizada**: Menos opciones = dropdowns más rápidos  
✅ **Datos Consistentes**: Reset automático garantiza coherencia  
✅ **Flujo Intuitivo**: Indicadores visuales (⭐) y placeholders informativos  
✅ **Mantenibilidad**: Código centralizado y reutilizable  
✅ **Escalabilidad**: Fácil agregar más niveles jerárquicos

---

## 📄 Archivos Modificados

| Archivo | Cambios | Líneas Modificadas |
|---------|---------|-------------------|
| `src/types/survey.ts` | Agregado `id_municipio` a `ConfigurationItem` | +1 |
| `src/hooks/useConfigurationData.ts` | Agregados useMemo para items con `id_municipio` | +150 |
| `src/pages/Reports.tsx` | Agregado filtrado jerárquico y UI actualizado | +200 |

**Total**: ~350 líneas de código agregadas/modificadas

---

## ✅ Conclusión

El sistema de **filtrado jerárquico por municipio** está completamente implementado y funcional. Los usuarios ahora pueden:

1. **Seleccionar un municipio** como filtro principal
2. **Ver solo opciones relevantes** para ese municipio en todos los demás filtros
3. **Recibir feedback visual** sobre el estado de los filtros
4. **Consultar datos** con filtros coherentes y validados

La implementación es **performante**, **escalable** y **fácil de mantener**, siguiendo los estándares del proyecto y best practices de React.
