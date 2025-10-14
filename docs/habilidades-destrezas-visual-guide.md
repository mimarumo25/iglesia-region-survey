# 🎨 Guía Visual: Habilidades y Destrezas

## Vista del Formulario

### Sección 9: Habilidades y Destrezas

```
┌────────────────────────────────────────────────────────────────────┐
│ 💡 Habilidades y Destrezas                                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Selecciona las habilidades profesionales y destrezas técnicas     │
│ del miembro familiar                                               │
│                                                                     │
│ ┌──────────────────────────┐  ┌──────────────────────────────┐   │
│ │ 💡 Habilidades           │  │ 🔧 Destrezas Técnicas        │   │
│ │ Profesionales            │  │                               │   │
│ ├──────────────────────────┤  ├──────────────────────────────┤   │
│ │                          │  │                               │   │
│ │ [Seleccionar...     ▼]  │  │ [Seleccionar...         ▼]  │   │
│ │                          │  │                               │   │
│ │ ┌──────────────────────┐ │  │ ┌──────────────────────────┐ │   │
│ │ │ Selected:            │ │  │ │ Selected:                │ │   │
│ │ │                      │ │  │ │                          │ │   │
│ │ │ [Comunicación x]     │ │  │ │ [Carpintería x]          │ │   │
│ │ │ [Trabajo equipo x]   │ │  │ │ [Electricidad x]         │ │   │
│ │ │ [Liderazgo x]        │ │  │ │ [Plomería x]             │ │   │
│ │ │                      │ │  │ │                          │ │   │
│ │ │      [Limpiar todo]  │ │  │ │      [Limpiar todo]      │ │   │
│ │ └──────────────────────┘ │  │ └──────────────────────────┘ │   │
│ └──────────────────────────┘  └──────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## Estados del Componente

### 1. Estado Inicial (Sin selección)
```
┌─────────────────────────────────────┐
│ 💡 Habilidades Profesionales        │
├─────────────────────────────────────┤
│                                     │
│ [Seleccionar habilidades...    ▼] │
│                                     │
└─────────────────────────────────────┘
```

### 2. Estado de Loading
```
┌─────────────────────────────────────┐
│ 💡 Habilidades Profesionales        │
├─────────────────────────────────────┤
│                                     │
│ [⏳ Cargando...                  ▼]│
│                                     │
└─────────────────────────────────────┘
```

### 3. Estado con Error
```
┌─────────────────────────────────────┐
│ 💡 Habilidades Profesionales        │
├─────────────────────────────────────┤
│                                     │
│ [Seleccionar habilidades...    ▼] │
│                                     │
│ ⚠️ Error al cargar habilidades      │
└─────────────────────────────────────┘
```

### 4. Dropdown Abierto
```
┌─────────────────────────────────────┐
│ 💡 Habilidades Profesionales        │
├─────────────────────────────────────┤
│                                     │
│ [Seleccionar habilidades...    ▲] │
│ ┌─────────────────────────────────┐│
│ │ 🔍 Buscar habilidad...          ││
│ ├─────────────────────────────────┤│
│ │ ✓ Comunicación efectiva         ││
│ │ ✓ Trabajo en equipo             ││
│ │   Liderazgo                     ││
│ │   Resolución de problemas       ││
│ │   Pensamiento crítico           ││
│ │   Creatividad                   ││
│ │   Adaptabilidad                 ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 5. Con Chips Seleccionados
```
┌─────────────────────────────────────┐
│ 💡 Habilidades Profesionales        │
├─────────────────────────────────────┤
│                                     │
│ [3 seleccionados               ▼] │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Selected:                       ││
│ │                                 ││
│ │ [Comunicación efectiva    ×]   ││
│ │ [Trabajo en equipo        ×]   ││
│ │ [Liderazgo                ×]   ││
│ │                                 ││
│ │            [Limpiar todo]       ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## Interacciones del Usuario

### Flujo de Selección:

```
1. Usuario hace click en selector
   ↓
2. Se abre dropdown con lista de opciones
   ↓
3. Usuario escribe en buscador (opcional)
   ↓
4. Lista se filtra en tiempo real
   ↓
5. Usuario hace click en opción
   ↓
6. Opción se agrega como chip
   ↓
7. Dropdown permanece abierto para más selecciones
   ↓
8. Usuario puede:
   - Seleccionar más opciones
   - Buscar otras opciones
   - Hacer click fuera para cerrar
```

### Flujo de Eliminación:

```
Opción A: Eliminar Individual
1. Usuario hace click en [×] del chip
   ↓
2. Chip se elimina inmediatamente
   ↓
3. Opción vuelve a estar disponible en el dropdown

Opción B: Limpiar Todo
1. Usuario hace click en "Limpiar todo"
   ↓
2. Todos los chips se eliminan
   ↓
3. Selector vuelve a estado inicial
```

---

## Estilos y Colores

### Sección Principal
- **Background**: `bg-amber-50` (claro) / `bg-amber-900/10` (oscuro)
- **Border**: `border-amber-200` (claro) / `border-amber-800` (oscuro)
- **Icon**: `text-amber-600`

### Selector (Botón)
- **Background**: `bg-input`
- **Border**: `border-input-border` (hover: `border-primary`)
- **Text**: `text-foreground`
- **Focus**: Ring con `ring-primary/20`

### Chips
- **Background**: `bg-secondary`
- **Text**: `text-secondary-foreground`
- **Hover**: `bg-secondary/80`
- **Delete Button**: Hover con `bg-destructive/20`

### Dropdown
- **Background**: `bg-popover`
- **Border**: `border-border`
- **Item Hover**: `bg-accent`
- **Item Selected**: Check icon visible

---

## Ejemplos de Uso en Código

### JSX Completo:
```tsx
<FormField
  control={form.control}
  name="habilidades"
  render={({ field }) => (
    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border shadow-sm">
      <FormLabel className="text-foreground font-bold text-sm flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        Habilidades Profesionales
      </FormLabel>
      <FormControl>
        <MultiSelectWithChips
          options={habilidades}
          value={field.value || []}
          onChange={field.onChange}
          placeholder="Seleccionar habilidades..."
          searchPlaceholder="Buscar habilidad..."
          emptyText="No se encontraron habilidades"
          isLoading={habilidadesLoading}
          error={habilidadesError}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Responsive Design

### Desktop (≥768px):
```
┌─────────────────────────────────────────────────────────┐
│ 💡 Habilidades y Destrezas                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────────────┐    ┌────────────────────┐       │
│ │ Habilidades        │    │ Destrezas          │       │
│ │ [Selector...    ▼] │    │ [Selector...    ▼] │       │
│ │ [Chips...]         │    │ [Chips...]         │       │
│ └────────────────────┘    └────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### Mobile (<768px):
```
┌───────────────────────────┐
│ 💡 Habilidades y Destrezas│
├───────────────────────────┤
│                           │
│ ┌───────────────────────┐│
│ │ Habilidades           ││
│ │ [Selector...       ▼] ││
│ │ [Chips...]            ││
│ └───────────────────────┘│
│                           │
│ ┌───────────────────────┐│
│ │ Destrezas             ││
│ │ [Selector...       ▼] ││
│ │ [Chips...]            ││
│ └───────────────────────┘│
└───────────────────────────┘
```

---

## Casos de Prueba Visual

### ✅ Caso 1: Agregar Primera Habilidad
```
ANTES:
[Seleccionar habilidades...]

DESPUÉS:
[1 seleccionado]
┌─────────────────────────┐
│ [Comunicación efectiva ×]│
└─────────────────────────┘
```

### ✅ Caso 2: Agregar Múltiples
```
[3 seleccionados]
┌─────────────────────────────────────┐
│ [Comunicación efectiva          ×] │
│ [Trabajo en equipo              ×] │
│ [Liderazgo                      ×] │
│                [Limpiar todo]      │
└─────────────────────────────────────┘
```

### ✅ Caso 3: Buscar y Filtrar
```
Dropdown abierto:
┌───────────────────────────┐
│ 🔍 [comu...]              │
├───────────────────────────┤
│ ✓ Comunicación efectiva   │ ← Match
│   Comunicación verbal     │ ← Match
└───────────────────────────┘
```

### ✅ Caso 4: Sin Resultados
```
Dropdown abierto:
┌───────────────────────────┐
│ 🔍 [xyz123...]            │
├───────────────────────────┤
│ No se encontraron         │
│ habilidades               │
└───────────────────────────┘
```

---

## Animaciones y Transiciones

### Hover en Chip:
```css
transition: background-color 200ms ease-in-out
bg-secondary → bg-secondary/80
```

### Hover en Delete Button:
```css
transition: background-color 200ms ease-in-out
transparent → bg-destructive/20
```

### Dropdown Open/Close:
```css
Animación nativa de Radix UI Popover
Fade + Scale from trigger
```

---

## Accesibilidad

### Navegación por Teclado:
```
Tab        → Enfocar selector
Enter      → Abrir dropdown
↑/↓        → Navegar opciones
Enter      → Seleccionar/Deseleccionar
Escape     → Cerrar dropdown
Tab        → Enfocar siguiente campo
```

### ARIA Labels:
```html
<button role="combobox" aria-expanded="false">
  Seleccionar habilidades...
</button>

<div role="listbox">
  <div role="option" aria-selected="true">
    Comunicación efectiva
  </div>
</div>

<button aria-label="Remover Comunicación efectiva">
  ×
</button>
```

---

**Última actualización**: 2025-01-10
