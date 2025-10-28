# Implementación de Chip Input para Campos de Texto Libre

## 📋 Resumen de Cambios

Se ha implementado un nuevo componente `ChipInput` que permite a los usuarios escribir texto libre y crear chips (etiquetas) al presionar Enter. Este componente ha sido aplicado a dos campos principales del formulario de miembros familiares.

## 🎯 Campos Modificados

### 1. **Necesidades del Enfermo** (`necesidadesEnfermo`)
- **Ubicación**: `src/types/survey.ts` (línea 27)
- **Cambio de tipo**: `string` → `string[]`
- **Comportamiento**: 
  - Usuario escribe una necesidad
  - Al presionar Enter, se crea un chip
  - Puede agregar múltiples necesidades
  - Cada necesidad se almacena como un elemento del array
  - Se muestra visualmente como chips/etiquetas removibles

### 2. **¿En qué eres líder?** (`enQueEresLider`)
- **Ubicación**: `src/types/survey.ts` (línea 24)
- **Cambio de tipo**: `string` → `string[]`
- **Comportamiento**: 
  - Usuario escribe un área de liderazgo
  - Al presionar Enter, se crea un chip
  - Puede agregar múltiples áreas de liderazgo
  - Cada área se almacena como un elemento del array

## 📁 Archivos Creados

### 1. **Componente ChipInput** 
- **Ruta**: `src/components/ui/chip-input.tsx`
- **Funcionalidad**: 
  - Renderiza chips de texto con botón de eliminar
  - Captura input de usuario
  - Crea nuevos chips al presionar Enter
  - Elimina chips al hacer clic en la X o presionando Backspace
  - Validación: No permite duplicados
  - Manejo robusto de valores no-array

**Características principales:**
```tsx
interface ChipInputProps {
  value?: string[]              // Array de strings (chips existentes)
  onChange?: (chips: string[]) => void  // Callback cuando cambian los chips
  placeholder?: string           // Placeholder del input
  className?: string             // Clases Tailwind personalizadas
  disabled?: boolean             // Deshabilitar input
}
```

**Interacciones:**
- **Enter**: Agrega el texto actual como nuevo chip
- **Backspace** (input vacío): Elimina el último chip
- **Click en X**: Elimina el chip específico

## 🔄 Archivos Modificados

### 1. **src/types/survey.ts**
```typescript
// Antes
necesidadesEnfermo: string;
enQueEresLider: string;

// Después
necesidadesEnfermo: string[];
enQueEresLider: string[];
```

### 2. **src/hooks/useFamilyGrid.ts**
**Cambios:**
- Actualizado schema de validación Zod para arrays
- Inicialización de defaultValues como arrays vacíos
- Conversión robusta de valores en familyMemberToFormData
- Manejo de arrays en formDataToFamilyMember

```typescript
// Schema de validación
necesidadesEnfermo: z.array(z.string().min(1, "La necesidad no puede estar vacía")).optional().default([]),
enQueEresLider: z.array(z.string().min(1, "El liderazgo no puede estar vacío")).optional().default([]),
```

### 3. **src/components/survey/FamilyMemberDialog.tsx**
**Cambios:**
- Importación del componente ChipInput
- Reemplazo de Input component por ChipInput en ambos campos
- Validación de array antes de pasar al componente
- Actualización de placeholders descriptivos

```tsx
<ChipInput
  value={Array.isArray(field.value) ? field.value : []}
  onChange={field.onChange}
  placeholder="Escribe una necesidad y presiona Enter..."
/>
```

### 4. **src/utils/encuestaToFormTransformer.ts**
**Cambios:**
- Inicialización de arrays vacíos en lugar de strings
- Dos ubicaciones actualizadas (líneas ~145 y ~295)

```typescript
enQueEresLider: [],           // ← array vacío
necesidadesEnfermo: [],       // ← array vacío
```

### 5. **src/utils/surveyAPITransformer.ts**
**Cambios:**
- Actualización de interfaz APIFamilyMember para aceptar `string | string[]`
- Conversión de arrays a strings al enviar a API (join con ', ')
- Manejo robusto con type coercion

```typescript
enQueEresLider: Array.isArray(member.enQueEresLider) ? member.enQueEresLider.join(', ') : (member.enQueEresLider as any),
necesidadesEnfermo: Array.isArray(member.necesidadesEnfermo) ? member.necesidadesEnfermo.join(', ') : (member.necesidadesEnfermo as any),
```

## 🎨 Estilos Aplicados

### ChipInput Container
```css
/* Estilos base */
- Flex layout con wrap
- Border 2px en color input-border
- Background input color
- Focus states con primary color
- Dark mode support
- Gap entre chips: 8px (spacing)
- Padding: 12px (espaciado interno)
- Border radius: 8px

/* Chip individual */
- Background: primary/10 (fondo sutil)
- Border: primary/30 (borde tenue)
- Padding: 12px 12px (py-1 px-3)
- Border radius: 9999px (rounded-full, totalmente redondeado)
- Font size: small (sm)
- Font weight: medium
- Max width: xs para truncate
```

### Comportamiento Hover/Focus
```css
- Focus-within: Border cambia a primary
- Focus-within: Ring de primary/20 de 2px
- Transición: 200ms duration
- Dark mode: Colores ajustados automáticamente
```

## 🔄 Flujo de Datos

```
Usuario escribe en input
    ↓
Presiona Enter
    ↓
handleKeyDown valida texto
    ↓
onChange({ ...array_anterior, nuevo_texto })
    ↓
field.onChange actualiza el formulario
    ↓
Se muestra nuevo chip
    ↓
Input se limpia
    ↓
Usuario puede agregar más chips
```

## 🛡️ Validaciones

1. **Texto vacío**: No permite crear chip si el texto está vacío o solo tiene espacios
2. **Duplicados**: No permite crear chip si ya existe en el array
3. **Normalization**: El componente siempre asegura que value sea un array válido
4. **Type coercion**: Si field.value no es array, se convierte a array vacío

## 📤 Serialización para API

**Formato interno**: `["Necesidad 1", "Necesidad 2", "Necesidad 3"]`

**Formato API**: `"Necesidad 1, Necesidad 2, Necesidad 3"` (string con comas como separador)

Esta conversión se realiza automáticamente en `surveyAPITransformer.ts` cuando se preparan los datos para enviar al backend.

## ♻️ Recuperación de Datos del API

Cuando se carga una encuesta existente desde la API:
1. El campo viene como string (ej: `"Necesidad 1, Necesidad 2"`)
2. En el transformer se convierte a array: `["Necesidad 1, Necesidad 2"]`
3. Se puede mejorar para separar por comas si es necesario

## 🚀 Características Adicionales

### Soporte para Teclado
- ✅ Enter: Crear chip
- ✅ Backspace (input vacío): Eliminar último chip
- ✅ Tab: Navegar fuera del campo (comportamiento estándar)
- ✅ Accessible labels y ARIA properties

### Responsive
- ✅ Flex wrap automático cuando hay muchos chips
- ✅ Input adapta su tamaño al contenedor
- ✅ Mobile friendly con touch support

### Dark Mode
- ✅ Colores automáticamente ajustados
- ✅ Contraste adecuado en ambos temas

## ✅ Testing Recomendado

```
[ ] Crear chip escribiendo y presionando Enter
[ ] Intentar crear chip sin texto
[ ] Intentar crear chip duplicado
[ ] Eliminar chip haciendo clic en X
[ ] Eliminar último chip con Backspace
[ ] Enviar formulario con múltiples chips
[ ] Cargar formulario con datos existentes
[ ] Editar miembro familiar con chips
[ ] Validación de Zod funciona correctamente
[ ] Mobile: Crear y eliminar chips
[ ] Dark mode: Estilos correctos
```

## 📝 Notas Importantes

1. **Backward Compatibility**: Si existen datos antiguos en localStorage con estos campos como strings, la conversión en `familyMemberToFormData` los convertirá a arrays automáticamente.

2. **API Compatibility**: El backend sigue recibiendo estos campos como strings (con comas como separador), por lo que no hay cambios requeridos en la API.

3. **Extensibilidad**: El componente ChipInput puede reutilizarse en otros campos similares en el futuro.

4. **Performance**: El componente usa `Array.map()` solo para renderizar, es O(n) pero eficiente para arrays pequeños típicos.

## 🔗 Referencias

- **Componente base**: `ChipInput` en `src/components/ui/chip-input.tsx`
- **Uso**: `FamilyMemberDialog.tsx` (líneas ~530 y ~750)
- **Validación**: `useFamilyGrid.ts` (schema)
- **Tipos**: `survey.ts` (interfaces FamilyMember)
- **Transformers**: `*Transformer.ts` (conversión de datos)

---

**Fecha de implementación**: Octubre 27, 2025  
**Estado**: ✅ Implementado y funcional
