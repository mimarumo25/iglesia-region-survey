# 🗺️ MAPA: Dónde se Transforma el JSON

## 3 Puntos Clave de Transformación

```
FRONTEND (React State)
    ↓
    └─→ formData, familyMembers, deceasedMembers (CON IDs temporales)
        
    ↓ [PUNTO 1: Limpiar IDs Temporales]
    
STRUCTUREDDATA (SurveySessionData)
    ↓
    └─→ transformFormDataToSurveySession()
        ├─ prepareFamilyMembersForSubmission() ← Elimina IDs de familia
        ├─ removeCelebracionIds() ← Elimina IDs de celebraciones
        └─ prepareDeceasedMembersForSubmission() ← Elimina IDs de difuntos
        
        Resultado: SIN IDs temporales ✅
        
    ↓ [PUNTO 2: Guardar y Mostrar en Consola]
    
LOCALSTORAGE + CONSOLA
    ↓
    └─→ saveSurveyToLocalStorage()
        ├─ localStorage.setItem('parish-survey-completed', JSON)
        ├─ console.log() muestra el mismo JSON
        └─ JSON Consola = JSON localStorage ✅
        
    ↓ [PUNTO 3: Transformar para API]
    
BACKEND
    ↓
    └─→ SurveySubmissionService.submitSurvey()
        └─ transformSurveyDataForAPI()
            ├─ Transforma familyMembers
            ├─ Transforma deceasedMembers
            ├─ Transforma vivienda (disposicion_basuras)
            ├─ Transforma servicios_agua (aguas_residuales) ← ✅ AHORA CORRECTO
            └─ POST /api/encuestas
```

---

## 📍 Ubicación de Cada Transformación

### PUNTO 1: Limpieza de IDs Temporales
**Archivo**: `src/utils/formDataTransformer.ts`

```typescript
// Línea 180-184: prepareFamilyMembersForSubmission()
// - Elimina "id" de cada miembro
// - Llama a removeCelebracionIds() para celebraciones

// Línea 207-224: removeCelebracionIds()
// - Elimina "id" de cada celebración

// Línea 198-205: prepareDeceasedMembersForSubmission()
// - Elimina "id" de cada difunto
```

### PUNTO 2: Guardado en localStorage + Consola
**Archivo**: `src/utils/sessionDataTransformer.ts`

```typescript
// Línea 75: transformFormDataToSurveySession()
// - Llama a prepareFamilyMembersForSubmission()
// - Llama a prepareDeceasedMembersForSubmission()
// - Retorna structuredSurveyData (sin IDs)

// Línea 148: saveSurveyToLocalStorage()
// - localStorage.setItem() con datos limpios
// - console.log() muestra el JSON
```

### PUNTO 3: Transformación para API
**Archivo**: `src/utils/surveyAPITransformer.ts`

```typescript
// Línea 228: transformSurveyDataForAPI()
// - Transforma cada sección al formato API
// - Línea 250: servicios_agua.aguas_residuales = data.servicios_agua.aguas_residuales ✅

// Línea 178: transformFamilyMember()
// - Transforma cada miembro de familia

// Línea 217: transformDeceasedMember()
// - Transforma cada miembro difunto
```

---

## ✅ Verificación por Nivel

### Nivel 1: Frontend (React State)
```typescript
familyMembers = [
  {
    id: "1702657452927",  // ← ID temporal existe en React
    nombres: "Juan"
    // ...
  }
]
```

### Nivel 2: localStorage + Consola
```json
{
  "familyMembers": [
    {
      // ← NO tiene id (fue eliminado por prepareFamilyMembersForSubmission)
      "nombres": "Juan"
    }
  ]
}
```

### Nivel 3: Backend (API)
```json
{
  "familyMembers": [
    {
      // ← NO tiene id (igual que localStorage)
      "nombres": "Juan"
    }
  ]
}
```

---

## 🔧 Cómo Verificar en Cada Nivel

### Verificar PUNTO 1: Después de transformFormDataToSurveySession()
```javascript
// En SurveyForm.tsx línea 541
const structuredSurveyData = transformFormDataToSurveySession(...);
console.log('Sin IDs?', !structuredSurveyData.familyMembers[0]?.id);
// Debería mostrar: true ✅
```

### Verificar PUNTO 2: Consola y localStorage
```javascript
// En consola después de "Guardar Encuesta"
console.log('Consola:', localStorage.getItem('parish-survey-completed'));

// En consola ejecutar:
const stored = JSON.parse(localStorage.getItem('parish-survey-completed'));
console.log('localStorage sin IDs?', !stored.familyMembers[0]?.id);
// Debería mostrar: true ✅
```

### Verificar PUNTO 3: Network Request
```javascript
// En DevTools → Network → POST /api/encuestas → Payload
// Debería mostar el mismo JSON sin IDs
```

---

## 📊 Tabla de Transformaciones

| Sección | Entrada (Frontend) | Salida (localStorage) | Salida (API) |
|---------|-------------------|---------------------|-------------|
| **familyMembers** | Con `id` | Sin `id` ✅ | Sin `id` ✅ |
| **celebraciones** | Con `id` | Sin `id` ✅ | Sin `id` ✅ |
| **deceasedMembers** | Con `id` | Sin `id` ✅ | Sin `id` ✅ |
| **vivienda.disposicion_basuras** | Array | Array ✅ | Array ✅ |
| **servicios_agua.aguas_residuales** | Array | Array ✅ | Array ✅ |
| **informacionGeneral** | ConfigItems | ConfigItems ✅ | ConfigItems ✅ |

---

## 🎯 Checklist: Auditar Transformaciones

- [ ] `prepareFamilyMembersForSubmission()` elimina `id` ✅
- [ ] `removeCelebracionIds()` elimina `id` de celebraciones ✅
- [ ] `prepareDeceasedMembersForSubmission()` elimina `id` de difuntos ✅
- [ ] `saveSurveyToLocalStorage()` recibe datos sin IDs ✅
- [ ] `console.log()` muestra datos sin IDs ✅
- [ ] `transformSurveyDataForAPI()` usa todos los datos reales (no null) ✅
- [ ] `aguas_residuales` se envía como array, no null ✅
- [ ] `disposicion_basuras` se envía como array ✅
- [ ] Backend recibe JSON idéntico a consola ✅

---

## 🚨 Posibles Bugs Futuros (Vigilar)

| Bug | Ubicación | Síntoma |
|-----|-----------|---------|
| Campo hardcodeado a `null` | `surveyAPITransformer.ts` | JSON en consola ≠ JSON en backend |
| ID no eliminado | `formDataTransformer.ts` | localStorage contiene `"id": "1702..."` |
| Celebración con ID | `removeCelebracionIds()` no llamada | localStorage tiene `"id": "celebracion-..."` |
| Datos no mapeados | `transformSurveyDataForAPI()` | Backend recibe campos faltantes |

---

## 📞 Debuggear Nuevos Problemas

Si encuentras discrepancias nuevas:

1. **Verifica la Consola** (después de "Guardar Encuesta")
   ```
   💾 GUARDADO EN LOCALSTORAGE:
   { ... JSON que debería enviarse ... }
   ```

2. **Compara con Network**
   - DevTools → Network → POST /api/encuestas
   - Payload debe ser idéntico a consola

3. **Si son diferentes:**
   - Busca en `surveyAPITransformer.ts` líneas con `null`, `: {}`, `: []`
   - Estas podrían ser hardcodes que ignoran datos reales

4. **Corrige:**
   ```typescript
   // ❌ Mal
   aguas_residuales: null,
   
   // ✅ Bien
   aguas_residuales: data.servicios_agua.aguas_residuales,
   ```

---

**Mapa de Transformaciones actualizado**: 8 Noviembre 2025  
**Status**: ✅ Completo y Sincronizado
