/**
 * Transformador de datos de encuesta - Versión simplificada 
 * Para convertir formData actual a estructura organizada por sesiones
 */

import { ConfigurationItem, SurveySessionData, FamilyMember, DeceasedFamilyMember } from "@/types/survey";
import { ConfigurationData } from "@/hooks/useConfigurationData";
import { prepareFamilyMembersForSubmission } from "./formDataTransformer";

/**
 * Encuentra un ConfigurationItem por su ID en una lista
 */
const findConfigurationItem = (id: string, items: ConfigurationItem[]): ConfigurationItem | null => {
  if (!id || !items.length) return null;
  return items.find(item => item.id === id) || null;
};

/**
 * Convierte un valor string del formulario a boolean
 * Maneja casos como: "true", "false", true, false, 1, 0, "1", "0"
 */
const stringToBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  return false;
};

/**
 * Transforma los datos del formulario actual a la nueva estructura SurveySessionData
 */
export const transformFormDataToSurveySession = (
  formData: Record<string, any>,
  familyMembers: FamilyMember[],
  deceasedMembers: DeceasedFamilyMember[],
  configurationData: ConfigurationData
): SurveySessionData => {
  
  return {
    // Información General - convertir strings a ConfigurationItems
    informacionGeneral: {
      municipio: findConfigurationItem(formData.municipio || '', configurationData.municipioItems),
      parroquia: findConfigurationItem(formData.parroquia || '', configurationData.parroquiaItems),
      sector: findConfigurationItem(formData.sector || '', configurationData.sectorItems),
      vereda: findConfigurationItem(formData.vereda || '', configurationData.veredaItems),
      fecha: formData.fecha || new Date().toISOString().split('T')[0],
      apellido_familiar: formData.apellido_familiar || '',
      direccion: formData.direccion || '',
      telefono: formData.telefono || '',
      numero_contrato_epm: formData.numero_contrato_epm || '',
    },
    
    // Información de Vivienda
    vivienda: {
      tipo_vivienda: findConfigurationItem(formData.tipo_vivienda || '', configurationData.tipoViviendaItems),
      disposicion_basuras: {
        recolector: stringToBoolean(formData.basuras_recolector),
        quemada: stringToBoolean(formData.basuras_quemada),
        enterrada: stringToBoolean(formData.basuras_enterrada),
        recicla: stringToBoolean(formData.basuras_recicla),
        aire_libre: stringToBoolean(formData.basuras_aire_libre),
        no_aplica: stringToBoolean(formData.basuras_no_aplica),
      },
    },
    
    // Servicios de Agua y Saneamiento  
    servicios_agua: {
      sistema_acueducto: findConfigurationItem(formData.sistema_acueducto || '', configurationData.sistemasAcueductoItems),
      aguas_residuales: findConfigurationItem(formData.aguas_residuales || '', configurationData.aguasResidualesItems),
      pozo_septico: stringToBoolean(formData.pozo_septico),
      letrina: stringToBoolean(formData.letrina),
      campo_abierto: stringToBoolean(formData.campo_abierto),
    },
    
    // Observaciones y consentimiento
    observaciones: {
      sustento_familia: formData.sustento_familia || '',
      observaciones_encuestador: formData.observaciones_encuestador || '',
      autorizacion_datos: stringToBoolean(formData.autorizacion_datos),
    },
    
    // Miembros de familia sin IDs temporales para el backend
    familyMembers: prepareFamilyMembersForSubmission(familyMembers),
    deceasedMembers: deceasedMembers,
    
    // Metadata
    metadata: {
      timestamp: new Date().toISOString(),
      completed: true,
      currentStage: 6, // Última etapa
    },
  };
};

/**
 * Guarda los datos de la encuesta en localStorage con la nueva estructura
 */
export const saveSurveyToLocalStorage = (surveyData: SurveySessionData, key: string = 'parish-survey-draft'): void => {
  try {
    const dataToSave = {
      ...surveyData,
      version: '2.0', // Para identificar la nueva estructura
    };
    
    localStorage.setItem(key, JSON.stringify(dataToSave));
  } catch (error) {
    // Error silenciado
  }
};


