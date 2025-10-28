/**
 * Hook para manejar la lógica dependiente de Municipio → Parroquia
 * 
 * Este hook se encarga de:
 * 1. Detectar cuando se selecciona un municipio
 * 2. Cargar las parroquias del municipio seleccionado
 * 3. Limpiar parroquias cuando se cambia el municipio
 * 4. Proporcionar estados de loading y error
 */

import { useMemo } from 'react';
import { AutocompleteOption } from '@/components/ui/autocomplete';
import { useParroquias } from './useParroquias';

interface UseMunicipioDependentParroquiasResult {
  parroquiaOptions: AutocompleteOption[];
  isLoading: boolean;
  error: any;
  hasSelectedMunicipio: boolean;
  isDisabled: boolean;
}

export const useMunicipioDependentParroquias = (
  selectedMunicipioId: string | null | undefined
): UseMunicipioDependentParroquiasResult => {
  // Hook para obtener parroquias por municipio
  const { useParroquiasByMunicipioQuery } = useParroquias();
  
  // Query que se ejecuta solo si hay un municipio seleccionado
  const { data, isLoading, error } = useParroquiasByMunicipioQuery(
    selectedMunicipioId || ''
  );

  // Convertir parroquias a AutocompleteOption
  const parroquiaOptions = useMemo(() => {
    if (!selectedMunicipioId || !data?.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map(parroquia => ({
      value: parroquia.id_parroquia,
      label: parroquia.nombre,
      description: parroquia.direccion || '',
      category: 'Parroquias',
    }));
  }, [data, selectedMunicipioId]);

  return {
    parroquiaOptions,
    isLoading: isLoading && !!selectedMunicipioId,
    error: error && selectedMunicipioId ? error : null,
    hasSelectedMunicipio: !!selectedMunicipioId,
    isDisabled: !selectedMunicipioId,
  };
};

export default useMunicipioDependentParroquias;
