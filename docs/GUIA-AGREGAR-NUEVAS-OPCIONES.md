# 🚀 Guía Rápida: Agregar Nuevas Opciones de Disposición de Basura

## Problema: Admin agrega una nueva opción en la API

El administrador agrega una nueva forma de disposición de basura en la base de datos, pero el formulario no la reconoce correctamente.

## Solución: 3 Sencillos Pasos

### Paso 1: Verificar la Nueva Opción
```
Acceder a:
  DevTools → Console
  Ejecutar:
  > db.disposicion_basura.find({})
  
Copiar el label exacto de la nueva opción, ej:
  "Incineración Industrial"
  "Reciclaje Avanzado"
  "Compostaje Doméstico"
```

### Paso 2: Actualizar la Configuración
**Archivo**: `src/utils/disposicionBasuraMapping.ts`

**Encontrar** la sección:
```typescript
export const DISPOSICION_BASURA_CATEGORIAS = {
  recolector: {
    campo: 'basuras_recolector',
    palabrasEtiqueta: ['recolección', 'recoleccion', 'empresa', 'pública', 'publica', 'municipal', 'servicio'],
    // ← AQUÍ: Agregar las palabras clave de la nueva opción
    ...
  },
  // Otras categorías...
}
```

**Ejemplos de cómo agregar**:

#### Ejemplo A: Nueva opción "Incineración Industrial"
```typescript
incineración: {  // Clave nueva
  campo: 'basuras_incineracion_industrial',
  palabrasEtiqueta: ['incineración industrial', 'industrial', 'incinerador industrial'],
  ejemplos: ['Incineración Industrial', 'Planta Incineradora'],
  descripcion: 'Basura incinerada en instalaciones industriales'
}
```

#### Ejemplo B: Agregar palabra clave a categoría existente
Si la nueva opción es "Recogida Municipal Extendida" (similar a "Recolección"):
```typescript
recolector: {
  campo: 'basuras_recolector',
  palabrasEtiqueta: [
    'recolección', 'recoleccion', 'empresa', 'pública', 'publica', 
    'municipal', 'servicio',
    'recogida'  // ← AGREGAR la palabra clave
  ],
  ...
}
```

### Paso 3: Recompilar y Probar
```bash
# Compilar
npm run build

# Desarrollar (si quieres ver cambios en tiempo real)
npm run dev

# Probar:
# 1. Abrir http://localhost:8081
# 2. Ir al formulario
# 3. Ver si la nueva opción aparece
# 4. Seleccionarla
# 5. Abrir DevTools Console
# 6. Buscar el reporte: "📊 MAPEO DE DISPOSICION BASURA"
# 7. Verificar que tiene ✅ (no ❌)
```

---

## 🎯 Tabla de Decisión: ¿Cuándo agregar a cada categoría?

| Nueva Opción | Agregar a Categoría | Por qué |
|---|---|---|
| "Incineración Industrial" | `quemada` | Es combustión, pero industrial |
| "Reciclaje Avanzado" | `recicla` | Sigue siendo reciclaje |
| "Acuicultura de Deshechos" | **Nueva categoría** | No encaja en ninguna |
| "Donación de Usables" | **Nueva categoría** | No es disposición, es reutilización |
| "Servicio Municipal Extendido" | `recolector` | Es recolección |

---

## 🐛 Verificar que Funciona

### Método 1: Reporte de Consola
```javascript
// En DevTools Console, después de seleccionar una opción nueva:
// Deberías ver:

📊 MAPEO DE DISPOSICION BASURA
============================================================
1. "Opción Nueva" (ID: id-999)
   ✅ → basuras_categoria_correcta
============================================================
```

### Método 2: Verificar localStorage
```javascript
// DevTools → Application → LocalStorage → parish-survey-draft
// Buscar "disposicion_basuras"
// Debería mostrar:
{
  "disposicion_basuras": {
    "recolector": false,
    "quemada": false,
    "categoria_nueva": true,  // ← Tu nueva opción
    ...
  }
}
```

### Método 3: Validación Automática
```javascript
// En DevTools Console:
// Si la opción no está mapeada, verás:

⚠️ ADVERTENCIA: Opciones no mapeadas: [
  "Opción Nueva (ID: id-999)"
]

// FIX: Actualiza DISPOSICION_BASURA_CATEGORIAS con las palabras clave
```

---

## ✅ Checklist: Nueva Opción Agregada Correctamente

- [ ] Nueva opción aparece en el dropdown/checkboxes del formulario
- [ ] Al seleccionarla, aparece en la consola con ✅ (no ❌)
- [ ] El localStorage muestra el boolean correspondiente en `true`
- [ ] Al recargar la página, la selección se mantiene
- [ ] Al enviar el formulario, la API recibe el valor correcto
- [ ] No hay errores en la consola

---

## 🚨 Troubleshooting

### Problema: La opción aparece con ❌ en la consola

**Causa**: La palabra clave no está en `DISPOSICION_BASURA_CATEGORIAS`

**Solución**:
```typescript
// ANTES (❌)
quemada: {
  palabrasEtiqueta: ['quema', 'incineración'],
  // ...
}

// DESPUÉS (✅)
quemada: {
  palabrasEtiqueta: ['quema', 'incineración', 'tu_palabra_nueva'],
  // ...
}
```

### Problema: La nueva opción no se guarda en localStorage

**Causa**: El mapeo es correcto, pero no está en `DisposicionBasuraResult` interface

**Solución**:
```typescript
// Actualizar en disposicionBasuraMapping.ts:
interface DisposicionBasuraBooleanos {
  basuras_recolector: boolean;
  basuras_quemada: boolean;
  basuras_enterrada: boolean;
  basuras_recicla: boolean;
  basuras_aire_libre: boolean;
  basuras_nueva_categoria: boolean;  // ← AGREGAR
  basuras_no_aplica: boolean;
}
```

### Problema: Después de actualizar, el formulario sigue viejo

**Causa**: El navegador tiene la versión cacheada

**Solución**:
```bash
# Limpiar cache
Ctrl+Shift+Delete (o Cmd+Shift+Delete en Mac)
Marcar "Cached images and files"
Click "Clear"

# O hacer hard refresh
Ctrl+Shift+R (o Cmd+Shift+R en Mac)
```

---

## 📚 Referencia: Estructura de DISPOSICION_BASURA_CATEGORIAS

```typescript
export const DISPOSICION_BASURA_CATEGORIAS = {
  // Clave: nombre corto sin espacios
  recolector: {
    // Campo booleano en el almacenamiento
    campo: 'basuras_recolector',
    
    // Palabras clave para detectar esta opción (case-insensitive)
    palabrasEtiqueta: ['palabra1', 'palabra2', 'palabra3'],
    
    // Ejemplos reales de labels que usan estas palabras
    ejemplos: ['Ejemplo 1', 'Ejemplo 2'],
    
    // Descripción legible (para documentación)
    descripcion: 'Descripción de qué es esta categoría'
  }
};
```

---

## 💡 Pro Tips

### Tip 1: Usar patrones genéricos
```typescript
// MALO: Demasiado específico
palabrasEtiqueta: ['Recepción Municipal de La Paz', 'Servicio Público Metropolitano']

// BUENO: Patrones genéricos
palabrasEtiqueta: ['municipal', 'recolección', 'público']
```

### Tip 2: Agregar variantes comunes
```typescript
// MALO: Asumir un solo formato
palabrasEtiqueta: ['reciclaje']

// BUENO: Incluir variantes
palabrasEtiqueta: ['reciclaj', 'reciclado', 'reciclar', 'relleno sanitario']
```

### Tip 3: Pensar en futuro
```typescript
// Cuando agregues una palabra clave, piensa:
// - ¿Es única para esta categoría?
// - ¿Podría aparecer en otras opciones?
// - ¿Hay variantes ortográficas? (recolección vs recoleción)
```

---

## 🎓 Ejemplo Práctico Completo

### Escenario: Admin agrega "Donación de Ropa y Útiles"

**Paso 1**: Verificar la opción
```
Label exacto: "Donación de Ropa y Útiles"
ID: "id-donacion-001"
```

**Paso 2**: Actualizar configuración
```typescript
export const DISPOSICION_BASURA_CATEGORIAS = {
  // ... categorías existentes ...
  
  reutilizacion: {  // Nueva categoría
    campo: 'basuras_reutilizacion',
    palabrasEtiqueta: ['donación', 'ropa', 'útiles', 'reutiliz', 'reutilización'],
    ejemplos: ['Donación de Ropa y Útiles', 'Donación a Organizaciones'],
    descripcion: 'Basura reutilizable donada a organizaciones'
  }
};
```

**Paso 3**: Actualizar interfaces
```typescript
interface DisposicionBasuraBooleanos {
  basuras_recolector: boolean;
  basuras_quemada: boolean;
  basuras_enterrada: boolean;
  basuras_recicla: boolean;
  basuras_aire_libre: boolean;
  basuras_reutilizacion: boolean;  // ← NUEVA
  basuras_no_aplica: boolean;
}
```

**Paso 4**: Compilar y probar
```bash
npm run build
npm run dev
# Probar en http://localhost:8081
```

---

## ❓ FAQ

**P: ¿Qué pasa si no agrego la nueva opción?**
A: Aparecerá con ❌ en la consola, no se guardará en localStorage, y el API recibirá `false`.

**P: ¿Puedo tener una palabra clave en dos categorías?**
A: No, porque el sistema usa `if...else`. La primera coincidencia se usa.

**P: ¿Cómo reporto si hay un bug?**
A: Comparte el reporte de consola con:
```javascript
console.log(reporteMapeoDisposicionBasura(configurationData.disposicionBasuraOptions))
```

**P: ¿Necesito reiniciar el servidor?**
A: Solo si haces `npm run build`. Con `npm run dev` (desarrollo) se recompila automáticamente.

---

*Última actualización: 2025-10-24*
*Versión: 1.0 - Sistema 100% Dinámico*
