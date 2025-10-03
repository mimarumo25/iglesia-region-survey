/**
 * Autocomplete Utilities
 * 
 * A collection of reusable utilities and helper functions for Autocomplete components.
 * These utilities provide consistent data handling, validation, and transformation patterns
 * for autocomplete interactions throughout the application.
 */

import * as React from 'react';
import { AutocompleteOption } from '@/components/ui/autocomplete';

/**
 * Configuration item interface for structured data
 */
export interface ConfigurationItem {
  id: string;
  nombre: string;
}

/**
 * Safely transforms an AutocompleteOption array to ensure all required properties exist
 * @param options - Array of autocomplete options (may be undefined or malformed)
 * @returns Safe array of AutocompleteOption with guaranteed properties
 */
export const safeAutocompleteOptions = (options?: any[]): AutocompleteOption[] => {
  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .filter(option => option != null) // Remove null/undefined items
    .map((option, index) => ({
      value: option.value?.toString() || option.id?.toString() || `option-${index}`,
      label: option.label || option.nombre || option.name || 'Sin nombre',
      description: option.description || option.descripcion || undefined,
      category: option.category || option.categoria || undefined,
      popular: Boolean(option.popular),
      disabled: Boolean(option.disabled || option.deshabilitado),
    }))
    .filter(option => option.value && option.label); // Remove items without essential data
};

/**
 * Creates a value change handler for form fields that work with ConfigurationItem objects
 * @param onChange - The form field onChange handler
 * @param options - Available autocomplete options
 * @returns A function that handles autocomplete value changes and converts them to ConfigurationItem
 */
export const createConfigurationItemHandler = (
  onChange: (value: ConfigurationItem | null) => void,
  options: AutocompleteOption[]
) => {
  return (value: string) => {
    if (!value) {
      onChange(null);
      return;
    }

    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      onChange({
        id: selectedOption.value,
        nombre: selectedOption.label
      });
    } else {
      onChange(null);
    }
  };
};

/**
 * Extracts the ID from a ConfigurationItem value for use in autocomplete components
 * @param value - The ConfigurationItem or null
 * @returns The ID string or empty string
 */
export const extractConfigurationItemId = (value: ConfigurationItem | null | undefined): string => {
  return value?.id || '';
};

/**
 * Creates a comprehensive autocomplete configuration object for consistent usage
 * @param options - Available options
 * @param loading - Loading state
 * @param error - Error state
 * @param fieldConfig - Additional field configuration
 * @returns Complete configuration object for AutocompleteWithLoading
 */
export interface AutocompleteFieldConfig {
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  errorText?: string;
}

export const createAutocompleteConfig = (
  options: AutocompleteOption[],
  loading: boolean,
  error: any,
  fieldConfig: AutocompleteFieldConfig = {}
) => {
  return {
    options: safeAutocompleteOptions(options),
    isLoading: loading,
    error: error,
    placeholder: fieldConfig.placeholder || 'Seleccionar opción...',
    emptyText: fieldConfig.emptyText || 'No hay opciones disponibles',
    searchPlaceholder: fieldConfig.searchPlaceholder || 'Buscar...',
    errorText: fieldConfig.errorText || 'Error al cargar opciones',
  };
};

/**
 * Validates that autocomplete props are properly formatted
 * @param props - The props object to validate
 * @returns Boolean indicating if props are valid
 */
export const validateAutocompleteProps = (props: any): boolean => {
  const requiredProps = ['options', 'onValueChange'];
  const missingProps = requiredProps.filter(prop => !(prop in props));
  
  if (missingProps.length > 0) {
    return false;
  }

  if (!Array.isArray(props.options)) {
    return false;
  }

  if (typeof props.onValueChange !== 'function') {
    return false;
  }

  return true;
};

/**
 * Creates a debounced search handler for autocomplete components
 * @param searchFn - The search function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced search function
 */
export const createDebouncedSearch = (
  searchFn: (query: string) => void,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout;

  return (query: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => searchFn(query), delay);
  };
};

/**
 * React Hook for managing autocomplete state and handlers
 * @param options - Available options
 * @param onChange - Value change handler
 * @param initialValue - Initial value
 * @returns Autocomplete state and handlers
 */
export const useAutocompleteState = (
  options: AutocompleteOption[],
  onChange: (value: string) => void,
  initialValue?: string
) => {
  const [value, setValue] = React.useState(initialValue || '');
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleValueChange = React.useCallback((newValue: string) => {
    setValue(newValue);
    onChange(newValue);
    setIsOpen(false);
    setSearchQuery('');
  }, [onChange]);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return {
    value,
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    handleValueChange,
    filteredOptions,
  };
};

export default {
  safeAutocompleteOptions,
  createConfigurationItemHandler,
  extractConfigurationItemId,
  createAutocompleteConfig,
  validateAutocompleteProps,
  createDebouncedSearch,
  useAutocompleteState,
};
