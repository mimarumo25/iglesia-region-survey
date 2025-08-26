import { FormField } from "@/types/survey";
import { ConfigurationData } from "@/hooks/useConfigurationData";
import { AutocompleteOption } from "@/components/ui/autocomplete";

/**
 * Mapa de configuración que relaciona configKey con las propiedades del hook de configuración
 */
const CONFIG_MAP = {
  sectorOptions: {
    options: 'sectorOptions',
    loading: 'sectoresLoading',
    error: 'sectoresError'
  },
  parroquiaOptions: {
    options: 'parroquiaOptions',
    loading: 'parroquiasLoading',
    error: 'parroquiasError'
  },
  municipioOptions: {
    options: 'municipioOptions',
    loading: 'municipiosLoading',
    error: 'municipiosError'
  },
  veredaOptions: {
    options: 'veredaOptions',
    loading: 'veredasLoading',
    error: 'veredasError'
  },
  tipoViviendaOptions: {
    options: 'tipoViviendaOptions',
    loading: 'tiposViviendaLoading',
    error: 'tiposViviendaError'
  },
  disposicionBasuraOptions: {
    options: 'disposicionBasuraOptions',
    loading: 'disposicionBasuraLoading',
    error: 'disposicionBasuraError'
  },
  aguasResidualesOptions: {
    options: 'aguasResidualesOptions',
    loading: 'aguasResidualesLoading',
    error: 'aguasResidualesError'
  },
  sistemasAcueductoOptions: {
    options: 'sistemasAcueductoOptions',
    loading: 'sistemasAcueductoLoading',
    error: 'sistemasAcueductoError'
  },
  estadoCivilOptions: {
    options: 'estadoCivilOptions',
    loading: 'estadosCivilesLoading',
    error: 'estadosCivilesError'
  },
  sexoOptions: {
    options: 'sexoOptions',
    loading: 'sexosLoading',
    error: 'sexosError'
  },
  userOptions: {
    options: 'userOptions',
    loading: 'usersLoading',
    error: 'usersError'
  },
  tiposIdentificacionOptions: {
    options: 'tiposIdentificacionOptions',
    loading: 'tiposIdentificacionLoading',
    error: 'tiposIdentificacionError'
  },
  parentescosOptions: {
    options: 'parentescosOptions',
    loading: 'parentescosLoading',
    error: 'parentescosError'
  },
  estudiosOptions: {
    options: 'estudiosOptions',
    loading: 'estudiosLoading',
    error: 'estudiosError'
  },
  profesionesOptions: {
    options: 'profesionesOptions',
    loading: 'profesionesLoading',
    error: 'profesionesError'
  },
  enfermedadesOptions: {
    options: 'enfermedadesOptions',
    loading: 'enfermedadesLoading',
    error: 'enfermedadesError'
  },
  comunidadesCulturalesOptions: {
    options: 'comunidadesCulturalesOptions',
    loading: 'comunidadesCulturalesLoading',
    error: 'comunidadesCulturalesError'
  },
  departamentoOptions: {
    options: 'departamentoOptions',
    loading: 'departamentosLoading',
    error: 'departamentosError'
  },
  tallasOptions: {
    options: 'tallasOptions',
    loading: 'tallasLoading',
    error: 'tallasError'
  }
} as const;

/**
 * Función auxiliar para obtener las opciones de autocomplete para un campo específico
 */
export const getAutocompleteOptions = (
  field: FormField, 
  configurationData: ConfigurationData
): AutocompleteOption[] => {
  if (!field.configKey || !CONFIG_MAP[field.configKey as keyof typeof CONFIG_MAP]) {
    return [];
  }

  const configKey = field.configKey as keyof typeof CONFIG_MAP;
  const optionsKey = CONFIG_MAP[configKey].options as keyof ConfigurationData;
  
  return (configurationData[optionsKey] as AutocompleteOption[]) || [];
};

/**
 * Función auxiliar para obtener el estado de loading para un campo específico
 */
export const getLoadingState = (
  field: FormField, 
  configurationData: ConfigurationData
): boolean => {
  if (!field.configKey || !CONFIG_MAP[field.configKey as keyof typeof CONFIG_MAP]) {
    return false;
  }

  const configKey = field.configKey as keyof typeof CONFIG_MAP;
  const loadingKey = CONFIG_MAP[configKey].loading as keyof ConfigurationData;
  
  return Boolean(configurationData[loadingKey]);
};

/**
 * Función auxiliar para obtener el estado de error para un campo específico
 */
export const getErrorState = (
  field: FormField, 
  configurationData: ConfigurationData
): any => {
  if (!field.configKey || !CONFIG_MAP[field.configKey as keyof typeof CONFIG_MAP]) {
    return null;
  }

  const configKey = field.configKey as keyof typeof CONFIG_MAP;
  const errorKey = CONFIG_MAP[configKey].error as keyof ConfigurationData;
  
  return configurationData[errorKey] || null;
};

export default {
  getAutocompleteOptions,
  getLoadingState,
  getErrorState
};
