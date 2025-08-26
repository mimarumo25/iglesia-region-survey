/**
 * Utilidades para manejo de datos de encuesta con estructura mejorada por sesiones
 */

import { ConfigurationItem, SurveySessionData } from "@/types/survey";

/**
 * Convierte un valor string a un ConfigurationItem o null
 */
export const stringToConfigurationItem = (
  value: string | null | undefined,
  items: ConfigurationItem[]
): ConfigurationItem | null => {
  if (!value || !items.length) return null;
  
  return items.find(item => item.id === value) || null;
};

/**
 * Convierte un ConfigurationItem a string para compatibilidad
 */
export const configurationItemToString = (item: ConfigurationItem | null): string => {
  return item?.id || '';
};

/**
 * Inicializa datos de encuesta con estructura por sesiones
 */
export const initializeSurveySessionData = (initialData?: any): SurveySessionData => {
  return {
    informacionGeneral: {
      municipio: null,
      parroquia: null,
      sector: null,
      vereda: null,
      fecha: new Date().toISOString().split('T')[0],
      apellido_familiar: '',
      direccion: '',
      telefono: '',
      numero_contrato_epm: '',
    },
    vivienda: {
      tipo_vivienda: null,
      disposicion_basuras: {
        recolector: false,
        quemada: false,
        enterrada: false,
        recicla: false,
        aire_libre: false,
        no_aplica: false,
      },
    },
    servicios_agua: {
      sistema_acueducto: null,
      aguas_residuales: null,
      pozo_septico: false,
      letrina: false,
      campo_abierto: false,
    },
    observaciones: {
      sustento_familia: '',
      observaciones_encuestador: '',
      autorizacion_datos: false,
    },
    familyMembers: initialData?.family_members || [],
    deceasedMembers: initialData?.deceased_members || [],
    metadata: {
      timestamp: new Date().toISOString(),
      completed: false,
      currentStage: 1,
    },
  };
};

/**
 * Actualiza un campo de información general
 */
export const updateInformacionGeneral = (
  surveyData: SurveySessionData,
  field: keyof SurveySessionData['informacionGeneral'],
  value: any
): SurveySessionData => {
  return {
    ...surveyData,
    informacionGeneral: {
      ...surveyData.informacionGeneral,
      [field]: value,
    },
    metadata: {
      ...surveyData.metadata,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Actualiza un campo de vivienda
 */
export const updateVivienda = (
  surveyData: SurveySessionData,
  field: keyof SurveySessionData['vivienda'],
  value: any
): SurveySessionData => {
  return {
    ...surveyData,
    vivienda: {
      ...surveyData.vivienda,
      [field]: value,
    },
    metadata: {
      ...surveyData.metadata,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Actualiza un campo específico de disposición de basuras
 */
export const updateDisposicionBasuras = (
  surveyData: SurveySessionData,
  field: keyof SurveySessionData['vivienda']['disposicion_basuras'],
  value: boolean
): SurveySessionData => {
  return {
    ...surveyData,
    vivienda: {
      ...surveyData.vivienda,
      disposicion_basuras: {
        ...surveyData.vivienda.disposicion_basuras,
        [field]: value,
      },
    },
    metadata: {
      ...surveyData.metadata,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Actualiza un campo de servicios de agua
 */
export const updateServiciosAgua = (
  surveyData: SurveySessionData,
  field: keyof SurveySessionData['servicios_agua'],
  value: any
): SurveySessionData => {
  return {
    ...surveyData,
    servicios_agua: {
      ...surveyData.servicios_agua,
      [field]: value,
    },
    metadata: {
      ...surveyData.metadata,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Actualiza observaciones
 */
export const updateObservaciones = (
  surveyData: SurveySessionData,
  field: keyof SurveySessionData['observaciones'],
  value: any
): SurveySessionData => {
  return {
    ...surveyData,
    observaciones: {
      ...surveyData.observaciones,
      [field]: value,
    },
    metadata: {
      ...surveyData.metadata,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Valida si una etapa está completa
 */
export const isStageComplete = (surveyData: SurveySessionData, stage: number): boolean => {
  switch (stage) {
    case 1: // Información General
      return !!(
        surveyData.informacionGeneral.municipio &&
        surveyData.informacionGeneral.apellido_familiar &&
        surveyData.informacionGeneral.direccion &&
        surveyData.informacionGeneral.fecha
      );
    
    case 2: // Vivienda
      return !!(surveyData.vivienda.tipo_vivienda);
    
    case 3: // Servicios de agua
      // No hay campos obligatorios en esta etapa
      return true;
    
    case 4: // Miembros de familia
      return surveyData.familyMembers.length > 0;
    
    case 5: // Fallecidos
      // No hay campos obligatorios en esta etapa
      return true;
    
    case 6: // Observaciones
      return surveyData.observaciones.autorizacion_datos;
    
    default:
      return true;
  }
};

/**
 * Convierte SurveySessionData a formato legacy para compatibilidad con APIs
 */
export const convertToLegacyFormat = (surveyData: SurveySessionData): any => {
  return {
    // Información general (convertir ConfigurationItems a strings)
    municipio: surveyData.informacionGeneral.municipio?.id || '',
    parroquia: surveyData.informacionGeneral.parroquia?.id || '',
    sector: surveyData.informacionGeneral.sector?.id || '',
    vereda: surveyData.informacionGeneral.vereda?.id || '',
    fecha: surveyData.informacionGeneral.fecha,
    apellido_familiar: surveyData.informacionGeneral.apellido_familiar,
    direccion: surveyData.informacionGeneral.direccion,
    telefono: surveyData.informacionGeneral.telefono,
    numero_contrato_epm: surveyData.informacionGeneral.numero_contrato_epm,
    
    // Vivienda
    tipo_vivienda: surveyData.vivienda.tipo_vivienda?.id || '',
    basuras_recolector: surveyData.vivienda.disposicion_basuras.recolector,
    basuras_quemada: surveyData.vivienda.disposicion_basuras.quemada,
    basuras_enterrada: surveyData.vivienda.disposicion_basuras.enterrada,
    basuras_recicla: surveyData.vivienda.disposicion_basuras.recicla,
    basuras_aire_libre: surveyData.vivienda.disposicion_basuras.aire_libre,
    basuras_no_aplica: surveyData.vivienda.disposicion_basuras.no_aplica,
    
    // Servicios de agua
    sistema_acueducto: surveyData.servicios_agua.sistema_acueducto?.id || '',
    aguas_residuales: surveyData.servicios_agua.aguas_residuales?.id || '',
    pozo_septico: surveyData.servicios_agua.pozo_septico,
    letrina: surveyData.servicios_agua.letrina,
    campo_abierto: surveyData.servicios_agua.campo_abierto,
    
    // Observaciones
    sustento_familia: surveyData.observaciones.sustento_familia,
    observaciones_encuestador: surveyData.observaciones.observaciones_encuestador,
    autorizacion_datos: surveyData.observaciones.autorizacion_datos,
    
    // Familia
    familyMembers: surveyData.familyMembers,
    deceasedMembers: surveyData.deceasedMembers,
    
    // Metadata
    timestamp: surveyData.metadata.timestamp,
    completed: surveyData.metadata.completed,
  };
};
