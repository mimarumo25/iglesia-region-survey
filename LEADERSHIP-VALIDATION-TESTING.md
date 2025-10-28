---
titulo: "Guía de Testing: Validación de Liderazgo"
fecha: 2025-10-27
tipo: "Testing"
---

# 🧪 Guía de Testing: Validación de Rol de Liderazgo

## Setup Inicial

Para probar la validación de liderazgo, necesitas:

1. ✅ Tener la aplicación corriendo
2. ✅ Estar en una encuesta nueva o en edición
3. ✅ Llegar a **Etapa 4 - Información Familiar**

## Test Cases

### Test 1: Familia Vacía (Boundary)
**Objetivo:** Verificar que no permite avanzar sin miembros

**Pasos:**
1. Llegar a Etapa 4
2. No agregar ningún miembro
3. Click en botón "Siguiente"

**Resultado Esperado:**
```
Toast Error Visible:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Información familiar requerida
    Debe agregar al menos un miembro de la familia
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ No avanza a Etapa 5
✅ Permanece en Etapa 4
```

**Pasos a Reproducir:**
```bash
1. Navega a http://localhost:5173/new-survey
2. Completa Etapas 1-3 (todos los campos requeridos)
3. Click "Siguiente" hasta llegar a Etapa 4
4. SIN agregar miembros, click "Siguiente"
5. Observa toast de error
```

---

### Test 2: Miembro Sin Rol de Liderazgo (Validación Principal)
**Objetivo:** Verificar rechazo de familia sin "Cabeza"

**Pasos:**
1. Llegar a Etapa 4
2. Agregar 1 miembro con:
   - Nombres: "Juan Pérez"
   - Parentesco: "Hijo"  ← ❌ NO es liderazgo
   - Edad: 25
3. Click "Siguiente"

**Resultado Esperado:**
```
Toast Error Visible:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Rol de liderazgo requerido
    Debe haber al menos un familiar con rol de
    responsabilidad (ej: Cabeza de Hogar, Jefe
    de Familia, Líder, etc.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ No avanza a Etapa 5
✅ Permanece en Etapa 4
✅ Miembro "Juan Pérez" sigue en tabla
```

**Script de Prueba:**
```typescript
// Simulación en browser console para testing manual
const testData = {
  nombres: "Juan Pérez",
  parentesco: { id: "3", nombre: "Hijo" },  // NO contiene palabras clave
  edad: 25
};
// Agregar y presionar Siguiente
```

---

### Test 3: Miembro CON Rol de Liderazgo (Happy Path)
**Objetivo:** Verificar que aprueba con "Cabeza de Hogar"

**Pasos:**
1. Llegar a Etapa 4
2. Agregar 1 miembro con:
   - Nombres: "Carlos López"
   - Parentesco: "Cabeza de Hogar"  ← ✅ VÁLIDO
   - Edad: 45
3. Click "Siguiente"

**Resultado Esperado:**
```
✅ NO hay toast de error
✅ Avanza automáticamente a Etapa 5
✅ Scroll al top de la página
✅ Encabezado cambia a "Etapa 5/6"
```

**Script de Prueba:**
```typescript
const testData = {
  nombres: "Carlos López",
  parentesco: { id: "1", nombre: "Cabeza de Hogar" },  // ✅ Contiene "cabeza"
  edad: 45
};
// Agregar y presionar Siguiente → Debe avanzar
```

---

### Test 4: Variaciones de Palabras Clave
**Objetivo:** Verificar case-insensitive y diferentes formatos

**Escenarios:**

#### 4a. Mayúsculas Mixtas
```
Parentesco: "CABEZA DE HOGAR"
Esperado: ✅ Válido (case-insensitive)
```

#### 4b. Todo Minúsculas
```
Parentesco: "jefe de familia"
Esperado: ✅ Válido (contiene "jefe")
```

#### 4c. Con Espacios Extra
```
Parentesco: "  Líder   Comunitario  "
Esperado: ✅ Válido (trim + contiene "lider")
```

#### 4d. Todas las Palabras Clave
```
Palabras: cabeza, hogar, lider, jefe, familiar, responsable

Ejemplos Válidos:
✅ "Cabeza de Hogar"
✅ "Jefe de Familia"  
✅ "Líder de la Iglesia"
✅ "Responsable del Hogar"
✅ "Familiar Principal"
```

**Procedimiento:**
```
1. Para cada palabra clave, agregar miembro con ese parentesco
2. Cada uno debe permitir avanzar (✅)
3. Verificar en browser console que coincide
```

---

### Test 5: Múltiples Miembros (Solo Uno Válido)
**Objetivo:** Verificar que 1 "Cabeza" es suficiente aunque haya otros

**Pasos:**
1. Agregar 3 miembros:
   ```
   1. Carlos López → "Cabeza de Hogar" ✅
   2. María García → "Esposa"
   3. Juan López → "Hijo"
   ```
2. Click "Siguiente"

**Resultado Esperado:**
```
✅ NO hay error
✅ Avanza a Etapa 5 (porque existe 1 "Cabeza")
✅ Los 3 miembros se enviarán al servidor
```

**Verificación:**
```javascript
// En DevTools, ver estructura guardada:
- familyMembers[0]: { nombres: "Carlos", parentesco: { nombre: "Cabeza..." } }
- familyMembers[1]: { nombres: "María", parentesco: { nombre: "Esposa" } }
- familyMembers[2]: { nombres: "Juan", parentesco: { nombre: "Hijo" } }
```

---

### Test 6: Edición Post-Rechazo (Recovery)
**Objetivo:** Verificar que se puede corregir después del error

**Pasos:**
1. Agregar miembro:
   ```
   1. Juan Pérez → "Hijo" ❌ (será rechazado)
   ```
2. Click "Siguiente" → ❌ ERROR
3. Click [Editar] en la tabla
4. Cambiar parentesco a "Cabeza de Hogar" ✅
5. Click [Guardar]
6. Click "Siguiente" nuevamente

**Resultado Esperado:**
```
After Edit:
✅ Toast de error desaparece
✅ Ahora sí avanza a Etapa 5
✅ Miembro actualizado con "Cabeza de Hogar"
```

---

### Test 7: Eliminación de Cabeza (Validation Regression)
**Objetivo:** Verificar que pierde validación si se elimina la "Cabeza"

**Pasos:**
1. Agregar 2 miembros:
   ```
   1. Carlos López → "Cabeza de Hogar" ✅
   2. María García → "Esposa"
   ```
2. Click "Siguiente" → ✅ Avanza (válido)
3. Volver a Etapa 4 (botón Anterior)
4. Click [Eliminar] para Carlos
5. Click "Siguiente"

**Resultado Esperado:**
```
After Delete:
❌ ERROR aparece:
   "Debe haber al menos un familiar con rol de responsabilidad"
✅ No avanza
✅ Solo María queda en la tabla
```

---

### Test 8: Navegación entre Etapas
**Objetivo:** Verificar que la validación se aplica cada vez

**Pasos:**
1. Etapa 4 con familia inválida (sin "Cabeza")
2. Click Anterior → Vuelve a Etapa 3
3. Click Siguiente → Regresa a Etapa 4
4. SIGUE SIENDO INVÁLIDA
5. Click Siguiente de nuevo

**Resultado Esperado:**
```
✅ Cada intento valida correctamente
✅ No hay estados cacheados
✅ Error persiste hasta corregir
```

---

## Test Automation Script

```typescript
// cypress/e2e/family-leadership-validation.cy.ts

describe('Family Leadership Validation', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173/new-survey');
    cy.completeStages1to3();
  });

  it('Should reject empty family', () => {
    cy.findByRole('button', { name: /Siguiente/i }).click();
    cy.findByText(/Debe agregar al menos un miembro/).should('be.visible');
  });

  it('Should reject family without leadership', () => {
    cy.addFamilyMember('Juan', 'Hijo', 25);
    cy.findByRole('button', { name: /Siguiente/i }).click();
    cy.findByText(/Debe haber al menos un familiar con rol/).should('be.visible');
  });

  it('Should accept family with leadership', () => {
    cy.addFamilyMember('Carlos', 'Cabeza de Hogar', 45);
    cy.findByRole('button', { name: /Siguiente/i }).click();
    cy.url().should('include', 'stage=5');
  });

  it('Should validate all leadership keywords', () => {
    const keywords = ['cabeza', 'hogar', 'lider', 'jefe', 'familiar', 'responsable'];
    
    keywords.forEach(keyword => {
      cy.visit('http://localhost:5173/new-survey');
      cy.completeStages1to3();
      cy.addFamilyMember('Test', `Test ${keyword}`, 40);
      cy.findByRole('button', { name: /Siguiente/i }).click();
      cy.url().should('include', 'stage=5');
    });
  });
});
```

---

## Manual Testing Checklist

```
VALIDACIÓN DE LIDERAZGO - TESTING CHECKLIST
═════════════════════════════════════════════

Etapa 4 - Información Familiar

☐ Test 1: Familia Vacía
  ☐ Sin miembros agregados
  ☐ Click Siguiente
  ☐ ✅ Error: "Debe agregar al menos un miembro"
  ☐ ✅ Permanece en Etapa 4

☐ Test 2: Miembro Sin Liderazgo
  ☐ Agregar: Juan Pérez - Hijo
  ☐ Click Siguiente
  ☐ ✅ Error: "Debe haber rol de liderazgo"
  ☐ ✅ Permanece en Etapa 4

☐ Test 3: Miembro Con Liderazgo
  ☐ Agregar: Carlos López - Cabeza de Hogar
  ☐ Click Siguiente
  ☐ ✅ Sin error
  ☐ ✅ Avanza a Etapa 5

☐ Test 4: Palabras Clave Mixtas
  ☐ "CABEZA DE HOGAR" → ✅ Válido
  ☐ "jefe de familia" → ✅ Válido
  ☐ "Líder Comunitario" → ✅ Válido
  ☐ "Responsable del Hogar" → ✅ Válido

☐ Test 5: Múltiples Miembros
  ☐ 3 miembros, 1 es Cabeza
  ☐ ✅ Avanza (solo necesita 1)

☐ Test 6: Edición Después de Error
  ☐ Error inicial con "Hijo"
  ☐ Editar a "Cabeza de Hogar"
  ☐ ✅ Ahora avanza

☐ Test 7: Eliminación de Cabeza
  ☐ Tenía "Cabeza", ahora no
  ☐ Click Siguiente
  ☐ ✅ Error reaparece

☐ Test 8: Navegación Persistente
  ☐ Anterior/Siguiente múltiples veces
  ☐ ✅ Validación siempre activa

RESULTADO FINAL: ☐ TODO PASÓ ✅
═════════════════════════════════════════════
```

---

## Debugging

### Ver Logs en Browser Console

```javascript
// Agregar esto en familyValidationHelpers.ts para debugging
export function hasLeadershipFamilyMember(familyMembers: FamilyMember[]): boolean {
  console.group('🔍 Leadership Validation Debug');
  console.log('Family Members:', familyMembers);
  
  const result = familyMembers.some(member => {
    const hasLeadership = isLeadershipParentesco(member.parentesco?.nombre);
    console.log(`  ${member.nombres}: ${member.parentesco?.nombre} → ${hasLeadership ? '✅' : '❌'}`);
    return hasLeadership;
  });
  
  console.log('Final Result:', result ? '✅ VALID' : '❌ INVALID');
  console.groupEnd();
  
  return result;
}
```

### Verificar en localStorage

```javascript
// Browser Console
JSON.parse(localStorage.getItem('survey-data')).formData.familyMembers
```

---

## Problemas Comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| "No funciona la validación" | Página no recargada | `F5` o limpiar cache |
| "Toast no aparece" | CSS oculto | Revisar `z-index` en DevTools |
| "Avanza sin validar" | Etapa incorrecta | Asegurar que es Etapa 4 |
| "Error no desaparece" | Estado cacheado | Limpiar localStorage |

---

**Última revisión:** 2025-10-27  
**Status:** ✅ Ready for Testing
