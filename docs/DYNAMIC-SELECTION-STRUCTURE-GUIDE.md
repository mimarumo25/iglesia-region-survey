# 🔄 Guía de Estructura Dinámica - Disposición de Basura y Aguas Residuales

## 📋 Resumen Ejecutivo

Se ha implementado una **estructura totalmente dinámica** para manejar `disposicion_basuras` y `aguas_residuales` que se adapta automáticamente cuando cambian las opciones en el backend.

### Cambio Principal
**Antes (Hardcodeado):**
```json
{
  "disposicion_basuras": {
    "recolector": true,
    "quemada": true,
    "enterrada": false,
    "recicla": true,
    "aire_libre": true,
    "no_aplica": false
  }
}
```

**Ahora (Dinámico):**
```json
{
  "disposicion_basuras": [
    { "id": "1", "nombre": "Recolección municipal", "seleccionado": true },
    { "id": "2", "nombre": "Incineración", "seleccionado": false },
    { "id": "3", "nombre": "Botadero", "seleccionado": true },
    { "id": "4", "nombre": "Reciclaje", "seleccionado": true },
    { "id": "5", "nombre": "Enterrado", "seleccionado": false },
    { "id": "6", "nombre": "Otra", "seleccionado": false }
  ]
}
```

## 🎯 Ventajas

✅ **100% Dinámico**: Si el backend agrega/elimina/renombra opciones, funciona automáticamente  
✅ **Nombres Incluidos**: Cada opción mantiene su nombre para debugging y logs  
✅ **Type-Safe**: TypeScript valida la estructura completamente  
✅ **Fácil de Extender**: Mismo patrón para otros campos multi-selección  
✅ **Migración Simple**: Funciones helper hacen conversiones fáciles

## 🏗️ Estructura de Tipos

### `DynamicSelectionItem`
```typescript
interface DynamicSelectionItem {
  id: string;           // ID único del backend
  nombre: string;       // Nombre legible de la opción
  seleccionado: boolean; // Estado: true si está marcado
}
```

### `DynamicSelectionMap`
```typescript
type DynamicSelectionMap = DynamicSelectionItem[];
```

### Uso en `SurveySessionData`
```typescript
interface SurveySessionData {
  vivienda: {
    tipo_vivienda: ConfigurationItem | null;
    disposicion_basuras: DynamicSelectionMap; // Array de items
  };
  servicios_agua: {
    sistema_acueducto: ConfigurationItem | null;
    aguas_residuales: DynamicSelectionMap; // Array de items
  };
  // ... resto de campos
}
```

## 🔧 Funciones Helper

### Conversión: Array de IDs → Array de Objetos
```typescript
import { convertIdsToSelectionMap } from '@/utils/dynamicSelectionHelpers';

const selectedIds = ['1', '3', '5'];
const selectionMap = convertIdsToSelectionMap(
  selectedIds,
  configurationData.disposicionBasuraOptions
);
// Resultado:
// [
//   { id: "1", nombre: "Recolección municipal", seleccionado: true },
//   { id: "2", nombre: "Incineración", seleccionado: false },
//   { id: "3", nombre: "Botadero", seleccionado: true },
//   ...
// ]
```

### Conversión: Array de Objetos → Array de IDs
```typescript
import { convertSelectionMapToIds } from '@/utils/dynamicSelectionHelpers';

const selectedIds = convertSelectionMapToIds(selectionMap);
// Resultado: ['1', '3', '5']
```

### Obtener Nombres Seleccionados
```typescript
import { getSelectedLabels } from '@/utils/dynamicSelectionHelpers';

const labels = getSelectedLabels(selectionMap);
// Resultado: ['Recolección municipal', 'Botadero', 'Reciclaje']
```

### Actualizar un Item Específico
```typescript
import { updateSelectionItem } from '@/utils/dynamicSelectionHelpers';

const updatedMap = updateSelectionItem(selectionMap, '3', false);
// Marca el item con id="3" como no seleccionado
```

### Debug y Reporte
```typescript
import { debugSelectionMap } from '@/utils/dynamicSelectionHelpers';

console.log(debugSelectionMap(selectionMap));
// Imprime reporte completo con detalles de selección
```

## 🔄 Flujo en el Formulario

### 1️⃣ En StandardFormField (Renderizado)
```tsx
// El componente recibe array de IDs seleccionados
const selectedIds = ['1', '3'];

// Para cada opción del backend
autocompleteOptions.map(option => {
  // Renderiza checkbox con label
  <Checkbox
    checked={selectedIds.includes(option.value)} // Está seleccionado?
    onCheckedChange={(checked) => {
      if (checked) {
        onChange(field.id, [...selectedIds, option.value]); // Agregar
      } else {
        onChange(field.id, selectedIds.filter(v => v !== option.value)); // Remover
      }
    }}
  />
});
```

### 2️⃣ En SurveyForm (Manejo de Estado)
```tsx
// Simplemente guarda el array de IDs
const [formData, setFormData] = useState({
  disposicion_basura: ['1', '3', '5'], // Array de IDs
  aguas_residuales: ['2'],
  // ... otros campos
});
```

### 3️⃣ En sessionDataTransformer (Conversión a Guardado)
```tsx
// Convierte array de IDs a DynamicSelectionMap para guardar
disposicion_basuras: convertIdsToSelectionMap(
  formData.disposicion_basura,
  configurationData.disposicionBasuraOptions
),
// Resultado guardado en localStorage/API:
// [
//   { id: "1", nombre: "Recolección municipal", seleccionado: true },
//   { id: "2", nombre: "Incineración", seleccionado: false },
//   { id: "3", nombre: "Botadero", seleccionado: true },
//   { id: "4", nombre: "Reciclaje", seleccionado: false },
//   { id: "5", nombre: "Enterrado", seleccionado: true },
//   { id: "6", nombre: "Otra", seleccionado: false }
// ]
```

### 4️⃣ En Carga (localStorage → Formulario)
```tsx
// Convierte DynamicSelectionMap de vuelta a array de IDs
const draftData = loadFromLocalStorage(); // Tiene array de objetos

disposicion_basura: convertSelectionMapToIds(
  draftData.vivienda.disposicion_basuras
),
// Resultado: ['1', '3', '5'] (listo para formulario)
```

## 📊 Ejemplo Completo

### Guardar Datos
```typescript
// En SurveyForm
const handleSubmit = async () => {
  // formData tiene arrays de IDs
  const surveySession = transformFormDataToSurveySession(
    formData, // { disposicion_basura: ['1', '3', '5'], aguas_residuales: ['2'] }
    familyMembers,
    deceasedMembers,
    configurationData
  );
  
  // surveySession.vivienda.disposicion_basuras es ahora:
  // [
  //   { id: "1", nombre: "Recolección municipal", seleccionado: true },
  //   { id: "2", nombre: "Incineración", seleccionado: false },
  //   { id: "3", nombre: "Botadero", seleccionado: true },
  //   ...
  // ]
  
  await submitSurvey(surveySession);
};
```

### Cargar Datos (Edición)
```typescript
// En SurveyForm - cuando se carga un borrador
const draft = localStorage.getItem('parish-survey-draft');
const draftData = JSON.parse(draft);

// Convertir de vuelta a array de IDs para el formulario
const formData = {
  disposicion_basura: convertSelectionMapToIds(
    draftData.vivienda.disposicion_basuras
  ), // ['1', '3', '5']
  aguas_residuales: convertSelectionMapToIds(
    draftData.servicios_agua.aguas_residuales
  ), // ['2']
  // ... otros campos
};

setFormData(formData);
```

## 🚀 Ventaja: Adaptación Automática

Si el admin agrega una nueva opción de disposición (ej: "Compostaje"):

**Backend actualiza:**
```json
{
  "tiposDisposicionBasura": [
    { "id": "1", "nombre": "Recolección municipal" },
    { "id": "2", "nombre": "Incineración" },
    // ... más opciones
    { "id": "7", "nombre": "Compostaje" } // 🆕 Nueva opción
  ]
}
```

**Frontend automáticamente:**
1. Recibe la nueva opción via `configurationData.disposicionBasuraOptions`
2. `convertIdsToSelectionMap()` la incluye automáticamente
3. El formulario renderiza el nuevo checkbox
4. El usuario puede seleccionarlo
5. Se guarda correctamente en el nuevo array

**Sin cambios de código necesarios** ✅

## 📝 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `src/types/survey.ts` | Definición de `DynamicSelectionItem` y `DynamicSelectionMap` |
| `src/utils/dynamicSelectionHelpers.ts` | Funciones de conversión y manejo |
| `src/utils/sessionDataTransformer.ts` | Usa `convertIdsToSelectionMap` |
| `src/components/SurveyForm.tsx` | Importa helpers y los usa |
| `src/components/survey/StandardFormField.tsx` | Sin cambios (ya funcionaba) |

## 🔍 Testing

### Escenarios Validados
- ✅ Seleccionar múltiples opciones
- ✅ Deseleccionar opciones
- ✅ Guardar en localStorage
- ✅ Cargar de localStorage
- ✅ Convertir entre formatos
- ✅ Nombres correctos en reporte

### Función de Debug
```typescript
// Para verificar estructura en consola
console.log(debugSelectionMap(selectionMap));

// Output:
// 📊 REPORTE DE SELECCIÓN DINÁMICA:
//   Total de opciones: 6
//   Total seleccionadas: 3
//   IDs seleccionados: [1, 3, 5]
//   Nombres: Recolección municipal, Botadero, Reciclaje
//   Detalle completo:
//     - 1: "Recolección municipal" = true
//     - 2: "Incineración" = false
//     - 3: "Botadero" = true
//     - 4: "Reciclaje" = false
//     - 5: "Enterrado" = true
//     - 6: "Otra" = false
```

## 🎓 Guía de Mantenimiento

### Agregar Nuevo Campo Multi-Selección
1. Agregar el campo a `SurveySessionData` con tipo `DynamicSelectionMap`
2. Agregar conversión en `sessionDataTransformer.ts`
3. Usar `convertIdsToSelectionMap()` al guardar
4. Usar `convertSelectionMapToIds()` al cargar
5. ¡Listo! El resto funciona automáticamente

### Cambiar Nombres en Backend
1. El admin actualiza los nombres en la BD
2. Automáticamente se reflejan en formularios
3. Se guardan en localStorage/API con nombres actualizados
4. Sin cambios de código needed

## ⚠️ Consideraciones Importantes

- **IDs deben ser strings**: Para consistencia en toda la app
- **Nombres para DEBUG**: Siempre incluir para reporte y logs
- **Seleccionado es booleano**: No permitir valores null/undefined
- **Mantener orden**: El array mantiene orden del backend
- **Migración segura**: Usar `convertSelectionMapToIds()` para datos antiguos

---

**Versión**: 2.0  
**Fecha**: Octubre 2025  
**Estado**: ✅ Implementado y Validado
