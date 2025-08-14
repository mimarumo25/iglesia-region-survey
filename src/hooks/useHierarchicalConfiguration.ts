import { useState, useMemo } from 'react';
import { useMunicipios } from './useMunicipios';
import { useParroquias } from './useParroquias';
import { useSectores } from './useSectores';
import { useVeredas } from './useVeredas';

export const useHierarchicalConfiguration = () => {
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('');

  // Cargar municipios
  const municipiosHook = useMunicipios();
  const municipiosQuery = municipiosHook.useAllMunicipiosQuery();

  // Cargar datos dependientes solo si hay municipio seleccionado
  const parroquiasHook = useParroquias();
  const parroquiasQuery = parroquiasHook.useParroquiasByMunicipioQuery(
    selectedMunicipio, 1, 1000
  );

  const sectoresHook = useSectores();
  const sectoresQuery = sectoresHook.useSectoresQuery();

  const veredasHook = useVeredas();
  const veredasQuery = veredasHook.useVeredasByMunicipioQuery(
    selectedMunicipio ? parseInt(selectedMunicipio) : 0
  );

  // Transformar datos para autocomplete
  const municipiosOptions = useMemo(() => {
    if (!municipiosQuery.data) return [];
    return municipiosQuery.data.map((municipio: any) => ({
      value: municipio.id_municipio?.toString() || '',
      label: municipio.nombre_municipio || municipio.nombre || 'Sin nombre',
    }));
  }, [municipiosQuery.data]);

  const parroquiasOptions = useMemo(() => {
    if (!parroquiasQuery.data?.data?.parroquias || !selectedMunicipio) return [];
    return parroquiasQuery.data.data.parroquias.map((parroquia: any) => ({
      value: parroquia.id_parroquia?.toString() || '',
      label: parroquia.nombre || 'Sin nombre',
    }));
  }, [parroquiasQuery.data, selectedMunicipio]);

  const sectoresOptions = useMemo(() => {
    if (!sectoresQuery.data?.data?.sectores) return [];
    // Solo mostrar sectores si hay municipio seleccionado
    if (!selectedMunicipio) return [];
    return sectoresQuery.data.data.sectores.map((sector: any) => ({
      value: sector.id_sector?.toString() || '',
      label: sector.nombre || 'Sin nombre',
    }));
  }, [sectoresQuery.data, selectedMunicipio]);

  const veredasOptions = useMemo(() => {
    if (!veredasQuery.data?.data || !selectedMunicipio) return [];
    return veredasQuery.data.data.map((vereda: any) => ({
      value: vereda.id_vereda?.toString() || '',
      label: vereda.nombre || 'Sin nombre',
    }));
  }, [veredasQuery.data, selectedMunicipio]);

  return {
    selectedMunicipio,
    setSelectedMunicipio,
    municipiosOptions,
    parroquiasOptions,
    sectoresOptions,
    veredasOptions,
    isLoadingMunicipios: municipiosQuery.isLoading,
    isLoadingParroquias: parroquiasQuery?.isLoading || false,
    isLoadingSectores: sectoresQuery.isLoading,
    isLoadingVeredas: veredasQuery?.isLoading || false,
  };
};
