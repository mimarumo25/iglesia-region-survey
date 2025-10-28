---
titulo: "Guía Visual: Validación de Liderazgo"
fecha: 2025-10-27
tipo: "Guía de Usuario"
---

# 🎯 Guía Visual: Validación de Rol de Liderazgo Familiar

## Flujo de Validación

```
┌─────────────────────────────────────────────────────────────┐
│              ETAPA 4: INFORMACIÓN FAMILIAR                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ¿Hay miembros agregados?
                      /              \
                    NO              SÍ
                     ↓               ↓
              ❌ Error:        ¿Alguno tiene rol de
              "Debe agregar   liderazgo?
              al menos 1       (Cabeza, Hogar, Lider, etc.)
              miembro"          /              \
                              NO              SÍ
                               ↓               ↓
                        ❌ Error:        ✅ Validación
                        "Debe haber    Aprobada
                        al menos 1
                        familiar con   →  [Siguiente →]
                        rol de
                        liderazgo"
```

## Ejemplos Prácticos

### ✅ VÁLIDO - Familia Aprobada

```
┌────────────────────────────────────────────┐
│        Integrantes de la Familia            │
├────────────────────────────────────────────┤
│ 1. 👨 Carlos Gómez López                   │
│    Parentesco: Cabeza de Hogar ✅         │
│    Edad: 45 años                           │
│    [Editar] [Eliminar]                     │
├────────────────────────────────────────────┤
│ 2. 👩 Ana Martínez García                  │
│    Parentesco: Esposa                      │
│    Edad: 42 años                           │
│    [Editar] [Eliminar]                     │
├────────────────────────────────────────────┤
│ 3. 👦 Luis Gómez Martínez                  │
│    Parentesco: Hijo                        │
│    Edad: 18 años                           │
│    [Editar] [Eliminar]                     │
└────────────────────────────────────────────┘
             ↓
        [Siguiente →]  ← Botón HABILITADO
```

**Resultado:** ✅ Avanza a Etapa 5


### ❌ INVÁLIDO - Falta Liderazgo

```
┌────────────────────────────────────────────┐
│        Integrantes de la Familia            │
├────────────────────────────────────────────┤
│ 1. 👩 Ana Martínez García                  │
│    Parentesco: Esposa                      │
│    Edad: 42 años                           │
│    [Editar] [Eliminar]                     │
├────────────────────────────────────────────┤
│ 2. 👦 Luis Gómez Martínez                  │
│    Parentesco: Hijo                        │
│    Edad: 18 años                           │
│    [Editar] [Eliminar]                     │
└────────────────────────────────────────────┘
             ↓
        [Siguiente →]  ← Botón DESHABILITADO

╔════════════════════════════════════════════╗
║  ⚠️  Rol de liderazgo requerido            ║
║─────────────────────────────────────────────║
║  Debe haber al menos un familiar con       ║
║  rol de responsabilidad (ej: Cabeza de     ║
║  Hogar, Jefe de Familia, Líder, etc.)     ║
╚════════════════════════════════════════════╝
```

**Resultado:** ❌ No avanza, muestra error


### ✅ Editar Parentesco para Cumplir

```
Usuario ve error → Click en [Editar]

┌────────────────────────────────────────────┐
│     EDITAR MIEMBRO DE LA FAMILIA            │
├────────────────────────────────────────────┤
│ Nombres: Ana Martínez García               │
│ Parentesco: [Esposa ▼]                     │
│ ┌──────────────────────────────┐           │
│ │ > Cabeza de Hogar ✨ ← AQUÍ  │           │
│ │ > Jefe de Familia            │           │
│ │ > Esposa                     │           │
│ │ > Hijo                       │           │
│ │ > Hija                       │           │
│ │ > Padre                      │           │
│ │ > Madre                      │           │
│ │ > Otro                       │           │
│ └──────────────────────────────┘           │
│                                            │
│ [Cancelar]        [Guardar]                │
└────────────────────────────────────────────┘

      → Selecciona "Cabeza de Hogar"
      → Click [Guardar]
      → Ahora SÍ cumple validación ✅
```

## Palabras Clave Reconocidas 🔑

Cualquiera de estas palabras en el parentesco valida la familia:

| Palabra Clave | Ejemplos | Válido |
|---|---|---|
| **cabeza** | "Cabeza de Hogar", "Cabezafamiliar" | ✅ |
| **hogar** | "Jefe del Hogar", "Responsable Hogar" | ✅ |
| **lider** | "Líder", "Líder Comunitario" | ✅ |
| **jefe** | "Jefe de Familia", "Jefe" | ✅ |
| **familiar** | "Responsable Familiar" | ✅ |
| **responsable** | "Responsable Hogar" | ✅ |
| **hijo** | "Hijo", "Hija" | ❌ |
| **esposa** | "Esposa", "Cónyuge" | ❌ |
| **padre** | "Padre", "Madre" | ❌ |

## Casos de Uso

### Caso 1: Familia Tradicional
```
👨 Jefe de Familia (Carlos) ← ✅ VÁLIDO
👩 Esposa (María)
👦 Hijo (Juan)
👧 Hija (Rosa)
```

### Caso 2: Familia Monoparental
```
👩 Cabeza de Hogar (Ana) ← ✅ VÁLIDO
👦 Hijo (Pedro)
👧 Hija (Sofía)
```

### Caso 3: Familia Extendida
```
👴 Abuelo (Responsable del Hogar) ← ✅ VÁLIDO
👵 Abuela
👨 Padre
👩 Madre
👦 Hijo
```

### Caso 4: ❌ Incompleto - RECHAZADO
```
👩 Esposa (María)
👦 Hijo (Pedro)
👧 Hija (Sofía)
⚠️ No hay "Cabeza de Hogar"
```
→ Debe editar alguno para que sea "Jefe" o similar

## Flujo Usuario Completo

```
1. COMPLETA ETAPAS 1-3 (Información General, Vivienda, Agua)
   ↓

2. LLEGA A ETAPA 4 (Información Familiar)
   ↓

3. AGREGA MIEMBROS CON [+ Agregar Miembro]
   ├─ Primer miembro: Parentesco = "Cabeza de Hogar" ✅
   ├─ Segundo miembro: Parentesco = "Esposa"
   ├─ Tercer miembro: Parentesco = "Hijo"
   └─ ... más miembros
   ↓

4. INTENTA AVANZAR CON [Siguiente]
   ├─ ✅ SI tiene "Cabeza de Hogar" → Pasa a Etapa 5
   └─ ❌ SI NO tiene → Muestra error y queda en Etapa 4
   ↓

5. SI RECIBIÓ ERROR:
   ├─ Hace clic en [Editar] de algún miembro
   ├─ Cambia "Esposa" → "Cabeza de Hogar"
   ├─ O agrega nuevo miembro con "Jefe de Familia"
   ├─ Click [Guardar]
   └─ Ahora vuelve a intentar [Siguiente] ✅
   ↓

6. ETAPA 5: Continúa con el resto de la encuesta...
```

## Notas Técnicas 📝

- La búsqueda **NO es sensible a mayúsculas** (case-insensitive)
  - ✅ "CABEZA DE HOGAR"
  - ✅ "Cabeza de Hogar"  
  - ✅ "cabeza de hogar"

- La búsqueda es **por contenido** (substring)
  - ✅ "Cabeza de Hogar XYZ" (contiene "cabeza")
  - ✅ "Mi Jefe del Hogar" (contiene "hogar")

- Se valida **en cada intento** de avanzar
  - No hay cache
  - Cambios en tiempo real

- **No afecta** otras etapas
  - Etapas 1-3: Sin validación adicional
  - Etapas 5-6: Sin validación de liderazgo

## ¿Qué Sucede si...?

| Situación | Resultado |
|-----------|-----------|
| No agrego ningún miembro | ❌ Error: "Debe agregar al menos 1" |
| Agrego 1 miembro sin rol | ❌ Error: "Debe haber rol de liderazgo" |
| Agrego 2 miembros, ambos sin rol | ❌ Error: "Debe haber rol de liderazgo" |
| Agrego 5 miembros, 1 es "Jefe" | ✅ Válido, avanza |
| Cambio "Jefe" a "Hijo" después | ❌ Error en siguiente intento |
| Elimino al "Jefe" dejando otros | ❌ Error en siguiente intento |

---

**Versión:** 1.0  
**Última actualización:** 2025-10-27  
**Status:** ✅ En Producción
