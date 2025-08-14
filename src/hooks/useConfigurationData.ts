import { useMemo } from "react";
import { AutocompleteOption } from "@/components/ui/autocomplete";

// Importar hooks de servicios disponibles
import { useSectores } from "@/hooks/useSectores";
import { useUsers } from "@/hooks/useUsers";
import { useSexos } from "@/hooks/useSexos";
import { useEstadosCiviles } from "@/hooks/useEstadosCiviles";
import { useTiposVivienda } from "@/hooks/useTiposVivienda";
import { useParroquias } from "@/hooks/useParroquias";
import { useMunicipios } from "@/hooks/useMunicipios";
import { useVeredas } from "@/hooks/useVeredas";
import { useDisposicionBasura } from "@/hooks/useDisposicionBasura";
import { useAguasResiduales } from "@/hooks/useAguasResiduales";
import { useTiposIdentificacion } from "@/hooks/useTiposIdentificacion";
import { useParentescos } from "@/hooks/useParentescos";
import { useSituacionesCiviles } from "@/hooks/useSituacionesCiviles";
import { useEstudios } from "@/hooks/useEstudios";
import { useProfesiones } from "@/hooks/useProfesiones";
import { useEnfermedades } from "@/hooks/useEnfermedades";
import { useComunidadesCulturales } from "@/hooks/useComunidadesCulturales";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { useSistemasAcueducto } from "@/hooks/useSistemasAcueducto";
import { useTallas } from "@/hooks/useTallas";

export interface ConfigurationData {
  // Sectores
  sectorOptions: AutocompleteOption[];
  sectoresLoading: boolean;
  sectoresError: any;

  // Usuarios
  userOptions: AutocompleteOption[];
  usersLoading: boolean;
  usersError: any;

  // Sexos
  sexoOptions: AutocompleteOption[];
  sexosLoading: boolean;
  sexosError: any;

  // Estados civiles
  estadoCivilOptions: AutocompleteOption[];
  estadosCivilesLoading: boolean;
  estadosCivilesError: any;

  // Tipos de vivienda
  tipoViviendaOptions: AutocompleteOption[];
  tiposViviendaLoading: boolean;
  tiposViviendaError: any;

  // Disposición de basura
  disposicionBasuraOptions: AutocompleteOption[];
  disposicionBasuraLoading: boolean;
  disposicionBasuraError: any;

  // Aguas residuales
  aguasResidualesOptions: AutocompleteOption[];
  aguasResidualesLoading: boolean;
  aguasResidualesError: any;

  // Tipos de identificación
  tiposIdentificacionOptions: AutocompleteOption[];
  tiposIdentificacionLoading: boolean;
  tiposIdentificacionError: any;

  // Parentescos
  parentescosOptions: AutocompleteOption[];
  parentescosLoading: boolean;
  parentescosError: any;

  // Situaciones civiles
  situacionesCivilesOptions: AutocompleteOption[];
  situacionesCivilesLoading: boolean;
  situacionesCivilesError: any;

  // Estudios
  estudiosOptions: AutocompleteOption[];
  estudiosLoading: boolean;
  estudiosError: any;

  // Profesiones
  profesionesOptions: AutocompleteOption[];
  profesionesLoading: boolean;
  profesionesError: any;

  // Enfermedades
  enfermedadesOptions: AutocompleteOption[];
  enfermedadesLoading: boolean;
  enfermedadesError: any;

  // Comunidades culturales
  comunidadesCulturalesOptions: AutocompleteOption[];
  comunidadesCulturalesLoading: boolean;
  comunidadesCulturalesError: any;

  // Parroquias
  parroquiaOptions: AutocompleteOption[];
  parroquiasLoading: boolean;
  parroquiasError: any;

  // Municipios
  municipioOptions: AutocompleteOption[];
  municipiosLoading: boolean;
  municipiosError: any;

  // Veredas
  veredaOptions: AutocompleteOption[];
  veredasLoading: boolean;
  veredasError: any;

  // Departamentos
  departamentoOptions: AutocompleteOption[];
  departamentosLoading: boolean;
  departamentosError: any;

  // Sistemas de Acueducto
  sistemasAcueductoOptions: AutocompleteOption[];
  sistemasAcueductoLoading: boolean;
  sistemasAcueductoError: any;

  // Tallas
  tallasOptions: AutocompleteOption[];
  tallasLoading: boolean;
  tallasError: any;

  // Estado general de carga
  isAnyLoading: boolean;
  hasAnyError: boolean;
}

/**
 * Hook personalizado para cargar y gestionar datos de configuración básicos
 * de la aplicación de manera centralizada
 */
export const useConfigurationData = (): ConfigurationData => {
  // Hooks de servicios
  const { useActiveSectoresQuery } = useSectores();
  const { useUsersQuery } = useUsers();
  const { useSexosActivosQuery } = useSexos();
  const { useEstadosCivilesQuery } = useEstadosCiviles();
  const { useTiposViviendaActivosQuery } = useTiposVivienda();
  const { useDisposicionBasuraQuery } = useDisposicionBasura();
  const { useAguasResidualesQuery } = useAguasResiduales();
  const { useTiposIdentificacionActivosQuery } = useTiposIdentificacion();
  const { useParentescosQuery } = useParentescos();
  const { useSituacionesCivilesQuery } = useSituacionesCiviles();
  const { useEstudiosQuery } = useEstudios();
  const { useActiveProfesionesQuery } = useProfesiones();
  const { useEnfermedadesQuery } = useEnfermedades();
  const { useComunidadesCulturalesQuery } = useComunidadesCulturales();
  const { useParroquiasQuery } = useParroquias();
  const { useAllMunicipiosQuery } = useMunicipios();
  const { useVeredasQuery } = useVeredas();
  const { useActiveDepartamentosQuery } = useDepartamentos();
  const { useSistemasAcueductoActivosQuery } = useSistemasAcueducto();
  const { useTallasActivasQuery } = useTallas();

  // Queries básicas (las que sabemos que funcionan)
  const { data: sectoresData, isLoading: sectoresLoading, error: sectoresError } = useActiveSectoresQuery();
  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsersQuery();
  const { data: sexosData, isLoading: sexosLoading, error: sexosError } = useSexosActivosQuery();

  // Queries adicionales (usando parámetros por defecto)
  const { data: estadosCivilesData, isLoading: estadosCivilesLoading, error: estadosCivilesError } = useEstadosCivilesQuery();
  const tiposViviendaQuery = useTiposViviendaActivosQuery(1, 50);
  const { data: tiposViviendaData, isLoading: tiposViviendaLoading, error: tiposViviendaError } = tiposViviendaQuery;
  const disposicionBasuraQuery = useDisposicionBasuraQuery(1, 50);
  const { data: disposicionBasuraData, isLoading: disposicionBasuraLoading, error: disposicionBasuraError } = disposicionBasuraQuery;
  const aguasResidualesQuery = useAguasResidualesQuery(1, 50);
  const { data: aguasResidualesData, isLoading: aguasResidualesLoading, error: aguasResidualesError } = aguasResidualesQuery;
  const tiposIdentificacionQuery = useTiposIdentificacionActivosQuery(1, 50);
  const { data: tiposIdentificacionData, isLoading: tiposIdentificacionLoading, error: tiposIdentificacionError } = tiposIdentificacionQuery;
  const parentescosQuery = useParentescosQuery(1, 50);
  const { data: parentescosData, isLoading: parentescosLoading, error: parentescosError } = parentescosQuery;
  const situacionesCivilesQuery = useSituacionesCivilesQuery(1, 50);
  const { data: situacionesCivilesData, isLoading: situacionesCivilesLoading, error: situacionesCivilesError } = situacionesCivilesQuery;
  const estudiosQuery = useEstudiosQuery(1, 50);
  const { data: estudiosData, isLoading: estudiosLoading, error: estudiosError } = estudiosQuery;
  const profesionesQuery = useActiveProfesionesQuery();
  const { data: profesionesData, isLoading: profesionesLoading, error: profesionesError } = profesionesQuery;
  const enfermedadesQuery = useEnfermedadesQuery(1, 50);
  const { data: enfermedadesData, isLoading: enfermedadesLoading, error: enfermedadesError } = enfermedadesQuery;
  const comunidadesCulturalesQuery = useComunidadesCulturalesQuery(1, 50);
  const { data: comunidadesCulturalesData, isLoading: comunidadesCulturalesLoading, error: comunidadesCulturalesError } = comunidadesCulturalesQuery;
  const { data: parroquiasData, isLoading: parroquiasLoading, error: parroquiasError } = useParroquiasQuery();
  const { data: municipiosData, isLoading: municipiosLoading, error: municipiosError } = useAllMunicipiosQuery();
  const { data: veredasData, isLoading: veredasLoading, error: veredasError } = useVeredasQuery();
  const departamentosQuery = useActiveDepartamentosQuery();
  const { data: departamentosData, isLoading: departamentosLoading, error: departamentosError } = departamentosQuery;
  const sistemasAcueductoQuery = useSistemasAcueductoActivosQuery(1, 50);
  const { data: sistemasAcueductoData, isLoading: sistemasAcueductoLoading, error: sistemasAcueductoError } = sistemasAcueductoQuery;
  const tallasQuery = useTallasActivasQuery(1, 50);
  const { data: tallasData, isLoading: tallasLoading, error: tallasError } = tallasQuery;

  // Memoización de opciones para autocomplete
  const sectorOptions = useMemo((): AutocompleteOption[] => {
    if (!sectoresData?.data) {
      return [];
    }
    
    // La API de sectores devuelve una estructura con sectors array
    if (typeof sectoresData.data === 'object' && 'sectors' in sectoresData.data && Array.isArray(sectoresData.data.sectors)) {
      return sectoresData.data.sectors.map(sector => ({
        value: sector.id_sector,
        label: sector.nombre
      }));
    }
    
    // Si la respuesta es directamente un array (fallback)
    if (Array.isArray(sectoresData.data)) {
      return sectoresData.data.map(sector => ({
        value: sector.id_sector,
        label: sector.nombre
      }));
    }
    
    return [];
  }, [sectoresData]);

  const userOptions = useMemo((): AutocompleteOption[] => {
    return Array.isArray(usersData) ? usersData.map(user => ({
      value: user.id,
      label: `${user.primer_nombre} ${user.primer_apellido}`
    })) : [];
  }, [usersData]);

  const sexoOptions = useMemo((): AutocompleteOption[] => {
    return sexosData?.data?.sexos?.map(sexo => ({
      value: sexo.id_sexo,
      label: sexo.nombre
    })) || [];
  }, [sexosData]);

  const estadoCivilOptions = useMemo((): AutocompleteOption[] => {
    // Por ahora retornamos array vacío hasta verificar la estructura de datos
    return [];
  }, [estadosCivilesData]);

  const tipoViviendaOptions = useMemo((): AutocompleteOption[] => {
    // Verificamos la estructura de datos que devuelve la API: ServerResponse<TiposViviendaResponse>
    const data = tiposViviendaData as any;
    if (!data?.data?.tiposVivienda || !Array.isArray(data.data.tiposVivienda)) {
      return [];
    }
    return data.data.tiposVivienda.map((tipo: any) => ({
      value: tipo.id_tipo_vivienda?.toString() || '',
      label: tipo.nombre || 'Sin nombre'
    }));
  }, [tiposViviendaData]);

  const parroquiaOptions = useMemo((): AutocompleteOption[] => {
    if (!parroquiasData?.data?.parroquias || !Array.isArray(parroquiasData.data.parroquias)) {
      return [];
    }
    return parroquiasData.data.parroquias.map(parroquia => ({
      value: parroquia.id_parroquia?.toString() || '',
      label: parroquia.nombre || 'Sin nombre'
    }));
  }, [parroquiasData]);

  const municipioOptions = useMemo((): AutocompleteOption[] => {
    if (!municipiosData || !Array.isArray(municipiosData)) {
      return [];
    }
    return municipiosData.map(municipio => ({
      value: municipio.id_municipio?.toString() || '',
      label: municipio.nombre_municipio || municipio.nombre || 'Sin nombre'
    }));
  }, [municipiosData]);

  const veredaOptions = useMemo((): AutocompleteOption[] => {
    if (!veredasData?.data || !Array.isArray(veredasData.data)) {
      return [];
    }
    return veredasData.data.map(vereda => ({
      value: vereda.id_vereda?.toString() || '',
      label: vereda.nombre || 'Sin nombre'
    }));
  }, [veredasData]);

  const departamentoOptions = useMemo((): AutocompleteOption[] => {
    if (!departamentosData?.data || !Array.isArray(departamentosData.data)) {
      return [];
    }
    return departamentosData.data.map((departamento: any) => ({
      value: departamento.id_departamento?.toString() || '',
      label: departamento.nombre || 'Sin nombre'
    }));
  }, [departamentosData]);

  const sistemasAcueductoOptions = useMemo((): AutocompleteOption[] => {
    if (!sistemasAcueductoData || !Array.isArray(sistemasAcueductoData)) {
      return [];
    }
    return sistemasAcueductoData.map((sistema: any) => ({
      value: sistema.id_sistema_acueducto?.toString() || '',
      label: sistema.nombre || 'Sin nombre'
    }));
  }, [sistemasAcueductoData]);

  const tallasOptions = useMemo((): AutocompleteOption[] => {
    if (!tallasData || !Array.isArray(tallasData)) {
      return [];
    }
    return tallasData.map((talla: any) => ({
      value: talla.id_talla?.toString() || '',
      label: talla.nombre || 'Sin nombre'
    }));
  }, [tallasData]);

  const disposicionBasuraOptions = useMemo((): AutocompleteOption[] => {
    // Verificamos la estructura de datos que devuelve la API: DisposicionBasuraResponse
    const data = disposicionBasuraData as any;
    if (!data?.data?.tipos || !Array.isArray(data.data.tipos)) {
      return [];
    }
    return data.data.tipos.map((tipo: any) => ({
      value: tipo.id_tipo_disposicion_basura?.toString() || '',
      label: tipo.nombre || 'Sin nombre'
    }));
  }, [disposicionBasuraData]);

  const aguasResidualesOptions = useMemo((): AutocompleteOption[] => {
    // Verificamos la estructura de datos que devuelve la API: AguasResidualesResponse
    const data = aguasResidualesData as any;
    if (!data?.data?.tiposAguasResiduales || !Array.isArray(data.data.tiposAguasResiduales)) {
      return [];
    }
    return data.data.tiposAguasResiduales.map((tipo: any) => ({
      value: tipo.id_tipo_aguas_residuales?.toString() || '',
      label: tipo.nombre || 'Sin nombre'
    }));
  }, [aguasResidualesData]);

  const tiposIdentificacionOptions = useMemo((): AutocompleteOption[] => {
    if (!tiposIdentificacionData || !Array.isArray(tiposIdentificacionData)) {
      return [];
    }
    
    return tiposIdentificacionData.map((tipo: any) => ({
      value: tipo.codigo || tipo.id_tipo_identificacion?.toString() || '',
      label: `${tipo.codigo} - ${tipo.nombre}` || 'Sin nombre'
    }));
  }, [tiposIdentificacionData]);

  const parentescosOptions = useMemo((): AutocompleteOption[] => {
    if (!parentescosData || !Array.isArray(parentescosData)) {
      return [];
    }
    return parentescosData.map((parentesco: any) => ({
      value: parentesco.id_parentesco?.toString() || '',
      label: parentesco.nombre || 'Sin nombre'
    }));
  }, [parentescosData]);

  const situacionesCivilesOptions = useMemo((): AutocompleteOption[] => {
    if (!situacionesCivilesData || !Array.isArray(situacionesCivilesData)) {
      return [];
    }
    return situacionesCivilesData.map((situacion: any) => ({
      value: situacion.id_situacion_civil?.toString() || '',
      label: situacion.nombre || 'Sin nombre'
    }));
  }, [situacionesCivilesData]);

  const estudiosOptions = useMemo((): AutocompleteOption[] => {
    if (!estudiosData || !Array.isArray(estudiosData)) {
      return [];
    }
    return estudiosData.map((estudio: any) => ({
      value: estudio.id_estudio?.toString() || '',
      label: estudio.nombre || 'Sin nombre'
    }));
  }, [estudiosData]);

  const profesionesOptions = useMemo((): AutocompleteOption[] => {
    if (!profesionesData?.data || !Array.isArray(profesionesData.data)) {
      return [];
    }
    return profesionesData.data.map((profesion: any) => ({
      value: profesion.id_profesion?.toString() || '',
      label: profesion.nombre || 'Sin nombre'
    }));
  }, [profesionesData]);

  const enfermedadesOptions = useMemo((): AutocompleteOption[] => {
    if (!enfermedadesData || !Array.isArray(enfermedadesData)) {
      return [];
    }
    return enfermedadesData.map((enfermedad: any) => ({
      value: enfermedad.id_enfermedad?.toString() || '',
      label: enfermedad.nombre || 'Sin nombre'
    }));
  }, [enfermedadesData]);

  const comunidadesCulturalesOptions = useMemo((): AutocompleteOption[] => {
    if (!comunidadesCulturalesData || !Array.isArray(comunidadesCulturalesData)) {
      return [];
    }
    return comunidadesCulturalesData.map((comunidad: any) => ({
      value: comunidad.id_comunidad_cultural?.toString() || '',
      label: comunidad.nombre || 'Sin nombre'
    }));
  }, [comunidadesCulturalesData]);

  // Estados de carga y error generales
  const isAnyLoading = useMemo(() => {
    return sectoresLoading || usersLoading || sexosLoading || 
           estadosCivilesLoading || tiposViviendaLoading || 
           disposicionBasuraLoading || aguasResidualesLoading || 
           tiposIdentificacionLoading || parentescosLoading ||
           situacionesCivilesLoading || estudiosLoading ||
           profesionesLoading || enfermedadesLoading ||
           comunidadesCulturalesLoading || parroquiasLoading || 
           municipiosLoading || veredasLoading ||
           departamentosLoading || sistemasAcueductoLoading || tallasLoading;
  }, [
    sectoresLoading, usersLoading, sexosLoading,
    estadosCivilesLoading, tiposViviendaLoading,
    disposicionBasuraLoading, aguasResidualesLoading,
    tiposIdentificacionLoading, parentescosLoading,
    situacionesCivilesLoading, estudiosLoading,
    profesionesLoading, enfermedadesLoading,
    comunidadesCulturalesLoading, parroquiasLoading, 
    municipiosLoading, veredasLoading,
    departamentosLoading, sistemasAcueductoLoading, tallasLoading
  ]);

  const hasAnyError = useMemo(() => {
    return !!(sectoresError || usersError || sexosError ||
              estadosCivilesError || tiposViviendaError ||
              disposicionBasuraError || aguasResidualesError ||
              tiposIdentificacionError || parentescosError ||
              situacionesCivilesError || estudiosError ||
              profesionesError || enfermedadesError ||
              comunidadesCulturalesError || parroquiasError || 
              municipiosError || veredasError ||
              departamentosError || sistemasAcueductoError || tallasError);
  }, [
    sectoresError, usersError, sexosError,
    estadosCivilesError, tiposViviendaError,
    disposicionBasuraError, aguasResidualesError,
    tiposIdentificacionError, parentescosError,
    situacionesCivilesError, estudiosError,
    profesionesError, enfermedadesError,
    comunidadesCulturalesError, parroquiasError, 
    municipiosError, veredasError,
    departamentosError, sistemasAcueductoError, tallasError
  ]);

  return {
    // Sectores
    sectorOptions,
    sectoresLoading,
    sectoresError,

    // Usuarios
    userOptions,
    usersLoading,
    usersError,

    // Sexos
    sexoOptions,
    sexosLoading,
    sexosError,

    // Estados civiles
    estadoCivilOptions,
    estadosCivilesLoading,
    estadosCivilesError,

    // Tipos de vivienda
    tipoViviendaOptions,
    tiposViviendaLoading,
    tiposViviendaError,

    // Disposición de basura
    disposicionBasuraOptions,
    disposicionBasuraLoading,
    disposicionBasuraError,

    // Aguas residuales
    aguasResidualesOptions,
    aguasResidualesLoading,
    aguasResidualesError,

    // Tipos de identificación
    tiposIdentificacionOptions,
    tiposIdentificacionLoading,
    tiposIdentificacionError,

    // Parentescos
    parentescosOptions,
    parentescosLoading,
    parentescosError,

    // Situaciones civiles
    situacionesCivilesOptions,
    situacionesCivilesLoading,
    situacionesCivilesError,

    // Estudios
    estudiosOptions,
    estudiosLoading,
    estudiosError,

    // Profesiones
    profesionesOptions,
    profesionesLoading,
    profesionesError,

    // Enfermedades
    enfermedadesOptions,
    enfermedadesLoading,
    enfermedadesError,

    // Comunidades culturales
    comunidadesCulturalesOptions,
    comunidadesCulturalesLoading,
    comunidadesCulturalesError,

    // Parroquias
    parroquiaOptions,
    parroquiasLoading,
    parroquiasError,

    // Municipios
    municipioOptions,
    municipiosLoading,
    municipiosError,

    // Veredas
    veredaOptions,
    veredasLoading,
    veredasError,

    // Departamentos
    departamentoOptions,
    departamentosLoading,
    departamentosError,

    // Sistemas de Acueducto
    sistemasAcueductoOptions,
    sistemasAcueductoLoading,
    sistemasAcueductoError,

    // Tallas
    tallasOptions,
    tallasLoading,
    tallasError,

    // Estados generales
    isAnyLoading,
    hasAnyError,
  };
};

export default useConfigurationData;
