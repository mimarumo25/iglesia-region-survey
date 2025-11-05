# 🧪 Ejemplos Prácticos: `trimString()` vs `.trim()`

## 1️⃣ Ejemplo Básico

### El Problema

```typescript
// Intenta hacer trim en un valor que no es string
const apellido = null;

// ❌ ESTO FALLA
try {
  const resultado = apellido.trim();  // TypeError
} catch (error) {
  console.error(error);  // Cannot read property 'trim' of null
}

// ✅ ESTO FUNCIONA
import { trimString } from '@/utils/stringTrimHelpers';
const resultado = trimString(apellido);  // Retorna: ''
console.log(resultado);  // ''
```

---

## 2️⃣ Manejo de Diferentes Tipos

### Código para Probar

```typescript
import { trimString } from '@/utils/stringTrimHelpers';

// Array de diferentes valores
const valores = [
  '  Hola Mundo  ',  // String con espacios
  '',                // String vacío
  null,              // null
  undefined,         // undefined
  123,               // Número
  { name: 'Juan' },  // Objeto
  ['a', 'b'],        // Array
  true,              // Boolean
];

console.log('=== COMPARATIVA: .trim() vs trimString() ===\n');

valores.forEach((valor, index) => {
  console.log(`Valor ${index}: ${JSON.stringify(valor)}`);
  
  // ❌ Intentar con .trim() directo
  try {
    const resultado = valor.trim();
    console.log(`  .trim() → ${JSON.stringify(resultado)} ✅`);
  } catch (error) {
    console.log(`  .trim() → ERROR ❌ (${error.message})`);
  }
  
  // ✅ Usar trimString()
  const resultado = trimString(valor);
  console.log(`  trimString() → ${JSON.stringify(resultado)} ✅\n`);
});
```

### Salida Esperada

```
=== COMPARATIVA: .trim() vs trimString() ===

Valor 0: "  Hola Mundo  "
  .trim() → "Hola Mundo" ✅
  trimString() → "Hola Mundo" ✅

Valor 1: ""
  .trim() → "" ✅
  trimString() → "" ✅

Valor 2: null
  .trim() → ERROR ❌ (Cannot read property 'trim' of null)
  trimString() → "" ✅

Valor 3: undefined
  .trim() → ERROR ❌ (Cannot read property 'trim' of undefined)
  trimString() → "" ✅

Valor 4: 123
  .trim() → ERROR ❌ (.trim is not a function)
  trimString() → "" ✅

Valor 5: {"name":"Juan"}
  .trim() → ERROR ❌ (.trim is not a function)
  trimString() → "" ✅

Valor 6: ["a","b"]
  .trim() → ERROR ❌ (.trim is not a function)
  trimString() → "" ✅

Valor 7: true
  .trim() → ERROR ❌ (.trim is not a function)
  trimString() → "" ✅
```

---

## 3️⃣ Ejemplo en un Formulario

### Código

```typescript
import { trimString } from '@/utils/stringTrimHelpers';

// Simulando datos de un formulario
const formData = {
  apellido_familiar: '  García Rodríguez  ',
  nombres: '  Juan Pablo  ',
  telefono: '  300 123 4567  ',
  email: '  juan@example.com  ',
  notas: null,  // ← Valor inesperado de API
  observaciones: undefined  // ← Valor inesperado
};

// ✅ Limpiar TODOS los valores con trimString()
const datosLimpios = Object.entries(formData).reduce((acc, [key, value]) => {
  acc[key] = trimString(value);
  return acc;
}, {} as Record<string, string>);

console.log('Datos originales:', formData);
console.log('Datos limpios:', datosLimpios);

/* Resultado:
Datos originales: {
  apellido_familiar: '  García Rodríguez  ',
  nombres: '  Juan Pablo  ',
  telefono: '  300 123 4567  ',
  email: '  juan@example.com  ',
  notas: null,
  observaciones: undefined
}

Datos limpios: {
  apellido_familiar: 'García Rodríguez',
  nombres: 'Juan Pablo',
  telefono: '300 123 4567',
  email: 'juan@example.com',
  notas: '',
  observaciones: ''
}
*/
```

### Si usaras `.trim()` directo

```typescript
// ❌ Esto fallaría
const datosLimpios = {
  apellido_familiar: formData.apellido_familiar.trim(),  // ✅
  nombres: formData.nombres.trim(),                      // ✅
  telefono: formData.telefono.trim(),                    // ✅
  email: formData.email.trim(),                          // ✅
  notas: formData.notas.trim(),                          // ❌ ERROR
  observaciones: formData.observaciones.trim()           // ❌ ERROR
};
// TypeError: Cannot read property 'trim' of null
```

---

## 4️⃣ Validación de Campos

### Código

```typescript
import { trimString, isValidText } from '@/utils/stringTrimHelpers';

// Datos del usuario
const usuario = {
  apellido: '  García  ',
  nombre: null,
  email: '   ',
  telefono: undefined
};

// Validar cada campo
console.log('=== VALIDACIÓN DE CAMPOS ===\n');

Object.entries(usuario).forEach(([campo, valor]) => {
  const esValido = isValidText(valor);
  const valLimpio = trimString(valor);
  
  console.log(`${campo}:`);
  console.log(`  Valor original: ${JSON.stringify(valor)}`);
  console.log(`  Valor limpio: "${valLimpio}"`);
  console.log(`  ¿Es válido? ${esValido ? '✅ SÍ' : '❌ NO'}\n`);
});

/* Resultado:
=== VALIDACIÓN DE CAMPOS ===

apellido:
  Valor original: "  García  "
  Valor limpio: "García"
  ¿Es válido? ✅ SÍ

nombre:
  Valor original: null
  Valor limpio: ""
  ¿Es válido? ❌ NO

email:
  Valor original: "   "
  Valor limpio: ""
  ¿Es válido? ❌ NO

telefono:
  Valor original: undefined
  Valor limpio: ""
  ¿Es válido? ❌ NO
*/
```

---

## 5️⃣ Comparativa en un Handler de Cambio

### Implementación con `trimString()`

```typescript
// ✅ SEGURO - Implementación actual
const handleBlur = (field: string, value: any) => {
  // trimString() maneja TODOS los tipos
  const valorLimpio = trimString(value);
  onChange(field, valorLimpio);
};

// Uso
handleBlur('apellido_familiar', '  García  ');  // ✅ 'García'
handleBlur('apellido_familiar', null);          // ✅ ''
handleBlur('apellido_familiar', undefined);     // ✅ ''
```

### Implementación con `.trim()` directo

```typescript
// ❌ INSEGURO - Código actual NO lo hace así
const handleBlur = (field: string, value: string) => {
  // value.trim() falla si value NO es string
  const valorLimpio = value.trim();
  onChange(field, valorLimpio);
};

// Uso
handleBlur('apellido_familiar', '  García  ');  // ✅ 'García'
handleBlur('apellido_familiar', null);          // ❌ ERROR
handleBlur('apellido_familiar', undefined);     // ❌ ERROR
```

---

## 6️⃣ Evolución del Código

### Versión 1: Sin Protección

```typescript
// ❌ Versión frágil
const cleanData = (data: Record<string, any>) => {
  return {
    apellido: data.apellido.trim(),      // Puede fallar
    nombre: data.nombre.trim(),          // Puede fallar
    email: data.email.trim()             // Puede fallar
  };
};

// Cualquier null/undefined falla toda la app
cleanData({ apellido: '  García  ', nombre: null, email: '...' });
// TypeError ❌
```

### Versión 2: Con Validación Manual

```typescript
// ⚠️ Versión defensiva pero repetitiva
const cleanData = (data: Record<string, any>) => {
  return {
    apellido: data.apellido && typeof data.apellido === 'string' 
      ? data.apellido.trim() 
      : '',
    nombre: data.nombre && typeof data.nombre === 'string' 
      ? data.nombre.trim() 
      : '',
    email: data.email && typeof data.email === 'string' 
      ? data.email.trim() 
      : ''
  };
};

// Mucho código repetido
```

### Versión 3: Con `trimString()` (Actual - MEJOR)

```typescript
// ✅ Versión limpia y segura
import { trimString } from '@/utils/stringTrimHelpers';

const cleanData = (data: Record<string, any>) => {
  return {
    apellido: trimString(data.apellido),
    nombre: trimString(data.nombre),
    email: trimString(data.email)
  };
};

// Código limpio, centralizado y seguro
cleanData({ apellido: '  García  ', nombre: null, email: '...' });
// { apellido: 'García', nombre: '', email: '...' } ✅
```

---

## 🎯 Conclusión Práctica

### `trimString()` es mejor porque:

✅ **1. Seguridad**: No falla con valores inesperados  
✅ **2. Limpieza**: Código más legible y mantenible  
✅ **3. Centralización**: Cambios en un solo lugar  
✅ **4. Flexibilidad**: Fácil de extender en el futuro  
✅ **5. Testing**: Fácil de probar exhaustivamente  

### Resumen

```typescript
// ❌ Evita
value.trim()

// ✅ Usa
trimString(value)
```

**Fin de los ejemplos prácticos.**

