import { useMemo } from 'react';
import { useCorregimientos } from './useCorregimientos';
import { AutocompleteOption } from '@/components/ui/autocomplete';

/**
 * Hook para obtener corregimientos dependientes del municipio seleccionado
 */
export const useMunicipioDependentCorregimientos = (municipioId: string | number | null) => {
  const corregimientosHook = useCorregimientos();
  const { data: corregimientos = [], isLoading, error } = corregimientosHook.useCorregimientosByMunicipioQuery(municipioId);

  const corregimientoOptions: AutocompleteOption[] = useMemo(() => {
    if (!corregimientos || corregimientos.length === 0) return [];
    
    return corregimientos.map((corregimiento) => ({
      value: corregimiento.id_corregimiento?.toString() || '',
      label: corregimiento.nombre || 'Sin nombre',
      description: `Corregimiento de ${corregimiento.municipio?.nombre_municipio || 'Municipio'}`,
      category: 'Ubicación',
      popular: false
    }));
  }, [corregimientos]);

  return {
    corregimientos,
    corregimientoOptions,
    isLoading,
    error
  };
};
