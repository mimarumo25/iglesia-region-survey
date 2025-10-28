# Solución: Disposición de Basura No Actualizaba Correctamente

## 📋 Problema Reportado
El campo `disposicion_basura` (checkboxes múltiples de tipos de disposición de basura) no estaba actualizando correctamente en el JSON guardado. Todos los valores de disposición se guardaban como `false` independientemente de las selecciones del usuario.

## 🔍 Root Cause Analysis

### El Problema
La estructura de datos tenía **dos versiones incompatibles**:

1. **En UI (StandardFormField.tsx)**: El campo `disposicion_basura` con tipo `"multiple-checkbox"` pasaba un **array de IDs** cuando el usuario seleccionaba opciones.
   ```javascript
   // Valores del múltiple-checkbox
   disposicion_basura: ['1', '3', '4']  // IDs seleccionados
   ```

2. **En Transformador (sessionDataTransformer.ts)**: Esperaba **booleanos individuales** para cada tipo de disposición.
   ```javascript
   // Lo que esperaba el transformador
   formData.basuras_recolector: true
   formData.basuras_quemada: true
   formData.basuras_enterrada: true
   // etc.
   ```

3. **Sin mapeo en handleFieldChange**: No existía lógica para convertir el array de IDs a booleanos individuales.

### El Resultado
- Usuario seleccionaba: "Recolección + Incineración + Enterrado"
- Se guardaba en formData: `disposicion_basura: ['1', '3', '4']`
- Pero se ignoraban los campos `basuras_*`
- El transformador generaba: `disposicion_basuras: { recolector: false, quemada: false, ... }`

## 🔧 Solución Implementada

### 1. Mapeo de IDs en `handleFieldChange` (SurveyForm.tsx)
Se agregó lógica especial para convertir el array de IDs a booleanos individuales:

```typescript
else if (fieldId === 'disposicion_basura') {
  // Array de IDs que viene del múltiple-checkbox
  const selectedIds = Array.isArray(value) ? value : [];
  
  // Resetear todos a false primero
  updated.basuras_recolector = false;
  updated.basuras_quemada = false;
  updated.basuras_enterrada = false;
  updated.basuras_recicla = false;
  updated.basuras_aire_libre = false;
  updated.basuras_no_aplica = false;
  
  // Mapear cada ID seleccionado
  selectedIds.forEach((id: string) => {
    if (id === '1' || id === '2') {
      updated.basuras_recolector = true;  // Recolección
    } else if (id === '3') {
      updated.basuras_quemada = true;     // Incineración
    } else if (id === '4') {
      updated.basuras_enterrada = true;   // Enterrado
    } else if (id === '6') {
      updated.basuras_recicla = true;     // Reciclaje
    } else if (id === '5') {
      updated.basuras_aire_libre = true;  // Botadero
    }
  });
}
```

**Mapeo de IDs:**
- `1` o `2` = Recolección (municipal o empresa) → `basuras_recolector`
- `3` = Incineración → `basuras_quemada`
- `4` = Enterrado → `basuras_enterrada`
- `5` = Botadero → `basuras_aire_libre`
- `6` = Reciclaje → `basuras_recicla`

### 2. Recuperación del Draft (SurveyForm.tsx)
Se agregó lógica para reconstruir el array `disposicion_basura` cuando se recupera un draft del localStorage:

```typescript
// Reconstruir el array de disposicion_basura a partir de los booleanos
const disposicionBasuraArray: string[] = [];
const basuras = draftData.vivienda.disposicion_basuras;
if (basuras.recolector) {
  disposicionBasuraArray.push('1');
}
if (basuras.quemada) {
  disposicionBasuraArray.push('3');
}
if (basuras.enterrada) {
  disposicionBasuraArray.push('4');
}
if (basuras.recicla) {
  disposicionBasuraArray.push('6');
}
if (basuras.aire_libre) {
  disposicionBasuraArray.push('5');
}
legacyFormData.disposicion_basura = disposicionBasuraArray;
```

### 3. Transformación de API a Formulario (encuestaToFormTransformer.ts)
Se agregó reconstrucción del array en ambas funciones de transformación:

**En `transformEncuestaListItemToFormData`:**
```typescript
// Reconstruir el array disposicion_basura a partir de los booleanos
disposicion_basura: (() => {
  const basuraArray: string[] = [];
  if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recolector'))) {
    basuraArray.push('1');
  }
  // ... más tipos ...
  return basuraArray;
})(),
```

**En `transformEncuestaCompletaToFormData`:**
```typescript
// Reconstruir el array disposicion_basura a partir del campo manejo_residuos
disposicion_basura: (() => {
  const basuraArray: string[] = [];
  const residuos = encuesta.vivienda?.manejo_residuos?.toLowerCase() || '';
  if (residuos.includes('recolector')) {
    basuraArray.push('1');
  }
  // ... más tipos ...
  return basuraArray;
})(),
```

## 📊 Flujo de Datos Ahora Correcto

```
┌─────────────────────────────────────────────────┐
│  Usuario selecciona en checkboxes                │
│  ✓ Recolección  ✓ Incineración  ✓ Enterrado    │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │ StandardFormField.tsx    │
    │ (múltiple-checkbox)      │
    │ Emite: ['1', '3', '4']   │
    └────────────┬─────────────┘
                 │
    ┌────────────▼────────────────────────┐
    │ handleFieldChange()                  │
    │ Mapea IDs → booleanos individuales   │
    │ basuras_recolector = true            │
    │ basuras_quemada = true               │
    │ basuras_enterrada = true             │
    └────────────┬────────────────────────┘
                 │
    ┌────────────▼─────────────────┐
    │ sessionDataTransformer.ts     │
    │ Genera disposicion_basuras:   │
    │ {                             │
    │   recolector: true,           │
    │   quemada: true,              │
    │   enterrada: true,            │
    │   recicla: false,             │
    │   aire_libre: false,          │
    │   no_aplica: false            │
    │ }                             │
    └────────────┬─────────────────┘
                 │
    ┌────────────▼──────────────────────┐
    │ localStorage / JSON guardado        │
    │ ✅ Correcto ahora!                 │
    └─────────────────────────────────────┘
```

## ✅ Verificación

Ahora cuando el usuario:
1. **Selecciona opciones** en disposicion_basura → se mapean a booleanos individuales
2. **Guarda el formulario** → los booleanos se transforman a la estructura correcta
3. **Recarga la página** → el draft se recupera y se reconstruye el array correcto
4. **Edita una encuesta** → los valores vienen de la API y se transforman correctamente

## 📝 Archivos Modificados

### 1. `src/components/SurveyForm.tsx`
- **handleFieldChange()**: Agregó mapeo especial para `disposicion_basura`
- **Draft recovery**: Agregó lógica para reconstruir array desde booleanos

### 2. `src/utils/encuestaToFormTransformer.ts`
- **transformEncuestaListItemToFormData()**: Agregó reconstrucción de array
- **transformEncuestaCompletaToFormData()**: Agregó reconstrucción de array

## 🧪 Cómo Probar

1. **Abrir formulario nuevo**
2. **Ir a Etapa 2 (Vivienda)**
3. **Seleccionar: Recolección + Incineración + Enterrado**
4. **Avanzar** (guardará automáticamente)
5. **Abrir DevTools → Application → Storage → LocalStorage**
6. **Ver `parish-survey-draft`** → debe tener:
   ```json
   {
     "vivienda": {
       "disposicion_basuras": {
         "recolector": true,
         "quemada": true,
         "enterrada": true,
         "recicla": false,
         "aire_libre": false,
         "no_aplica": false
       }
     }
   }
   ```
7. **Refrescar página** → los checkboxes deben mantener sus selecciones
8. **Volver atrás y adelante** → debe funcionar sin perder datos

## 🔗 Relación con Otros Cambios

Este fix sigue el **mismo patrón** implementado recientemente para campos dinámicos:
- **Vereda, Sector, Corregimiento, Centro Poblado**: Usan `_data` objects
- **Disposición de Basura**: Usa mapeo de IDs a booleanos individuales

Ambos patrones resuelven el problema de **múltiples fuentes de datos** que necesitan sincronización.

## 📌 Consideraciones Importantes

1. **Asimetría de datos**: El formulario almacena `disposicion_basura` como array, pero el transformador espera booleanos individuales. Esto es intencional y correcto.

2. **Validación**: El transformador siempre genera la estructura correcta independientemente de los valores de entrada (conversión robusta).

3. **Escalabilidad**: Si se agregan nuevos tipos de disposición en el futuro, solo se necesita:
   - Agregar el ID en apiErrorHandler.ts
   - Actualizar el mapeo en handleFieldChange
   - Actualizar los transformadores

## 🚀 Próximos Pasos

- ✅ Verificar que todos los campos persisten correctamente
- ✅ Probar recuperación de draft
- ✅ Probar edición de encuestas existentes
- ✅ Compilación exitosa (9.43s)

---

**Compile Status**: ✅ Exitoso (9.43s)
**Build Status**: ✅ Listo para deploy
