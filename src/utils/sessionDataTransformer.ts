/**
 * Transformador de datos de encuesta - Versión simplificada 
 * Para convertir formData actual a estructura organizada por sesiones
 */

import { ConfigurationItem, SurveySessionData, FamilyMember, DeceasedFamilyMember, DynamicSelectionMap } from "@/types/survey";
import { ConfigurationData } from "@/hooks/useConfigurationData";
import { prepareFamilyMembersForSubmission } from "./formDataTransformer";
import { convertIdsToSelectionMap, createEmptySelectionMap } from "./dynamicSelectionHelpers";

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
 * Nota: corregimiento y centro_poblado se pasan como datos dinámicos desde formData
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
      // sector, vereda, corregimiento y centro_poblado son dinámicos basados en municipio
      // se guardan como objetos completos {id, nombre} desde el FormData
      sector: formData.sector_data || null,
      vereda: formData.vereda_data || null,
      corregimiento: formData.corregimiento_data || null,
      centro_poblado: formData.centro_poblado_data || null,
      fecha: formData.fecha || new Date().toISOString().split('T')[0],
      apellido_familiar: formData.apellido_familiar || '',
      direccion: formData.direccion || '',
      telefono: formData.telefono || '',
      numero_contrato_epm: formData.numero_contrato_epm || '',
      comunionEnCasa: stringToBoolean(formData.comunionEnCasa),
    },
    
    // Información de Vivienda
    vivienda: {
      tipo_vivienda: findConfigurationItem(formData.tipo_vivienda || '', configurationData.tipoViviendaItems),
      // Convertir array de IDs seleccionados a DynamicSelectionMap (array de objetos)
      // formData.disposicion_basura viene como array: ['1', '3', '5']
      disposicion_basuras: convertIdsToSelectionMap(
        Array.isArray(formData.disposicion_basura) ? formData.disposicion_basura : [],
        configurationData.disposicionBasuraOptions || []
      ),
    },
    
    // Servicios de Agua y Saneamiento  
    servicios_agua: {
      sistema_acueducto: findConfigurationItem(formData.sistema_acueducto || '', configurationData.sistemasAcueductoItems),
      // Convertir array de IDs seleccionados a DynamicSelectionMap (array de objetos)
      // formData.aguas_residuales viene como array: ['1', '3']
      aguas_residuales: convertIdsToSelectionMap(
        Array.isArray(formData.aguas_residuales) ? formData.aguas_residuales : [],
        configurationData.aguasResidualesOptions || []
      ),
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
    
    // Log limpio del JSON que se guardó
    console.clear();
    console.log('💾 GUARDADO EN LOCALSTORAGE:');
    console.log(JSON.stringify(dataToSave, null, 2));
  } catch (error) {
    // Error silenciado
  }
};


