/**
 * Componente Autocomplete dependiente de Municipio → Parroquia
 * 
 * Este componente renderiza el campo de Parroquia de forma especial:
 * - Se deshabilita hasta que se seleccione un municipio
 * - Carga dinámicamente las parroquias del municipio seleccionado
 * - Muestra loading mientras se cargan las parroquias
 * - Limpia la selección cuando cambia el municipio
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { AutocompleteWithLoading } from '@/components/ui/autocomplete-with-loading';
import { useMunicipioDependentParroquias } from '@/hooks/useMunicipioDependentParroquias';
import { AlertCircle, Lock } from 'lucide-react';

interface MunicipioDependentParroquiaFieldProps {
  fieldId: string;
  label: string;
  value: string | null | undefined;
  onChange: (fieldId: string, value: string) => void;
  selectedMunicipioId: string | null | undefined;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  errorText?: string;
}

export const MunicipioDependentParroquiaField: React.FC<MunicipioDependentParroquiaFieldProps> = ({
  fieldId,
  label,
  value,
  onChange,
  selectedMunicipioId,
  required = true,
  placeholder = 'Seleccionar parroquia...',
  searchPlaceholder = 'Buscar parroquia...',
  emptyText = 'No hay parroquias disponibles',
  errorText = 'Error al cargar parroquias',
}) => {
  // Hook para manejar la dependencia municipio-parroquia
  const { 
    parroquiaOptions, 
    isLoading, 
    error, 
    hasSelectedMunicipio, 
    isDisabled 
  } = useMunicipioDependentParroquias(selectedMunicipioId);

  // Limpiar la selección de parroquia cuando cambia el municipio
  React.useEffect(() => {
    if (!hasSelectedMunicipio && value) {
      // Si se deselecciona el municipio, limpiar la parroquia
      onChange(fieldId, '');
    }
  }, [hasSelectedMunicipio, value, fieldId, onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-2">
        {label}
        {required && <span className="text-destructive">*</span>}
        
        {/* Indicador de estado bloqueado */}
        {isDisabled && (
          <div className="flex items-center gap-1 ml-auto" title="Selecciona un municipio primero">
            <Lock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Selecciona municipio</span>
          </div>
        )}
      </Label>

      {/* Mostrar mensaje si no hay municipio seleccionado */}
      {isDisabled && !isLoading ? (
        <div className="w-full px-4 py-3 bg-muted border-2 border-border rounded-xl text-muted-foreground font-medium text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Primero selecciona un municipio para cargar las parroquias</span>
        </div>
      ) : (
        <AutocompleteWithLoading
          options={parroquiaOptions}
          value={value || ''}
          onValueChange={(val) => onChange(fieldId, val)}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
          isLoading={isLoading}
          error={error}
          errorText={errorText}
          enhanced={true}
          showDescriptions={true}
          showCategories={false}
          allowClear={true}
          disabled={isDisabled}
        />
      )}

      {/* Estado de carga visual adicional */}
      {isLoading && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Cargando parroquias del municipio...
        </div>
      )}
    </div>
  );
};

export default MunicipioDependentParroquiaField;
