# 🧪 Guía de Prueba Rápida: Disposición de Basura

## ✅ Test 1: Selección Múltiple
**Objetivo**: Verificar que los checkboxes de disposición de basura se guardan correctamente

### Pasos:
1. Abrir formulario en `http://localhost:8081`
2. Ir a **Etapa 2: Información de Vivienda**
3. Seleccionar **Tipos de Disposición de Basura**:
   - ✓ Recolección Municipal
   - ✓ Incineración (Quema)
   - ✓ Enterrado
4. Avanzar a la siguiente etapa
5. Abrir DevTools (F12)
6. `Application` → `Storage` → `LocalStorage` → `http://localhost:8081`
7. Buscar `parish-survey-draft`
8. Expandir y validar:

```json
{
  "vivienda": {
    "disposicion_basuras": {
      "recolector": true,      ✅
      "quemada": true,         ✅
      "enterrada": true,       ✅
      "recicla": false,        ✅
      "aire_libre": false,     ✅
      "no_aplica": false       ✅
    }
  }
}
```

**Resultado Esperado**: ✅ Todos los valores deben estar correctos

---

## ✅ Test 2: Recuperación del Draft
**Objetivo**: Verificar que los datos se restauran correctamente al recargar

### Pasos:
1. Con la página abierta y selecciones hechas
2. Presionar `F5` o `Ctrl+R` para recargar
3. Verificar que aparezca el toast "Borrador recuperado"
4. Ir a **Etapa 2: Vivienda**
5. Validar que los checkboxes mantienen sus selecciones:
   - ✓ Recolección Municipal (checked)
   - ✓ Incineración (checked)
   - ✓ Enterrado (checked)
   - ☐ Reciclaje (unchecked)
   - ☐ Botadero (unchecked)

**Resultado Esperado**: ✅ Todos los checkboxes en su estado anterior

---

## ✅ Test 3: Navegación entre Etapas
**Objetivo**: Verificar que los datos persisten al navegar

### Pasos:
1. Estar en Etapa 2 con selecciones hechas
2. Avanzar a Etapa 3 (Servicios de Agua)
3. Retroceder a Etapa 2
4. Validar que las selecciones de basura se mantienen
5. Avanzar nuevamente
6. Validar en DevTools que se guarden correctamente

**Resultado Esperado**: ✅ Datos se mantienen en todas las navegaciones

---

## ✅ Test 4: Combinaciones Diferentes
**Objetivo**: Probar varios escenarios de selección

### Escenario A: Solo Recolección
```
Seleccionar: ✓ Recolección Municipal
Otros: ☐

Esperado: { recolector: true, quemada: false, ... }
```

### Escenario B: Todo seleccionado
```
Seleccionar: ✓✓✓✓✓ (todos excepto uno)
Esperado: 4-5 booleanos en true
```

### Escenario C: Ninguno seleccionado
```
Seleccionar: ☐☐☐☐☐ (ninguno)
Esperado: { recolector: false, quemada: false, ... }
```

**Resultado Esperado**: ✅ Todos los escenarios funcionan correctamente

---

## ✅ Test 5: Envío de Formulario
**Objetivo**: Verificar que el JSON enviado a la API es correcto

### Pasos:
1. Completar formulario con datos de prueba
2. En Etapa 2, seleccionar tipos de disposición
3. Completar resto del formulario hasta Etapa 6
4. Click en "Enviar Encuesta"
5. En DevTools, `Network` tab
6. Buscar la llamada POST a `/encuestas`
7. Ver el JSON enviado en `Request Payload`

**Validar**:
```json
{
  "vivienda": {
    "disposicion_basuras": {
      "recolector": true,
      "quemada": true,
      "enterrada": true,
      ...
    }
  }
}
```

**Resultado Esperado**: ✅ JSON correcto en la solicitud

---

## ✅ Test 6: Edición de Encuesta Existente
**Objetivo**: Verificar que al cargar una encuesta existente, los datos se restauran correctamente

### Pasos:
1. Ir a sección **Encuestas** (si está disponible)
2. Encontrar una encuesta existente
3. Hacer click en "Editar"
4. Ir a Etapa 2
5. Validar que los checkboxes de disposición de basura están correctos según el registro

**Resultado Esperado**: ✅ Los valores se muestran correctamente basados en los datos guardados

---

## 📊 Resumen de Validación

| Test | Descripción | Estado |
|------|-------------|--------|
| 1 | Selección múltiple | 🟢 |
| 2 | Recuperación del draft | 🟢 |
| 3 | Navegación entre etapas | 🟢 |
| 4 | Combinaciones diferentes | 🟢 |
| 5 | JSON del envío | 🟢 |
| 6 | Edición de existentes | 🟢 |

---

## 🐛 Si algo No Funciona

### Síntoma: Los checkboxes no se guardan
**Debug**:
```javascript
// En DevTools Console
localStorage.getItem('parish-survey-draft')
// Buscar la sección vivienda.disposicion_basuras
```

### Síntoma: Al recargar los checkboxes no aparecen seleccionados
**Posible Causa**: Problema en la recuperación del draft
**Debug**: 
- Ver en Console si hay errores
- Verificar en Storage si el draft existe
- Limpiar localStorage y reintentar

### Síntoma: Todos los valores siempre false
**Posible Causa**: handleFieldChange no está mapeando correctamente
**Debug**:
- Verificar en Console:
  ```javascript
  // Poner un console.log en handleFieldChange
  console.log('disposicion_basura:', value)
  ```
- Verificar el mapeo de IDs

---

## 🎯 Criterios de Éxito

✅ Los checkboxes se pueden seleccionar/deseleccionar
✅ Los valores se guardan en localStorage
✅ Los valores persisten al recargar
✅ Los valores se mantienen al navegar etapas
✅ El JSON enviado tiene la estructura correcta
✅ Se pueden editar encuestas existentes con valores correctos

Si todos pasan: **¡Fix exitoso!** 🎉
