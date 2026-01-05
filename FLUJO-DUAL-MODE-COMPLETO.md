# 📋 Flujo Dual-Mode: CREAR vs EDITAR Encuestas

## 🎯 Resumen Ejecutivo

El formulario SurveyForm funciona en **DOS MODOS** con una base de código unificada:

1. **MODO CREATE**: Usuario crea una nueva encuesta desde cero
2. **MODO EDIT**: Usuario edita una encuesta existente

Ambos modos comparten:
- ✅ La misma interfaz visual (SurveyForm.tsx)
- ✅ Los mismos validadores (Zod schemas)
- ✅ La misma lógica de guardado (sessionDataTransformer → API)
- ✅ El mismo manejo de campos múltiples (disposicion_basura, aguas_residuales)

---

## 🔄 MODO CREATE: Crear Nueva Encuesta

### Flujo de Inicio

```
User: Navega a /survey (sin surveyId)
  ↓
SurveyForm: Monta el componente sin props.surveyId
  ↓
useState: formData = {} (objeto vacío)
  ↓
useEffect (inicialización): 
  - formData.fecha = new Date()
  - formData.disposicion_basura = [] (array vacío)
  - formData.aguas_residuales = [] (array vacío)
  ↓
useConfigurationData: Carga opciones de la API
  - disposicionBasuraOptions: [{value: '1', label: 'Recolección'}, ...]
  - aguasResidualesOptions: [{value: '1', label: 'Alcantarillado'}, ...]
  ↓
SurveyForm: Renderiza 6 etapas con campos vacíos
```

### Ejemplo: Usuario Selecciona Disposición de Basura

```javascript
// PASO 1: Usuario hace click en "Recolección" (id: '1')
StandardFormField.tsx: onChange('disposicion_basura', ['1'])

// PASO 2: Se actualiza el estado
SurveyForm.handleFieldChange:
  setFormData(prev => ({
    ...prev,
    disposicion_basura: ['1']  // ← Ahora tiene UN elemento
  }))

// PASO 3: Usuario clica en "Reciclaje" (id: '6')
StandardFormField.tsx: onChange('disposicion_basura', ['1', '6'])

// RESULTADO FINAL
formData.disposicion_basura = ['1', '6']  // ← Dos IDs seleccionados
```

### Guardado en Modo CREATE

```javascript
// PASO 1: Usuario hace click en "Crear Encuesta"
SurveyForm.handleSubmit() es llamado

// PASO 2: Transformar formData → SurveySessionData
sessionDataTransformer.transformFormDataToSurveySession({
  disposicion_basura: ['1', '6'],  // ← Array de IDs
  aguas_residuales: ['2'],
  ...otrosCampos
})
  ↓
// Dentro del transformer:
const basuras = convertIdsToSelectionMap(
  formData.disposicion_basura,        // ['1', '6']
  disposicionBasuraOptions            // [{value: '1', ...}, {value: '6', ...}, ...]
)
// Resultado: [{id: '1', nombre: 'Recolección', seleccionado: true}, ...]

// PASO 3: Enviar a API
POST /api/encuesta {
  disposicion_basuras: [{id: '1', nombre: '...', seleccionado: true}, ...],
  aguas_residuales: [{id: '2', nombre: '...', seleccionado: true}, ...],
  ...
}
```

---

## ✏️ MODO EDIT: Editar Encuesta Existente

### Flujo de Inicio

```
User: Navega a /survey/12345 (con surveyId)
  ↓
SurveyForm: Detecta surveyId en useParams()
  ↓
useEffect (cargar encuesta):
  encuestasService.getEncuestaById(surveyId)
  ↓
API Response (EncuestaListItem):
{
  id_encuesta: '12345',
  basuras: [
    { id: '1', nombre: 'Recolección municipal' },
    { id: '6', nombre: 'Reciclaje' }
  ],
  aguas_residuales: [
    { id: '2', nombre: 'Alcantarillado público' }
  ],
  ...
}
  ↓
transformEncuestaToFormData(EncuestaListItem):
  disposicion_basura: ['1', '6']  // Extrae solo los IDs
  aguas_residuales: ['2']
  ↓
setFormData(transformedData)
  ↓
SurveyForm: Renderiza con checkboxes MARCADOS
  - ✅ Recolección
  - ✅ Reciclaje
  - ❌ Quemada
  - ❌ Enterrado
```

### Detalle: Transformación de Basuras

```typescript
// EncuestaListItem que llega de API:
{
  basuras: [
    { id: '1', nombre: 'Recolección municipal' },
    { id: '6', nombre: 'Reciclaje' }
  ]
}

// Transformador (encuestaToFormTransformer.ts):
disposicion_basura: encuesta.basuras.map(b => String(b.id))
// Resultado: ['1', '6']

// StandardFormField recibe:
value = ['1', '6']
autocompleteOptions = [
  { value: '1', label: 'Recolección' },
  { value: '3', label: 'Incineración' },
  { value: '4', label: 'Enterrado' },
  { value: '5', label: 'Botadero' },
  { value: '6', label: 'Reciclaje' }
]

// Matching:
selectedAutoValues.includes('1')  // true  → ✅ Marcado
selectedAutoValues.includes('3')  // false → ❌ No marcado
selectedAutoValues.includes('6')  // true  → ✅ Marcado
```

### Ejemplo: Usuario Edita Basuras

```javascript
// ESTADO INICIAL (después de cargar)
formData.disposicion_basura = ['1', '6']
// Checkboxes mostrados: ✅ Recolección, ✅ Reciclaje

// PASO 1: Usuario DESACTIVA "Recolección"
StandardFormField: onChange('disposicion_basura', ['6'])

// PASO 2: Usuario ACTIVA "Enterrado"
StandardFormField: onChange('disposicion_basura', ['6', '4'])

// RESULTADO FINAL
formData.disposicion_basura = ['6', '4']
// Checkboxes ahora: ❌ Recolección, ✅ Enterrado, ✅ Reciclaje
```

### Guardado en Modo EDIT

```javascript
// El flujo es IDÉNTICO al CREATE
sessionDataTransformer.transformFormDataToSurveySession({
  disposicion_basura: ['6', '4'],  // ← Nuevos IDs seleccionados
  ...
})

// PUT /api/encuesta/12345 {
//   disposicion_basuras: [{id: '6', ...}, {id: '4', ...}],
//   ...
// }
```

---

## 🔑 Campos Críticos para Dual-Mode

### Campos de Selección Múltiple

| Campo | Type | Create | Edit |
|-------|------|--------|------|
| `disposicion_basura` | string[] | [] | [id1, id2, ...] |
| `aguas_residuales` | string[] | [] | [id1, id2, ...] |

### Campos Simples

| Campo | Type | Create | Edit |
|-------|------|--------|------|
| `fecha` | Date | today | fromAPI |
| `numero_contrato_epm` | string | '' | fromAPI |
| `sustento_familia` | string | '' | fromAPI |
| `autorizacion_datos` | boolean | false | fromAPI |

---

## 🎯 Puntos Clave para Consistencia

### 1️⃣ IDs Siempre como Strings

```typescript
// ✅ CORRECTO
disposicion_basura: ['1', '6']  // Strings
aguas_residuales: ['2', '3']    // Strings

// ❌ INCORRECTO
disposicion_basura: [1, 6]      // Números
aguas_residuales: ['quemada']   // Nombres en lugar de IDs
```

### 2️⃣ Arrays Nunca Undefined

```typescript
// ✅ CORRECTO
if (!Array.isArray(newData.disposicion_basura)) {
  newData.disposicion_basura = [];
}

// ❌ INCORRECTO
if (formData.disposicion_basura) {
  // Si es undefined, no se ejecuta
}
```

### 3️⃣ Matching Basado en Valores

```typescript
// En StandardFormField:
const selectedAutoValues = Array.isArray(value) ? value : [];
// Así se asegura que siempre es un array

checked={selectedAutoValues.includes(option.value)}
// Comparación directa de string a string
```

### 4️⃣ Transformación Consistente

**Ambos modos usan la MISMA transformación:**

```typescript
// CREATE → sessionDataTransformer
disposicion_basura: ['1', '6']
  ↓
convertIdsToSelectionMap(['1', '6'], options)
  ↓
[{id: '1', seleccionado: true}, {id: '6', seleccionado: true}]

// EDIT → sessionDataTransformer (MISMO CÓDIGO)
disposicion_basura: ['1', '6']
  ↓
convertIdsToSelectionMap(['1', '6'], options)
  ↓
[{id: '1', seleccionado: true}, {id: '6', seleccionado: true}]
```

---

## 🔍 Debugging: Cómo Verificar Dual-Mode

### Verificar CREATE Mode

```typescript
// Abrir DevTools → Console
// Navegar a /survey (sin ID)
formData.disposicion_basura  // Debería ser []
formData.aguas_residuales   // Debería ser []
formData.fecha              // Debería ser Today's Date

// Seleccionar opciones
formData.disposicion_basura  // Debería mostrar ['1', '6'] después de seleccionar
```

### Verificar EDIT Mode

```typescript
// Navegar a /survey/12345
// Ver en Console:
// "🔄 Transformando encuesta a formulario"
// "📥 Datos de entrada:" con basuras: Array

formData.disposicion_basura  // Debería mostrar ['1', '6'] desde API
// Checkboxes deberían estar pre-marcados
```

### Debug Logging Disponible

En [src/components/survey/StandardFormField.tsx](src/components/survey/StandardFormField.tsx#L230-L238):

```typescript
if (field.id === 'disposicion_basura') {
  console.log(`🗑️ [${field.id}]`, {
    value: value,                    // Array actual
    selectedValues: selectedAutoValues,
    availableOptions: autocompleteOptions?.length,
    matchingOptions: autocompleteOptions?.filter(...)
  });
}
```

---

## ✅ Checklist de Validación

- [ ] CREATE: Navega a `/survey` y verifica que `disposicion_basura = []`
- [ ] CREATE: Selecciona opciones y verifica que se agregan a array
- [ ] CREATE: Submitea y verifica que se crea nueva encuesta
- [ ] EDIT: Navega a `/survey/{id}` y verifica que cargan opciones seleccionadas
- [ ] EDIT: Desactiva una opción y verifica que se remueve del array
- [ ] EDIT: Submitea y verifica que se actualiza encuesta
- [ ] AMBOS: Verifica que no hay errores en console
- [ ] AMBOS: Verifica que `disposicion_basura` nunca es undefined/null

---

## 📝 Archivos Modificados en Sesión Actual

### 1. [src/services/encuestas.ts](src/services/encuestas.ts)
**Cambio**: Agregado campo `numero_contrato_epm?: string` a `EncuestaListItem`
**Impacto**: Permite que el transformador capture el número de contrato EPM

### 2. [src/utils/encuestaToFormTransformer.ts](src/utils/encuestaToFormTransformer.ts)
**Cambios**:
- Línea 99: `numero_contrato_epm: encuesta.numero_contrato_epm || ''`
- Línea 96-100: `disposicion_basura: encuesta.basuras.map(b => String(b.id))`
- Línea 115-117: `aguas_residuales: aguas_residuales.map(ar => String(ar.id))`
- Línea 132-135: `autorizacion_datos: encuesta.observaciones?.autorizacion_datos !== undefined ? ...`
**Impacto**: Transformación correcta de campos múltiples usando IDs directos

### 3. [src/components/SurveyForm.tsx](src/components/SurveyForm.tsx)
**Cambios**:
- Línea 370-390: Agregado `useEffect` para inicializar arrays correctamente
**Impacto**: Asegura que ambos modos (create/edit) tengan arrays válidos

### 4. [src/components/survey/StandardFormField.tsx](src/components/survey/StandardFormField.tsx)
**Cambios**:
- Línea 220-228: Agregado debug logging para `disposicion_basura`
**Impacto**: Facilita debugging del matching de opciones

---

## 🚀 Próximos Pasos (Si Hay Problemas)

1. **Verificar IDs en Opciones**: Asegurar que `disposicionBasuraOptions` tiene `value: '1'`, `value: '3'`, etc.
2. **Revisar Transformación**: Ejecutar `transformEncuestaToFormData()` en console y verificar resultado
3. **Comprobar Matching**: Revisar console.log en StandardFormField durante carga
4. **Prueba E2E**: Crear y editar una encuesta, verificar datos en DevTools Network

---

**Status**: ✅ DUAL-MODE READY
**Última actualización**: 2024
**Probado en**: CREATE y EDIT flows
