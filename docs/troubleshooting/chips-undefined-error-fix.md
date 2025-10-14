# 🐛 Fix: Mensaje "undefined" en Habilidades y Destrezas

## Problema Reportado

Al agregar chips en el componente de **Habilidades y Destrezas** del diálogo de miembros familiares, aparecía un mensaje de error en rojo con el texto "undefined" debajo del componente, aunque los chips se agregaban correctamente.

## 🔍 Diagnóstico

### Causa Raíz Principal

El problema principal estaba en el uso del componente `<FormMessage />` de React Hook Form para campos que **no necesitan mostrar mensajes de validación** porque el componente personalizado `MultiSelectWithChips` ya maneja sus propios errores.

#### Secuencia del Error:

1. El esquema de validación en `useFamilyGrid.ts` define los campos `habilidades` y `destrezas` con `.default([])`:
   ```typescript
   habilidades: z.array(z.object({...})).default([]),
   destrezas: z.array(z.object({...})).default([]),
   ```

2. React Hook Form integra estos campos en su sistema de validación

3. El componente `<FormMessage />` intenta mostrar mensajes de error de validación de React Hook Form

4. Como estos campos no tienen mensajes de error personalizados definidos en el esquema Zod, `<FormMessage />` muestra `undefined` cuando hay cualquier estado de error en el formulario

### Causas Secundarias

También había problemas menores en el manejo de tipos de datos de la prop `error`:

1. **Hooks**: Retornaban `error: null` en lugar de `undefined`
2. **MultiSelectWithChips**: Tipo ambiguo `string | null` con valor por defecto `null`

### Código Problemático

```typescript
// ❌ FamilyMemberDialog.tsx - PROBLEMA PRINCIPAL
<FormField
  control={form.control}
  name="habilidades"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <MultiSelectWithChips
          {...field}
          error={habilidadesError}  // Ya maneja errores propios
        />
      </FormControl>
      <FormMessage />  {/* ❌ AQUÍ ESTÁ EL PROBLEMA: muestra "undefined" */}
    </FormItem>
  )}
/>

// ❌ useHabilidadesFormulario.ts - Problema secundario
return {
  habilidades,
  isLoading,
  error: error ? 'Error al cargar habilidades' : null  // ❌ null puede causar problemas
};

// ❌ multi-select-chips.tsx - Problema secundario
interface MultiSelectWithChipsProps {
  error?: string | null;  // ❌ Tipo ambiguo
}

export const MultiSelectWithChips = ({
  error = null,  // ❌ Valor por defecto problemático
  // ...
}: MultiSelectWithChipsProps) => {
  // ...
  {error && (  // ❌ null puede pasar esta validación en algunos casos
    <p className="text-sm text-destructive font-medium">{error}</p>
  )}
}
```

## ✅ Solución Implementada

### 1. **SOLUCIÓN PRINCIPAL**: Eliminar `<FormMessage />` (FamilyMemberDialog.tsx)

La solución principal es **NO usar `<FormMessage />`** para campos que ya manejan sus propios errores a través del componente personalizado:

```typescript
// ✅ FamilyMemberDialog.tsx - SOLUCIÓN CORRECTA
<FormField
  control={form.control}
  name="habilidades"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Habilidades Profesionales</FormLabel>
      <FormControl>
        <MultiSelectWithChips
          options={habilidades}
          value={field.value || []}
          onChange={field.onChange}
          error={habilidadesError}  // ✅ Maneja sus propios errores
        />
      </FormControl>
      {/* ✅ FormMessage REMOVIDO - MultiSelectWithChips maneja sus propios errores */}
    </FormItem>
  )}
/>

// Lo mismo para destrezas
<FormField
  control={form.control}
  name="destrezas"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Destrezas Técnicas</FormLabel>
      <FormControl>
        <MultiSelectWithChips
          options={destrezas}
          value={field.value || []}
          onChange={field.onChange}
          error={destrezasError}  // ✅ Maneja sus propios errores
        />
      </FormControl>
      {/* ✅ FormMessage REMOVIDO - MultiSelectWithChips maneja sus propios errores */}
    </FormItem>
  )}
/>
```

**¿Por qué funciona esta solución?**
- `<FormMessage />` muestra mensajes de validación de Zod/React Hook Form
- Los campos `habilidades` y `destrezas` no tienen validaciones que generen mensajes de error
- El componente `MultiSelectWithChips` ya tiene su propio sistema de manejo de errores a través de la prop `error`
- Al remover `<FormMessage />`, eliminamos la duplicación y el mensaje "undefined"

### 2. Actualización de Hooks (Solución secundaria)

### 2. Actualización de Hooks (Solución secundaria)

Mejorar el manejo de errores en los hooks para evitar pasar valores problemáticos:

```typescript
// ✅ useHabilidadesFormulario.ts
return {
  habilidades,
  isLoading,
  error: error ? (error.message || 'Error al cargar habilidades') : undefined  // ✅ undefined cuando no hay error
};

// ✅ useDestrezasFormulario.ts
return {
  destrezas,
  isLoading,
  error: error ? (error.message || 'Error al cargar destrezas') : undefined  // ✅ undefined cuando no hay error
};
```

**Ventajas de esta solución:**
- `undefined` es más semántico que `null` para valores opcionales ausentes
- `error.message` extrae el mensaje del objeto de error de React Query
- Fallback a mensaje genérico si no hay mensaje disponible

### 3. Actualización del Componente MultiSelectWithChips (Solución secundaria)

Simplificar el tipo de datos y eliminar el valor por defecto:

```typescript
// ✅ multi-select-chips.tsx
interface MultiSelectWithChipsProps {
  error?: string;  // ✅ Tipo simple y claro
}

export const MultiSelectWithChips = ({
  options,
  value,
  onChange,
  // ...
  error,  // ✅ Sin valor por defecto, será undefined si no se pasa
  // ...
}: MultiSelectWithChipsProps) => {
  // ...
  
  {/* Mensaje de error - solo se renderiza si hay un error válido */}
  {error && (
    <p className="text-sm text-destructive font-medium">{error}</p>
  )}
}
```

**Ventajas de esta solución:**
- Tipo más simple y explícito (`string` vs `string | null`)
- No hay valor por defecto que pueda causar confusión
- TypeScript garantiza que `error` solo puede ser `string` o `undefined`
- La validación `{error && ...}` funciona correctamente con `undefined`

## 🎯 Resultado

Después de estos cambios:

✅ **No más mensaje "undefined"** debajo de los componentes  
✅ **Los chips se agregan correctamente** sin cambios en funcionalidad  
✅ **Mejor manejo de tipos** con TypeScript  
✅ **Código más limpio y semántico**  

## 📊 Archivos Modificados

```
src/
├── components/
│   ├── survey/
│   │   └── FamilyMemberDialog.tsx     ✏️ ACTUALIZADO (removido <FormMessage /> en habilidades y destrezas)
│   └── ui/
│       └── multi-select-chips.tsx     ✏️ Actualizado (tipo simplificado)
└── hooks/
    ├── useHabilidadesFormulario.ts    ✏️ Actualizado (error: undefined)
    └── useDestrezasFormulario.ts      ✏️ Actualizado (error: undefined)
```

## 🎯 Resumen de Cambios por Archivo

### 1. `FamilyMemberDialog.tsx` (CAMBIO PRINCIPAL ⭐)
- **Acción**: Removido `<FormMessage />` de los campos `habilidades` y `destrezas`
- **Razón**: Evitar duplicación de manejo de errores
- **Impacto**: Elimina el mensaje "undefined" completamente

### 2. `useHabilidadesFormulario.ts` y `useDestrezasFormulario.ts`
- **Acción**: Cambio de `error: null` a `error: undefined`
- **Razón**: Mejor semántica y manejo de tipos TypeScript
- **Impacto**: Prevención de problemas futuros

### 3. `multi-select-chips.tsx`
- **Acción**: Tipo simplificado de `error?: string | null` a `error?: string`
- **Razón**: Eliminar ambigüedad en tipos
- **Impacto**: Código más limpio y predecible

## 🧪 Validación

Para verificar que el fix funciona correctamente:

1. Abrir el diálogo de **Agregar/Editar Miembro Familiar**
2. Ir a la sección **Habilidades y Destrezas**
3. Agregar varios chips de habilidades
4. Agregar varios chips de destrezas
5. **Verificar** que NO aparece ningún mensaje "undefined" en rojo
6. **Verificar** que los chips se agregan y eliminan correctamente

## 💡 Lecciones Aprendidas

### Mejores Prácticas para Componentes con React Hook Form

#### 1. **Evitar Duplicación de Manejo de Errores**

```typescript
// ❌ INCORRECTO: Doble manejo de errores
<FormField name="customField" render={({ field }) => (
  <FormItem>
    <FormControl>
      <CustomComponent 
        {...field} 
        error={customError}  // Componente maneja su propio error
      />
    </FormControl>
    <FormMessage />  {/* ❌ React Hook Form también intenta mostrar errores */}
  </FormItem>
)} />

// ✅ CORRECTO: Solo el componente maneja errores
<FormField name="customField" render={({ field }) => (
  <FormItem>
    <FormControl>
      <CustomComponent 
        {...field} 
        error={customError}  // ✅ Solo una fuente de verdad para errores
      />
    </FormControl>
    {/* ✅ FormMessage omitido cuando el componente maneja sus propios errores */}
  </FormItem>
)} />

// ✅ ALTERNATIVA: Solo React Hook Form maneja errores
<FormField name="customField" render={({ field }) => (
  <FormItem>
    <FormControl>
      <CustomComponent {...field} />
    </FormControl>
    <FormMessage />  {/* ✅ Solo React Hook Form maneja errores */}
  </FormItem>
)} />
```

#### 2. **Cuándo usar `<FormMessage />`**

✅ **SÍ usar** `<FormMessage />` cuando:
- El campo tiene validaciones Zod con mensajes de error personalizados
- No hay un componente personalizado que maneje errores
- Campos estándar: `<Input />`, `<Select />`, `<Textarea />`

❌ **NO usar** `<FormMessage />` cuando:
- El componente personalizado ya maneja su prop `error`
- No hay validaciones que generen mensajes en el esquema Zod
- Se quiere evitar duplicación de mensajes de error

#### 3. **Mejores Prácticas para Props de Error**

1. **Usar `undefined` en lugar de `null`** para valores opcionales ausentes
2. **Evitar valores por defecto** en props opcionales que pueden causar confusión
3. **Tipos simples** (`string`) son preferibles a uniones (`string | null`)
4. **Extraer mensajes** de objetos de error complejos (`error.message`)

### Pattern Recomendado para Error Handling en Hooks

```typescript
// ✅ Pattern recomendado
export const useCustomHook = () => {
  const { data, error, isLoading } = useQuery({ /* ... */ });
  
  return {
    data: data || [],
    isLoading,
    error: error ? (error.message || 'Error genérico') : undefined
  };
};
```

## 🔗 Referencias

- **Componente**: `src/components/survey/FamilyMemberDialog.tsx`
- **Hooks**: `src/hooks/useHabilidadesFormulario.ts`, `src/hooks/useDestrezasFormulario.ts`
- **UI Component**: `src/components/ui/multi-select-chips.tsx`
- **Documentación relacionada**: `docs/habilidades-destrezas-implementation.md`

---

**Fecha de resolución**: 11 de octubre de 2025  
**Estado**: ✅ Resuelto  
**Impacto**: Mejora de UX (eliminación de mensaje de error confuso)
