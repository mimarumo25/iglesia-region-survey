/**
 * Hook para manejar la lógica dependiente de Municipio → Vereda
 * 
 * Este hook se encarga de:
 * 1. Detectar cuando se selecciona un municipio
 * 2. Cargar las veredas del municipio seleccionado
 * 3. Limpiar veredas cuando se cambia el municipio
 * 4. Proporcionar estados de loading y error
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AutocompleteOption } from '@/components/ui/autocomplete';
import { veredasService } from '@/services/veredas';

interface UseMunicipioDependentVeredasResult {
  veredaOptions: AutocompleteOption[];
  isLoading: boolean;
  error: any;
  hasSelectedMunicipio: boolean;
  isDisabled: boolean;
}

export const useMunicipioDependentVeredas = (
  selectedMunicipioId: string | null | undefined
): UseMunicipioDependentVeredasResult => {
  // Query para obtener veredas por municipio
  const { data, isLoading, error } = useQuery({
    queryKey: ['veredas', { municipio: selectedMunicipioId }],
    queryFn: async () => {
      if (!selectedMunicipioId) return { data: [] };
      
      const municipioIdNum = parseInt(selectedMunicipioId);
      if (isNaN(municipioIdNum)) return { data: [] };
      
      const veredas = await veredasService.getVeredasByMunicipio(municipioIdNum);
      return { data: veredas };
    },
    enabled: !!selectedMunicipioId && selectedMunicipioId !== '',
    placeholderData: (previousData) => previousData,
  });

  // Convertir veredas a AutocompleteOption
  const veredaOptions = useMemo(() => {
    if (!selectedMunicipioId || !data?.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map(vereda => ({
      value: vereda.id_vereda?.toString() || '',
      label: vereda.nombre || '',
      description: vereda.codigo_vereda || '',
      category: 'Veredas',
    }));
  }, [data, selectedMunicipioId]);

  return {
    veredaOptions,
    isLoading: isLoading && !!selectedMunicipioId,
    error: error && selectedMunicipioId ? error : null,
    hasSelectedMunicipio: !!selectedMunicipioId,
    isDisabled: !selectedMunicipioId,
  };
};

export default useMunicipioDependentVeredas;
