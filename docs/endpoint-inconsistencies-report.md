# 🔍 Reporte de Inconsistencias en Endpoints de Configuración

## ❌ **Problemas Identificados**

### 1. **Error Tipográfico en Encuestas**
**Ubicación**: `src/config/api.ts`
```typescript
// ❌ INCORRECTO
SURVEYS: '/api/encuentas',

// ✅ CORRECTO (según curl usado anteriormente)
SURVEYS: '/api/encuesta',
```

### 2. **Endpoint Incorrecto en Sectores**
**Ubicación**: `src/services/sectores.ts`
```typescript
// ❌ INCORRECTO (en inglés)
'/api/catalog/sectors'

// ✅ CORRECTO (debe ser en español)
'/api/catalog/sectores'
```

### 3. **Inconsistencia en Estadísticas de Estudios**
**Ubicación**: `src/services/estudios.ts`
```typescript
// ❌ INCORRECTO (inconsistente)
'/api/catalog/estudios/stats'

// ✅ CORRECTO (consistente con otros servicios)
'/api/catalog/estudios/statistics'
```

### 4. **Servicios No Refactorizados**
**Ubicación**: `src/services/situaciones-civiles.ts`
- ❌ **No usa `getApiClient()`** - usa `axios` directamente
- ❌ **Configuración hardcodeada** no centralizada

## 📊 **Estado Actual de Servicios**

### ✅ **Servicios Refactorizados Correctamente**
- `sexos.ts` - ✅ Usa `getApiClient()` + endpoints correctos
- `parroquias.ts` - ✅ Usa `getApiClient()` + endpoints correctos  
- `parentescos.ts` - ✅ Usa `getApiClient()` + endpoints correctos
- `estudios.ts` - ⚠️ Usa `getApiClient()` pero `/stats` inconsistente
- `tipos-vivienda.ts` - ✅ Usa `getApiClient()` + endpoints correctos
- `veredas.ts` - ✅ Usa `getApiClient()` + endpoints correctos

### ❌ **Servicios Que Requieren Corrección**
- `sectores.ts` - ❌ Endpoint en inglés `/sectors`
- `situaciones-civiles.ts` - ❌ No usa configuración centralizada
- `sistemas-acueducto.ts` - ⚠️ Revisar consistencia

### ⚠️ **Servicios Por Verificar**
- `enfermedades.ts`
- `estados-civiles.ts` 
- `disposicion-basura.ts`
- `aguas-residuales.ts`
- `departamentos.ts`
- `comunidades-culturales.ts`
- `tallas.ts`
- `tipos-identificacion.ts`

## 🎯 **Endpoints Esperados Según Configuración**

```typescript
// Catálogos principales
/api/catalog/aguas-residuales
/api/catalog/departamentos  
/api/catalog/disposicion-basura
/api/catalog/enfermedades
/api/catalog/estados-civiles
/api/catalog/estudios
/api/catalog/municipios
/api/catalog/parentescos
/api/catalog/parroquias
/api/catalog/profesiones
/api/catalog/sectores          ← Debe ser en español
/api/catalog/sexos
/api/catalog/sistemas-acueducto
/api/catalog/situaciones-civiles
/api/catalog/tallas
/api/catalog/tipos-identificacion
/api/catalog/tipos-vivienda
/api/catalog/comunidades-culturales
/api/catalog/veredas

// Encuestas
/api/encuesta                  ← Corregir de /api/encuentas
```

## 🛠️ **Plan de Corrección**

### Prioridad Alta
1. **Corregir tipeo en encuestas** - `/api/encuentas` → `/api/encuesta`
2. **Corregir sectores** - `/api/catalog/sectors` → `/api/catalog/sectores`
3. **Estandarizar estadísticas** - `/stats` → `/statistics`

### Prioridad Media
4. **Refactorizar situaciones-civiles** para usar `getApiClient()`
5. **Verificar servicios restantes** y aplicar patrón consistente

### Validación
6. **Probar conectividad** con endpoints corregidos
7. **Verificar respuestas** de API coinciden con tipos TypeScript

---

*Análisis realizado el 18 de septiembre de 2025*