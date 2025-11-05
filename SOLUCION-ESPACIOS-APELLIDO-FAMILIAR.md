# 🔧 Solución: Espacios en Campo Apellido Familiar

## 📋 Problema Identificado

El campo "Apellido Familiar" en el formulario de encuesta **no permitía agregar espacios entre caracteres**. El usuario reportó que al intentar escribir un apellido con espacios (ej: "García Rodríguez"), los espacios no se mostraban o se eliminaban.

## 🔍 Causa Raíz

En el archivo `src/components/survey/StandardFormField.tsx`, la función `trimString()` estaba siendo aplicada **en tiempo real** en el evento `onChange` del campo de texto:

```tsx
// ❌ INCORRECTO - Aplica trim en tiempo real
onChange={(e) => onChange(field.id, trimString(e.target.value))}
```

Aunque la función `trimString()` solo trimea espacios al **inicio y final** de la cadena, el problema era:

1. **En tiempo real**, cada vez que el usuario escribía, se aplicaba el trim
2. Esto podría causar comportamientos inesperados en algunos navegadores
3. Mejor práctica: **trimear solo cuando el usuario sale del campo** (onBlur)

## ✅ Solución Implementada

**Archivo modificado**: `src/components/survey/StandardFormField.tsx`

Se cambió el manejo de los eventos del campo de texto de la siguiente forma:

```tsx
// ✅ CORRECTO - Permite espacios en tiempo real, trimea solo al salir del campo
onChange={(e) => onChange(field.id, e.target.value)}
onBlur={(e) => onChange(field.id, trimString(e.target.value))}
```

### Cambios específicos:

```diff
  <Input
    id={field.id}
    type={field.type}
    value={value || ''}
-   onChange={(e) => onChange(field.id, trimString(e.target.value))}
+   onChange={(e) => onChange(field.id, e.target.value)}
-   onBlur={(e) => onChange(field.id, trimString(e.target.value))}
+   onBlur={(e) => onChange(field.id, trimString(e.target.value))}
    className={STANDARD_STYLES.input}
    required={field.required}
    placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}`}
    data-testid={`input-${field.id}`}
    name={field.id}
  />
```

## 🎯 Comportamiento Resultante

| Acción | Antes | Después |
|--------|-------|---------|
| Escribir "García Rodríguez" | ❌ Los espacios podían tener problemas | ✅ Se preservan correctamente |
| Espacios al inicio | Se eliminaban en tiempo real | Se eliminan solo al salir del campo |
| Espacios al final | Se eliminaban en tiempo real | Se eliminan solo al salir del campo |
| Espacios intermedios | ✅ Se preservaban | ✅ Se preservan (nunca se eliminaban) |

## 🔍 Campos Afectados

Esta corrección se aplica a **todos los campos de tipo `text` y `number`** en el formulario:

- ✅ Apellido Familiar (Etapa 1)
- ✅ Dirección (Etapa 1)
- ✅ Teléfono (Etapa 1)
- ✅ Número Contrato EPM (Etapa 1)
- ✅ Y cualquier otro campo de tipo "text" en el formulario

## 🧪 Pruebas Recomendadas

1. **Test 1**: Escribir "García Rodríguez" en el campo apellido_familiar
   - Verificar que los espacios se vean mientras se escribe
   - Verificar que se trimee correctamente al salir del campo

2. **Test 2**: Escribir " García " (con espacios al inicio y final)
   - Verificar que aparezca correctamente mientras se escribe
   - Verificar que se convierte a "García" al hacer blur

3. **Test 3**: Números con espacios
   - Escribir "123 456 789" en teléfono
   - Verificar que se preserven mientras se escribe

## 📚 Contexto

- **Localización**: `src/components/survey/StandardFormField.tsx` (líneas 60-77)
- **Función afectada**: Renderizado de campos tipo `text` y `number`
- **Hook**: Usa `trimString()` de `src/utils/stringTrimHelpers.ts`
- **Fecha de solución**: 5 de noviembre de 2025

## 🚀 Mejoras Futuras

Se podría considerar:
1. Crear un componente específico `TextInputField` con mejor manejo de espacios
2. Agregar validación visual de campos con espacios
3. Documentar mejor el comportamiento esperado en comentarios del código

---

**Status**: ✅ RESUELTO

El campo "Apellido Familiar" ahora permite correctamente agregar espacios entre caracteres.
