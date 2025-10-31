import { useMemo, useRef, useEffect } from "react";
import { AutocompleteOption } from "@/components/ui/autocomplete";
import { ConfigurationItem } from "@/types/survey";
import type { Municipio } from "@/services/municipios";
import type { Departamento } from "@/services/departamentos";
import type { SistemaAcueducto } from "@/types/sistemas-acueducto";
import type { DisposicionBasura } from "@/types/disposicion-basura";
import type { AguaResidual } from "@/types/aguas-residuales";

// Tipo para errores de API
type ApiError = string | null | Error | { message: string };

// Tipos específicos para los datos de API
interface SituacionCivil {
  id: number;
  id_situacion_civil?: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

// Importar tipos específicos
import type { TipoVivienda as TipoViviendaType } from "@/types/tipos-vivienda";

// Importar hooks de servicios disponibles
import { useSectores } from "@/hooks/useSectores";
import { useUsers } from "@/hooks/useUsers";
import { useSexos } from "@/hooks/useSexos";
import { useSituacionesCiviles } from "@/hooks/useSituacionesCiviles";
import { useTiposVivienda } from "@/hooks/useTiposVivienda";
import { useParroquias } from "@/hooks/useParroquias";
import { useMunicipios } from "@/hooks/useMunicipios";
import { useVeredas } from "@/hooks/useVeredas";
import { useDisposicionBasura } from "@/hooks/useDisposicionBasura";
import { useAguasResiduales } from "@/hooks/useAguasResiduales";
import { useTiposIdentificacion } from "@/hooks/useTiposIdentificacion";
import { useParentescos } from "@/hooks/useParentescos";
import { useEstudios } from "@/hooks/useEstudios";
import { useProfesiones } from "@/hooks/useProfesiones";
import { useEnfermedades } from "@/hooks/useEnfermedades";
import { useComunidadesCulturales } from "@/hooks/useComunidadesCulturales";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { useSistemasAcueducto } from "@/hooks/useSistemasAcueducto";

export interface ConfigurationData {
  // Sectores - con objetos ConfigurationItem
  sectorOptions: AutocompleteOption[];
  sectorItems: ConfigurationItem[];
  sectoresLoading: boolean;
  sectoresError: ApiError;

  // Usuarios
  userOptions: AutocompleteOption[];
  usersLoading: boolean;
  usersError: ApiError;

  // Sexos - con objetos ConfigurationItem
  sexoOptions: AutocompleteOption[];
  sexoItems: ConfigurationItem[];
  sexosLoading: boolean;
  sexosError: ApiError;

  // Estados civiles - con objetos ConfigurationItem
  estadoCivilOptions: AutocompleteOption[];
  estadoCivilItems: ConfigurationItem[];
  situacionesCivilesLoading: boolean;
  situacionesCivilesError: ApiError;

  // Tipos de vivienda - con objetos ConfigurationItem
  tipoViviendaOptions: AutocompleteOption[];
  tipoViviendaItems: ConfigurationItem[];
  tiposViviendaLoading: boolean;
  tiposViviendaError: ApiError;

  // Disposición de basura - con objetos ConfigurationItem
  disposicionBasuraOptions: AutocompleteOption[];
  disposicionBasuraItems: ConfigurationItem[];
  disposicionBasuraLoading: boolean;
  disposicionBasuraError: ApiError;

  // Aguas residuales - con objetos ConfigurationItem
  aguasResidualesOptions: AutocompleteOption[];
  aguasResidualesItems: ConfigurationItem[];
  aguasResidualesLoading: boolean;
  aguasResidualesError: ApiError;

  // Tipos de identificación - con objetos ConfigurationItem
  tiposIdentificacionOptions: AutocompleteOption[];
  tiposIdentificacionItems: ConfigurationItem[];
  tiposIdentificacionLoading: boolean;
  tiposIdentificacionError: ApiError;

  // Parentescos - con objetos ConfigurationItem
  parentescosOptions: AutocompleteOption[];
  parentescosItems: ConfigurationItem[];
  parentescosLoading: boolean;
  parentescosError: ApiError;

  // Estudios - con objetos ConfigurationItem
  estudiosOptions: AutocompleteOption[];
  estudiosItems: ConfigurationItem[];
  estudiosLoading: boolean;
  estudiosError: ApiError;

  // Profesiones - con objetos ConfigurationItem
  profesionesOptions: AutocompleteOption[];
  profesionesItems: ConfigurationItem[];
  profesionesLoading: boolean;
  profesionesError: ApiError;

  // Enfermedades - con objetos ConfigurationItem
  enfermedadesOptions: AutocompleteOption[];
  enfermedadesItems: ConfigurationItem[];
  enfermedadesLoading: boolean;
  enfermedadesError: ApiError;

  // Comunidades culturales - con objetos ConfigurationItem
  comunidadesCulturalesOptions: AutocompleteOption[];
  comunidadesCulturalesItems: ConfigurationItem[];
  comunidadesCulturalesLoading: boolean;
  comunidadesCulturalesError: ApiError;

  // Parroquias - con objetos ConfigurationItem
  parroquiaOptions: AutocompleteOption[];
  parroquiaItems: ConfigurationItem[];
  parroquiasLoading: boolean;
  parroquiasError: ApiError;

  // Municipios - con objetos ConfigurationItem
  municipioOptions: AutocompleteOption[];
  municipioItems: ConfigurationItem[];
  municipiosLoading: boolean;
  municipiosError: ApiError;

  // Veredas - con objetos ConfigurationItem
  veredaOptions: AutocompleteOption[];
  veredaItems: ConfigurationItem[];
  veredasLoading: boolean;
  veredasError: ApiError;

  // Departamentos - con objetos ConfigurationItem
  departamentoOptions: AutocompleteOption[];
  departamentoItems: ConfigurationItem[];
  departamentosLoading: boolean;
  departamentosError: ApiError;

  // Sistemas de Acueducto - con objetos ConfigurationItem
  sistemasAcueductoOptions: AutocompleteOption[];
  sistemasAcueductoItems: ConfigurationItem[];
  sistemasAcueductoLoading: boolean;
  sistemasAcueductoError: ApiError;

  // Estado general de carga
  isAnyLoading: boolean;
  hasAnyError: boolean;
}

/**
 * Hook personalizado para cargar y gestionar datos de configuración básicos
 * de la aplicación de manera centralizada con manejo mejorado de errores
 */
export const useConfigurationData = (): ConfigurationData => {
  // Ref para rastrear si el componente está montado
  const mountedRef = useRef(true);
  
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Función auxiliar para convertir opciones a items estructurados de forma segura
  const convertToConfigurationItems = useMemo(() => 
    (options: AutocompleteOption[]): ConfigurationItem[] => {
      if (!mountedRef.current || !Array.isArray(options)) {
        return [];
      }
      
      return options.map(option => ({
        id: option.value,
        nombre: option.label
      }));
    }, []);
  
  // Función auxiliar para manejo seguro de datos
  const safeDataExtraction = useMemo(() => 
    <T>(data: T | null | undefined, defaultValue: T[] = [] as T[]): T[] => {
      if (!mountedRef.current || !data) {
        return defaultValue;
      }
      return Array.isArray(data) ? data : defaultValue;
    }, []);
  
  // Hooks de servicios con manejo de errores mejorado
  const { useActiveSectoresQuery } = useSectores();
  const { useUsersQuery } = useUsers();
  const { useSexosActivosQuery } = useSexos();
  const { useSituacionesCivilesQuery } = useSituacionesCiviles();
  const { useTiposViviendaQuery } = useTiposVivienda();
  const { useDisposicionBasuraQuery } = useDisposicionBasura();
  const { useAguasResidualesQuery } = useAguasResiduales();
  const { useTiposIdentificacionActivosQuery } = useTiposIdentificacion();
  const { useParentescosQuery } = useParentescos();
  const { useActiveEstudiosQuery } = useEstudios();
  const { useActiveProfesionesQuery } = useProfesiones();
  const { useEnfermedadesQuery } = useEnfermedades();
  const { useComunidadesCulturalesQuery } = useComunidadesCulturales();
  const { useParroquiasQuery } = useParroquias();
  const { useAllMunicipiosQuery } = useMunicipios();
  const { useVeredasQuery } = useVeredas();
  const { useActiveDepartamentosQuery } = useDepartamentos();
  const { useSistemasAcueductoActivosQuery } = useSistemasAcueducto();

  // Queries básicas (las que sabemos que funcionan)
  const { data: sectoresData, isLoading: sectoresLoading, error: sectoresError } = useActiveSectoresQuery();
  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsersQuery();
  const { data: sexosData, isLoading: sexosLoading, error: sexosError } = useSexosActivosQuery();

  // Queries adicionales (usando parámetros por defecto)
  const { data: situacionesCivilesData, isLoading: situacionesCivilesLoading, error: situacionesCivilesError } = useSituacionesCivilesQuery(1, 50);
  const tiposViviendaQuery = useTiposViviendaQuery(undefined, 1, 50);
  const { data: tiposViviendaData, isLoading: tiposViviendaLoading, error: tiposViviendaError } = tiposViviendaQuery;
  const disposicionBasuraQuery = useDisposicionBasuraQuery(undefined, 1, 50);
  const { data: disposicionBasuraData, isLoading: disposicionBasuraLoading, error: disposicionBasuraError } = disposicionBasuraQuery;
  const aguasResidualesQuery = useAguasResidualesQuery('', 1, 50);
  const { data: aguasResidualesData, isLoading: aguasResidualesLoading, error: aguasResidualesError } = aguasResidualesQuery;
  const tiposIdentificacionQuery = useTiposIdentificacionActivosQuery(1, 50);
  const { data: tiposIdentificacionData, isLoading: tiposIdentificacionLoading, error: tiposIdentificacionError } = tiposIdentificacionQuery;
  const parentescosQuery = useParentescosQuery(1, 50);
  const { data: parentescosData, isLoading: parentescosLoading, error: parentescosError } = parentescosQuery;
  const estudiosQuery = useActiveEstudiosQuery();
  const { data: estudiosData, isLoading: estudiosLoading, error: estudiosError } = estudiosQuery;
  const profesionesQuery = useActiveProfesionesQuery();
  const { data: profesionesData, isLoading: profesionesLoading, error: profesionesError } = profesionesQuery;
  const enfermedadesQuery = useEnfermedadesQuery(1, 50);
  const { data: enfermedadesData, isLoading: enfermedadesLoading, error: enfermedadesError } = enfermedadesQuery;
  const comunidadesCulturalesQuery = useComunidadesCulturalesQuery();
  const { data: comunidadesCulturalesData, isLoading: comunidadesCulturalesLoading, error: comunidadesCulturalesError } = comunidadesCulturalesQuery;
  const { data: parroquiasData, isLoading: parroquiasLoading, error: parroquiasError } = useParroquiasQuery();
  const { data: municipiosData, isLoading: municipiosLoading, error: municipiosError } = useAllMunicipiosQuery();
  const { data: veredasData, isLoading: veredasLoading, error: veredasError } = useVeredasQuery();
  const departamentosQuery = useActiveDepartamentosQuery();
  const { data: departamentosData, isLoading: departamentosLoading, error: departamentosError } = departamentosQuery;
  const sistemasAcueductoQuery = useSistemasAcueductoActivosQuery(1, 50);
  const { data: sistemasAcueductoData, isLoading: sistemasAcueductoLoading, error: sistemasAcueductoError } = sistemasAcueductoQuery;

  // Memoización de opciones para autocomplete y items estructurados
  const sectorOptions = useMemo((): AutocompleteOption[] => {
    if (!sectoresData?.data) {
      return [];
    }
    
    // Caso 1: La API devuelve {data: {data: Array}} (estructura anidada)
    if (typeof sectoresData.data === 'object' && 'data' in sectoresData.data && Array.isArray(sectoresData.data.data)) {
      return sectoresData.data.data.map((sector, index) => ({
        value: sector.id_sector,
        label: sector.nombre,
        description: `Sector de la parroquia`,
        category: 'Ubicación',
        popular: false // Sin estrellas
      }));
    }
    
    // Caso 2: La API de sectores devuelve una estructura con sectors array
    if (typeof sectoresData.data === 'object' && 'sectors' in sectoresData.data && Array.isArray(sectoresData.data.sectors)) {
      return sectoresData.data.sectors.map((sector, index) => ({
        value: sector.id_sector,
        label: sector.nombre,
        description: `Sector de la parroquia`,
        category: 'Ubicación',
        popular: false // Sin estrellas
      }));
    }
    
    // Caso 3: Si la respuesta es directamente un array (fallback)
    if (Array.isArray(sectoresData.data)) {
      return sectoresData.data.map((sector, index) => ({
        value: sector.id_sector,
        label: sector.nombre,
        description: `Sector de la parroquia`,
        category: 'Ubicación',
        popular: false // Sin estrellas
      }));
    }
    
    return [];
  }, [sectoresData]);

  const sectorItems = useMemo((): ConfigurationItem[] => {
    return sectorOptions.map(option => ({
      id: option.value,
      nombre: option.label
    }));
  }, [sectorOptions]);

  const userOptions = useMemo((): AutocompleteOption[] => {
    return Array.isArray(usersData) ? usersData.map(user => ({
      value: user.id,
      label: `${user.primer_nombre} ${user.primer_apellido}`
    })) : [];
  }, [usersData]);

  const sexoOptions = useMemo((): AutocompleteOption[] => {
    return sexosData?.data?.data?.map(sexo => ({
      value: sexo.id_sexo,
      label: sexo.nombre,
      description: 'Sexo biológico',
      category: 'Datos personales',
      popular: false
    })) || [];
  }, [sexosData]);

  const sexoItems = useMemo((): ConfigurationItem[] => {
    return sexoOptions.map(option => ({
      id: option.value,
      nombre: option.label
    }));
  }, [sexoOptions]);

  const estadoCivilOptions = useMemo((): AutocompleteOption[] => {
    // Verificamos la estructura de datos que devuelve la API de situaciones civiles con paginación
    const data = situacionesCivilesData as { 
      data?: { 
        situaciones_civiles?: SituacionCivil[]
      } | SituacionCivil[] 
    };
    
    // Caso 1: Estructura SituacionesCivilesResponse {status, message, data: {situaciones_civiles: Array, pagination}}
    if (data?.data && 'situaciones_civiles' in data.data && Array.isArray(data.data.situaciones_civiles)) {
      return data.data.situaciones_civiles
        .filter((situacion: SituacionCivil) => situacion.activo) // Filtrar solo activos
        .map((situacion: SituacionCivil) => ({
          value: situacion.id?.toString() || '',
          label: situacion.nombre || 'Sin nombre',
          description: `Situación civil: ${situacion.nombre}`,
          category: 'Estado Civil',
          popular: false
        }));
    }
    
    // Caso 2: Estructura ServerResponse<SituacionCivil[]> {status, message, data: Array}
    if (data?.data && Array.isArray(data.data)) {
      return data.data
        .filter((situacion: SituacionCivil) => situacion.activo) // Filtrar solo activos
        .map((situacion: SituacionCivil) => ({
          value: situacion.id?.toString() || '',
          label: situacion.nombre || 'Sin nombre',
          description: `Situación civil: ${situacion.nombre}`,
          category: 'Estado Civil',
          popular: false
        }));
    }
    
    // Caso 3: Array directo
    if (Array.isArray(data)) {
      return data
        .filter((situacion: SituacionCivil) => situacion.activo) // Filtrar solo activos
        .map((situacion: SituacionCivil) => ({
          value: situacion.id?.toString() || '',
          label: situacion.nombre || 'Sin nombre',
          description: situacion.descripcion || `Situación civil: ${situacion.nombre}`,
          category: 'Estado Civil',
          popular: false
        }));
    }
    
    return [];
  }, [situacionesCivilesData]);

  const tipoViviendaOptions = useMemo((): AutocompleteOption[] => {
    // Verificamos la estructura de datos que devuelve la API: ServerResponse<TiposViviendaResponse>
    const data = tiposViviendaData as { 
      data?: { 
        tiposVivienda?: TipoViviendaType[] 
      } 
    };
    if (!data?.data?.tiposVivienda || !Array.isArray(data.data.tiposVivienda)) {
      return [];
    }
    return data.data.tiposVivienda.map((tipo: TipoViviendaType) => ({
      value: tipo.id_tipo_vivienda?.toString() || '',
      label: tipo.nombre || 'Sin nombre',
      description: tipo.descripcion || `Tipo de vivienda: ${tipo.nombre}`,
      category: 'Vivienda'
    }));
  }, [tiposViviendaData]);

  const parroquiaOptions = useMemo((): AutocompleteOption[] => {
    if (!parroquiasData?.data || !Array.isArray(parroquiasData.data)) {
      return [];
    }
    return parroquiasData.data.map(parroquia => ({
      value: parroquia.id_parroquia?.toString() || '',
      label: parroquia.nombre || 'Sin nombre',
      description: `Parroquia del municipio`,
      category: 'Ubicación'
    }));
  }, [parroquiasData]);

  const municipioOptions = useMemo((): AutocompleteOption[] => {
    if (!mountedRef.current || !municipiosData || !Array.isArray(municipiosData)) {
      return [];
    }
    
    return municipiosData.map((municipio: Municipio, index) => {
      // Verificar que municipio existe y tiene las propiedades necesarias
      if (!municipio || typeof municipio !== 'object') {
        return {
          value: '',
          label: 'Municipio inválido',
          description: 'Datos incompletos',
          category: 'División territorial',
          popular: false
        };
      }

      // Obtener nombre del municipio de forma segura
      const rawName = municipio.nombre_municipio || 'Sin nombre';
      
      const cleanName = typeof rawName === 'string' 
        ? rawName.replace(/[🏢🏘️🌆🏙️🌃🗼🏛️🏠🏡🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🌍🌎🌏📍🎯🌟⭐✨💫🔸🔹🔷🔶⚡🔥💎🎊🎉🏆🥇🎖️🏅★☆✦✧✩✪✫⋆※○◯◎●◆◇◈◉◊⬣⬡⬢⬛⬜]/gu, '').trim()
        : 'Sin nombre';

      // Manejar información del departamento de forma segura
      let departamentoInfo = 'Colombia';
      if (municipio.departamento) {
        if (typeof municipio.departamento === 'object' && municipio.departamento.nombre) {
          // Si departamento es un objeto con nombre
          departamentoInfo = municipio.departamento.nombre;
        }
      }
      
      // Limpiar información de departamento de caracteres extraños
      departamentoInfo = departamentoInfo
        .replace(/Actualizado/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Crear descripción limpia
      const description = `Municipio del departamento de ${departamentoInfo}`;

      const option: AutocompleteOption = {
        value: municipio.id_municipio?.toString() || `temp-${index}`,
        label: cleanName,
        description: description,
        category: 'División territorial',
        popular: false // No marcar municipios como populares para evitar estrella
      };

      return option;
    }).filter(option => option.value && option.label !== 'Municipio inválido'); // Filtrar opciones inválidas
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
    return departamentosData.data.map((departamento: Departamento) => ({
      value: departamento.id_departamento?.toString() || '',
      label: departamento.nombre || 'Sin nombre',
      description: `Departamento de Colombia`,
      category: 'División territorial',
      popular: false
    }));
  }, [departamentosData]);

  const sistemasAcueductoOptions = useMemo((): AutocompleteOption[] => {
    if (!sistemasAcueductoData || !Array.isArray(sistemasAcueductoData)) {
      return [];
    }
    return sistemasAcueductoData.map((sistema: SistemaAcueducto) => ({
      value: sistema.id_sistema_acueducto?.toString() || '',
      label: sistema.nombre || 'Sin nombre',
      description: `Sistema de abastecimiento de agua`,
      category: 'Servicios públicos',
      popular: false
    }));
  }, [sistemasAcueductoData]);

  const disposicionBasuraOptions = useMemo((): AutocompleteOption[] => {
    // Verificamos la estructura de datos que devuelve la API: DisposicionBasuraResponse
    const data = disposicionBasuraData as { 
      data?: { 
        data?: DisposicionBasura[] 
      } | DisposicionBasura[] 
    };
    
    // Caso 1: Estructura DisposicionBasuraResponse completa: {status, message, data: {status, data: Array, total, message}}
    if (data?.data && 'data' in data.data && Array.isArray(data.data.data)) {
      const options = data.data.data.map((tipo: DisposicionBasura) => ({
        value: tipo.id_tipo_disposicion_basura?.toString() || '',
        label: tipo.nombre || 'Sin nombre',
        description: tipo.descripcion || `Tipo de disposición de basura`,
        category: 'Manejo de Basura',
        popular: false
      }));
      return options;
    }
    
    // Caso 2: Estructura {data: Array} directamente
    if (data?.data && Array.isArray(data.data)) {
      const options = data.data.map((tipo: DisposicionBasura) => ({
        value: tipo.id_tipo_disposicion_basura?.toString() || '',
        label: tipo.nombre || 'Sin nombre',
        description: tipo.descripcion || `Tipo de disposición de basura`,
        category: 'Manejo de Basura',
        popular: false
      }));
      return options;
    }
    
    // Caso 3: Array directo
    if (Array.isArray(data)) {
      const options = data.map((tipo: DisposicionBasura) => ({
        value: tipo.id_tipo_disposicion_basura?.toString() || '',
        label: tipo.nombre || 'Sin nombre',
        description: tipo.descripcion || 'Tipo de disposición de basura',
        category: 'Manejo de Basura',
        popular: false
      }));
      return options;
    }
    
    return [];
  }, [disposicionBasuraData]);

  const aguasResidualesOptions = useMemo((): AutocompleteOption[] => {
    // Verificamos la estructura de datos que devuelve la API: AguasResidualesResponse
    const data = aguasResidualesData as {
      data?: {
        tiposAguasResiduales?: AguaResidual[]
      }
    };
    if (!data?.data?.tiposAguasResiduales || !Array.isArray(data.data.tiposAguasResiduales)) {
      return [];
    }
    return data.data.tiposAguasResiduales.map((tipo: AguaResidual) => ({
      value: tipo.id_tipo_aguas_residuales?.toString() || '',
      label: tipo.nombre || 'Sin nombre'
    }));
  }, [aguasResidualesData]);

  const tiposIdentificacionOptions = useMemo((): AutocompleteOption[] => {
    // Estructura real: data.data.tiposIdentificacion.data (array)
    const data = tiposIdentificacionData as any;
    
    if (data?.data?.tiposIdentificacion?.data && Array.isArray(data.data.tiposIdentificacion.data)) {
      return data.data.tiposIdentificacion.data.map((tipo: any) => ({
        value: tipo.codigo || tipo.id_tipo_identificacion?.toString() || '',
        label: tipo.codigo ? `${tipo.codigo} - ${tipo.nombre}` : tipo.nombre || 'Sin nombre',
        description: tipo.descripcion || `Tipo de documento: ${tipo.nombre}`,
        category: 'Identificación',
        popular: false,
        // Agregar metadata con el ID numérico real para uso en transformaciones
        metadata: {
          id: tipo.id_tipo_identificacion,
          codigo: tipo.codigo
        }
      }));
    }
    
    // Retornar array vacío si no hay datos del servicio
    return [];
  }, [tiposIdentificacionData]);

  const parentescosOptions = useMemo((): AutocompleteOption[] => {
    // El hook useParentescosQuery devuelve una estructura {data: Array, pagination: Object}
    // Necesitamos extraer el array de parentescos
    let parentescosArray: any[] = [];
    
    if (parentescosData) {
      if (Array.isArray(parentescosData)) {
        // Si es directamente un array
        parentescosArray = parentescosData;
      } else if (parentescosData.data && Array.isArray(parentescosData.data)) {
        // Si es un objeto con propiedad data que contiene el array
        parentescosArray = parentescosData.data;
      }
    }
    
    if (!parentescosArray || parentescosArray.length === 0) {
      return [];
    }
    
    const options = parentescosArray.map((parentesco: any) => ({
      value: parentesco.id_parentesco?.toString() || '',
      label: parentesco.nombre || 'Sin nombre'
    }));
    
    return options;
  }, [parentescosData, parentescosLoading, parentescosError]);

  const estudiosOptions = useMemo((): AutocompleteOption[] => {
    // Verificamos la estructura de datos que devuelve la API: EstudiosResponse
    const data = estudiosData as any;
    
    // Caso 1: Estructura EstudiosResponse {estudios: Array, total, message}
    if (data?.estudios && Array.isArray(data.estudios)) {
      return data.estudios
        .filter((estudio: any) => estudio.activo) // Filtrar solo activos
        .map((estudio: any) => ({
          value: estudio.id?.toString() || '',
          label: estudio.nivel || 'Sin nombre',
          description: estudio.descripcion || `Nivel educativo: ${estudio.nivel}`,
          category: 'Educación',
          popular: false
        }));
    }
    
    // Caso 2: Array directo
    if (Array.isArray(data)) {
      return data
        .filter((estudio: any) => estudio.activo) // Filtrar solo activos
        .map((estudio: any) => ({
          value: estudio.id?.toString() || '',
          label: estudio.nivel || 'Sin nombre',
          description: estudio.descripcion || `Nivel educativo: ${estudio.nivel}`,
          category: 'Educación',
          popular: false
        }));
    }
    
    return [];
  }, [estudiosData]);

  const profesionesOptions = useMemo((): AutocompleteOption[] => {
    // Asertación de tipo para acceder a la estructura anidada de la respuesta de profesiones
    const profesionesResponse = profesionesData as any;
    
    // Verificar que exista la respuesta completa y los datos anidados
    if (!profesionesResponse?.data || !Array.isArray(profesionesResponse.data)) {
      return [];
    }

    return profesionesResponse.data.map((profesion: any, index: number) => {
      
      return {
        value: profesion.id_profesion?.toString() || '',
        label: profesion.nombre || 'Sin nombre',
        description: profesion.descripcion || `Profesión: ${profesion.nombre}`,
        category: 'Profesiones',
        popular: false
      };
    });
  }, [profesionesData]);

  const enfermedadesOptions = useMemo((): AutocompleteOption[] => {
    // Asertación de tipo para acceder a la estructura de la respuesta de enfermedades
    const enfermedadesResponse = enfermedadesData as any;
    
    // Verificar que exista la respuesta completa y los datos anidados
    if (!enfermedadesResponse?.data || !Array.isArray(enfermedadesResponse.data)) {
      return [];
    }

    return enfermedadesResponse.data.map((enfermedad: any, index: number) => {
      
      return {
        value: enfermedad.id_enfermedad?.toString() || '',
        label: enfermedad.nombre || 'Sin nombre',
        description: enfermedad.descripcion || `Enfermedad: ${enfermedad.nombre}`,
        category: 'Salud',
        popular: false
      };
    });
  }, [enfermedadesData]);

  const comunidadesCulturalesOptions = useMemo((): AutocompleteOption[] => {
    // Verificar que exista la respuesta completa y los datos anidados
    if (!comunidadesCulturalesData?.data?.comunidades_culturales || !Array.isArray(comunidadesCulturalesData.data.comunidades_culturales)) {
      return [];
    }
    
    return comunidadesCulturalesData.data.comunidades_culturales.map((comunidad: any, index: number) => {
      
      // Filtrar solo las comunidades activas
      if (comunidad.activo === false) {
        return null;
      }
      
      return {
        value: comunidad.id_comunidad_cultural?.toString() || '',
        label: comunidad.nombre || 'Sin nombre',
        description: comunidad.descripcion || 'Comunidad cultural',
        category: 'Cultural',
        popular: false
      };
    }).filter(Boolean); // Remover elementos null
  }, [comunidadesCulturalesData]);

  // Estados de carga y error generales
  const isAnyLoading = useMemo(() => {
    return sectoresLoading || usersLoading || sexosLoading || 
           situacionesCivilesLoading || tiposViviendaLoading || 
           disposicionBasuraLoading || aguasResidualesLoading || 
           tiposIdentificacionLoading || parentescosLoading ||
           estudiosLoading ||
           profesionesLoading || enfermedadesLoading ||
           comunidadesCulturalesLoading || parroquiasLoading || 
           municipiosLoading || veredasLoading ||
           departamentosLoading || sistemasAcueductoLoading;
  }, [
    sectoresLoading, usersLoading, sexosLoading,
    situacionesCivilesLoading, tiposViviendaLoading,
    disposicionBasuraLoading, aguasResidualesLoading,
    tiposIdentificacionLoading, parentescosLoading,
    estudiosLoading,
    profesionesLoading, enfermedadesLoading,
    comunidadesCulturalesLoading, parroquiasLoading, 
    municipiosLoading, veredasLoading,
    departamentosLoading, sistemasAcueductoLoading
  ]);

  const hasAnyError = useMemo(() => {
    return !!(sectoresError || usersError || sexosError ||
              situacionesCivilesError || tiposViviendaError ||
              disposicionBasuraError || aguasResidualesError ||
              tiposIdentificacionError || parentescosError ||
              estudiosError ||
              profesionesError || enfermedadesError ||
              comunidadesCulturalesError || parroquiasError || 
              municipiosError || veredasError ||
              departamentosError || sistemasAcueductoError);
  }, [
    sectoresError, usersError, sexosError,
    situacionesCivilesError, tiposViviendaError,
    disposicionBasuraError, aguasResidualesError,
    tiposIdentificacionError, parentescosError,
    estudiosError,
    profesionesError, enfermedadesError,
    comunidadesCulturalesError, parroquiasError, 
    municipiosError, veredasError,
    departamentosError, sistemasAcueductoError
  ]);

  return {
    // Sectores
    sectorOptions: sectorOptions || [],
    sectorItems: sectorItems || [],
    sectoresLoading,
    sectoresError,

    // Usuarios
    userOptions: userOptions || [],
    usersLoading,
    usersError,

    // Sexos
    sexoOptions: sexoOptions || [],
    sexoItems: sexoItems || [],
    sexosLoading,
    sexosError,

    // Estados civiles
    estadoCivilOptions: estadoCivilOptions || [],
    estadoCivilItems: convertToConfigurationItems(estadoCivilOptions || []),
    situacionesCivilesLoading,
    situacionesCivilesError,

    // Tipos de vivienda
    tipoViviendaOptions: tipoViviendaOptions || [],
    tipoViviendaItems: convertToConfigurationItems(tipoViviendaOptions || []),
    tiposViviendaLoading,
    tiposViviendaError,

    // Disposición de basura
    disposicionBasuraOptions: disposicionBasuraOptions || [],
    disposicionBasuraItems: convertToConfigurationItems(disposicionBasuraOptions || []),
    disposicionBasuraLoading,
    disposicionBasuraError,

    // Aguas residuales
    aguasResidualesOptions: aguasResidualesOptions || [],
    aguasResidualesItems: convertToConfigurationItems(aguasResidualesOptions || []),
    aguasResidualesLoading,
    aguasResidualesError,

    // Tipos de identificación
    tiposIdentificacionOptions: tiposIdentificacionOptions || [],
    tiposIdentificacionItems: convertToConfigurationItems(tiposIdentificacionOptions || []),
    tiposIdentificacionLoading,
    tiposIdentificacionError,

    // Parentescos
    parentescosOptions: parentescosOptions || [],
    parentescosItems: convertToConfigurationItems(parentescosOptions || []),
    parentescosLoading,
    parentescosError,

    // Estudios
    estudiosOptions: estudiosOptions || [],
    estudiosItems: convertToConfigurationItems(estudiosOptions || []),
    estudiosLoading,
    estudiosError,

    // Profesiones
    profesionesOptions: profesionesOptions || [],
    profesionesItems: convertToConfigurationItems(profesionesOptions || []),
    profesionesLoading,
    profesionesError,

    // Enfermedades
    enfermedadesOptions: enfermedadesOptions || [],
    enfermedadesItems: convertToConfigurationItems(enfermedadesOptions || []),
    enfermedadesLoading,
    enfermedadesError,

    // Comunidades culturales
    comunidadesCulturalesOptions: comunidadesCulturalesOptions || [],
    comunidadesCulturalesItems: convertToConfigurationItems(comunidadesCulturalesOptions || []),
    comunidadesCulturalesLoading,
    comunidadesCulturalesError,

    // Parroquias
    parroquiaOptions: parroquiaOptions || [],
    parroquiaItems: convertToConfigurationItems(parroquiaOptions || []),
    parroquiasLoading,
    parroquiasError,

    // Municipios
    municipioOptions: municipioOptions || [],
    municipioItems: convertToConfigurationItems(municipioOptions || []),
    municipiosLoading,
    municipiosError,

    // Veredas
    veredaOptions: veredaOptions || [],
    veredaItems: convertToConfigurationItems(veredaOptions || []),
    veredasLoading,
    veredasError,

    // Departamentos
    departamentoOptions: departamentoOptions || [],
    departamentoItems: convertToConfigurationItems(departamentoOptions || []),
    departamentosLoading,
    departamentosError,

    // Sistemas de Acueducto
    sistemasAcueductoOptions: sistemasAcueductoOptions || [],
    sistemasAcueductoItems: convertToConfigurationItems(sistemasAcueductoOptions || []),
    sistemasAcueductoLoading,
    sistemasAcueductoError,

    // Estados generales
    isAnyLoading,
    hasAnyError,
  };
};

export default useConfigurationData;
