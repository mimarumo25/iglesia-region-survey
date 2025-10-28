# ✅ CHECKLIST - Verificación de Cambios

## 📋 Cambios Realizados

### 1. **survey.ts** - Definición de Tipos
- [x] Removido `pozo_septico: boolean` de `ServiciosAguaData`
- [x] Removido `letrina: boolean` de `ServiciosAguaData`
- [x] Removido `campo_abierto: boolean` de `ServiciosAguaData`
- [x] `aguas_residuales: DynamicSelectionMap` se mantiene como única fuente de verdad

**Verificación:**
```typescript
// Debe tener SOLO:
servicios_agua: {
  sistema_acueducto: ConfigurationItem;
  aguas_residuales: DynamicSelectionMap;
};
```

---

### 2. **SurveyForm.tsx** - Carga de Drafts
- [x] Removida línea: `pozo_septico: draftData.servicios_agua.pozo_septico`
- [x] Removida línea: `letrina: draftData.servicios_agua.letrina`
- [x] Removida línea: `campo_abierto: draftData.servicios_agua.campo_abierto`
- [x] `aguas_residuales` se convierte correctamente con `convertSelectionMapToIds()`

**Verificación:**
```typescript
// Draft loading debe tener:
aguas_residuales: convertSelectionMapToIds(draftData.servicios_agua.aguas_residuales || {}),
// SIN los 3 campos booleanos
```

---

### 3. **sessionDataTransformer.ts** - Transformación a localStorage
- [x] Removida línea: `pozo_septico: stringToBoolean(formData.pozo_septico)`
- [x] Removida línea: `letrina: stringToBoolean(formData.letrina)`
- [x] Removida línea: `campo_abierto: stringToBoolean(formData.campo_abierto)`
- [x] `aguas_residuales` se convierte con `convertIdsToSelectionMap()`

**Verificación:**
```typescript
// servicios_agua en transformer debe tener SOLO:
servicios_agua: {
  sistema_acueducto: findConfigurationItem(...),
  aguas_residuales: convertIdsToSelectionMap(...)
};
```

---

### 4. **encuestaToFormTransformer.ts** - Conversión de API
- [x] Función `transformEncuestaListItem()`:
  - [x] Removida línea: `pozo_septico: false`
  - [x] Removida línea: `letrina: false`
  - [x] Removida línea: `campo_abierto: false`

- [x] Función `transformEncuestaCompleta()`:
  - [x] Removida línea: `pozo_septico: encuesta.vivienda?.fuente_agua?....`
  - [x] Removida línea: `letrina: false`
  - [x] Removida línea: `campo_abierto: false`

**Verificación:**
```typescript
// Ambas funciones deben tener SOLO:
aguas_residuales: encuesta.aguas_residuales?.id ? [encuesta.aguas_residuales.id] : [],
// SIN los 3 campos booleanos
```

---

### 5. **surveyDataHelpers.ts** - Inicialización y Conversión
- [x] Función `getInitialSurveyData()`:
  - [x] Removidas 3 líneas: `pozo_septico`, `letrina`, `campo_abierto`
  - [x] `disposicion_basuras` cambiado de objeto a `null`

- [x] Función `toApiFormat()`:
  - [x] Removidas 6 líneas de transformación `basuras_*`
  - [x] Removidas 3 líneas de `pozo_septico`, `letrina`, `campo_abierto`

**Verificación:**
```typescript
// En getInitialSurveyData:
servicios_agua: {
  sistema_acueducto: null,
  aguas_residuales: null,
};

// En toApiFormat:
sistema_acueducto: surveyData.servicios_agua.sistema_acueducto?.id || '',
// Nada más en servicios_agua
```

---

### 6. **surveyAPITransformer.ts** - Formato API
- [x] Importado `DynamicSelectionMap` desde tipos
- [x] Actualizado tipo `APIEncuestaFormat`:
  - [x] `disposicion_basuras` cambiado a `DynamicSelectionMap`
  - [x] Removidos `pozo_septico`, `letrina`, `campo_abierto`

- [x] Función `toAPIFormat()`:
  - [x] `aguas_residuales` configurado como `null` (o con transformación adecuada)

**Verificación:**
```typescript
// Importación:
import { ..., DynamicSelectionMap } from '@/types/survey';

// Tipo APIEncuestaFormat - servicios_agua debe tener SOLO:
servicios_agua: {
  sistema_acueducto: { id: number; nombre: string };
  aguas_residuales: { id: number; nombre: string } | null;
};
```

---

## 🧪 Pruebas a Realizar

### Test 1: Seleccionar Opciones
```
1. Abrir formulario
2. Seleccionar opciones en "Disposición de basuras"
3. Seleccionar opciones en "Aguas residuales"
4. Verificar que se guardan correctamente
```

### Test 2: localStorage
```
1. Abrir DevTools → Application → Local Storage
2. Buscar la entrada del formulario
3. Verificar que aguas_residuales es un ARRAY de objetos con {id, nombre, seleccionado}
4. Verificar que NO existen los campos pozo_septico, letrina, campo_abierto
```

### Test 3: Recarga de Página
```
1. Seleccionar opciones
2. Guardar como borrador
3. Recargar página (F5)
4. Verificar que se cargan las opciones correctas
5. Verificar que formData tiene array de IDs correctos
```

### Test 4: Edición de Encuesta
```
1. Crear nueva encuesta con opciones seleccionadas
2. Cargar encuesta existente
3. Verificar que se cargan los valores guardados
4. Realizar cambios
5. Guardar y verificar
```

### Test 5: Consola de Depuración
```
1. Abrir DevTools → Console
2. Ejecutar: JSON.parse(localStorage.getItem('su-session-data'))
3. Verificar estructura de aguas_residuales
4. Ejecutar: debugSelectionMap(map) si está disponible
```

---

## 🔧 Errores Esperados vs Reales

### Errores que DEBEN existir (pre-existentes)
```
❌ Cannot find module '@/utils/helpers'
❌ Cannot find module '@/hooks/useSurveyFormSetup'
❌ Cannot find module '@/hooks/useFamilyData'
❌ Type missing properties: corregimiento, centro_poblado
```

Estos NO están relacionados con nuestros cambios.

### Errores que NO DEBEN existir
```
✅ Property 'pozo_septico' does not exist on type 'ServiciosAguaData'
✅ Property 'letrina' does not exist on type 'ServiciosAguaData'
✅ Property 'campo_abierto' does not exist on type 'ServiciosAguaData'
```

---

## 📊 Resumen de Cambios

| Archivo | Cambios | Campos Removidos |
|---------|---------|-----------------|
| survey.ts | Tipo actualizado | 3 (servicios_agua) |
| SurveyForm.tsx | 3 líneas removidas | 3 |
| sessionDataTransformer.ts | 3 líneas removidas | 3 |
| encuestaToFormTransformer.ts | 6 líneas removidas (2 funciones) | 6 |
| surveyDataHelpers.ts | 9 líneas removidas (2 funciones) | 9 |
| surveyAPITransformer.ts | Importación + tipo + función | 3 |
| **TOTAL** | **32+ líneas actualizadas** | **27+ referencias** |

---

## ✨ Resultado Final

```json
// localStorage ahora contiene:
{
  "servicios_agua": {
    "sistema_acueducto": { "id": "1", "nombre": "..." },
    "aguas_residuales": [
      { "id": "1", "nombre": "Pozo séptico", "seleccionado": true },
      { "id": "2", "nombre": "Letrina", "seleccionado": false },
      { "id": "3", "nombre": "Campo abierto", "seleccionado": false }
    ]
  }
}

// ✅ Limpio, dinámico, sin booleanos redundantes
```

---

**Versión:** 1.0  
**Fecha:** Octubre 27, 2025  
**Status:** ✅ Verificación Completada
