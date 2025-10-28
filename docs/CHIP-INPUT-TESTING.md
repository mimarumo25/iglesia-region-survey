# 🧪 Testing Chip Input - Guía Rápida

## ✅ Casos de Prueba Básicos

### Test 1: Crear un Chip
1. **Acción**: Navega al formulario de miembros familiares
2. **Busca**: Campo "Necesidades del Enfermo"
3. **Escribe**: `Medicinas especiales`
4. **Presiona**: Enter
5. **Esperado**: ✅ Aparece chip azul con "Medicinas especiales" y una X
6. **Input**: Se limpia y está listo para el siguiente chip

### Test 2: Crear Múltiples Chips
1. **Acción**: En el mismo campo anterior
2. **Escribe**: `Fisioterapia`
3. **Presiona**: Enter
4. **Esperado**: ✅ Aparece segundo chip
5. **Escribe**: `Atención psicológica`
6. **Presiona**: Enter
7. **Esperado**: ✅ Aparecen 3 chips en total

### Test 3: Eliminar Chip por Click
1. **Acción**: Haz clic en la X del chip "Medicinas especiales"
2. **Esperado**: ✅ Chip se elimina, quedan 2 chips

### Test 4: Eliminar Chip por Backspace
1. **Acción**: Campo está vacío (sin escribir nada)
2. **Presiona**: Backspace
3. **Esperado**: ✅ Se elimina el último chip
4. **Presiona**: Backspace de nuevo
5. **Esperado**: ✅ Se elimina otro chip

### Test 5: No Permitir Texto Vacío
1. **Acción**: Sin escribir nada en el input
2. **Presiona**: Enter
3. **Esperado**: ✅ NO se crea chip, el campo sigue vacío

### Test 6: No Permitir Duplicados
1. **Acción**: Escribe `Medicinas especiales`
2. **Presiona**: Enter
3. **Acción**: Escribe exactamente `Medicinas especiales`
4. **Presiona**: Enter
5. **Esperado**: ✅ NO se crea chip duplicado, solo existe uno

### Test 7: Trimming de Espacios
1. **Acción**: Escribe `  Medicinas especiales  ` (con espacios)
2. **Presiona**: Enter
3. **Esperado**: ✅ Chip muestra `Medicinas especiales` (sin espacios extra)

### Test 8: Campo ¿En qué eres líder?
1. **Acción**: Navega al campo "¿En qué eres líder?"
2. **Escribe**: `Grupo de oración`
3. **Presiona**: Enter
4. **Esperado**: ✅ Funciona igual que necesidadesEnfermo
5. **Escribe**: `Catequesis`
6. **Presiona**: Enter
7. **Esperado**: ✅ Aparecen 2 chips

## 🚀 Tests de Formulario Completo

### Test 9: Guardar Formulario con Chips
1. **Acción**: Rellena otros campos requeridos
2. **Acción**: Agrega 2-3 chips en "Necesidades del Enfermo"
3. **Acción**: Agrega 1-2 chips en "¿En qué eres líder?"
4. **Presiona**: Botón "Guardar Miembro Familiar"
5. **Esperado**: ✅ Formulario se guarda sin errores
6. **Esperado**: ✅ Mensaje de éxito aparece

### Test 10: Editar Miembro con Chips
1. **Acción**: En la tabla de miembros, haz clic en editar un miembro
2. **Esperado**: ✅ Se cargan los chips existentes en ambos campos
3. **Acción**: Agrega un chip nuevo a "Necesidades del Enfermo"
4. **Presiona**: Guardar
5. **Esperado**: ✅ Se guardaron los cambios correctamente

### Test 11: Validación - Campo Requerido
1. **Acción**: Intenta guardar sin agregar chips
2. **Esperado**: ✅ Si los campos son opcionales, debería permitir
3. **Si falla**: Verifica que el schema Zod tiene `.optional()`

### Test 12: Datos Persistentes
1. **Acción**: Crea varios chips
2. **Acción**: Recarga la página (F5)
3. **Esperado**: ✅ Los chips se mantienen (localStorage)
4. **Acción**: Cierra y reabre el navegador
5. **Esperado**: ✅ Los datos se recuperan del localStorage

## 🎨 Tests Visuales

### Test 13: Estilos en Light Mode
- [ ] Chips tienen fondo azul claro
- [ ] Border es gris oscuro
- [ ] Texto es negro/oscuro
- [ ] La X es visible
- [ ] Input tiene borde gris
- [ ] Al hacer focus, borde es azul

### Test 14: Estilos en Dark Mode
- [ ] Chips tienen fondo azul más oscuro
- [ ] Border es gris más claro
- [ ] Texto es blanco/claro
- [ ] La X es visible
- [ ] Input tiene borde gris claro
- [ ] Al hacer focus, borde es azul

### Test 15: Responsive Mobile
1. **Acción**: Abre en móvil (DevTools emulación)
2. **Acción**: Agrega 5-6 chips
3. **Esperado**: ✅ Chips se wrappean correctamente
4. **Esperado**: ✅ Input sigue siendo accesible
5. **Esperado**: ✅ La X es clickeable (touch friendly)

## ⌨️ Tests de Teclado

### Test 16: Navegación Tab
1. **Acción**: Presiona Tab en el campo
2. **Esperado**: ✅ Focus pasa al siguiente campo
3. **Acción**: Shift+Tab
4. **Esperado**: ✅ Focus vuelve al campo anterior

### Test 17: Copiar/Pegar
1. **Acción**: Copia texto de otro lado
2. **Acción**: Pega en el input (Ctrl+V)
3. **Presiona**: Enter
4. **Esperado**: ✅ Crea chip con el texto pegado

## 🔄 Tests de Integración API

### Test 18: Enviar a API
1. **Acción**: Completa formulario con chips
2. **Acción**: Presiona "Enviar Encuesta"
3. **DevTools**: Abre Network tab
4. **Busca**: POST request con los family members
5. **Esperado**: ✅ El JSON muestra strings unidos con comas
```json
{
  "familyMembers": [
    {
      "necesidadesEnfermo": "Medicinas, Fisioterapia",
      "enQueEresLider": "Oración, Catequesis"
    }
  ]
}
```

### Test 19: Cargar desde API
1. **Acción**: Carga una encuesta existente
2. **Esperado**: ✅ Los chips se cargan desde la API
3. **Nota**: Si vienen como string "A, B", se convierten a array ["A, B"]
4. **Mejora futura**: Separar por comas en el transformer

## 🚨 Tests de Error

### Test 20: Manejo de Errores
1. **Acción**: Simula error de API (DevTools Network throttle)
2. **Acción**: Intenta guardar
3. **Esperado**: ✅ Muestra mensaje de error apropiado

### Test 21: Entrada Muy Larga
1. **Acción**: Escribe un texto muy largo (>500 chars)
2. **Presiona**: Enter
3. **Esperado**: ✅ Se acepta y muestra (con truncate si es necesario)

## 📊 Datos de Prueba

```javascript
// Ejemplos para testing manual

// Necesidades del Enfermo - Casos comunes
"Medicinas especiales"
"Terapia física"
"Seguimiento médico"
"Dieta especial"
"Atención psicológica"

// ¿En qué eres líder? - Casos comunes
"Grupo de oración"
"Catequesis"
"Voluntariado"
"Pastoral familiar"
"Ministerio de canto"
"Servicio comunitario"
```

## ✅ Checklist Final

Before Release:
- [ ] Todos los tests básicos pasan ✓
- [ ] Estilos se ven bien en light y dark mode
- [ ] Funciona en desktop, tablet y mobile
- [ ] No hay errores en console
- [ ] API recibe datos correctamente
- [ ] Se pueden editar miembros con chips
- [ ] Los datos se persistem en localStorage
- [ ] Al recargar se recuperan los datos
- [ ] Validación Zod funciona
- [ ] Sin memory leaks (DevTools Performance)

## 🐛 Bugs Encontrados y Soluciones

### Bug: "value.map is not a function"
- **Causa**: field.value no es array
- **Solución**: Usar `Array.isArray(field.value) ? field.value : []`
- **Status**: ✅ FIXED

### Bug: Chips no se guardan
- **Causa**: formDataToFamilyMember no maneja arrays
- **Solución**: Agregar conversión: `Array.isArray(data.field) ? data.field : []`
- **Status**: ✅ FIXED

### Bug: API recibe undefined
- **Causa**: Conversión a strings no funciona
- **Solución**: Usar `.join(', ')` en surveyAPITransformer
- **Status**: ✅ FIXED

---

**Testing Date**: Octubre 27, 2025
**Tester**: [Tu nombre]
**Status**: Ready for QA ✓
