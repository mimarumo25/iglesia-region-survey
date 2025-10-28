# 🔍 Script de Debug: Verificar IDs Reales de Disposición

## El Problema

El usuario reporta que ve valores **diferentes** en el formulario que en localStorage. Esto sugiere que los IDs que recibe la API son **diferentes** a los que el código está mapeando.

**Ejemplo**:
```
Frontend: ✓ Recolección, ✓ Botadero, ✓ Reciclaje
localStorage: recolector=true, quemada=false, enterrada=true
```

---

## 🔧 Solución: Verificar IDs Reales

### Paso 1: Abre la consola del navegador

Presiona: `F12` o `Ctrl+Shift+I`

### Paso 2: Pega este código en la Console

```javascript
// Script para capturar los IDs reales de disposicion basura
console.log('%c=== DEBUG: Disposición de Basura IDs ===', 'color: blue; font-weight: bold; font-size: 14px');

// Encontrar los checkboxes de disposicion basura
const checkboxes = document.querySelectorAll('input[data-testid^="checkbox-disposicion_basura-"]');

console.log('Checkboxes encontrados:', checkboxes.length);

// Para cada checkbox, mostrar su ID
checkboxes.forEach((checkbox, index) => {
  const testId = checkbox.getAttribute('data-testid');
  const isChecked = checkbox.checked;
  const valueAttr = checkbox.value;
  const idAttr = checkbox.id;
  
  console.log(`%c[${index + 1}]`, 'color: green; font-weight: bold');
  console.log('  data-testid:', testId);
  console.log('  id:', idAttr);
  console.log('  value:', valueAttr);
  console.log('  checked:', isChecked);
  console.log('---');
});

// También mostrar qué hay actualmente en formData
console.log('%c=== formData Actual ===', 'color: orange; font-weight: bold; font-size: 12px');

// Acceder al localStorage draft
const draft = localStorage.getItem('parish-survey-draft');
if (draft) {
  const data = JSON.parse(draft);
  console.log('disposicion_basura array:', data.disposicion_basura);
  console.log('basuras_recolector:', data.basuras_recolector);
  console.log('basuras_quemada:', data.basuras_quemada);
  console.log('basuras_enterrada:', data.basuras_enterrada);
  console.log('basuras_recicla:', data.basuras_recicla);
  console.log('basuras_aire_libre:', data.basuras_aire_libre);
  console.log('basuras_no_aplica:', data.basuras_no_aplica);
} else {
  console.log('No hay draft en localStorage');
}
```

### Paso 3: Ejecuta el código

Pega en la Console y presiona Enter.

### Paso 4: Mira la salida

Debería mostrar algo como:
```
=== DEBUG: Disposición de Basura IDs ===
Checkboxes encontrados: 5

[1]
  data-testid: checkbox-disposicion_basura-1
  id: disposicion_basura-1
  value: 1
  checked: true
---

[2]
  data-testid: checkbox-disposicion_basura-3
  id: disposicion_basura-3
  value: 3
  checked: false
---
...
```

---

## 📋 Tabla de Comparación

Captura la información y completa esta tabla:

### Checkboxes Seleccionados en UI:

| # | Nombre | data-testid | value | checked? |
|---|--------|-------------|-------|----------|
| 1 | ... | ... | `?` | ✓/☐ |
| 2 | ... | ... | `?` | ✓/☐ |
| 3 | ... | ... | `?` | ✓/☐ |
| 4 | ... | ... | `?` | ✓/☐ |
| 5 | ... | ... | `?` | ✓/☐ |

### localStorage (formData):

| Campo | Valor |
|-------|-------|
| disposicion_basura (array) | `['?', '?', '?']` |
| basuras_recolector | true/false |
| basuras_quemada | true/false |
| basuras_enterrada | true/false |
| basuras_recicla | true/false |
| basuras_aire_libre | true/false |
| basuras_no_aplica | true/false |

---

## 🎯 Interpretación

### Si los IDs en "value" son 1, 2, 3, 4, 5, 6:
✅ Los IDs están correctos, el problema está en otro lado

### Si los IDs son diferentes (ej: 10, 20, 30):
❌ Los IDs reales son **diferentes**, necesito actualizar el mapeo

### Si los IDs en "value" no coinciden con localStorage:
❌ El mapeo en `handleFieldChange` no se está ejecutando correctamente

---

## 🔧 Alternativa: Agregar Console.log Temporal

Si el script anterior no funciona, podemos agregar console.log directo en el código:

**Archivo**: `src/components/SurveyForm.tsx`
**Función**: `handleFieldChange`

Agregar después de line 385:
```typescript
} else if (fieldId === 'disposicion_basura') {
  const selectedIds = Array.isArray(value) ? value : [];
  
  // ⭐ DEBUG
  console.log('📍 handleFieldChange disposicion_basura');
  console.log('  selectedIds recibidos:', selectedIds);
  console.log('  IDs están en formato string:', selectedIds.map(id => typeof id));
  
  // Resetear...
```

Luego al cambiar un checkbox, verás en consola qué IDs reales recibe.

---

## 📝 Reporte

Una vez que obtengas la información, por favor comparte:

1. **IDs reales que devuelve la API** (de los checkboxes)
2. **Valores en localStorage después de seleccionar**
3. **Screenshot de la consola**

Con eso podré:
- ✅ Actualizar el mapeo si es necesario
- ✅ Corregir el problema de sincronización
- ✅ Asegurar que front = localStorage

---

**Importante**: Esta información me ayudará a identificar exactamente dónde está la desconexión entre lo que ves en el frontend y lo que se guarda en localStorage.
