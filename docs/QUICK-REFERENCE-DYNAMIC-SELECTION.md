# 🚀 QUICK REFERENCE - ESTRUCTURA DINÁMICA

## 📊 Estructura de Datos

```typescript
// ✅ NUEVA ESTRUCTURA
{
  "disposicion_basuras": [
    { "id": "1", "nombre": "Recolección municipal", "seleccionado": true },
    { "id": "2", "nombre": "Incineración", "seleccionado": false },
    { "id": "3", "nombre": "Botadero", "seleccionado": true }
  ]
}
```

## 🔧 Funciones Principales

### 1. Convertir IDs a Objetos
```typescript
import { convertIdsToSelectionMap } from '@/utils/dynamicSelectionHelpers';

const selectedIds = ['1', '3', '5'];
const map = convertIdsToSelectionMap(selectedIds, backendOptions);
```

### 2. Convertir Objetos a IDs
```typescript
import { convertSelectionMapToIds } from '@/utils/dynamicSelectionHelpers';

const ids = convertSelectionMapToIds(selectionMap);
// Retorna: ['1', '3', '5']
```

### 3. Obtener Nombres Seleccionados
```typescript
import { getSelectedLabels } from '@/utils/dynamicSelectionHelpers';

const labels = getSelectedLabels(selectionMap);
// Retorna: ['Recolección municipal', 'Botadero', 'Reciclaje']
```

### 4. Actualizar un Item
```typescript
import { updateSelectionItem } from '@/utils/dynamicSelectionHelpers';

const updated = updateSelectionItem(map, '3', false); // Desmarcar id "3"
```

### 5. Debug
```typescript
import { debugSelectionMap } from '@/utils/dynamicSelectionHelpers';

console.log(debugSelectionMap(map));
```

## 🔄 Flujo en Componente

```typescript
// 1. Usuario selecciona en formulario
<Checkbox 
  checked={selectedIds.includes(option.value)}
  onChange={(checked) => {
    if (checked) {
      onChange('disposicion_basura', [...selectedIds, option.value]);
    } else {
      onChange('disposicion_basura', selectedIds.filter(v => v !== option.value));
    }
  }}
/>

// 2. formData se actualiza con array de IDs
formData = { 
  disposicion_basura: ['1', '3', '5'],
  ...
}

// 3. Al guardar, se convierte a DynamicSelectionMap
const sessionData = transformFormDataToSurveySession(formData, ...);
// sessionData.vivienda.disposicion_basuras es array de objetos

// 4. Al cargar, se convierte de vuelta a array de IDs
const formData = {
  disposicion_basura: convertSelectionMapToIds(draft.vivienda.disposicion_basuras),
  ...
}
```

## 📋 Tipos

```typescript
interface DynamicSelectionItem {
  id: string;
  nombre: string;
  seleccionado: boolean;
}

type DynamicSelectionMap = DynamicSelectionItem[];
```

## 📁 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/types/survey.ts` | Definición de tipos |
| `src/utils/dynamicSelectionHelpers.ts` | Funciones de conversión |
| `src/utils/sessionDataTransformer.ts` | Transformación al guardar |
| `src/components/survey/StandardFormField.tsx` | Renderizado de checkboxes |
| `src/components/SurveyForm.tsx` | Manejo de estado |

## ✨ Ventajas Clave

✅ **100% Dinámico** - Se adapta a cambios en backend  
✅ **Nombres Incluidos** - Para debugging  
✅ **Type-Safe** - Completamente tipado  
✅ **Extensible** - Mismo patrón para otros campos  
✅ **Documented** - Guías de uso incluidas  

## 🎯 Checklist de Implementación

- [x] Tipos definidos
- [x] Funciones helper creadas
- [x] SessionDataTransformer actualizado
- [x] SurveyForm adaptado
- [x] StandardFormField funciona
- [x] Carga de borradores funciona
- [x] Documentación completa
- [x] Testing completado

## 🔗 Documentación Completa

- **Guía Detallada:** `docs/DYNAMIC-SELECTION-STRUCTURE-GUIDE.md`
- **Resumen Implementación:** `docs/IMPLEMENTATION-SUMMARY-DYNAMIC-SELECTION.md`
- **Testing:** `docs/TESTING-DYNAMIC-SELECTION.md`

---

**Version:** 1.0  
**Status:** ✅ Listo para Uso
