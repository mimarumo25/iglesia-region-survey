import React, { useRef, useEffect, useMemo } from "react";
import { Loader2, AlertCircle, Search } from "lucide-react";
import { Autocomplete, AutocompleteOption } from "@/components/ui/autocomplete";
import { EnhancedAutocomplete } from "@/components/ui/enhanced-autocomplete";
import { Button } from "@/components/ui/button";

interface AutocompleteWithLoadingProps {
  options?: AutocompleteOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  error?: any;
  errorText?: string;
  className?: string;
  disabled?: boolean;
  enhanced?: boolean;
  showDescriptions?: boolean;
  showCategories?: boolean;
  allowClear?: boolean;
}

export const AutocompleteWithLoading: React.FC<AutocompleteWithLoadingProps> = ({
  options = [],
  value = "",
  onValueChange,
  placeholder = "Seleccionar...",
  emptyText = "No hay opciones disponibles",
  searchPlaceholder = "Buscar...",
  isLoading = false,
  error = null,
  errorText = "Error al cargar datos",
  className,
  disabled = false,
  enhanced = false,
  showDescriptions = true,
  showCategories = false,
  allowClear = true,
}) => {
  // Ref para rastrear si el componente está montado
  const mountedRef = useRef(true);
  
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Memoización segura de las opciones para evitar re-renders innecesarios
  const safeOptions = useMemo(() => {
    if (!mountedRef.current || !Array.isArray(options)) {
      return [];
    }
    return options;
  }, [options]);

  // Memoización segura del valor para evitar actualizaciones durante unmount
  const safeValue = useMemo(() => {
    if (!mountedRef.current) {
      return "";
    }
    return value || "";
  }, [value]);

  // Handler seguro para cambio de valor
  const handleValueChange = useMemo(() => (newValue: string) => {
    if (mountedRef.current && onValueChange) {
      onValueChange(newValue);
    }
  }, [onValueChange]);

  // Handler seguro para retry
  const handleRetry = useMemo(() => () => {
    if (mountedRef.current) {
      window.location.reload();
    }
  }, []);

  if (isLoading) {
    return (
      <div className={`relative ${className || ''}`}>
        <div className="flex items-center gap-3 h-12 px-4 bg-gray-100 border-2 border-gray-400 rounded-xl shadow-inner animate-pulse">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-gray-600 font-medium text-sm">Cargando opciones...</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className || ''}`}>
        <div className="flex items-center gap-3 h-12 px-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-100 transition-colors duration-200">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-red-400 flex-shrink-0" />
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm">{errorText}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-200"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Determinar qué componente de Autocomplete usar
  const AutocompleteComponent = enhanced ? EnhancedAutocomplete : Autocomplete;

  // Props base para ambos componentes
  const baseProps = {
    options: safeOptions,
    value: safeValue,
    onValueChange: handleValueChange,
    placeholder,
    emptyText,
    searchPlaceholder,
    disabled: disabled || isLoading,
    className: className || '',
  };

  // Props adicionales para Enhanced
  const enhancedProps = enhanced ? {
    showDescriptions,
    showCategories,
    allowClear,
  } : {};

  return (
    <AutocompleteComponent
      {...baseProps}
      {...enhancedProps}
    />
  );
};

export default AutocompleteWithLoading;
