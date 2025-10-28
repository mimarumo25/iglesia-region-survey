# 🔧 Corrección: Campos Faltantes en Guardado de JSON

## 📋 Problema Identificado

Los campos **vereda**, **sector**, **corregimiento** y **centro_poblado** no se estaban guardando correctamente en el JSON del borrador cuando se completaba el formulario de encuesta.

## 🎯 Causa Raíz

1. **En `SurveySessionData` (types)**: Los campos `corregimiento` y `centro_poblado` no estaban definidos en la interfaz
2. **En `sessionDataTransformer.ts`**: No se transformaban ni guardaban estos campos
3. **En `SurveyForm.tsx` (recuperación)**: No se recuperaban estos campos al cargar un borrador guardado
4. **En `encuestaToFormTransformer.ts`**: No se mapeaban estos campos cuando se cargaba una encuesta para editar

## ✅ Soluciones Implementadas

### 1. Actualizar Tipos (`src/types/survey.ts`)
```typescript
// Agregar estos campos a SurveySessionData.informacionGeneral:
corregimiento: ConfigurationItem | null;
centro_poblado: ConfigurationItem | null;
```

### 2. Actualizar Transformador (`src/utils/sessionDataTransformer.ts`)
```typescript
// Guardar los datos dinámicos con su objeto completo
corregimiento: formData.corregimiento_data || null,
centro_poblado: formData.centro_poblado_data || null,
// También agregar comunionEnCasa que faltaba
comunionEnCasa: stringToBoolean(formData.comunionEnCasa),
```

### 3. Mejorar `handleFieldChange` en SurveyForm (`src/components/SurveyForm.tsx`)
```typescript
// Cuando el usuario selecciona corregimiento o centro_poblado,
// guardar no solo el ID sino también el objeto completo con {id, nombre}
if (fieldId === 'corregimiento') {
  const corregimientoObj = dinamicCorregimientoOptions.find(opt => opt.value === value);
  if (corregimientoObj) {
    updated.corregimiento_data = { id: corregimientoObj.value, nombre: corregimientoObj.label };
  }
}
```

### 4. Recuperación de Borrador (`src/components/SurveyForm.tsx`)
```typescript
// Agregar al recuperar del localStorage:
corregimiento: draftData.informacionGeneral.corregimiento?.id || '',
centro_poblado: draftData.informacionGeneral.centro_poblado?.id || '',
corregimiento_data: draftData.informacionGeneral.corregimiento || null,
centro_poblado_data: draftData.informacionGeneral.centro_poblado || null,
```

### 5. Transformador de Encuesta (`src/utils/encuestaToFormTransformer.ts`)
```typescript
// En ambas transformaciones (EncuestaListItem y EncuestaCompleta):
corregimiento: (encuesta as any)?.corregimiento?.id || '',
centro_poblado: (encuesta as any)?.centro_poblado?.id || '',
corregimiento_data: (encuesta as any)?.corregimiento || null,
centro_poblado_data: (encuesta as any)?.centro_poblado || null,
```

### 6. Corregir Campo `enfermedades` en Transformador
- Cambiar de `enfermedad: null` a `enfermedades: []` (array) para cumplir con FamilyMember interface

## 📊 Estructura de Guardado (Ejemplo JSON)

Ahora el JSON guardará correctamente:

```json
{
  "informacionGeneral": {
    "municipio": { "id": "123", "nombre": "Medellín" },
    "parroquia": { "id": "456", "nombre": "San Alonso" },
    "sector": { "id": "789", "nombre": "Centro" },
    "vereda": { "id": "101", "nombre": "La Mesa" },
    "corregimiento": { "id": "202", "nombre": "San Sebastián" },
    "centro_poblado": { "id": "303", "nombre": "El Pesebre" },
    "fecha": "2025-10-24",
    "apellido_familiar": "García López",
    "direccion": "Calle 50 # 35-20"
  }
}
```

## 🧪 Cómo Verificar

1. **Abrir formulario de encuesta**
2. **Completar el Stage 1** con todos los campos incluyendo:
   - ✅ Municipio
   - ✅ Parroquia
   - ✅ Sector
   - ✅ Vereda
   - ✅ Corregimiento (nuevo)
   - ✅ Centro Poblado (nuevo)
3. **Navegar a otra etapa** (se guarda automáticamente)
4. **Abrir consola del navegador** (F12 → Console)
5. **Ver el JSON guardado**:
   ```javascript
   JSON.parse(localStorage.getItem('parish-survey-draft'))
   ```
6. **Verificar que todos los campos estén presentes** con id y nombre

## 🔄 Flujos Afectados

### Nuevo Formulario (Borrador)
- ✅ Guardado automático → JSON con todos los campos
- ✅ Recuperación al recargar → Se cargan todos los campos
- ✅ Envío → API recibe estructura completa

### Edición de Encuesta Existente
- ✅ Carga desde API → Se mapean todos los campos
- ✅ Modificación → Se guardan correctamente
- ✅ Guardado → JSON completo con cambios

## 📝 Notas Técnicas

- `corregimiento` y `centro_poblado` se cargan **dinámicamente** según el municipio seleccionado
- Se guardan tanto el **ID** como los datos completos `{id, nombre}` para flexibilidad en el transformador
- Los campos son **opcionales** (no requeridos) en el formulario Stage 1
- Compatible con estructura antigua de formularios (fallback a legacy si es necesario)

## 🚀 Estado

✅ **Compilación**: Exitosa  
✅ **Errores de TypeScript**: Corregidos  
✅ **Pruebas de Build**: Pasadas  

Listo para testing en navegador.
