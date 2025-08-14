import React from "react";
import { Loader2 } from "lucide-react";
import { Autocomplete, AutocompleteOption } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";

interface AutocompleteWithLoadingProps {
  options: AutocompleteOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  error?: any;
  errorText?: string;
  className?: string;
  disabled?: boolean;
}

export const AutocompleteWithLoading: React.FC<AutocompleteWithLoadingProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  emptyText = "No hay opciones disponibles",
  searchPlaceholder = "Buscar...",
  isLoading = false,
  error = null,
  errorText = "Error al cargar datos",
  className,
  disabled = false,
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-600 py-2 ${className}`}>
        {errorText}
      </div>
    );
  }

  return (
    <Autocomplete
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      emptyText={emptyText}
      searchPlaceholder={searchPlaceholder}
      disabled={disabled || isLoading}
      className={className}
    />
  );
};

export default AutocompleteWithLoading;
