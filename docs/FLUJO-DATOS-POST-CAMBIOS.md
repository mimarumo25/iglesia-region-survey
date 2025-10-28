# 🔄 FLUJO DE DATOS - POST-CAMBIOS

## 📊 Diagrama Completo del Flujo

```
┌─────────────────────────────────────────────────────────────────────┐
│ USUARIO INTERACTÚA CON FORMULARIO                                  │
│                                                                     │
│  ☑ Pozo séptico                                                    │
│  ☐ Letrina                                                         │
│  ☑ Otra opción                                                     │
│                                                                     │
│  onChange → formData.aguas_residuales = ['1', '3']                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STATE EN COMPONENTE (SurveyForm)                                    │
│                                                                     │
│  formData: {                                                        │
│    aguas_residuales: ['1', '3']  ← Array simple de IDs            │
│  }                                                                  │
│                                                                     │
│  ✅ Ligero, eficiente para renderizar                              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                     (onSaveClick)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ TRANSFORMACIÓN (sessionDataTransformer.ts)                          │
│                                                                     │
│  Input:  formData.aguas_residuales = ['1', '3']                  │
│          configurationData.aguasResidualesOptions = [               │
│            { value: '1', label: 'Pozo séptico' },                 │
│            { value: '2', label: 'Letrina' },                      │
│            { value: '3', label: 'Otra opción' }                   │
│          ]                                                          │
│                                                                     │
│  Función: convertIdsToSelectionMap(['1', '3'], options)           │
│                                                                     │
│  Output: [                                                          │
│    { id: '1', nombre: 'Pozo séptico', seleccionado: true },      │
│    { id: '2', nombre: 'Letrina', seleccionado: false },          │
│    { id: '3', nombre: 'Otra opción', seleccionado: true }        │
│  ]                                                                  │
│                                                                     │
│  ✅ Conversión de forma eficiente a estructura completa            │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ ESTRUCTURA EN localStorage (SurveySessionData)                      │
│                                                                     │
│  {                                                                  │
│    "servicios_agua": {                                             │
│      "sistema_acueducto": { "id": "1", "nombre": "..." },         │
│      "aguas_residuales": [                                         │
│        { "id": "1", "nombre": "Pozo séptico", "seleccionado": true }, │
│        { "id": "2", "nombre": "Letrina", "seleccionado": false }, │
│        { "id": "3", "nombre": "Otra opción", "seleccionado": true }   │
│      ]                                                              │
│    }                                                                │
│  }                                                                  │
│                                                                     │
│  ✅ Persistencia con información completa                          │
│  ✅ Sin pozo_septico, letrina, campo_abierto booleanos            │
│  ✅ UNA FUENTE DE VERDAD                                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
              (Página recargada, usuario vuelve)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ CARGAR DESDE localStorage (SurveyForm.tsx)                          │
│                                                                     │
│  const draftData = JSON.parse(localStorage...)                     │
│                                                                     │
│  formData.aguas_residuales =                                       │
│    convertSelectionMapToIds(                                        │
│      draftData.servicios_agua.aguas_residuales                     │
│    )                                                                │
│                                                                     │
│  Output: ['1', '3']  ← Array simple de IDs                         │
│                                                                     │
│  ✅ Conversión inversa eficiente                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ RENDERIZAR EN FORMULARIO                                            │
│                                                                     │
│  StandardFormField recibe:                                          │
│  - value: ['1', '3']                                               │
│  - options: [                                                       │
│      { value: '1', label: 'Pozo séptico' },                       │
│      { value: '2', label: 'Letrina' },                            │
│      { value: '3', label: 'Otra opción' }                         │
│    ]                                                                │
│                                                                     │
│  Renderiza:                                                         │
│  ☑ Pozo séptico          ← Porque '1' está en array              │
│  ☐ Letrina               ← Porque '2' NO está en array            │
│  ☑ Otra opción           ← Porque '3' está en array              │
│                                                                     │
│  ✅ UI sincronizada con datos guardados                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo Completo: Usuario ↔ Backend

```
┌─────────────────────────────────────────────────────────────────────┐
│ CREAR NUEVA ENCUESTA                                                │
└─────────────────────────────────────────────────────────────────────┘

UI (Formulario)
    ↓
    ├─→ User selecciona opciones
    └─→ formData.aguas_residuales = ['1', '3']
    ↓
    ├─→ Click "Guardar como borrador"
    ↓
SurveyForm.tsx
    ├─→ sessionDataTransformer.transformFormToSession(formData)
    ├─→ convertIdsToSelectionMap(['1', '3'], options)
    ↓
localStorage (SurveySessionData)
    ├─→ aguas_residuales: [
    │   { id: '1', nombre: 'Pozo séptico', seleccionado: true },
    │   { id: '2', nombre: 'Letrina', seleccionado: false },
    │   { id: '3', nombre: 'Otra opción', seleccionado: true }
    │ ]
    ↓
    ├─→ Click "Enviar Encuesta"
    ↓
SurveyForm.tsx
    ├─→ surveyAPITransformer.toAPIFormat(sessionData)
    ├─→ Prepara estructura para API
    ↓
API Backend
    ├─→ POST /encuestas
    ├─→ Recibe: { aguas_residuales: [...] }
    ├─→ Procesa y guarda en BD
    ↓
✅ Encuesta guardada
```

---

## 📥 Flujo de Lectura: Backend → UI

```
┌─────────────────────────────────────────────────────────────────────┐
│ EDITAR ENCUESTA EXISTENTE                                           │
└─────────────────────────────────────────────────────────────────────┘

API Backend
    ↓
    ├─→ GET /encuestas/{id}
    ├─→ Retorna: { aguas_residuales: { id: '1', nombre: 'Pozo...' } }
    ↓
SurveyForm.tsx
    ├─→ encuestaToFormTransformer.transformEncuestaCompleta(apiResponse)
    ├─→ Convierte a formData:
    │   aguas_residuales: ['1']  ← Array de IDs
    ↓
State (formData)
    ├─→ aguas_residuales: ['1']
    ↓
StandardFormField
    ├─→ Renderiza checkboxes
    ├─→ Marca Pozo séptico: ☑ (porque '1' en array)
    ├─→ Marca Letrina: ☐
    ├─→ Marca Otra: ☐
    ↓
UI muestra opciones correctas
    ↓
✅ Usuario puede editar
```

---

## 🔀 Transformaciones Clave

### Transformación 1: Form → Storage

```typescript
// Input (formData después de llenar formulario)
{
  aguas_residuales: ['1', '3', '5']
}

// +

{
  aguasResidualesOptions: [
    { value: '1', label: 'Pozo séptico' },
    { value: '2', label: 'Letrina' },
    { value: '3', label: 'Campo abierto' },
    { value: '4', label: 'Otra opción' },
    { value: '5', label: 'No aplica' }
  ]
}

        ↓ convertIdsToSelectionMap()

// Output (para guardar en localStorage)
[
  { id: '1', nombre: 'Pozo séptico', seleccionado: true },
  { id: '2', nombre: 'Letrina', seleccionado: false },
  { id: '3', nombre: 'Campo abierto', seleccionado: true },
  { id: '4', nombre: 'Otra opción', seleccionado: false },
  { id: '5', nombre: 'No aplica', seleccionado: true }
]
```

### Transformación 2: Storage → Form

```typescript
// Input (de localStorage)
[
  { id: '1', nombre: 'Pozo séptico', seleccionado: true },
  { id: '2', nombre: 'Letrina', seleccionado: false },
  { id: '3', nombre: 'Campo abierto', seleccionado: true },
  { id: '4', nombre: 'Otra opción', seleccionado: false },
  { id: '5', nombre: 'No aplica', seleccionado: true }
]

        ↓ convertSelectionMapToIds()

// Output (para poner en formData)
['1', '3', '5']
```

---

## 💾 Comparativa de Tamaño

### ANTES (Con redundancia)
```json
{
  "servicios_agua": {
    "sistema_acueducto": {...},
    "aguas_residuales": [
      { "id": "1", "nombre": "...", "seleccionado": true },
      // ... 5 items
    ],
    "pozo_septico": false,          ← BYTES EXTRA
    "letrina": false,               ← BYTES EXTRA
    "campo_abierto": false          ← BYTES EXTRA
  }
}

Aproximado: ~350 bytes
```

### DESPUÉS (Limpio)
```json
{
  "servicios_agua": {
    "sistema_acueducto": {...},
    "aguas_residuales": [
      { "id": "1", "nombre": "...", "seleccionado": true },
      // ... 5 items
    ]
  }
}

Aproximado: ~320 bytes
Reducción: ~9% (pequeña pero acumulable con múltiples registros)
```

---

## 🎯 Ventajas del Nuevo Flujo

| Aspecto | Beneficio |
|--------|----------|
| **Simplicidad** | Un solo lugar donde vive la información |
| **Consistencia** | No hay riesgo de desincronización |
| **Debugging** | Nombres incluidos para fácil inspección |
| **Eficiencia** | Menos datos, mismo resultado |
| **Mantenibilidad** | Menos código, menos lugares de error |
| **Escalabilidad** | Patrón puede replicarse a otros campos |

---

## 🔍 Verificación en DevTools

```javascript
// Console, pegar:

// 1. Ver estructura completa
JSON.parse(localStorage.getItem('su-session-data'))

// 2. Ver solo aguas_residuales
JSON.parse(localStorage.getItem('su-session-data')).servicios_agua.aguas_residuales

// 3. Verificar que NO existen los campos antiguos
localStorage.getItem('su-session-data').includes('pozo_septico')  // Debe ser false

// 4. Ver estructura en forma legible
JSON.stringify(
  JSON.parse(localStorage.getItem('su-session-data')).servicios_agua,
  null,
  2
)
```

---

## ✨ Resultado Final

```
┌───────────────────────────────────┐
│   FLUJO DE DATOS OPTIMIZADO       │
├───────────────────────────────────┤
│                                   │
│  UI (Array de IDs)                │
│    ↕                              │
│  Transformer                      │
│    ↕                              │
│  Storage (Array de Objetos)       │
│    ↕                              │
│  API                              │
│                                   │
│  ✅ Claro                         │
│  ✅ Eficiente                     │
│  ✅ Consistente                   │
│  ✅ Mantenible                    │
│                                   │
└───────────────────────────────────┘
```

---

**Versión:** 1.0  
**Fecha:** Octubre 27, 2025  
**Status:** ✅ DOCUMENTACIÓN COMPLETA
