# 🔧 REFERENCIA TÉCNICA RÁPIDA - Cambios Nov 2025

## Donde buscar cada cambio

### 1️⃣ STRING TRIMMING

**Archivo**: `src/utils/stringTrimHelpers.ts` (NUEVO)
```typescript
// Función principal
export const trimString = (value: any): string => {
  return typeof value === 'string' ? value.trim() : '';
};

// Uso en componentes
onChange={(e) => onChange(field.id, trimString(e.target.value))}
```

**Dónde se usa**:
- ✅ `src/components/survey/StandardFormField.tsx` - líneas con onChange/onBlur
- ✅ `src/components/survey/EnhancedFormField.tsx` - líneas con onChange/onBlur  
- ✅ `src/components/ui/autocomplete.tsx` - filtrado y selección
- ✅ `src/components/ui/enhanced-autocomplete.tsx` - filtrado y selección
- ✅ `src/components/survey/FamilyMemberDialog.tsx` - campos de nombre

---

### 2️⃣ SECTOR OPCIONAL

**Archivo**: `src/components/SurveyForm.tsx` - **Línea 47**

```typescript
// Busca esta línea:
{ id: "sector", label: "Sector", type: "autocomplete", required: false, configKey: "sectorOptions" }
//                                                                    ^^^^^^^^ 
//                                                                 CAMBIO AQUI
```

**Verificación**: El label "Sector" NO debe tener asterisco (*)

---

### 4️⃣ CHIP INPUT PARA CAMPOS DE TEXTO LIBRE

**Archivos Principales**:
- ✅ `src/components/ui/chip-input.tsx` (NUEVO) - Componente ChipInput
- ✅ `src/types/survey.ts` - Cambio de tipo string → string[]
- ✅ `src/components/survey/FamilyMemberDialog.tsx` - Integración en formulario
- ✅ `src/hooks/useFamilyGrid.ts` - Schema Zod + conversión de datos
- ✅ `src/utils/encuestaToFormTransformer.ts` - Transformación desde API
- ✅ `src/utils/surveyAPITransformer.ts` - Transformación hacia API

**Campos Modificados**:
1. **Necesidades del Enfermo** - `necesidadesEnfermo: string[]`
2. **¿En qué eres líder?** - `enQueEresLider: string[]`

**Como Usar**:
```tsx
<ChipInput
  value={Array.isArray(field.value) ? field.value : []}
  onChange={field.onChange}
  placeholder="Escribe y presiona Enter..."
/>
```

**Interacciones**:
- 🎯 **Enter**: Crea nuevo chip
- 🗑️ **Backspace** (input vacío): Elimina último chip
- ❌ **Click en X**: Elimina chip específico
- 🚫 **Validación**: No permite duplicados ni vacíos

**Validación Zod**:
```typescript
necesidadesEnfermo: z.array(z.string().min(1, "No puede estar vacío")).optional().default([]),
enQueEresLider: z.array(z.string().min(1, "No puede estar vacío")).optional().default([]),
```

**Serialización a API**:
```typescript
// Interno: ["Necesidad 1", "Necesidad 2"]
// API: "Necesidad 1, Necesidad 2" (join con comas)
```

---

#### Paso 1: Hook Personalizado
**Archivo**: `src/hooks/useMunicipioDependentParroquias.ts` (NUEVO)

```typescript
export const useMunicipioDependentParroquias = (selectedMunicipioId?: string | null) => {
  // Retorna: parroquiaOptions, isLoading, error, hasSelectedMunicipio, isDisabled
}
```

#### Paso 2: En SurveyForm.tsx
**Archivo**: `src/components/SurveyForm.tsx`

**Import** (línea ~29):
```typescript
import { useMunicipioDependentParroquias } from "@/hooks/useMunicipioDependentParroquias";
```

**Hook call** (línea ~118):
```typescript
const {
  parroquiaOptions: dinamicParroquiaOptions,
  isLoading: parroquiasLoading,
  error: parroquiasError,
  hasSelectedMunicipio
} = useMunicipioDependentParroquias(formData?.municipio);
```

**Helper functions** (línea ~468-495):
```typescript
// Obtener opciones (parroquias dinámicas si hay municipio, sino array vacío)
const getFieldAutocompleteOptions = (field: any) => {
  if (field.id === 'parroquia' && hasSelectedMunicipio) return dinamicParroquiaOptions;
  if (field.id === 'parroquia' && !hasSelectedMunicipio) return [];
  return getAutocompleteOptions(field, configurationData);
};

// Obtener loading (mostrar spinner para parroquia si está cargando)
const getFieldLoadingState = (field: any) => {
  if (field.id === 'parroquia' && hasSelectedMunicipio) return parroquiasLoading;
  return getLoadingState(field, configurationData);
};

// Obtener error (mostrar error para parroquia si hay)
const getFieldErrorState = (field: any) => {
  if (field.id === 'parroquia' && hasSelectedMunicipio) return parroquiasError;
  return getErrorState(field, configurationData);
};
```

**Render** (línea ~710):
```typescript
<StandardFormField
  field={field}
  value={formData[field.id]}
  onChange={handleFieldChange}
  autocompleteOptions={getFieldAutocompleteOptions(field)}  // ← HELPERS
  isLoading={getFieldLoadingState(field)}                   // ← HELPERS
  error={getFieldErrorState(field)}                         // ← HELPERS
/>
```

---

## 🔍 Como Verificar Cada Cambio

### Verificar Trimming
```bash
# En la consola del navegador:
"  test  ".trim()  # → "test"
```

En el formulario:
1. Escribe "  Medellín  " en Municipio
2. Presiona Tab
3. Debería quedar como "Medellín"

### Verificar Sector Opcional
Mira el label en el formulario:
- ❌ "Municipio *" - REQUERIDO
- ❌ "Parroquia *" - REQUERIDO  
- ✅ "Sector" - SIN ASTERISCO = OPCIONAL

### Verificar Paroquia Dependiente
Dev Tools → Network → Busca por `parroquias/municipio`:
```
GET /api/catalog/parroquias/municipio/1
Status: 200 OK
Response: Array de parroquias
```

### Verificar Chip Input
En el formulario de miembros familiares:
1. Navega a la sección "Información de Servicios y Liderazgo"
2. Busca los campos:
   - "Necesidades del Enfermo"
   - "¿En qué eres líder?"
3. Escribe texto en cualquiera de ellos
4. Presiona Enter → Debería aparecer un chip
5. Escribe más texto y presiona Enter → Debería agregar otro chip
6. Haz clic en la X del chip → Debería eliminarse
7. Intenta crear un chip vacío → No debería permitir

**Verificación en Console**:
```javascript
// Inspecciona los valores del formulario
form.watch('necesidadesEnfermo')  // Debería ser: ["Chip 1", "Chip 2", ...]
form.watch('enQueEresLider')      // Debería ser: ["Liderazgo 1", ...]
```

---

## 🛠️ Como Debuggear Problemas

### Problema: Parroquias no se cargan
**Checklist**:
1. ¿Seleccionaste un Municipio? → Si no, Parroquia estará vacío (es normal)
2. ¿Hay spinner en Parroquia? → Si sí, está cargando (espera)
3. ¿Dev Tools muestra error en Network? → Si sí, problema en API

**Solución**:
```typescript
// Agregar log temporal en useMunicipioDependentParroquias.ts
console.log('Municipio ID:', selectedMunicipioId);
console.log('Is loading:', isLoading);
console.log('Parroquias:', parroquiasData);
console.log('Error:', error);
```

### Problema: Trim no funciona
**Checklist**:
1. ¿Existe `src/utils/stringTrimHelpers.ts`? → Si no, crear archivo
2. ¿Se importa en el componente? → Busca `import { trimString }`
3. ¿Se usa en onChange/onBlur? → Busca `trimString(e.target.value)`

**Verificación en Browser Console**:
```javascript
// Abre DevTools → Console en cualquier página del app
// Intenta escribir en un input y verifica:
// 1. El onChange se ejecuta (sin errores en console)
// 2. El valor se trimea
```

### Problema: Sector sigue requerido
**Solución**:
1. Limpia localStorage: `localStorage.clear()` en console
2. Recarga página: Ctrl+F5 (hard refresh)
3. Verifica línea 47 de SurveyForm.tsx tiene `required: false`

---

## 📊 Dependencias de Cambios

```
stringTrimHelpers.ts (NEW)
    ↓ usado por
    StandardFormField.tsx
    EnhancedFormField.tsx
    autocomplete.tsx
    enhanced-autocomplete.tsx
    FamilyMemberDialog.tsx
    
useMunicipioDependentParroquias.ts (NEW)
    ↓ usado por
    SurveyForm.tsx
    ↓ que a su vez llama
    StandardFormField.tsx
```

---

## 🚨 NO TOCAR (Estos archivos NO fueron modificados intencionalmente)

- `useConfigurationData` - La configuración global SIGUE siendo usada para otros campos
- `parroquiasService` - El servicio de API ya existía, solo se usa en el hook
- `StandardFormField.tsx` - Propiedades principales NO cambiaron, solo handlers

---

## ✅ Build Information

```
Vite v7.1.7
Modules: 3504
Build time: 7.71s
Errors: 0
Status: SUCCESS ✓
```

**Para reconstruir**:
```bash
npm run build
```

**Para desarrollo**:
```bash
npm run dev
# Abre: http://localhost:8081
```

---

## 📱 Archivos Key del Proyecto

```
src/
├── components/
│   ├── survey/
│   │   ├── SurveyForm.tsx ← PRINCIPAL (3 cambios)
│   │   ├── StandardFormField.tsx ← TRIM (líneas onChange)
│   │   ├── FamilyMemberDialog.tsx ← TRIM (nombres) + CHIP INPUT (2 campos)
│   │   └── MunicipioDependentParroquiaField.tsx ← NEW (no integrado)
│   ├── ui/
│   │   ├── chip-input.tsx ← NEW (Componente ChipInput)
│   │   ├── autocomplete.tsx ← TRIM (búsqueda)
│   │   └── enhanced-autocomplete.tsx ← TRIM (búsqueda)
│   └── EnhancedFormField.tsx ← TRIM (onChange)
├── hooks/
│   ├── useConfigurationData.ts ← SIN CAMBIOS
│   ├── useMunicipioDependentParroquias.ts ← NEW
│   └── useFamilyGrid.ts ← CHIP INPUT (schema + conversión)
├── utils/
│   ├── formFieldHelpers.ts ← SIN CAMBIOS
│   ├── stringTrimHelpers.ts ← NEW
│   ├── encuestaToFormTransformer.ts ← CHIP INPUT (inicialización arrays)
│   └── surveyAPITransformer.ts ← CHIP INPUT (serialización)
├── types/
│   └── survey.ts ← CHIP INPUT (necesidadesEnfermo[], enQueEresLider[])
└── services/
    └── parroquiasService.ts ← SIN CAMBIOS (ya tenía método)
```

---

## 🔐 Seguridad & Performance

✅ **Trim**: No hay impacto de seguridad (es sanitización básica)  
✅ **Opcional**: Solo cambio de config, sin lógica compleja  
✅ **Dependiente**: Usa React Query cache, no dispara N queries  
✅ **Memory**: useMemo en opciones evita re-conversiones innecesarias  

---

## 📞 Soporte Rápido

| Issue | Solución Rápida |
|-------|-----------------|
| Chip Input no muestra | Verifica que el campo sea necesidadesEnfermo o enQueEresLider |
| Chip no se crea | Verifica que escribiste algo y presionaste Enter |
| Error "value.map is not a function" | Limpia localStorage y hard refresh (Ctrl+F5) |
| Parroquias no cargan | Selecciona municipio, espera 2-3s, verifica Network tab |
| Trim no aplica | Limpia localStorage y hard refresh (Ctrl+F5) |
| Sector sigue requerido | Verifica línea 47 SurveyForm.tsx tiene `required: false` |
| Build falla | `npm install && npm run build` |
| Servidor no inicia | Verifica puerto 8081 no esté en uso |

---

**Last Updated**: Noviembre 2025  
**Quick Reference v1.0**
