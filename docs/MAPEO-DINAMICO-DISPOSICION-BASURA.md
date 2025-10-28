---
titulo: "MAPEO DINÁMICO - Disposición de Basura 100% Flexible"
fecha: "2025-10-24"
version: "2.0"
---

# 🎯 Sistema de Mapeo Dinámico - Disposición de Basura

## Problema Resuelto

Anteriormente, el código asumía que las opciones de disposición de basura tenían **IDs específicos (1-6)** y labels fijos. Esto causaba problemas cuando:

- ✗ Se agregaban **nuevas opciones** a la API
- ✗ Se **renombraban opciones** existentes
- ✗ Los **IDs eran diferentes** en diferentes ambientes
- ✗ El **label no coincidía** con lo esperado

---

## 💡 Solución: Mapeo 100% Dinámico

El nuevo sistema es **completamente flexible** porque:

1. **No depende de IDs específicos** - Funciona con cualquier ID
2. **Se adapta a cualquier label** - Busca palabras clave en los nombres
3. **Se auto-configura** - No requiere mantenimiento manual
4. **Es totalmente verificable** - Logging completo para debugging

---

## 🏗️ Arquitectura del Sistema

### Capas del Mapeo Dinámico

```
┌─────────────────────────────────────────────────┐
│  UI: Select/Checkboxes (SurveyForm.tsx)         │
│  Selecciona: ["id-abc", "id-def", "id-xyz"]   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Utilidad: disposicionBasuraMapping.ts          │
│  - mapearLabelACategoria()                      │
│  - procesarDisposicionBasura()                  │
│  - validarMapeoCompleto()                       │
│  - reporteMapeoDisposicionBasura()              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Configuración: DISPOSICION_BASURA_CATEGORIAS   │
│  Define palabras clave por categoría            │
│  Actualizable sin cambiar código                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Resultado: Booleanos de almacenamiento         │
│  {                                              │
│    basuras_recolector: true,                    │
│    basuras_quemada: false,                      │
│    basuras_enterrada: true,                     │
│    basuras_recicla: false,                      │
│    basuras_aire_libre: false,                   │
│    basuras_no_aplica: false                     │
│  }                                              │
└─────────────────────────────────────────────────┘
```

---

## 📂 Archivos Involucrados

### 1. **`src/utils/disposicionBasuraMapping.ts`** (Core)
**Propósito**: Lógica centralizada de mapeo dinámico

**Funciones principales**:
```typescript
// Mapear un label a una categoría
mapearLabelACategoria(label: string): string | null

// Procesar IDs seleccionados a booleanos
procesarDisposicionBasura(selectedIds: string[], optionsDelConfig: any[]): DisposicionBasuraBooleanos

// Validar que todas las opciones estén mapeadas
validarMapeoCompleto(optionsDelConfig: any[]): { valido: boolean; noMapeados: string[] }

// Generar reporte de debug
reporteMapeoDisposicionBasura(optionsDelConfig: any[]): string
```

**Configuración dinámicamente editable**:
```typescript
DISPOSICION_BASURA_CATEGORIAS = {
  recolector: {
    campo: 'basuras_recolector',
    palabrasEtiqueta: ['recolección', 'empresa', 'pública', 'municipal', ...],
    ejemplos: ['Recolección Pública', 'Empresa de Recolección', ...],
    descripcion: '...'
  },
  quemada: { ... },
  enterrada: { ... },
  recicla: { ... },
  aireLibre: { ... }
}
```

### 2. **`src/hooks/useDisposicionBasuraMapping.ts`** (Hook)
**Propósito**: Interfaz reutilizable para componentes

**Métodos disponibles**:
```typescript
const {
  mapearDisposicionBasura,      // (selectedIds) => DisposicionBasuraResult
  opcionesDisponibles,           // Todas las opciones de la API
  obtenerCategoria,              // (id) => label
  validarMapeo,                  // () => { valido, noMapeados }
  obtenerReporte,                // () => string (debug)
  categorias,                    // DISPOSICION_BASURA_CATEGORIAS
  obtenerSeleccionados,          // (booleanos) => array de campos en true
  resetear                       // () => todos false
} = useDisposicionBasuraMapping()
```

### 3. **`src/components/SurveyForm.tsx`** (Consumidor)
**Ubicación**: En el handleFieldChange, caso `'disposicion_basura'`

**Código**:
```typescript
} else if (fieldId === 'disposicion_basura') {
  // 100% DINÁMICO: Usar función centralizada
  const selectedIds = Array.isArray(value) ? value : [];
  
  // Procesar con la utilidad centralizada
  const basuraBooleanos = procesarDisposicionBasura(
    selectedIds,
    configurationData.disposicionBasuraOptions || []
  );
  
  // Asignar todos los campos booleanos
  Object.assign(updated, basuraBooleanos);
  
  // DEBUG: Logging completo
  console.log('📊 DISPOSICION BASURA MAPEO:');
  console.log('   Opciones dinámicas:', configurationData.disposicionBasuraOptions);
  console.log('   IDs seleccionados:', selectedIds);
  console.log('   Resultado:', basuraBooleanos);
}
```

---

## 🔄 Flujo Completo: De Selección a Almacenamiento

### Ejemplo: Usuario selecciona "Recolección Pública" y "Quema"

```
1️⃣ SELECCIÓN EN UI
   Usuario hace click en checkboxes:
   ✓ Recolección Pública
   ✓ Quema

2️⃣ CALLBACK handleFieldChange recibe
   fieldId: 'disposicion_basura'
   value: ['id-123', 'id-456']  ← IDs reales de la API

3️⃣ BÚSQUEDA DE OPCIONES
   Busca en configurationData.disposicionBasuraOptions:
   {
     value: 'id-123',
     label: 'Recolección Pública',  ← Encuentra el label
     description: '...',
     ...
   },
   {
     value: 'id-456',
     label: 'Quema en Hornillo',     ← Encuentra el label
     ...
   }

4️⃣ MAPEO POR PALABRAS CLAVE
   Para 'id-123' (Recolección Pública):
     - Label normalizado: 'recolección pública'
     - Busca en palabrasRecolector: ['recolección', ...]
     - ✓ COINCIDENCIA: basuras_recolector = true
   
   Para 'id-456' (Quema en Hornillo):
     - Label normalizado: 'quema en hornillo'
     - Busca en palabrasQuemada: ['quema', ...]
     - ✓ COINCIDENCIA: basuras_quemada = true

5️⃣ RESULTADO DEL MAPEO
   {
     basuras_recolector: true,      ← Sí se seleccionó
     basuras_quemada: true,         ← Sí se seleccionó
     basuras_enterrada: false,      ← No se seleccionó
     basuras_recicla: false,        ← No se seleccionó
     basuras_aire_libre: false,     ← No se seleccionó
     basuras_no_aplica: false       ← No se seleccionó
   }

6️⃣ ALMACENAMIENTO
   Se asignan al estado:
   updated = {
     ...updated,
     basuras_recolector: true,
     basuras_quemada: true,
     basuras_enterrada: false,
     ...
   }

7️⃣ PERSISTENCIA EN localStorage
   Al guardar en localStorage, se transforma:
   SurveySessionData {
     disposicion_basuras: {
       recolector: true,
       quemada: true,
       enterrada: false,
       ...
     },
     ...
   }

8️⃣ ENVÍO A API
   Se transforma nuevamente para API:
   POST /encuestas {
     "disposicion_basuras": {
       "recolector": true,
       "quemada": true,
       ...
     },
     ...
   }
```

---

## 🔧 Cómo Agregar Nuevas Opciones (Sin Cambiar Código)

### Escenario: Admin agrega "Compostaje Avanzado" en la API

**Antes del fix**:
- Cambiar IDs hardcodeados en el código
- Recompilar y desplegar
- Riesgo de bugs

**Después del fix**:
1. El admin agrega opción en la API:
   ```json
   {
     "id": "id-999",
     "nombre": "Compostaje Avanzado",
     "descripcion": "...",
     "activo": true
   }
   ```

2. **El código se auto-adapta** porque:
   - `procesarDisposicionBasura()` busca el label en la configuración
   - Label: "Compostaje Avanzado" contiene "compostaje"
   - Busca "compostaje" en `palabrasRecicla`
   - ✓ Encuentra coincidencia: `basuras_recicla = true`

3. **Sin cambios necesarios** en el código fuente ✨

---

## 🐛 Debugging y Verificación

### 1. Ver el Mapeo en Consola (DevTools)
```
Abre DevTools (F12) → Console
Selecciona checkboxes de disposición de basura
Observa los logs:

📊 DISPOSICION BASURA MAPEO REALIZADO:
   Opciones dinámicas disponibles: [...]
   IDs seleccionados: ["id-1", "id-3"]
   Resultado del mapeo: { basuras_recolector: true, ... }
```

### 2. Verificar localStorage (DevTools)
```
DevTools → Application → LocalStorage → parish-survey-draft
Busca: "disposicion_basuras"
Verifica que coincida con lo seleccionado
```

### 3. Ejecutar Validación Completa
```typescript
// En consola, dentro de un componente que use el hook:
const { validarMapeo, obtenerReporte } = useDisposicionBasuraMapping();

// Ver reporte completo de mapeo
console.log(obtenerReporte());

// Validar que todas las opciones de la API estén mapeadas
const { valido, noMapeados } = validarMapeo();
if (!valido) {
  console.warn('⚠️ Opciones sin mapear:', noMapeados);
}
```

---

## 📊 Tabla de Referencia: Palabras Clave por Categoría

| Categoría | Campo Booleano | Palabras Clave | Ejemplos |
|-----------|---|---|---|
| **Recolección** | `basuras_recolector` | recolección, empresa, pública, municipal, servicio | "Recolección Pública", "Empresa Municipal" |
| **Quemada** | `basuras_quemada` | quema, incineración, incinerador | "Quema", "Incineración", "Quema en Hornillo" |
| **Enterrada** | `basuras_enterrada` | enterr, enterrado | "Enterrio", "Enterrado en Predio" |
| **Reciclada** | `basuras_recicla` | reciclaj, composta, compostaje | "Reciclaje", "Compostaje", "Reciclado" |
| **Aire Libre** | `basuras_aire_libre` | botader, campo abierto, río, quebrada, agua | "Botadero", "Campo Abierto", "Río o Quebrada" |
| **No Aplica** | `basuras_no_aplica` | (automático si no selecciona nada) | "No aplica" |

---

## ✅ Ventajas del Sistema 100% Dinámico

| Ventaja | Cómo Se Logra |
|---------|---|
| 🔄 **Auto-adaptativo** | Busca palabras clave, no IDs específicos |
| 📦 **Mantenible** | Un solo lugar (disposicionBasuraMapping.ts) |
| 🚀 **Escalable** | Nuevas opciones sin cambio de código |
| 🐛 **Debuggable** | Logging completo en consola |
| 💯 **Verificable** | Función `validarMapeoCompleto()` |
| 🔒 **Type-safe** | TypeScript con interfaces tipadas |
| ♻️ **Reutilizable** | Hook disponible para cualquier componente |

---

## 🎯 Próximos Pasos (Si Se Necesitan Nuevas Categorías)

1. Agregar nueva entrada en `DISPOSICION_BASURA_CATEGORIAS`:
   ```typescript
   nueva_categoria: {
     campo: 'basuras_nueva_categoria',
     palabrasEtiqueta: ['palabra1', 'palabra2', ...],
     ejemplos: ['Ejemplo 1', 'Ejemplo 2'],
     descripcion: 'Descripción...'
   }
   ```

2. Agregar campo booleano en `SurveySessionData`:
   ```typescript
   basuras_nueva_categoria?: boolean;
   ```

3. Actualizar `DisposicionBasuraBooleanos` interface:
   ```typescript
   interface DisposicionBasuraBooleanos {
     basuras_recolector: boolean;
     // ... otros campos ...
     basuras_nueva_categoria: boolean;
   }
   ```

4. ¡Listo! El sistema se auto-adapta automáticamente ✨

---

## 📌 Resumen Ejecutivo

```
ANTES:
┌─────────────────────────┐
│ IDs Hardcodeados: 1-6   │
│ Labels Fijos            │
│ Mantenimiento Manual    │
│ Quebradizo              │
└─────────────────────────┘
          ❌

AHORA:
┌──────────────────────────┐
│ Mapeo Dinámico por Label │
│ Auto-adaptativo          │
│ Cero Mantenimiento       │
│ Robusto y Flexible       │
└──────────────────────────┘
          ✅
```

**Beneficio**: El código funciona con **cualquier configuración de opciones** sin cambios necesarios.

---

*Documentación generada: 2025-10-24*
*Versión: 2.0 - Sistema 100% Dinámico*
