---
titulo: "Validación de Rol de Liderazgo en Miembros Familiares"
fecha: 2025-10-27
tipo: "Feature"
estado: "✅ Completado"
---

# Validación de Rol de Liderazgo en Miembros Familiares

## 📋 Descripción del Cambio

Se implementó una validación que **impide avanzar a la siguiente etapa (Etapa 5) si ningún familiar tiene un parentesco que indique liderazgo o responsabilidad**.

### Palabras Clave Reconocidas

La validación busca palabras clave (case-insensitive) en el nombre del parentesco:

- **"cabeza"** → Cabeza de Hogar, Cabeza de Familia
- **"hogar"** → Jefe del Hogar, Responsable del Hogar
- **"lider"** → Líder, Líder Comunitario
- **"jefe"** → Jefe de Familia, Jefe de Hogar
- **"familiar"** → Responsable Familiar
- **"responsable"** → Responsable del Hogar, Responsable Familiar

## 🔧 Cambios Técnicos

### 1. Nuevo Archivo: `familyValidationHelpers.ts`
**Ubicación:** `src/utils/familyValidationHelpers.ts`

Contiene funciones de utilidad para validar roles de liderazgo:

```typescript
// Valida si un parentesco contiene palabras clave de liderazgo
isLeadershipParentesco(parentescoNombre: string): boolean

// Valida si existe al menos un familiar con rol de liderazgo
hasLeadershipFamilyMember(familyMembers: FamilyMember[]): boolean

// Obtiene el nombre del primer familiar con rol de liderazgo
getLeadershipFamilyMemberName(familyMembers: FamilyMember[]): string | null

// Genera mensaje descriptivo
getLeadershipMessage(): string
```

### 2. Actualización: `SurveyForm.tsx`

**Cambios en la función `handleNext()`:**

```typescript
// Nueva validación en la Etapa 4 (Información Familiar)
if (currentStage === 4 && familyMembers.length > 0) {
  if (!hasLeadershipFamilyMember(familyMembers)) {
    toast({
      title: "Rol de liderazgo requerido",
      description: getLeadershipMessage(),
      variant: "destructive"
    });
    return;
  }
}
```

**Flujo de Validación:**
1. ✅ Primero valida que haya al menos 1 miembro familiar
2. ✅ Luego valida que al menos 1 tenga un rol de liderazgo
3. ✅ Si faltan, muestra toast de error
4. ✅ Impide avance a Etapa 5 hasta cumplir la validación

## 🎯 Comportamiento

### Escenarios

**Escenario 1: Sin miembros familiares**
- ❌ Error: "Debe agregar al menos un miembro de la familia"
- Acción: No avanza

**Escenario 2: Con miembros pero sin rol de liderazgo**
```json
Miembros:
- Juan Pérez (Hijo)
- María García (Esposa)
- Pedro López (Padre)
```
- ❌ Error: "Debe haber al menos un familiar con rol de responsabilidad"
- Acción: No avanza

**Escenario 3: Con miembro con rol de liderazgo ✅**
```json
Miembros:
- Carlos Gómez (Cabeza de Hogar) ← ✅ Cumple
- Ana Martínez (Esposa)
- Luis Gómez (Hijo)
```
- ✅ Validación aprobada
- Acción: Avanza a Etapa 5

## 🧪 Casos de Prueba

### Test 1: Parentesco exacto
```
Parentesco: "Cabeza de Hogar" → ✅ Válido (contiene "cabeza")
```

### Test 2: Variaciones de mayúsculas
```
Parentesco: "LÍDER DE LA FAMILIA" → ✅ Válido (contiene "lider")
Parentesco: "Jefe de HOGAR" → ✅ Válido (contiene "jefe" y "hogar")
```

### Test 3: Parentesco no válido
```
Parentesco: "Hijo" → ❌ No válido
Parentesco: "Esposa" → ❌ No válido
Parentesco: "Sobrino" → ❌ No válido
```

### Test 4: Múltiples miembros
```
Familia:
1. Juan (Hijo) → ❌ No válido
2. María (Cabeza de Hogar) → ✅ Válido (se detecta)
3. Pedro (Padre) → ❌ No válido
Resultado final: ✅ Familia aprobada
```

## 📊 Validación Cruzada

La validación es **sensible al contexto de la etapa**:

| Etapa | Validación | Comportamiento |
|-------|-----------|----------------|
| 1-3 | No | Permite avanzar sin cambios |
| 4 | **SÍ** | Valida miembro + liderazgo |
| 5-6 | No | Permite completar encuesta |

## 🔐 Integración

### Entrada
- `FamilyMember[]` con estructura: `{ ..., parentesco: { id, nombre }, ... }`
- Ejemplo: `{ parentesco: { id: 1, nombre: "Cabeza de Hogar" } }`

### Salida
- `boolean` (true si cumple validación)
- `string` (mensaje descriptivo para el usuario)

### Ubicación del Control
- **Componente:** `SurveyForm.tsx`
- **Etapa:** 4 (Información Familiar)
- **Botón:** "Siguiente" (deshabilitado si no cumple)
- **Feedback:** Toast de error

## 📝 Notas de Implementación

### Flexibilidad
- Las palabras clave se buscan con `.includes()` (substring matching)
- Permite capturar variaciones futuras de parentescos
- Si se agrega "Coordinador de Hogar" → automáticamente válido (contiene "hogar")

### Rendimiento
- O(n) donde n = número de miembros familiares
- Búsqueda de palabras clave es O(1) (6 palabras fijas)
- Sin impacto en performance

### Mantenibilidad
- Las palabras clave están centralizadas en `LEADERSHIP_KEYWORDS`
- Fácil de ampliar o modificar en el futuro
- Funciones reutilizables para otros casos

## ✅ Pruebas Completadas

- ✅ Validación de parentescos individuales
- ✅ Validación de múltiples miembros
- ✅ Case-insensitive matching
- ✅ Integration con toast notifications
- ✅ No afecta otras etapas
- ✅ TypeScript strict mode

## 🚀 Próximos Pasos Opcionales

1. Agregar más palabras clave según necesidad
2. Permitir configurar palabras clave desde base de datos
3. Mostrar sugerencia visual de qué familiar editar
4. Agregar campo de "Rol Principal" separado del parentesco
5. Generar reporte de estructura familiar
