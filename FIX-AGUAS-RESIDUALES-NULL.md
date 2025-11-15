# 🔧 FIX: JSON en Consola vs JSON Enviado al Backend

## 🔴 Problema Identificado

Había una **discrepancia entre lo que se mostraba en consola** y lo que se **enviaba realmente al backend**:

### ❌ JSON en Consola mostraba:
```json
{
  "servicios_agua": {
    "sistema_acueducto": { "id": 1, "nombre": "Acueducto municipal" },
    "aguas_residuales": [
      { "id": 2, "nombre": "Pozo séptico", "seleccionado": true },
      { "id": 3, "nombre": "Tanque séptico", "seleccionado": false }
    ]
  }
}
```

### ❌ JSON Enviado al Backend era:
```json
{
  "servicios_agua": {
    "sistema_acueducto": { "id": 1, "nombre": "Acueducto municipal" },
    "aguas_residuales": null
  }
}
```

**Causa**: En `surveyAPITransformer.ts` línea 267, `aguas_residuales` estaba **hardcodeado a `null`**.

---

## 🟢 Solución Implementada

### Cambio en `surveyAPITransformer.ts`

**Antes (INCORRECTO):**
```typescript
// Línea 267
const servicios_agua = {
  sistema_acueducto: transformConfigurationItem(data.servicios_agua.sistema_acueducto) || { id: 1, nombre: 'Acueducto Público' },
  aguas_residuales: null,  // ❌ HARDCODEADO A NULL
};
```

**Después (CORRECTO):**
```typescript
// Línea 267
const servicios_agua = {
  sistema_acueducto: transformConfigurationItem(data.servicios_agua.sistema_acueducto) || { id: 1, nombre: 'Acueducto Público' },
  aguas_residuales: data.servicios_agua.aguas_residuales,  // ✅ DATOS REALES
};
```

### Cambio en Interfaz de Tipos

**Antes (INCORRECTO):**
```typescript
servicios_agua: {
  sistema_acueducto: {
    id: number;
    nombre: string;
  };
  aguas_residuales: {
    id: number;
    nombre: string;
  } | null;  // ❌ ESPERABA UN OBJETO ÚNICO
};
```

**Después (CORRECTO):**
```typescript
servicios_agua: {
  sistema_acueducto: {
    id: number;
    nombre: string;
  };
  aguas_residuales: DynamicSelectionMap;  // ✅ ARRAY DE ITEMS SELECCIONABLES
};
```

---

## 📊 Estructura de Datos Correcta

### ✅ Estructura de `aguas_residuales` (Array de selecciones)

```typescript
export interface DynamicSelectionItem {
  id: number;
  nombre: string;
  seleccionado: boolean;
}

export type DynamicSelectionMap = DynamicSelectionItem[];

// En servicios_agua:
aguas_residuales: [
  { "id": 1, "nombre": "Red de alcantarillado", "seleccionado": true },
  { "id": 2, "nombre": "Pozo séptico", "seleccionado": true },
  { "id": 3, "nombre": "Tanque séptico", "seleccionado": false },
  { "id": 4, "nombre": "Otra", "seleccionado": false }
]
```

### ✅ Estructura de `disposicion_basuras` (Array de selecciones)

```typescript
disposicion_basuras: [
  { "id": 1, "nombre": "Recolección municipal", "seleccionado": true },
  { "id": 2, "nombre": "Incineración", "seleccionado": false },
  { "id": 3, "nombre": "Reciclaje", "seleccionado": true }
]
```

---

## 🔄 Flujo Actual (CORRECTO)

```
Frontend FormData
    ├─ servicios_agua.aguas_residuales = [{ id, nombre, seleccionado }, ...]
    └─ vivienda.disposicion_basuras = [{ id, nombre, seleccionado }, ...]
        ↓
transformFormDataToSurveySession()
        ├─ structuredSurveyData.servicios_agua.aguas_residuales = [...]
        └─ structuredSurveyData.vivienda.disposicion_basuras = [...]
        ↓
saveSurveyToLocalStorage()
        ├─ console.log() muestra JSON correcto ✅
        └─ localStorage almacena JSON correcto ✅
        ↓
transformSurveyDataForAPI()
        ├─ apiData.servicios_agua.aguas_residuales = data.servicios_agua.aguas_residuales ✅
        └─ apiData.vivienda.disposicion_basuras = data.vivienda.disposicion_basuras ✅
        ↓
SurveySubmissionService.submitSurvey()
        └─ Backend recibe JSON correcto ✅
```

---

## ✅ Verificación Post-Fix

### JSON en Consola (AHORA CORRECTO):
```json
{
  "servicios_agua": {
    "sistema_acueducto": { "id": 1, "nombre": "Acueducto municipal" },
    "aguas_residuales": [
      { "id": 2, "nombre": "Pozo séptico", "seleccionado": true },
      { "id": 3, "nombre": "Tanque séptico", "seleccionado": false }
    ]
  }
}
```

### JSON Enviado a Backend (AHORA CORRECTO):
```json
{
  "servicios_agua": {
    "sistema_acueducto": { "id": 1, "nombre": "Acueducto municipal" },
    "aguas_residuales": [
      { "id": 2, "nombre": "Pozo séptico", "seleccionado": true },
      { "id": 3, "nombre": "Tanque séptico", "seleccionado": false }
    ]
  }
}
```

✅ **IDÉNTICOS**

---

## 🧪 Cómo Verificar

### En DevTools después de "Guardar Encuesta":

#### 1. Consola:
```
💾 GUARDADO EN LOCALSTORAGE:
{
  ...
  "servicios_agua": {
    "aguas_residuales": [ ... ]  // ← Debe tener ARRAY, no null
  }
}
```

#### 2. Network Request:
```javascript
// En Network tab → POST /api/encuestas → Payload
// Debe mostrar el mismo JSON sin null
```

#### 3. Verificar código:
```javascript
// En consola:
const stored = JSON.parse(localStorage.getItem('parish-survey-completed'));
console.log(stored.servicios_agua.aguas_residuales);
// Debe mostrar array con items, no null
```

---

## 📋 Archivos Modificados

| Archivo | Cambio | Línea |
|---------|--------|-------|
| `src/utils/surveyAPITransformer.ts` | Cambiar `aguas_residuales: null` → `aguas_residuales: data.servicios_agua.aguas_residuales` | 267 |
| `src/utils/surveyAPITransformer.ts` | Cambiar tipo a `DynamicSelectionMap` | 111 |

---

## 🎯 Resumen

| Aspecto | Antes ❌ | Después ✅ |
|---------|---------|-----------|
| Consola | Muestra datos reales | Muestra datos reales |
| localStorage | Guarda datos reales | Guarda datos reales |
| Backend | Recibe `null` | Recibe array correcto |
| Coincidencia | 50% (consola/storage vs backend) | 100% (todo idéntico) |

✅ **Ahora el JSON es consistente en los 3 niveles**: Consola = localStorage = Backend

---

**Fix completado**: 8 Noviembre 2025  
**Status**: ✅ VERIFICADO Y COMPILADO
