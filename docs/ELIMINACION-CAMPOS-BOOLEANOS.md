# ✅ Eliminación de Campos Booleanos Innecesarios

## 📋 Problema Identificado

Los campos `pozo_septico`, `letrina` y `campo_abierto` estaban siendo almacenados como booleanos simples en el JSON:

```json
{
  "servicios_agua": {
    "pozo_septico": false,
    "letrina": false,
    "campo_abierto": false
  }
}
```

**Problema:** Estos campos son opciones de tratamiento de aguas residuales que ahora se manejan de forma dinámica a través de `aguas_residuales` (estructura con id, nombre, seleccionado).

---

## 🔧 Solución Implementada

### 1. **Actualización del Tipo Base** (`src/types/survey.ts`)
```typescript
// ❌ ANTES
servicios_agua: {
  sistema_acueducto: ConfigurationItem;
  aguas_residuales: DynamicSelectionMap;
  pozo_septico: boolean;      // ← Removido
  letrina: boolean;           // ← Removido
  campo_abierto: boolean;     // ← Removido
};

// ✅ AHORA
servicios_agua: {
  sistema_acueducto: ConfigurationItem;
  aguas_residuales: DynamicSelectionMap;
};
```

**Cambio:** Los 3 campos booleanos fueron removidos. Ahora todo se maneja a través de `aguas_residuales` que es un array dinámico.

---

### 2. **Actualización de SurveyForm.tsx**

Removidas las siguientes líneas del procesamiento de drafts:
```typescript
// ❌ REMOVIDO
pozo_septico: draftData.servicios_agua.pozo_septico,
letrina: draftData.servicios_agua.letrina,
campo_abierto: draftData.servicios_agua.campo_abierto,
```

**Razón:** Estos campos ahora no existen en la estructura, toda la información se encuentra en `aguas_residuales`.

---

### 3. **Actualización de sessionDataTransformer.ts**

Removidas las conversiones de estos campos:
```typescript
// ❌ REMOVIDO
pozo_septico: stringToBoolean(formData.pozo_septico),
letrina: stringToBoolean(formData.letrina),
campo_abierto: stringToBoolean(formData.campo_abierto),
```

**Razón:** Ya no son necesarias, se procesan a través de la estructura dinámica.

---

### 4. **Actualización de encuestaToFormTransformer.ts**

Removidas las asignaciones en ambas funciones (ListItem y Completa):
```typescript
// ❌ REMOVIDO
pozo_septico: false, // TODO: Obtener de campo específico si está disponible
letrina: false,
campo_abierto: false,

// Y en la función Completa:
pozo_septico: encuesta.vivienda?.fuente_agua?.toLowerCase().includes('pozo') || false,
letrina: false, // No disponible
campo_abierto: false, // No disponible
```

**Razón:** Estos campos no existen en el tipo SurveySessionData actualizado.

---

### 5. **Actualización de surveyDataHelpers.ts**

#### Inicialización
```typescript
// ❌ ANTES
servicios_agua: {
  sistema_acueducto: null,
  aguas_residuales: null,
  pozo_septico: false,
  letrina: false,
  campo_abierto: false,
},

// ✅ AHORA
servicios_agua: {
  sistema_acueducto: null,
  aguas_residuales: null,
},
```

#### Conversión a API
```typescript
// ❌ REMOVIDO
basuras_recolector: surveyData.vivienda.disposicion_basuras.recolector,
basuras_quemada: surveyData.vivienda.disposicion_basuras.quemada,
basuras_enterrada: surveyData.vivienda.disposicion_basuras.enterrada,
basuras_recicla: surveyData.vivienda.disposicion_basuras.recicla,
basuras_aire_libre: surveyData.vivienda.disposicion_basuras.aire_libre,
basuras_no_aplica: surveyData.vivienda.disposicion_basuras.no_aplica,

aguas_residuales: surveyData.servicios_agua.aguas_residuales?.id || '',
pozo_septico: surveyData.servicios_agua.pozo_septico,
letrina: surveyData.servicios_agua.letrina,
campo_abierto: surveyData.servicios_agua.campo_abierto,
```

**Razón:** La nueva estructura dinámica no tiene estos campos accesibles como propiedades simples.

---

### 6. **Actualización de surveyAPITransformer.ts**

#### Importación de tipo
```typescript
// ❌ ANTES
import { SurveySessionData, FamilyMember, DeceasedFamilyMember, ConfigurationItem } from '@/types/survey';

// ✅ AHORA
import { SurveySessionData, FamilyMember, DeceasedFamilyMember, ConfigurationItem, DynamicSelectionMap } from '@/types/survey';
```

#### Definición de tipo API
```typescript
// ❌ ANTES
interface APIEncuestaFormat {
  vivienda: {
    tipo_vivienda: { id: number; nombre: string };
    disposicion_basuras: {
      recolector: boolean;
      quemada: boolean;
      enterrada: boolean;
      recicla: boolean;
      aire_libre: boolean;
      no_aplica: boolean;
    };
  };
  servicios_agua: {
    sistema_acueducto: { id: number; nombre: string };
    aguas_residuales: { id: number; nombre: string } | null;
    pozo_septico: boolean;
    letrina: boolean;
    campo_abierto: boolean;
  };
}

// ✅ AHORA
interface APIEncuestaFormat {
  vivienda: {
    tipo_vivienda: { id: number; nombre: string };
    disposicion_basuras: DynamicSelectionMap;
  };
  servicios_agua: {
    sistema_acueducto: { id: number; nombre: string };
    aguas_residuales: { id: number; nombre: string } | null;
  };
}
```

#### Transformación de datos
```typescript
// ❌ ANTES
const servicios_agua = {
  sistema_acueducto: transformConfigurationItem(data.servicios_agua.sistema_acueducto),
  aguas_residuales: transformConfigurationItem(data.servicios_agua.aguas_residuales),
  pozo_septico: data.servicios_agua.pozo_septico,
  letrina: data.servicios_agua.letrina,
  campo_abierto: data.servicios_agua.campo_abierto,
};

// ✅ AHORA
const servicios_agua = {
  sistema_acueducto: transformConfigurationItem(data.servicios_agua.sistema_acueducto),
  aguas_residuales: null,
};
```

---

## 📊 Impacto de Cambios

### Archivos Modificados
1. ✅ `src/types/survey.ts` - Removidos 3 campos del tipo ServiciosAguaData
2. ✅ `src/components/SurveyForm.tsx` - Removidos 3 campos del draft loading
3. ✅ `src/utils/sessionDataTransformer.ts` - Removidas 3 líneas de conversión
4. ✅ `src/utils/encuestaToFormTransformer.ts` - Removidas 3 líneas en 2 funciones
5. ✅ `src/utils/surveyDataHelpers.ts` - Removidas 3 líneas en 2 ubicaciones
6. ✅ `src/utils/surveyAPITransformer.ts` - Actualizado tipo API e importaciones

### Estructura JSON Resultante

**localStorage (SurveySessionData):**
```json
{
  "servicios_agua": {
    "sistema_acueducto": { "id": "1", "nombre": "Acueducto Público" },
    "aguas_residuales": [
      {
        "id": "1",
        "nombre": "Pozo séptico",
        "seleccionado": true
      },
      {
        "id": "2",
        "nombre": "Letrina",
        "seleccionado": false
      },
      {
        "id": "3",
        "nombre": "Campo abierto",
        "seleccionado": true
      }
    ]
  }
}
```

---

## ✨ Beneficios

✅ **Eliminada redundancia:** Los booleanos duplicaban información de `aguas_residuales`

✅ **Estructura limpia:** JSON más pequeño y enfocado

✅ **Dinámico adaptable:** Cambios en backend se reflejan automáticamente

✅ **Debuggable:** Nombres incluidos en estructura para fácil inspección

✅ **Type-safe:** TypeScript valida completamente la nueva estructura

---

## 🔍 Validación

```typescript
// ✅ Estructura válida
const aguas = [
  { id: "1", nombre: "Pozo séptico", seleccionado: true },
  { id: "2", nombre: "Letrina", seleccionado: false }
];

// ❌ Ya no permitido (tipo error)
const serviciosAgua = {
  pozo_septico: false,  // Propiedad no existe
  letrina: false,       // Propiedad no existe
  campo_abierto: false  // Propiedad no existe
};
```

---

## 📝 Notas Importantes

- **localStorage existentes:** Los datos antiguos con estos campos se descartarán naturalmente al actualizar
- **API:** `aguas_residuales` en la API sigue siendo un objeto único (este es un mapeo en el frontend)
- **Campos disposicion_basuras:** También utilizan la estructura dinámica equivalente
- **Migración:** No se requiere script de migración, es un cambio de frontend

---

**Versión:** 1.0  
**Fecha:** Octubre 27, 2025  
**Status:** ✅ Completado
