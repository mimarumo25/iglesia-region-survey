# 🧪 GUÍA DE TESTING - ESTRUCTURA DINÁMICA

## ✅ Casos de Prueba

### Caso 1: Seleccionar Opciones en Formulario
**Pasos:**
1. Abrir formulario de encuesta
2. Ir a etapa 2 (Vivienda y Basuras)
3. Marcar múltiples opciones en "Tipos de Disposición de Basura"
   - Ej: Recolección municipal, Reciclaje, Botadero
4. Ir a etapa 3 (Aguas Residuales)
5. Marcar opciones en "Tipos de Aguas Residuales"

**Verificar:**
- ✅ Checkboxes se marcan correctamente
- ✅ Se pueden desmarcar
- ✅ Múltiples selecciones funcionan

**Resultado esperado:** 
```json
{
  "disposicion_basura": ["1", "4", "6"],
  "aguas_residuales": ["2"]
}
```

---

### Caso 2: Debug en Consola
**Pasos:**
1. Abrir DevTools (F12)
2. Ir a Console
3. Ejecutar:
```javascript
// Buscar en storage
const draft = JSON.parse(localStorage.getItem('parish-survey-draft'));
console.log('Disposición de Basuras:', draft.vivienda.disposicion_basuras);
console.log('Aguas Residuales:', draft.servicios_agua.aguas_residuales);
```

**Verificar:**
- ✅ Estructura es array de objetos
- ✅ Cada objeto tiene: {id, nombre, seleccionado}
- ✅ Los nombres son legibles

**Resultado esperado:**
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

---

### Caso 3: Guardar y Cargar (Borrador)
**Pasos:**
1. Seleccionar opciones en disposición de basuras
2. Ir a otra etapa (auto-guardado)
3. Actualizar página (F5)
4. Verificar que se recuperan los datos

**Verificar:**
- ✅ El borrador se guardó
- ✅ Se recuperan correctamente al recargar
- ✅ Las opciones marcadas siguen marcadas

---

### Caso 4: Edición de Encuesta Existente
**Pasos:**
1. Crear una encuesta nueva
2. Seleccionar disposición_basuras: ['1', '3']
3. Seleccionar aguas_residuales: ['2']
4. Guardar/enviar
5. Ir a editar esa encuesta
6. Verificar que las selecciones se cargan

**Verificar:**
- ✅ Los mismos checkboxes están marcados
- ✅ Se puede cambiar la selección
- ✅ Se puede agregar/quitar opciones

---

### Caso 5: Conversión de Datos Helper
**En Console:**
```javascript
// Importar helpers (si están en scope)
import { convertIdsToSelectionMap, convertSelectionMapToIds } from '@/utils/dynamicSelectionHelpers';

// Simular conversión IDs → Objetos
const selectedIds = ['1', '3', '5'];
const selectionMap = convertIdsToSelectionMap(
  selectedIds,
  [
    { value: "1", label: "Recolección municipal" },
    { value: "2", label: "Incineración" },
    { value: "3", label: "Botadero" },
    { value: "4", label: "Reciclaje" },
    { value: "5", label: "Enterrado" },
    { value: "6", label: "Otra" }
  ]
);

console.log('Conversion IDs → Objetos:', selectionMap);

// Simular conversión Objetos → IDs
const backToIds = convertSelectionMapToIds(selectionMap);
console.log('Conversion Objetos → IDs:', backToIds);
```

**Verificar:**
- ✅ `selectionMap` tiene array de objetos
- ✅ Solo `["1", "3", "5"]` tienen `seleccionado: true`
- ✅ `backToIds` retorna `["1", "3", "5"]`

---

### Caso 6: Debug con Función Helper
**En Console:**
```javascript
import { debugSelectionMap } from '@/utils/dynamicSelectionHelpers';

const draft = JSON.parse(localStorage.getItem('parish-survey-draft'));
console.log(debugSelectionMap(draft.vivienda.disposicion_basuras));
```

**Verificar:**
- ✅ Se imprime reporte formateado
- ✅ Muestra total de opciones
- ✅ Muestra total seleccionadas
- ✅ Lista detalles de cada opción

**Output esperado:**
```
📊 REPORTE DE SELECCIÓN DINÁMICA:
  Total de opciones: 6
  Total seleccionadas: 3
  IDs seleccionados: [1, 3, 5]
  Nombres: Recolección municipal, Botadero, Reciclaje
  Detalle completo:
    - 1: "Recolección municipal" = true
    - 2: "Incineración" = false
    - 3: "Botadero" = true
    - 4: "Reciclaje" = false
    - 5: "Enterrado" = true
    - 6: "Otra" = false
```

---

### Caso 7: Comparación de Mapas
**En Console:**
```javascript
import { areSelectionMapsEqual } from '@/utils/dynamicSelectionHelpers';

const map1 = [
  { id: "1", nombre: "A", seleccionado: true },
  { id: "2", nombre: "B", seleccionado: false }
];

const map2 = [
  { id: "1", nombre: "A", seleccionado: true },
  { id: "2", nombre: "B", seleccionado: false }
];

const map3 = [
  { id: "1", nombre: "A", seleccionado: false },
  { id: "2", nombre: "B", seleccionado: true }
];

console.log('map1 === map2:', areSelectionMapsEqual(map1, map2)); // true
console.log('map1 === map3:', areSelectionMapsEqual(map1, map3)); // false
```

---

### Caso 8: Actualización de Item Individual
**En Console:**
```javascript
import { updateSelectionItem } from '@/utils/dynamicSelectionHelpers';

const selectionMap = [
  { id: "1", nombre: "Recolección", seleccionado: false },
  { id: "2", nombre: "Incineración", seleccionado: false },
  { id: "3", nombre: "Botadero", seleccionado: false }
];

// Actualizar item con id "2" a seleccionado=true
const updated = updateSelectionItem(selectionMap, "2", true);
console.log('Mapa actualizado:', updated);
```

**Verificar:**
- ✅ El item con id "2" tiene `seleccionado: true`
- ✅ Los otros mantienen su estado
- ✅ Retorna nuevo array (no muta)

---

## 🔧 Checks de Integración

### Check 1: Tipos TypeScript
```bash
cd iglesia-region-survey
npm run build
# Verificar: No hay errores de tipo
```

**Pasar:**
- ✅ `DynamicSelectionItem` está definido
- ✅ `DynamicSelectionMap` es array de items
- ✅ `SurveySessionData` usa tipos correctos
- ✅ No hay `any` en conversiones

---

### Check 2: Imports Correctos
```bash
grep -r "import.*DynamicSelection" src/
# Verificar que está importado en:
# - SurveyForm.tsx
# - sessionDataTransformer.ts
```

---

### Check 3: Estructura en localStorage
**Pasos:**
1. Abrir DevTools Storage
2. LocalStorage → `parish-survey-draft`
3. Verificar JSON:

```javascript
{
  "version": "2.0",
  "vivienda": {
    "disposicion_basuras": [
      { "id": "...", "nombre": "...", "seleccionado": true/false },
      ...
    ]
  },
  "servicios_agua": {
    "aguas_residuales": [
      { "id": "...", "nombre": "...", "seleccionado": true/false },
      ...
    ]
  }
}
```

---

### Check 4: Carga Desde API
**Pasos:**
1. Abrir encuesta existente (modo edición)
2. DevTools Network
3. Filtrar respuesta de GET `/api/encuestas/{id}`
4. Verificar que `aguas_residuales` tiene estructura esperada

**Esperado:**
- ✅ `aguas_residuales` es array o objeto con `id`/`nombre`
- ✅ Se convierte correctamente a `DynamicSelectionMap`

---

## 🐛 Problemas Comunes

### Problema 1: "disposicion_basura is undefined"
**Causa:** El campo no se inicializa correctamente  
**Solución:**
```javascript
// Verificar en SurveyForm
formData.disposicion_basura = formData.disposicion_basura || [];
```

---

### Problema 2: "Cannot read property 'includes' of undefined"
**Causa:** `selectedIds` no es array  
**Solución:**
```javascript
// En StandardFormField
const selectedAutoValues = Array.isArray(value) ? value : [];
```

---

### Problema 3: "Checkboxes no se marcan al cargar"
**Causa:** IDs no coinciden  
**Solución:**
```javascript
// Verificar que IDs son strings
console.log(typeof selectedIds[0]); // "string"
console.log(typeof option.value);  // "string"
```

---

### Problema 4: "Extra properties not allowed in type"
**Causa:** Estructura de objeto incorrecta  
**Solución:** Verificar que cada item tiene exactamente:
```json
{
  "id": "string",
  "nombre": "string",
  "seleccionado": "boolean"
}
```

---

## 📋 Checklist de Validación Final

- [ ] Seleccionar opciones marca correctamente
- [ ] Deseleccionar opciones desmar ca correctamente
- [ ] Múltiples opciones se pueden seleccionar
- [ ] localStorage guarda estructura correcta
- [ ] Recargar página recupera opciones
- [ ] Editar encuesta carga opciones anteriores
- [ ] API devuelve estructura compatible
- [ ] Conversiones helpers funcionan
- [ ] Debug helper imprime reporte correcto
- [ ] No hay errores en console
- [ ] TypeScript compila sin errores
- [ ] Tests pasan (cuando se implementen)

---

## 🎯 Escenario de Prueba End-to-End

1. **Crear encuesta:**
   - Llenar datos generales
   - Seleccionar: Disposición = [1, 3, 5]
   - Seleccionar: Aguas = [2]
   - Ir a familia
   - Ir a observaciones
   - Aceptar términos
   - Guardar

2. **Verificar guardado:**
   - Check localStorage tiene estructura correcta
   - Check API tiene datos correctos (si se envía)

3. **Editar encuesta:**
   - Abrir modo edición
   - Verificar opciones previas están marcadas
   - Cambiar: Disposición = [2, 4]
   - Cambiar: Aguas = [1, 3]
   - Guardar cambios

4. **Verificar cambios:**
   - Check localStorage actualizado
   - Check se guardaron correctamente

---

**Última actualización:** Octubre 2025  
**Status:** ✅ Listo para pruebas
