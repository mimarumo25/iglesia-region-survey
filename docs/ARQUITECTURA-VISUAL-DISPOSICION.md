# 🏗️ Arquitectura Visual: Sistema 100% Dinámico de Disposición de Basura

## Diagrama 1: Flujo de Datos (End-to-End)

```
┌─────────────────────────────────────────────────────────────────┐
│                      USUARIO                                    │
│         Selecciona checkboxes en el formulario                  │
│                                                                 │
│  ☑ Recolección Pública      ☐ Enterrio                         │
│  ☑ Quema                    ☐ Reciclaje                        │
│  ☐ Botadero                 ☐ Compostaje                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │   onChange Event           │
        │  selectedIds =             │
        │  ["id-123", "id-456"]      │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌──────────────────────────────────────┐
        │  handleFieldChange(fieldId, value)   │
        │  src/components/SurveyForm.tsx       │
        │                                      │
        │  if (fieldId === 'disposicion_basura')
        │    procesarDisposicionBasura(...)    │
        └────────────┬───────────────────────────┘
                     │
                     ▼
        ┌───────────────────────────────────────────┐
        │  procesarDisposicionBasura()              │
        │  src/utils/disposicionBasuraMapping.ts   │
        │                                          │
        │  1. Recibe: ["id-123", "id-456"]        │
        │  2. Busca opciones en config            │
        │  3. Extrae labels                       │
        │  4. Mapea por palabras clave            │
        │  5. Retorna booleanos                   │
        └────────────┬────────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────────────────┐
        │  Resultado del Mapeo                 │
        │                                      │
        │  {                                   │
        │    basuras_recolector: true,  ✓     │
        │    basuras_quemada: true,     ✓     │
        │    basuras_enterrada: false,  ✗     │
        │    basuras_recicla: false,    ✗     │
        │    basuras_aire_libre: false, ✗     │
        │    basuras_no_aplica: false   ✗     │
        │  }                                   │
        └────────────┬───────────────────────┘
                     │
                     ▼
        ┌───────────────────────────────────┐
        │  setFormData(updated)             │
        │  Actualizar estado del formulario │
        └────────────┬─────────────────────┘
                     │
                     ▼
        ┌───────────────────────────────────┐
        │  saveSurveyToLocalStorage()       │
        │  Persistir en localStorage        │
        └────────────┬─────────────────────┘
                     │
                     ▼
        ┌───────────────────────────────────┐
        │  localStorage                     │
        │  "parish-survey-draft"            │
        │                                   │
        │  {                                │
        │    "disposicion_basuras": {      │
        │      "recolector": true,         │
        │      "quemada": true,            │
        │      "enterrada": false,         │
        │      ...                         │
        │    }                             │
        │  }                               │
        └────────────┬─────────────────────┘
                     │
                     ▼
        ┌───────────────────────────────────┐
        │  API Submission                   │
        │  POST /encuestas                  │
        │  (cuando el usuario envía)        │
        └───────────────────────────────────┘
```

## Diagrama 2: Estructura de Carpetas

```
src/
├── components/
│   └── SurveyForm.tsx                    ← CONSUMIDOR
│       └── handleFieldChange()           ← Llamada: procesarDisposicionBasura()
│
├── hooks/
│   ├── useConfigurationData.ts           ← Obtiene opciones de API
│   └── useDisposicionBasuraMapping.ts    ← INTERFAZ REUTILIZABLE
│       └── Envuelve: procesarDisposicionBasura()
│
├── utils/
│   └── disposicionBasuraMapping.ts       ← LÓGICA CENTRALIZADA
│       ├── DISPOSICION_BASURA_CATEGORIAS ← CONFIGURACIÓN (palabras clave)
│       ├── mapearLabelACategoria()
│       ├── procesarDisposicionBasura()
│       ├── validarMapeoCompleto()
│       └── reporteMapeoDisposicionBasura()
│
└── docs/
    ├── MAPEO-DINAMICO-DISPOSICION-BASURA.md
    ├── EJEMPLOS-USO-DISPOSICION-BASURA.md
    └── GUIA-AGREGAR-NUEVAS-OPCIONES.md
```

## Diagrama 3: Mapeo de Palabras Clave (Core Logic)

```
┌───────────────────────────────────────────────────────────────────┐
│                   API RETORNA OPCIONES                            │
│                                                                   │
│  [                                                                │
│    {id: "id-1", label: "Recolección Pública"},                  │
│    {id: "id-2", label: "Quema en Hornillo"},                    │
│    {id: "id-3", label: "Enterrio en Predio"},                   │
│    {id: "id-4", label: "Reciclaje Avanzado"}                    │
│  ]                                                                │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│         DISPOSICION_BASURA_CATEGORIAS (Configuración)            │
│                                                                  │
│  recolector: {                                                   │
│    palabrasEtiqueta: ['recolección', 'empresa', 'pública', ...] │
│  }                                                               │
│                                                                  │
│  quemada: {                                                      │
│    palabrasEtiqueta: ['quema', 'incineración', ...]             │
│  }                                                               │
│                                                                  │
│  enterrada: {                                                    │
│    palabrasEtiqueta: ['enterr', 'enterrado', ...]               │
│  }                                                               │
│                                                                  │
│  recicla: {                                                      │
│    palabrasEtiqueta: ['reciclaj', 'composta', ...]              │
│  }                                                               │
│                                                                  │
│  aireLibre: {                                                    │
│    palabrasEtiqueta: ['botader', 'río', 'agua', ...]            │
│  }                                                               │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│          BÚSQUEDA: Para cada label de API                        │
│                                                                  │
│  "Recolección Pública".toLowerCase() = "recolección pública"    │
│         ↓                                                        │
│    Buscar en palabrasRecolector:                                │
│    ┌─ 'recolección' ✓ COINCIDENCIA                             │
│    ├─ 'empresa'     ✗                                           │
│    ├─ 'pública'     ✓ COINCIDENCIA                              │
│    └─ ...                                                       │
│                                                                  │
│  → basuras_recolector = true                                    │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  "Quema en Hornillo".toLowerCase() = "quema en hornillo"        │
│         ↓                                                        │
│    Buscar en palabrasQuemada:                                   │
│    ┌─ 'quema'          ✓ COINCIDENCIA                           │
│    ├─ 'incineración'   ✗                                        │
│    └─ ...                                                       │
│                                                                  │
│  → basuras_quemada = true                                       │
│                                                                  │
│  [... similar para otros ...]                                   │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    RESULTADO FINAL                               │
│                                                                  │
│  {                                                               │
│    basuras_recolector: true,   ← "Recolección Pública"         │
│    basuras_quemada: true,       ← "Quema en Hornillo"          │
│    basuras_enterrada: true,     ← "Enterrio en Predio"         │
│    basuras_recicla: true,       ← "Reciclaje Avanzado"         │
│    basuras_aire_libre: false,   ← No seleccionado              │
│    basuras_no_aplica: false     ← No aplica si hay selección   │
│  }                                                               │
└──────────────────────────────────────────────────────────────────┘
```

## Diagrama 4: Reutilización del Hook

```
┌─────────────────────────────────────────────────────────────┐
│        useDisposicionBasuraMapping()                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MÉTODO                          RETORNA            │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  mapearDisposicionBasura()  →  Booleanos          │   │
│  │  opcionesDisponibles        →  Array de opciones  │   │
│  │  obtenerCategoria()         →  String (label)     │   │
│  │  validarMapeo()             →  {valido, noMapeados}   │   │
│  │  obtenerReporte()           →  String (reporte)  │   │
│  │  categorias                 →  CATEGORIAS object │   │
│  │  obtenerSeleccionados()     →  Array de campos   │   │
│  │  resetear()                 →  Booleanos en false   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  USABLE EN:                                                 │
│  - Componentes de reporte                                   │
│  - Validación y debugging                                   │
│  - Consultas de datos                                       │
│  - Filtrados y búsquedas                                    │
│  - Exportación de datos                                     │
└─────────────────────────────────────────────────────────────┘
```

## Diagrama 5: Ciclo de Vida Completo

```
1️⃣  CARGA INICIAL
    ├─ useConfigurationData() obtiene opciones de API
    └─ Opciones se cargan en disposicionBasuraOptions

2️⃣  USUARIO INTERACTÚA
    ├─ Selecciona checkboxes
    └─ onChange dispara handleFieldChange()

3️⃣  MAPEO AUTOMÁTICO
    ├─ procesarDisposicionBasura() procesa IDs
    ├─ Busca palabras clave en labels
    └─ Retorna booleanos mapeados

4️⃣  ACTUALIZACIÓN DE ESTADO
    ├─ setFormData() actualiza React state
    └─ Componente se re-renderiza

5️⃣  GUARDADO LOCAL
    ├─ useEffect detecta cambios en formData
    ├─ saveSurveyToLocalStorage() persiste
    └─ Data disponible aunque cierre el navegador

6️⃣  CARGA DE BORRADOR
    ├─ Al recargar, loadFromStorage() restaura datos
    └─ Booleanos se recuperan exactamente como se dejaron

7️⃣  ENVÍO A SERVIDOR
    ├─ Usuario completa form y hace submit
    ├─ transformFormDataToSurveySession() prepara payload
    └─ SurveySubmissionService.submitSurvey() envía a API

8️⃣  CONFIRMACIÓN EN API
    ├─ API recibe JSON con booleanos correctos
    ├─ Se almacena en base de datos
    └─ Encuesta completada exitosamente
```

## Diagrama 6: Casos de Uso Específicos

```
┌──────────────────────────────────────────────────────────┐
│  CASO 1: Usuario selecciona "Recolección + Compostaje"  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend selecciona: ["id-rec-pub", "id-compost"]     │
│           ↓                                             │
│  Mapeo:   "Recolección Pública"     → basuras_recolector
│           "Compostaje Doméstico"    → basuras_recicla  │
│           ↓                                             │
│  Storage: {                                            │
│    basuras_recolector: true,                          │
│    basuras_recicla: true,                             │
│    otras_basuras: false                               │
│  }                                                     │
│           ↓                                             │
│  API:     POST con disposicion_basuras mapeado        │
│                                                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  CASO 2: Admin agrega nueva opción "Incineración Pro"   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  API retorna: "Incineración Pro"                       │
│           ↓                                             │
│  Código busca en palabrasQuemada: ['quema', ...]      │
│           ↓                                             │
│  ❌ NO ENCUENTRA: "incineración pro" no está          │
│           ↓                                             │
│  SOLUCIÓN:                                            │
│  - Agregar 'incineración' a palabrasQuemada           │
│  - O crear nueva categoría si es diferente            │
│           ↓                                             │
│  Después de actualizar:                               │
│  ✅ AHORA FUNCIONA automáticamente                    │
│                                                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  CASO 3: Validar que todas las opciones están cubiertas │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  validarMapeo() retorna:                               │
│  {                                                     │
│    valido: false,                                      │
│    noMapeados: ["Opción X (ID: id-999)"]              │
│  }                                                     │
│           ↓                                             │
│  ACCIÓN: Revisar DISPOSICION_BASURA_CATEGORIAS       │
│  y agregar palabra clave                              │
│           ↓                                             │
│  validarMapeo() retorna:                               │
│  {                                                     │
│    valido: true,                                       │
│    noMapeados: []                                      │
│  }                                                     │
│                                                        │
└──────────────────────────────────────────────────────────┘
```

## Diagrama 7: Resumen Técnico

```
╔════════════════════════════════════════════════════════════╗
║                    ARQUITECTURA FINAL                      ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  ENTRADA:  Array de IDs seleccionados                     ║
║  ↓                                                         ║
║  PROCESAMIENTO:                                            ║
║  ├─ Lookup opciones en configurationData                 ║
║  ├─ Extraer labels                                        ║
║  ├─ Normalizar a lowercase                               ║
║  ├─ Buscar palabras clave en CATEGORIAS                  ║
║  └─ Mapear a booleanos                                    ║
║  ↓                                                         ║
║  SALIDA:   Objeto con 6 booleanos + 1 para "no_aplica"  ║
║  ↓                                                         ║
║  ALMACENAMIENTO: localStorage                             ║
║  PERSISTENCIA:   Entre sesiones y recargas               ║
║  TRANSMISIÓN:    Via API JSON con disposicion_basuras    ║
║                                                            ║
║  VENTAJAS:                                                 ║
║  ✅ 100% Dinámico                                        ║
║  ✅ Sin IDs hardcodeados                                 ║
║  ✅ Fácil de extender                                    ║
║  ✅ Totalmente tipado en TypeScript                      ║
║  ✅ Debuggable con console.log                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

**Documentación Visual v2.0 - Sistema 100% Dinámico**
*Generada: 2025-10-24*
