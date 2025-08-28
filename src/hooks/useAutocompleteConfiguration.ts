/**
 * Custom Hook for Autocomplete with Configuration Items
 * 
 * This hook provides a simplified interface for using Autocomplete components
 * with ConfigurationItem objects, handling all the conversion logic automatically.
 * 
 * Features:
 * - Automatic conversion between string values and ConfigurationItem objects
 * - Error boundary integration
 * - Loading state handling
 * - Consistent prop validation
 * - Type safety
 */

import { useCallback } from 'react';
import { AutocompleteOption } from '@/components/ui/autocomplete';
import { ConfigurationItem, createConfigurationItemHandler, extractConfigurationItemId, safeAutocompleteOptions } from '@/utils/autocomplete-utils';

export interface UseAutocompleteConfigurationProps {
  options: AutocompleteOption[];
  isLoading?: boolean;
  error?: any;
  value?: ConfigurationItem | null;
  onChange: (value: ConfigurationItem | null) => void;
}

export interface UseAutocompleteConfigurationReturn {
  autocompleteProps: {
    options: AutocompleteOption[];
    value: string;
    onValueChange: (value: string) => void;
    isLoading?: boolean;
    error?: any;
  };
  isValid: boolean;
  hasOptions: boolean;
}

/**
 * Custom hook for managing autocomplete with ConfigurationItem objects
 * 
 * @param props - Configuration props
 * @returns Autocomplete props and utility flags
 * 
 * @example
 * ```tsx
 * const { autocompleteProps, isValid, hasOptions } = useAutocompleteConfiguration({
 *   options: configurationData.sexoOptions,
 *   isLoading: configurationData.sexosLoading,
 *   error: configurationData.sexosError,
 *   value: field.value,
 *   onChange: field.onChange,
 * });
 * 
 * return (
 *   <AutocompleteWithLoading
 *     {...autocompleteProps}
 *     placeholder="Seleccionar sexo"
 *     emptyText="No se encontraron opciones de sexo"
 *     errorText="Error al cargar sexos"
 *   />
 * );
 * ```
 */
export const useAutocompleteConfiguration = ({
  options,
  isLoading = false,
  error = null,
  value,
  onChange,
}: UseAutocompleteConfigurationProps): UseAutocompleteConfigurationReturn => {
  
  // Ensure options are safe and properly formatted
  const safeOptions = safeAutocompleteOptions(options);
  
  // Create the value change handler that converts string to ConfigurationItem
  const handleValueChange = useCallback(
    createConfigurationItemHandler(onChange, safeOptions),
    [onChange, safeOptions]
  );
  
  // Extract the ID from the ConfigurationItem value
  const stringValue = extractConfigurationItemId(value);
  
  // Check if configuration is valid
  const isValid = safeOptions.length > 0 || isLoading;
  const hasOptions = safeOptions.length > 0;
  
  return {
    autocompleteProps: {
      options: safeOptions,
      value: stringValue,
      onValueChange: handleValueChange,
      isLoading,
      error,
    },
    isValid,
    hasOptions,
  };
};

/**
 * Custom hook specifically for simple string-based autocomplete
 * 
 * @param options - Available options
 * @param value - Current value
 * @param onChange - Change handler
 * @param isLoading - Loading state
 * @param error - Error state
 * @returns Autocomplete props ready to use
 */
export const useSimpleAutocomplete = (
  options: AutocompleteOption[],
  value: string,
  onChange: (value: string) => void,
  isLoading: boolean = false,
  error: any = null
) => {
  const safeOptions = safeAutocompleteOptions(options);
  
  return {
    options: safeOptions,
    value: value || '',
    onValueChange: onChange,
    isLoading,
    error,
  };
};

export default useAutocompleteConfiguration;
