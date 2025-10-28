import { useMemo } from 'react';
import { useCentrosPoblados } from './useCentrosPoblados';
import { AutocompleteOption } from '@/components/ui/autocomplete';

/**
 * Hook para obtener centros poblados dependientes del municipio seleccionado
 */
export const useMunicipioDependentCentrosPoblados = (municipioId: string | number | null) => {
  const centrosPobladosHook = useCentrosPoblados();
  const { data: centrosPoblados = [], isLoading, error } = centrosPobladosHook.useCentrosPobladosByMunicipioQuery(municipioId);

  const centroPobladoOptions: AutocompleteOption[] = useMemo(() => {
    if (!centrosPoblados || centrosPoblados.length === 0) return [];
    
    return centrosPoblados.map((centroPoblado) => ({
      value: centroPoblado.id_centro_poblado?.toString() || '',
      label: centroPoblado.nombre || 'Sin nombre',
      description: `Centro poblado de ${centroPoblado.municipio?.nombre_municipio || 'Municipio'}`,
      category: 'Ubicación',
      popular: false
    }));
  }, [centrosPoblados]);

  return {
    centrosPoblados,
    centroPobladoOptions,
    isLoading,
    error
  };
};
