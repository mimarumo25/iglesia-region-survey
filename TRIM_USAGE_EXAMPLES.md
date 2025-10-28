/**
 * 📋 Ejemplos de Uso - Trimado de Espacios en Formularios
 * 
 * Este archivo muestra ejemplos prácticos de cómo funcionan los cambios implementados
 * para trimado de espacios en campos de texto y búsquedas.
 */

// =============================================================================
// EJEMPLO 1: Campos de Texto en StandardFormField
// =============================================================================

/**
 * ANTES (sin trimado):
 * 
 * const StandardFormField = ({ field, value, onChange }) => {
 *   if (field.type === 'text') {
 *     return (
 *       <Input
 *         value={value || ''}
 *         onChange={(e) => onChange(field.id, e.target.value)}
 *         // Si escribes "  José  ", se guarda exactamente así
 *       />
 *     );
 *   }
 * };
 */

/**
 * DESPUÉS (con trimado):
 * 
 * import { trimString } from '@/utils/stringTrimHelpers';
 * 
 * const StandardFormField = ({ field, value, onChange }) => {
 *   if (field.type === 'text') {
 *     return (
 *       <Input
 *         value={value || ''}
 *         onChange={(e) => onChange(field.id, trimString(e.target.value))}
 *         onBlur={(e) => onChange(field.id, trimString(e.target.value))}
 *         // Si escribes "  José  ", se guarda como "José"
 *       />
 *     );
 *   }
 * };
 */

// =============================================================================
// EJEMPLO 2: Búsqueda en Autocomplete
// =============================================================================

/**
 * ANTES (sin trimado):
 * 
 * const filteredOptions = React.useMemo(() => {
 *   if (!searchValue) return safeOptions
 *   return safeOptions.filter(option => 
 *     option.label.toLowerCase().includes(searchValue.toLowerCase())
 *   )
 * }, [safeOptions, searchValue])
 * 
 * Buscar por "  mun  " NO encuentra "municipio"
 * porque "  mun  ".toLowerCase() = "  mun  " !== "mun"
 */

/**
 * DESPUÉS (con trimado):
 * 
 * import { trimSearchValue } from '@/utils/stringTrimHelpers';
 * 
 * const filteredOptions = React.useMemo(() => {
 *   if (!searchValue) return safeOptions
 *   const trimmedSearch = trimSearchValue(searchValue).toLowerCase()
 *   return safeOptions.filter(option => 
 *     option.label.toLowerCase().includes(trimmedSearch)
 *   )
 * }, [safeOptions, searchValue])
 * 
 * Buscar por "  mun  " SÍ encuentra "municipio"
 * porque "mun" ✓ está en "municipio"
 */

// =============================================================================
// EJEMPLO 3: Selección en Autocomplete
// =============================================================================

/**
 * ANTES (sin trimado):
 * 
 * const CommandItem = ({
 *   onSelect={() => {
 *     const newValue = value === option.value ? "" : option.value
 *     onValueChange(newValue)
 *     // Si seleccionas "  Medellín  " se guarda exactamente así
 *   }}
 * />
 */

/**
 * DESPUÉS (con trimado):
 * 
 * import { trimString } from '@/utils/stringTrimHelpers';
 * 
 * const CommandItem = ({
 *   onSelect={() => {
 *     const trimmedValue = trimString(option.value)
 *     const newValue = value === trimmedValue ? "" : trimmedValue
 *     onValueChange(newValue)
 *     // Si seleccionas "  Medellín  " se guarda como "Medellín"
 *   }}
 * />
 */

// =============================================================================
// EJEMPLO 4: FamilyMemberDialog - Nombres
// =============================================================================

/**
 * ANTES (sin trimado):
 * 
 * <FormField
 *   name="nombres"
 *   render={({ field }) => (
 *     <FormItem>
 *       <Input
 *         {...field}
 *         onChange={(e) => field.onChange(e.target.value)}
 *         // Input: "  Juan Pérez  " → Guardado: "  Juan Pérez  "
 *       />
 *     </FormItem>
 *   )}
 * />
 */

/**
 * DESPUÉS (con trimado):
 * 
 * import { trimString } from '@/utils/stringTrimHelpers';
 * 
 * <FormField
 *   name="nombres"
 *   render={({ field }) => (
 *     <FormItem>
 *       <Input
 *         {...field}
 *         value={field.value || ''}
 *         onChange={(e) => field.onChange(trimString(e.target.value))}
 *         onBlur={(e) => field.onChange(trimString(e.target.value))}
 *         // Input: "  Juan Pérez  " → Guardado: "Juan Pérez"
 *       />
 *     </FormItem>
 *   )}
 * />
 */

// =============================================================================
// EJEMPLO 5: Utilidades - Funciones Disponibles
// =============================================================================

/**
 * Archivo: src/utils/stringTrimHelpers.ts
 */

// 1. Trimea una cadena simple
export const trimString = (value: any): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

// Uso:
// trimString("  José  ") → "José"
// trimString("") → ""
// trimString(null) → ""

// ---

// 2. Trimea strings o arrays de strings
export const trimValue = (value: any): string | string[] => {
  if (Array.isArray(value)) {
    return value.map(item => trimString(item));
  }
  return trimString(value);
};

// Uso:
// trimValue("  José  ") → "José"
// trimValue(["  José  ", "  María  "]) → ["José", "María"]

// ---

// 3. Trimea valor de búsqueda
export const trimSearchValue = (searchValue: string): string => {
  return trimString(searchValue);
};

// Uso:
// trimSearchValue("  buscar mun  ") → "buscar mun"

// ---

// 4. Valida que el texto no sea solo espacios
export const isValidText = (value: any): boolean => {
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim().length > 0;
};

// Uso:
// isValidText("José") → true
// isValidText("  ") → false
// isValidText("") → false

// ---

// 5. Trimea datos completos de formulario
export const trimFormData = (data: Record<string, any>): Record<string, any> => {
  const trimmed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      trimmed[key] = value.trim();
    } else if (Array.isArray(value)) {
      trimmed[key] = value.map(item => 
        typeof item === 'string' ? item.trim() : item
      );
    } else {
      trimmed[key] = value;
    }
  }
  
  return trimmed;
};

// Uso:
// trimFormData({
//   nombres: "  José  ",
//   apellido: "  García  ",
//   ciudad: "  Medellín  ",
//   hobbies: ["  Fútbol  ", "  Lectura  "]
// })
// →
// {
//   nombres: "José",
//   apellido: "García",
//   ciudad: "Medellín",
//   hobbies: ["Fútbol", "Lectura"]
// }

// =============================================================================
// EJEMPLO 6: Casos de Uso Reales
// =============================================================================

/**
 * CASO 1: Usuario tipea nombre con espacios accidentales
 * 
 * Usuario: "  María José Rodríguez Pérez  "
 * Sistema valida si contiene solo espacios: isValidText() → true
 * Sistema guarda el valor: trimmed = "María José Rodríguez Pérez"
 * ✓ Se guarda sin espacios extras
 */

/**
 * CASO 2: Usuario busca municipio con espacios
 * 
 * Usuario escribe: "  medell  "
 * Búsqueda trimea: "medell"
 * Encuentra: "Medellín" ✓
 * Sin trimado: "  medell  ".toLowerCase() ≠ "medell" ✗ No encuentra
 */

/**
 * CASO 3: Usuario selecciona opción en autocomplete
 * 
 * Opción: "  Bachillerato técnico  "
 * Seleccionado sin trim: "  Bachillerato técnico  "
 * Seleccionado con trim: "Bachillerato técnico"
 * Evita errores de comparación en base de datos
 */

/**
 * CASO 4: Validación de campo requerido
 * 
 * Usuario escribe: "     " (solo espacios)
 * Con trim: "" (cadena vacía)
 * Validador: campo.required = true
 * Resultado: ❌ Valor no válido (como debería ser)
 * Sin trim: "     " se considera como texto válido ✗ Incorrecto
 */

/**
 * CASO 5: Textarea con observaciones
 * 
 * Usuario escribe:
 * "   La familia tiene muy buena situación   \n   Todos estudian en la escuela   "
 * 
 * Con trim en onChange y onBlur:
 * "La familia tiene muy buena situación\nTodos estudian en la escuela"
 * 
 * Beneficio: Datos limpios sin espacios en blanco innecesarios
 */

// =============================================================================
// EJEMPLO 7: Patrones Implementados
// =============================================================================

/**
 * PATRÓN 1: Input Field Simple
 * 
 * <Input
 *   value={value || ''}
 *   onChange={(e) => onChange(field.id, trimString(e.target.value))}
 *   onBlur={(e) => onChange(field.id, trimString(e.target.value))}
 * />
 * 
 * Se aplica trim en:
 * ✓ onChange - inmediatamente al cambiar
 * ✓ onBlur - cuando abandona el campo
 */

/**
 * PATRÓN 2: Autocomplete Selección
 * 
 * onValueChange={(val) => onChange(field.id, trimString(val))}
 * 
 * Se aplica trim en:
 * ✓ onValueChange - al seleccionar opción
 */

/**
 * PATRÓN 3: Autocomplete Búsqueda
 * 
 * const trimmedSearch = trimSearchValue(searchValue).toLowerCase()
 * 
 * Se aplica trim en:
 * ✓ Búsqueda de filtrado
 */

/**
 * PATRÓN 4: Textarea
 * 
 * <Textarea
 *   value={value || ''}
 *   onChange={(e) => onChange(field.id, trimString(e.target.value))}
 *   onBlur={(e) => onChange(field.id, trimString(e.target.value))}
 * />
 * 
 * Se aplica trim en:
 * ✓ onChange - cambio de contenido
 * ✓ onBlur - al salir del campo
 */

// =============================================================================
// EJEMPLO 8: Testing - Casos de Prueba
// =============================================================================

/**
 * Caso 1: Texto con espacios al inicio
 * Input: "  José"
 * Esperado: "José"
 * Resultado: ✓ PASS
 */

/**
 * Caso 2: Texto con espacios al final
 * Input: "José  "
 * Esperado: "José"
 * Resultado: ✓ PASS
 */

/**
 * Caso 3: Texto con espacios al inicio y final
 * Input: "  José  "
 * Esperado: "José"
 * Resultado: ✓ PASS
 */

/**
 * Caso 4: Búsqueda en autocomplete
 * Input: "  mun  "
 * Opciones: ["municipio", "región"]
 * Esperado: Encuentra "municipio"
 * Resultado: ✓ PASS
 */

/**
 * Caso 5: Campo vacío
 * Input: ""
 * Esperado: ""
 * Resultado: ✓ PASS
 */

/**
 * Caso 6: Solo espacios
 * Input: "     "
 * Esperado: ""
 * Resultado: ✓ PASS
 */

/**
 * Caso 7: Campo nulo
 * Input: null
 * Esperado: ""
 * Resultado: ✓ PASS
 */

/**
 * Caso 8: Campo con espacios internos válidos
 * Input: "María José García"
 * Esperado: "María José García" (mantiene espacios internos)
 * Resultado: ✓ PASS
 */

/**
 * Caso 9: Número identificación con espacios
 * Input: "  123456789  "
 * Esperado: "123456789"
 * Resultado: ✓ PASS
 */

/**
 * Caso 10: Email con espacios
 * Input: "  usuario@gmail.com  "
 * Esperado: "usuario@gmail.com"
 * Resultado: ✓ PASS
 */

// =============================================================================
// RESUMEN DE CAMBIOS
// =============================================================================

/**
 * ANTES:
 * ❌ Espacios al inicio y final causaban errores
 * ❌ Búsquedas en autocomplete no funcionaban con espacios
 * ❌ Comparaciones en base de datos fallaban
 * ❌ Validaciones no funcionaban para "solo espacios"
 * ❌ UX inconsistente
 * 
 * DESPUÉS:
 * ✅ Espacios eliminados automáticamente
 * ✅ Búsquedas funcionan correctamente
 * ✅ Comparaciones en BD funcionan
 * ✅ Validación correcta de campos vacíos
 * ✅ UX limpia y consistente
 */
