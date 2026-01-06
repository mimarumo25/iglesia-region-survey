# 🔍 Diagnóstico: Tipos de Disposición de Basura No Se Carga al Editar

## 🎯 Problema
Al editar una encuesta existente, el campo "Tipos de Disposición de Basura" no carga los valores guardados.

## ✅ Cambios Realizados

### 1. Simplificación del Transformador (`src/utils/encuestaToFormTransformer.ts`)

**Antes:**
```typescript
// ❌ Búsqueda por texto (propenso a errores)
disposicion_basura: (() => {
  const basuraArray: string[] = [];
  if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recolector'))) {
    basuraArray.push('1');
  }
  // ... más búsquedas de texto
  return basuraArray;
})(),
```

**Ahora:**
```typescript
// ✅ Usa directamente los IDs de la BD
disposicion_basura: encuesta.basuras && Array.isArray(encuesta.basuras) 
  ? encuesta.basuras.map(b => String(b.id)) 
  : [],
```

### 2. Debug Agregado en Componente (`src/components/survey/StandardFormField.tsx`)

Se agregó logging detallado para monitorear:
```typescript
if (field.id === 'disposicion_basura') {
  console.log(`🗑️ [disposicion_basura]`, {
    value: value,                    // Valor del formulario
    selectedValues: selectedAutoValues, // Array parseado
    availableOptions: autocompleteOptions?.length, // Opciones disponibles
    firstOption: autocompleteOptions?.[0], // Primera opción
    matchingOptions: // Opciones que coinciden con el valor
  });
}
```

## 🧪 Cómo Diagnosticar el Problema

### Paso 1: Abrir DevTools
1. Abre la encuesta para editar
2. Presiona F12 para abrir Developer Tools
3. Ve a la pestaña **Console**

### Paso 2: Buscar los Logs

Busca logs con estos patrones:

#### 🔄 Transformación de la Encuesta
```
🔄 Transformando encuesta a formulario
📥 Datos de entrada:
  basuras: [Array]
  basuras_ids: [
    { id: "1", nombre: "Recolección municipal" },
    { id: "3", nombre: "Incineración" },
    ...
  ]
```

Verifica que `basuras_ids` NO esté vacío. Si está vacío, el problema está en el API.

#### 📤 Resultado de la Transformación
```
📤 Resultado de la transformación:
  formData:
    disposicion_basura: ['1', '3', '5']  // ✅ Debe tener IDs
    ...
```

Verifica que `disposicion_basura` sea un array con IDs string. Si está vacío `[]`, el problema está en el transformador.

#### 🗑️ Renderización del Campo
```
🗑️ [disposicion_basura]
{
  value: ['1', '3', '5'],              // Valor del formulario
  selectedValues: ['1', '3', '5'],     // Array parseado
  availableOptions: 6,                 // Cantidad de opciones disponibles
  firstOption: {                        // Primera opción
    value: "1",
    label: "Recolección municipal"
  },
  matchingOptions: [                   // Opciones que coinciden
    { value: "1", label: "..." },
    { value: "3", label: "..." },
    ...
  ]
}
```

## 🐛 Posibles Causas y Soluciones

### Causa 1: API devuelve `basuras` vacío
**Síntomas:**
- El log `📥 Datos de entrada` muestra `basuras: []`
- El campo `basuras_ids` está vacío

**Solución:**
- Verificar que la BD tenga registros de disposición de basura para esta encuesta
- Verificar que la API esté devolviendo correctamente los datos
- Ejecutar: `console.log(response.data)` en el API para ver la estructura

### Causa 2: IDs no coinciden entre API y opciones
**Síntomas:**
- El log `📤 Resultado` muestra `disposicion_basura: ['1', '3', '5']`
- El log `🗑️ [disposicion_basura]` muestra `matchingOptions: []` (vacío)

**Solución:**
- Los IDs en la BD no coinciden con los IDs en `disposicionBasuraOptions`
- Verificar que los IDs que devuelve el API sean los mismos que en la tabla de configuración
- Ejecutar en consola:
  ```javascript
  // Ver qué opciones está mostrando
  console.log(configurationData.disposicionBasuraOptions);
  // Debe mostrar: [{ value: "1", label: "..." }, ...]
  ```

### Causa 3: Transformador devuelve array vacío
**Síntomas:**
- El log `📤 Resultado` muestra `disposicion_basura: []`
- El log `📥 Datos` muestra `basuras: [Array]` (NO está vacío)

**Solución:**
- El problema está en la lógica de transformación
- Verificar que `encuesta.basuras` sea un array
- Verificar que cada objeto tenga una propiedad `id`

---

## 📊 Tabla de Diagnóstico Rápido

| Escenario | Síntoma | Causa Probable | Solución |
|-----------|---------|----------------|----------|
| Basuras vacío en API | `basuras: []` en log | BD sin datos | Verificar BD |
| IDs no coinciden | `matchingOptions: []` | IDs desfasados | Sincronizar IDs |
| Transformador falla | `disposicion_basura: []` | Lógica transformación | Revisar transformador |
| Opciones cargadas mal | `availableOptions: 0` | Hook configuración | Revisar useConfigurationData |

---

## 🔧 Pasos Adicionales para Debug

### 1. Verificar estructura de `encuesta.basuras`
En el navegador, ejecuta:
```javascript
// En SurveyForm o StandardFormField
console.log('Estructura de basuras:', {
  basuras: formData.basuras,
  disposicion_basura: formData.disposicion_basura,
  autocompleteOptions: autocompleteOptions
});
```

### 2. Verificar opciones disponibles
```javascript
// Ver todas las opciones de disposición
const options = configurationData.disposicionBasuraOptions;
console.log('Opciones disponibles:', options);
console.log('IDs en opciones:', options.map(o => o.value));
```

### 3. Verificar matching manual
```javascript
const selectedIds = ['1', '3', '5'];
const allOptions = configurationData.disposicionBasuraOptions;
const matching = allOptions.filter(opt => selectedIds.includes(opt.value));
console.log('Opciones que deberían estar seleccionadas:', matching);
```

---

## 📌 Notas Técnicas

### Flujo de Datos

1. **API devuelve:**
   ```typescript
   {
     basuras: [
       { id: '1', nombre: 'Recolección municipal' },
       { id: '3', nombre: 'Incineración' }
     ]
   }
   ```

2. **Transformador convierte a:**
   ```typescript
   {
     disposicion_basura: ['1', '3']  // Array de IDs string
   }
   ```

3. **StandardFormField renderiza:**
   - Lee `value = ['1', '3']`
   - Para cada opción en `autocompleteOptions`
   - Marca como checked si `value.includes(option.value)`

### Estructura de Opciones

Las opciones deben tener esta estructura:
```typescript
{
  value: string;      // ID (debe coincidir con BD)
  label: string;      // Descripción
  description?: string;
  category?: string;
  popular?: boolean;
}
```

---

## 🚀 Próximos Pasos

1. **Ejecuta los logs** y comparte la salida en consola
2. **Verifica el escenario** según la tabla de diagnóstico
3. **Si aún hay problema**, proporciona:
   - Captura de pantalla de los logs en consola
   - Respuesta del API cuando se carga la encuesta
   - Estructura de `configurationData.disposicionBasuraOptions`

---

**Última actualización:** 23/12/2024
**Status:** ✅ Cambios implementados - Listo para diagnóstico
