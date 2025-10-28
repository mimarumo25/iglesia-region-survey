# 🔍 Cambios Exactos en el Código

## 📄 Archivo 1: `src/components/SurveyForm.tsx`

### Cambio 1.1: Mapeo en handleFieldChange (línea ~318)

**Ubicación**: handleFieldChange function, después de la lógica de centro_poblado

**Código agregado**:
```typescript
} else if (fieldId === 'disposicion_basura') {
  // disposicion_basura es un array de IDs que debe mapearse a booleanos individuales
  // Mapeo de ID de tipo disposición a campo de formData:
  // '1' (Recolección) → basuras_recolector
  // '2' (Empresa) → basuras_recolector
  // '3' (Incineración) → basuras_quemada
  // '4' (Enterrado) → basuras_enterrada
  // '5' (Botadero) → basuras_aire_libre
  // '6' (Reciclaje) → basuras_recicla
  const selectedIds = Array.isArray(value) ? value : [];
  
  // Resetear todos los campos de basura a false primero
  updated.basuras_recolector = false;
  updated.basuras_quemada = false;
  updated.basuras_enterrada = false;
  updated.basuras_recicla = false;
  updated.basuras_aire_libre = false;
  updated.basuras_no_aplica = false;
  
  // Luego mapear cada ID seleccionado al boolean correspondiente
  selectedIds.forEach((id: string) => {
    if (id === '1' || id === '2') {
      updated.basuras_recolector = true;
    } else if (id === '3') {
      updated.basuras_quemada = true;
    } else if (id === '4') {
      updated.basuras_enterrada = true;
    } else if (id === '6') {
      updated.basuras_recicla = true;
    } else if (id === '5') {
      updated.basuras_aire_libre = true;
    }
    // Nota: no_aplica se maneja como un tipo de disposición específico si lo tiene ID propio
  });
```

**Nota**: Este bloque se inserta después del bloque `centro_poblado` y antes del cierre de `setFormData`.

---

### Cambio 1.2: Recuperación del Draft (línea ~216)

**Ubicación**: loadDraft effect, dentro del bloque de legacyFormData, después de aguas_residuales

**Código agregado**:
```typescript
// Reconstruir el array de disposicion_basura a partir de los booleanos
const disposicionBasuraArray: string[] = [];
const basuras = draftData.vivienda.disposicion_basuras;
if (basuras.recolector) {
  disposicionBasuraArray.push('1'); // Recolección municipal
}
if (basuras.quemada) {
  disposicionBasuraArray.push('3'); // Incineración
}
if (basuras.enterrada) {
  disposicionBasuraArray.push('4'); // Enterrado
}
if (basuras.recicla) {
  disposicionBasuraArray.push('6'); // Reciclaje
}
if (basuras.aire_libre) {
  disposicionBasuraArray.push('5'); // Botadero
}
// Nota: no_aplica no tiene un ID específico en el array actual

legacyFormData.disposicion_basura = disposicionBasuraArray;
```

**Nota**: Este código se inserta inmediatamente después de definir la variable `legacyFormData` y antes de `setFormData(legacyFormData)`.

---

## 📄 Archivo 2: `src/utils/encuestaToFormTransformer.ts`

### Cambio 2.1: transformEncuestaListItemToFormData (línea ~65)

**Ubicación**: Línea 65-72 (después de basuras_no_aplica)

**Código reemplazado**:
```typescript
// ANTES (no incluía disposicion_basura):
// Disposición de basuras - transformar array a booleans individuales
basuras_recolector: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recolector')) || false,
basuras_quemada: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('quemada')) || false,
basuras_enterrada: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('enterrada')) || false,
basuras_recicla: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recicla')) || false,
basuras_aire_libre: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('aire libre')) || false,
basuras_no_aplica: encuesta.basuras?.length === 0 || false,

// Servicios de agua
```

**DESPUÉS (ahora incluye disposicion_basura)**:
```typescript
// Disposición de basuras - transformar array a booleans individuales
basuras_recolector: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recolector')) || false,
basuras_quemada: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('quemada')) || false,
basuras_enterrada: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('enterrada')) || false,
basuras_recicla: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recicla')) || false,
basuras_aire_libre: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('aire libre')) || false,
basuras_no_aplica: encuesta.basuras?.length === 0 || false,

// Reconstruir el array disposicion_basura a partir de los booleanos
disposicion_basura: (() => {
  const basuraArray: string[] = [];
  if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recolector'))) {
    basuraArray.push('1'); // Recolección municipal
  }
  if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('quemada'))) {
    basuraArray.push('3'); // Incineración
  }
  if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('enterrada'))) {
    basuraArray.push('4'); // Enterrado
  }
  if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recicla'))) {
    basuraArray.push('6'); // Reciclaje
  }
  if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('aire libre'))) {
    basuraArray.push('5'); // Botadero
  }
  return basuraArray;
})(),

// Servicios de agua
```

---

### Cambio 2.2: transformEncuestaCompletaToFormData (línea ~200)

**Ubicación**: Línea 200-205 (después de basuras_no_aplica)

**Código reemplazado**:
```typescript
// ANTES (no incluía disposicion_basura):
// Disposición de basuras - extraer de vivienda
basuras_recolector: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('recolector') || false,
basuras_quemada: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('quemada') || false,
basuras_enterrada: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('enterrada') || false,
basuras_recicla: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('recicla') || false,
basuras_aire_libre: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('aire libre') || false,
basuras_no_aplica: !encuesta.vivienda?.manejo_residuos,

// Servicios de agua
```

**DESPUÉS (ahora incluye disposicion_basura)**:
```typescript
// Disposición de basuras - extraer de vivienda
basuras_recolector: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('recolector') || false,
basuras_quemada: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('quemada') || false,
basuras_enterrada: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('enterrada') || false,
basuras_recicla: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('recicla') || false,
basuras_aire_libre: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('aire libre') || false,
basuras_no_aplica: !encuesta.vivienda?.manejo_residuos,

// Reconstruir el array disposicion_basura a partir del campo manejo_residuos
disposicion_basura: (() => {
  const basuraArray: string[] = [];
  const residuos = encuesta.vivienda?.manejo_residuos?.toLowerCase() || '';
  if (residuos.includes('recolector')) {
    basuraArray.push('1'); // Recolección municipal
  }
  if (residuos.includes('quemada')) {
    basuraArray.push('3'); // Incineración
  }
  if (residuos.includes('enterrada')) {
    basuraArray.push('4'); // Enterrado
  }
  if (residuos.includes('recicla')) {
    basuraArray.push('6'); // Reciclaje
  }
  if (residuos.includes('aire libre')) {
    basuraArray.push('5'); // Botadero
  }
  return basuraArray;
})(),

// Servicios de agua
```

---

## 📊 Resumen de Cambios

| Archivo | Función | Línea | Tipo | Descripción |
|---------|---------|-------|------|------------|
| SurveyForm.tsx | handleFieldChange | ~350 | Agregar | Mapeo de IDs a booleanos |
| SurveyForm.tsx | loadDraft | ~220 | Agregar | Reconstrucción de array |
| encuestaToFormTransformer.ts | transformEncuestaListItemToFormData | ~75 | Modificar | Agregar disposicion_basura |
| encuestaToFormTransformer.ts | transformEncuestaCompletaToFormData | ~225 | Modificar | Agregar disposicion_basura |

---

## 🔗 Flujo Completo de Ejecución

```
1. Usuario selecciona checkboxes
   ↓
2. StandardFormField emite ['1', '3', '4']
   ↓
3. handleFieldChange() intercepta
   → Mapea a: basuras_recolector=true, basuras_quemada=true, basuras_enterrada=true
   ↓
4. Guardado automático en localStorage
   → sessionDataTransformer.ts convierte a SurveySessionData
   → disposicion_basuras: { recolector: true, quemada: true, enterrada: true, ... }
   ↓
5. Usuario recarga página
   → loadDraft() recupera SurveySessionData
   → Reconstruye disposicion_basura: ['1', '3', '4']
   → StandardFormField restaura checkboxes
   ↓
6. Usuario edita encuesta existente
   → encuestaToFormTransformer.ts transforma API response
   → Reconstruye disposicion_basura: ['1', '3', '4']
   → StandardFormField restaura checkboxes
```

---

## ✅ Validación

### Antes de los cambios:
```bash
npm run build
# ✓ Sin errores de TypeScript (pero lógica rota)
```

### Después de los cambios:
```bash
npm run build
# ✓ 3517 modules transformed
# ✓ built in 9.43s
# ✓ Sin errores
```

---

## 🎯 Testing Manual Recomendado

1. **Seleccionar opciones**
   - Abrir formulario
   - Ir a Etapa 2
   - Seleccionar: Recolección, Incineración, Enterrado
   - Verificar localStorage

2. **Recuperar draft**
   - Recargar F5
   - Verificar que checkboxes se mantienen

3. **Navegar etapas**
   - Ir a Etapa 3
   - Volver a Etapa 2
   - Verificar que checkboxes están ahí

4. **Enviar formulario**
   - Completar todo
   - Enviar
   - Verificar Network tab que JSON es correcto

---

**Cambios Totales**: 3 archivos modificados, 4 secciones de código
**Líneas Agregadas**: ~50 líneas de mapeo y reconstrucción
**Compilación**: ✅ Exitosa
