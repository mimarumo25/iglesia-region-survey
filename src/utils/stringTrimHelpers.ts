/**
 * Utilidades para trimado de espacios en formularios
 * 
 * Este módulo proporciona funciones para eliminar espacios al inicio
 * y al final de cadenas de texto, aplicado en todos los campos de entrada
 * de usuario para evitar errores por espacios en blanco.
 */

/**
 * Trimea una cadena de texto eliminando espacios al inicio y al final
 * Retorna cadena vacía si el valor es nulo o indefinido
 */
export const trimString = (value: any): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

/**
 * Trimea un valor que puede ser string o array de strings
 * Útil para campos de búsqueda en autocompletes
 */
export const trimValue = (value: any): string | string[] => {
  if (Array.isArray(value)) {
    return value.map(item => trimString(item));
  }
  return trimString(value);
};

/**
 * Trimea un array de opciones (búsqueda en filtros)
 */
export const trimSearchValue = (searchValue: string): string => {
  return trimString(searchValue);
};

/**
 * Trimea todas las propiedades de string en un objeto
 * Útil para datos de formulario antes de enviar
 */
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

/**
 * Validar que un texto no sea solo espacios en blanco
 */
export const isValidText = (value: any): boolean => {
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim().length > 0;
};

/**
 * Validar requerimientos de campo con trim
 */
export const validateRequiredField = (value: any): boolean => {
  return isValidText(value);
};

/**
 * Validar longitud mínima después de trim
 */
export const validateMinLength = (value: any, minLength: number): boolean => {
  const trimmed = trimString(value);
  return trimmed.length >= minLength;
};

/**
 * Validar longitud máxima después de trim
 */
export const validateMaxLength = (value: any, maxLength: number): boolean => {
  const trimmed = trimString(value);
  return trimmed.length <= maxLength;
};

/**
 * Aplicar transformación a valor con trim
 */
export const transformTrimmedValue = (value: any, transform?: (val: string) => any): any => {
  const trimmed = trimString(value);
  if (transform) {
    return transform(trimmed);
  }
  return trimmed;
};
