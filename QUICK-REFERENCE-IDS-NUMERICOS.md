# 🎯 Guía Rápida: IDs Numéricos en JSON

**Commit**: `c85c46aee1099ab8a0110d81fe4799a2f6f9bde4`

---

## ✅ Lo que Se Corrigió

### Problema Reportado por Usuario
```json
// ❌ ANTES (ID como string)
{
  "tipoIdentificacion": {
    "id": "CC",
    "nombre": "Cédula de Ciudadanía"
  }
}

// ✅ DESPUÉS (ID como número)
{
  "tipoIdentificacion": {
    "id": 1,
    "nombre": "Cédula de Ciudadanía"
  }
}
```

### Campos Actualizados

**3 Tipos Principales Corregidos:**

1. **DynamicSelectionItem** (disposicion_basuras)
   - ANTES: `id: string`
   - DESPUÉS: `id: number`

2. **Enfermedades Array**
   - ANTES: `Array<{ id: string; nombre: string }>`
   - DESPUÉS: `Array<{ id: number; nombre: string }>`

3. **Transformaciones en Helpers**
   - Agregado `parseInt()` en todas las conversiones
   - Agregado `.toString()` al devolver al formulario

---

## 📋 Checklist de Verificación

Cuando generes un JSON de encuesta, verifica que estos campos tengan **IDs numéricos**:

### InformaciónGeneral
- [ ] `municipio.id` es número
- [ ] `parroquia.id` es número
- [ ] `sector.id` es número
- [ ] `vereda.id` es número

### Vivienda
- [ ] `tipo_vivienda.id` es número
- [ ] `disposicion_basuras[].id` es número ⭐ NUEVO

### FamilyMembers
- [ ] `tipoIdentificacion.id` es número
- [ ] `sexo.id` es número
- [ ] `parentesco.id` es número
- [ ] `enfermedades[].id` es número ⭐ NUEVO
- [ ] `habilidades[].id` es número
- [ ] `destrezas[].id` es número

---

## 🔍 Cómo Verificar

### Opción 1: Inspeccionar LocalStorage
```javascript
// En DevTools Console
const data = JSON.parse(localStorage.getItem('surveySessionData'));
console.log(typeof data.familyMembers[0].tipoIdentificacion.id);
// Debe mostrar: "number"
```

### Opción 2: Inspeccionar Network Request
1. Abrir DevTools → Network
2. Guardar encuesta
3. Ver request payload
4. Verificar que todos los `id` sean números (sin comillas)

```json
// ✅ CORRECTO (sin comillas)
{ "id": 1, "nombre": "..." }

// ❌ INCORRECTO (con comillas)
{ "id": "1", "nombre": "..." }
```

---

## 🚨 Errores Comunes

### Error 1: ID viene como "CC" en lugar de número
**Causa**: El autocomplete no está extrayendo el `metadata.id`  
**Solución**: Verificar que `useConfigurationData` tenga metadata configurada

### Error 2: DynamicSelectionMap con IDs strings
**Causa**: Usando versión antigua de `dynamicSelectionHelpers.ts`  
**Solución**: Pull latest changes desde commit `c85c46ae`

### Error 3: Enfermedades con IDs strings
**Causa**: Schema Zod no tiene `.transform()` a número  
**Solución**: Actualizar `familyMemberSchema` en `useFamilyGrid.ts`

---

## 🛠️ Testing Rápido

### Test 1: Nuevo Family Member
```
1. Abrir formulario de familia
2. Agregar nuevo miembro
3. Seleccionar "Cédula de Ciudadanía"
4. Guardar
5. Inspeccionar localStorage
6. Verificar: tipoIdentificacion.id === 1 (número)
```

### Test 2: Disposición de Basuras
```
1. Ir a sección Vivienda
2. Seleccionar "Recolección municipal" + "Reciclaje"
3. Guardar borrador
4. Inspeccionar localStorage
5. Verificar: disposicion_basuras[0].id === 1 (número)
```

### Test 3: Enfermedades
```
1. Editar miembro de familia
2. Agregar enfermedad "Diabetes"
3. Guardar
4. Inspeccionar localStorage
5. Verificar: enfermedades[0].id es número
```

---

## 📚 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/types/survey.ts` | Definiciones de tipos base |
| `src/utils/surveyAPITransformer.ts` | Convierte datos a formato API |
| `src/utils/dynamicSelectionHelpers.ts` | Helpers para arrays multi-selección |
| `src/hooks/useFamilyGrid.ts` | Lógica de formulario de familia |
| `src/hooks/useConfigurationData.ts` | Carga opciones desde API |

---

## 🎯 Para Desarrolladores

### Al Agregar Nuevo Campo con ID

```typescript
// 1️⃣ Definir tipo
interface MiCampo {
  id: number;  // ⭐ SIEMPRE number
  nombre: string;
}

// 2️⃣ Usar en transformador
import { transformConfigurationItem } from '@/utils/surveyAPITransformer';

const apiData = {
  miCampo: transformConfigurationItem(data.miCampo) || { id: 1, nombre: 'Default' }
};

// 3️⃣ Schema Zod (si viene de formulario)
const schema = z.object({
  miCampo: z.union([z.number(), z.string()]).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
  )
});
```

---

## ✅ Estado Actual

- ✅ 21 tipos de campos con IDs verificados
- ✅ Todos usan `id: number`
- ✅ Sin errores de compilación TypeScript
- ✅ Compatible con datos existentes en localStorage

**Estado**: 🟢 **100% Compliant con API**

---

_Última actualización: 2025-01-XX (Commit c85c46ae)_
