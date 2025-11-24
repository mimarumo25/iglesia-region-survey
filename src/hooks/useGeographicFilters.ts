/**
 * Hook personalizado para gestionar filtros geográficos jerárquicos
 * 
 * @description Maneja la carga automática de datos geográficos según selección:
 * - Municipio → Parroquias, Sectores, Veredas, Corregimientos, Centros Poblados
 * 
 * @version 1.0
 * @since Sistema MIA v2.0
 */

import { useMemo } from 'react';
import { AutocompleteOption } from '@/components/ui/autocomplete';
import { useParroquias } from '@/hooks/useParroquias';
import { useSectores } from '@/hooks/useSectores';
import { useVeredas } from '@/hooks/useVeredas';
import { useCorregimientos } from '@/hooks/useCorregimientos';
import { useCentrosPoblados } from '@/hooks/useCentrosPoblados';

export interface GeographicFilters {
  id_municipio?: number;
  id_parroquia?: number;
  id_sector?: number;
  id_vereda?: number;
  id_corregimiento?: number;
  id_centro_poblado?: number;
}

export interface UseGeographicFiltersResult {
  // Opciones filtradas para autocomplete
  parroquiaOptions: AutocompleteOption[];
  sectorOptions: AutocompleteOption[];
  veredaOptions: AutocompleteOption[];
  corregimientoOptions: AutocompleteOption[];
  centroPobladoOptions: AutocompleteOption[];
  
  // Estados de carga
  isLoadingParroquias: boolean;
  isLoadingSectores: boolean;
  isLoadingVeredas: boolean;
  isLoadingCorregimientos: boolean;
  isLoadingCentrosPoblados: boolean;
}

/**
 * Hook para manejar filtros geográficos con carga automática jerárquica
 * 
 * Jerarquía de datos:
 * - Municipio → Parroquia, Sector, Vereda, Corregimiento, Centro Poblado
 * 
 * @param filters - Filtros geográficos actuales
 * @returns Opciones filtradas y estados de carga
 */
export const useGeographicFilters = (
  filters: GeographicFilters
): UseGeographicFiltersResult => {
  
  const { useParroquiasByMunicipioQuery } = useParroquias();
  const { useSectoresByMunicipioQuery } = useSectores();
  const { useCentrosPobladosByMunicipioQuery } = useCentrosPoblados();
  const { useCorregimientosByMunicipioQuery } = useCorregimientos();
  const { useVeredasQuery } = useVeredas();

  // Queries condicionales según filtros
  const { 
    data: parroquiasData, 
    isLoading: isLoadingParroquias 
  } = useParroquiasByMunicipioQuery(
    filters.id_municipio?.toString() || ''
  );

  const { 
    data: sectoresData, 
    isLoading: isLoadingSectores 
  } = useSectoresByMunicipioQuery(
    filters.id_municipio
  );

  // Veredas: filtrado del lado del cliente por municipio
  const { 
    data: veredasData, 
    isLoading: isLoadingVeredas 
  } = useVeredasQuery(
    '', // searchTerm
    filters.id_municipio?.toString() || '', // municipioFilter
    1, // page
    1000 // limit alto para obtener todas
  );

  const { 
    data: corregimientosData, 
    isLoading: isLoadingCorregimientos 
  } = useCorregimientosByMunicipioQuery(
    filters.id_municipio
  );

  const { 
    data: centrosPobladosData, 
    isLoading: isLoadingCentrosPoblados 
  } = useCentrosPobladosByMunicipioQuery(
    filters.id_municipio
  );

  // Transformar datos a opciones de autocomplete
  const parroquiaOptions = useMemo((): AutocompleteOption[] => {
    if (!parroquiasData?.data || !Array.isArray(parroquiasData.data)) {
      return [];
    }
    
    return parroquiasData.data.map(parroquia => ({
      value: parroquia.id_parroquia?.toString() || '',
      label: parroquia.nombre || 'Sin nombre',
      description: parroquia.direccion || 'Parroquia',
      category: 'Parroquias',
      popular: false
    }));
  }, [parroquiasData]);

  const sectorOptions = useMemo((): AutocompleteOption[] => {
    if (!sectoresData?.data || !Array.isArray(sectoresData.data)) {
      return [];
    }
    
    return sectoresData.data.map(sector => ({
      value: sector.id_sector?.toString() || '',
      label: sector.nombre || 'Sin nombre',
      description: 'Sector del municipio',
      category: 'Sectores',
      popular: false
    }));
  }, [sectoresData]);

  const veredaOptions = useMemo((): AutocompleteOption[] => {
    if (!veredasData?.data || !Array.isArray(veredasData.data)) {
      return [];
    }
    
    return veredasData.data.map(vereda => ({
      value: vereda.id_vereda?.toString() || '',
      label: vereda.nombre || 'Sin nombre',
      description: 'Vereda del municipio',
      category: 'Veredas',
      popular: false
    }));
  }, [veredasData]);

  const corregimientoOptions = useMemo((): AutocompleteOption[] => {
    if (!corregimientosData || !Array.isArray(corregimientosData)) {
      return [];
    }
    
    return corregimientosData.map(corregimiento => ({
      value: corregimiento.id_corregimiento?.toString() || '',
      label: corregimiento.nombre || 'Sin nombre',
      description: 'Corregimiento del municipio',
      category: 'Corregimientos',
      popular: false
    }));
  }, [corregimientosData]);

  const centroPobladoOptions = useMemo((): AutocompleteOption[] => {
    if (!centrosPobladosData || !Array.isArray(centrosPobladosData)) {
      return [];
    }
    
    return centrosPobladosData.map(centro => ({
      value: centro.id_centro_poblado?.toString() || '',
      label: centro.nombre || 'Sin nombre',
      description: 'Centro poblado del municipio',
      category: 'Centros Poblados',
      popular: false
    }));
  }, [centrosPobladosData]);

  return {
    parroquiaOptions,
    sectorOptions,
    veredaOptions,
    corregimientoOptions,
    centroPobladoOptions,
    isLoadingParroquias,
    isLoadingSectores,
    isLoadingVeredas,
    isLoadingCorregimientos,
    isLoadingCentrosPoblados
  };
};
