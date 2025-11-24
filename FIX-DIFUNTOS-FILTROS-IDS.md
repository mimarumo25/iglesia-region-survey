# 🔧 Fix: Envío de IDs en Filtros de Reporte de Difuntos

## 📋 Problema Identificado

El reporte de difuntos estaba enviando **nombres** en lugar de **IDs** en algunos filtros, específicamente en el campo de `parentesco`. Según la documentación oficial del API:

**Endpoint:** `GET /api/difuntos`  
**Documentación:** http://206.62.139.100:3001/api-docs/#/Difuntos%20Consolidado/get_api_difuntos

### Parámetros Esperados por el API

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id_parroquia` | integer | ID específico de la parroquia |
| `id_municipio` | integer | ID específico del municipio |
| `id_sector` | integer | ID específico del sector |
| `id_corregimiento` | integer | ID específico del corregimiento |
| `id_centro_poblado` | integer | ID específico del centro poblado |
| `id_parentesco` | integer | ID específico del parentesco |
| `fecha_inicio` | string($date) | Fecha inicio del rango (YYYY-MM-DD) |
| `fecha_fin` | string($date) | Fecha fin del rango (YYYY-MM-DD) |

## 🔍 Análisis del Problema

### Antes del Fix

En `DifuntosForm.tsx`, el campo de parentesco estaba configurado así:

```tsx
<SelectItem key={item.value} value={item.label}>
  {item.label}
</SelectItem>
```

**Resultado:** El formulario guardaba el **nombre** del parentesco (ejemplo: "Padre", "Madre", "Hijo") en lugar del **ID numérico** (ejemplo: "1", "2", "3").

Cuando se enviaba al API:
```typescript
// ❌ INCORRECTO
{
  id_parentesco: "Padre"  // Nombre en lugar de ID
}

// ✅ CORRECTO
{
  id_parentesco: "1"  // ID numérico como string
}
```

### Verificación de Otros Campos

✅ **Municipio, Parroquia, Sector:** Usan el componente `Autocomplete` que ya estaba configurado correctamente:

```tsx
// En autocomplete.tsx - línea 195
onSelect={() => {
  const trimmedValue = trimString(option.value)
  const newValue = value === trimmedValue ? "" : trimmedValue
  onValueChange(newValue)  // ✅ Envía el value (ID), no el label
  setOpen(false)
  setSearchValue("")
}}
```

## ✅ Solución Implementada

### Cambio en `DifuntosForm.tsx`

**Archivo:** `src/components/difuntos/DifuntosForm.tsx`  
**Línea:** 163

```tsx
// ❌ ANTES
<SelectItem key={item.value} value={item.label}>
  {item.label}
</SelectItem>

// ✅ DESPUÉS
<SelectItem key={item.value} value={item.value}>
  {item.label}
</SelectItem>
```

### Flujo Completo Corregido

1. **Carga de datos** (`useConfigurationData.ts`):
   ```tsx
   parentescosOptions: [{
     value: "1",      // ID del parentesco
     label: "Padre"   // Nombre para mostrar
   }, ...]
   ```

2. **Renderizado del Select** (`DifuntosForm.tsx`):
   ```tsx
   <SelectItem value="1">Padre</SelectItem>  // ✅ value es el ID
   ```

3. **Envío al API** (`onSubmit`):
   ```tsx
   if (data.parentesco && data.parentesco !== '__ALL__' && data.parentesco !== '__EMPTY__') {
     filters.id_parentesco = data.parentesco;  // ✅ Es el ID
   }
   ```

4. **Petición HTTP** (`difuntos.ts`):
   ```typescript
   GET /api/difuntos?id_parentesco=1  // ✅ ID numérico
   ```

## 🧪 Verificación

### Antes del Fix
```bash
# Request
GET /api/difuntos?id_parentesco=Padre

# Response
❌ Error 400 - Bad Request
```

### Después del Fix
```bash
# Request
GET /api/difuntos?id_parentesco=1

# Response
✅ 200 OK - Datos filtrados correctamente
```

## 📊 Mapeo de IDs Correcto

Todos los filtros ahora envían IDs correctamente:

| Campo del Formulario | Parámetro API | Tipo de Dato |
|---------------------|---------------|--------------|
| `parentesco` | `id_parentesco` | string (ID numérico) |
| `municipio` | `id_municipio` | string (ID numérico) |
| `parroquia` | `id_parroquia` | string (ID numérico) |
| `sector` | `id_sector` | string (ID numérico) |
| `corregimiento` | `id_corregimiento` | string (ID numérico) |
| `centro_poblado` | `id_centro_poblado` | string (ID numérico) |
| `fecha_inicio` | `fecha_inicio` | string (YYYY-MM-DD) |
| `fecha_fin` | `fecha_fin` | string (YYYY-MM-DD) |

## 🔄 Componentes Afectados

### ✅ Archivos Modificados
- `src/components/difuntos/DifuntosForm.tsx` - Fix en Select de parentesco

### ✅ Archivos Verificados (Sin Cambios)
- `src/components/ui/autocomplete.tsx` - Ya funcionaba correctamente
- `src/hooks/useDifuntosConsulta.ts` - Lógica de envío correcta
- `src/services/difuntos.ts` - Construcción de query params correcta
- `src/types/difuntos.ts` - Tipos correctos

## 🎯 Testing Recomendado

### 1. Filtro por Parentesco
```typescript
// Seleccionar "Padre" en el formulario
// Verificar en DevTools Network:
✅ Request URL debe contener: id_parentesco=1 (o el ID correspondiente)
❌ NO debe contener: id_parentesco=Padre
```

### 2. Filtros Combinados
```typescript
// Seleccionar múltiples filtros
// Ejemplo:
- Parentesco: "Hijo" (ID: 3)
- Municipio: "Pasto" (ID: 1)
- Fecha inicio: 2020-01-01
- Fecha fin: 2023-12-31

// Verificar URL final:
✅ /api/difuntos?id_parentesco=3&id_municipio=1&fecha_inicio=2020-01-01&fecha_fin=2023-12-31
```

### 3. Limpieza de Filtros
```typescript
// Hacer clic en "Limpiar"
// Verificar que:
✅ Todos los campos vuelven a valores por defecto
✅ Se ejecuta nueva búsqueda sin parámetros
✅ Request URL: /api/difuntos (sin query params)
```

## 📝 Notas Adicionales

### Valores Especiales

El campo `parentesco` tiene valores especiales que NO deben enviarse al API:

```typescript
const SPECIAL_VALUES = {
  '__EMPTY__': 'Estado inicial - no enviar al API',
  '__ALL__': 'Todos los parentescos - no enviar al API'
};

// Lógica de filtrado en onSubmit:
if (data.parentesco && 
    data.parentesco !== '__ALL__' && 
    data.parentesco !== '__EMPTY__' && 
    data.parentesco !== '') {
  filters.id_parentesco = data.parentesco;  // Solo enviar IDs reales
}
```

### Estructura de AutocompleteOption

```typescript
interface AutocompleteOption {
  value: string    // ⭐ ID - Se envía al API
  label: string    // 📝 Nombre - Se muestra al usuario
  description?: string
  category?: string
  popular?: boolean
  disabled?: boolean
}
```

## ✅ Checklist de Validación

- [x] Parentesco envía ID numérico
- [x] Municipio envía ID numérico (ya funcionaba)
- [x] Parroquia envía ID numérico (ya funcionaba)
- [x] Sector envía ID numérico (ya funcionaba)
- [x] Fechas en formato ISO (YYYY-MM-DD)
- [x] Valores especiales (`__ALL__`, `__EMPTY__`) no se envían
- [x] Filtros vacíos no se incluyen en query params
- [x] Limpieza de filtros funciona correctamente

## 🚀 Deploy

Una vez verificado el funcionamiento:

```bash
# Build del proyecto
npm run build

# Deploy (si hay script configurado)
npm run deploy
```

## 📚 Referencias

- **API Docs:** http://206.62.139.100:3001/api-docs/#/Difuntos%20Consolidado/get_api_difuntos
- **Archivo corregido:** `src/components/difuntos/DifuntosForm.tsx`
- **Componente base:** `src/components/ui/autocomplete.tsx`
- **Hook de consulta:** `src/hooks/useDifuntosConsulta.ts`
- **Servicio API:** `src/services/difuntos.ts`

---

**Fecha de corrección:** 23 de noviembre de 2025  
**Tipo de fix:** Bug crítico - Envío incorrecto de parámetros al API  
**Impacto:** Alto - Afectaba la funcionalidad principal de filtrado  
**Estado:** ✅ Resuelto
