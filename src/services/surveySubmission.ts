/**
 * Servicio para envío de encuestas al servidor
 * Maneja el envío de la estructura de datos nueva al endpoint de surveys
 */

import { apiPost } from '@/interceptors/axios';
import { SurveySessionData } from '@/types/survey';
import { transformSurveyDataForAPI, validateAPIFormat, logDataDifferences } from '@/utils/surveyAPITransformer';

export interface SurveySubmissionResponse {
  success: boolean;
  message: string;
  data?: any;
  surveyId?: string;
}

/**
 * Servicio especializado para envío de encuestas
 */
export class SurveySubmissionService {
  
  /**
   * Envía una encuesta al servidor usando la estructura de datos nueva
   * @param surveyData - Datos de la encuesta en formato SurveySessionData
   * @returns Respuesta del servidor
   */
  static async submitSurvey(surveyData: SurveySessionData): Promise<SurveySubmissionResponse> {
    try {
      console.log('🚀 Iniciando envío de encuesta...');
      
      // Transformar datos al formato esperado por la API
      const apiData = transformSurveyDataForAPI(surveyData);
      
      // Validar formato antes del envío
      const validation = validateAPIFormat(apiData);
      if (!validation.isValid) {
        console.error('❌ Errores de validación:', validation.errors);
        return {
          success: false,
          message: `Errores de validación: ${validation.errors.join(', ')}`
        };
      }
      
      // Log diferencias para debugging (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        logDataDifferences(surveyData, apiData);
      }
      
      console.log('📤 Enviando datos transformados a /api/encuesta:', apiData);
      
      const response = await apiPost('/api/encuesta', apiData);
      
      console.log('✅ Respuesta exitosa del servidor:', response.data);
      
      return {
        success: true,
        message: 'Encuesta enviada correctamente',
        data: response.data,
        surveyId: response.data?.id || response.data?.surveyId || response.data?.familia_id
      };
      
    } catch (error: any) {
      console.error('❌ Error al enviar encuesta:', error);
      console.error('📋 Datos que causaron el error:', surveyData);
      
      // Extraer información detallada del error
      const errorResponse = error.response?.data;
      let errorMessage = 'Error desconocido al enviar la encuesta';
      
      if (errorResponse) {
        if (errorResponse.message) {
          errorMessage = errorResponse.message;
        } else if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
          errorMessage = errorResponse.errors.join(', ');
        } else if (errorResponse.error) {
          errorMessage = errorResponse.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const statusCode = error.response?.status || 500;
      
      return {
        success: false,
        message: `Error ${statusCode}: ${errorMessage}`,
        data: errorResponse
      };
    }
  }

  /**
   * Envía encuesta desde localStorage
   * @param storageKey - Clave del localStorage (por defecto 'parish-survey-draft')
   * @returns Respuesta del servidor
   */
  static async submitSurveyFromStorage(storageKey: string = 'parish-survey-draft'): Promise<SurveySubmissionResponse> {
    try {
      // Obtener datos del localStorage
      const storedData = localStorage.getItem(storageKey);
      
      if (!storedData) {
        return {
          success: false,
          message: 'No se encontraron datos de encuesta en el almacenamiento local'
        };
      }

      const surveyData: SurveySessionData = JSON.parse(storedData);
      
      // Validar estructura mínima
      if (!surveyData.informacionGeneral || !surveyData.metadata) {
        return {
          success: false,
          message: 'Los datos de la encuesta no tienen la estructura correcta'
        };
      }

      // Enviar la encuesta
      return await this.submitSurvey(surveyData);
      
    } catch (error) {
      console.error('❌ Error al procesar datos del localStorage:', error);
      return {
        success: false,
        message: 'Error al procesar los datos almacenados localmente'
      };
    }
  }

  /**
   * Convierte la estructura nueva a un formato compatible con el endpoint actual si es necesario
   * @param surveyData - Datos en formato SurveySessionData
   * @returns Datos transformados para el API
   */
  static transformForAPI(surveyData: SurveySessionData): any {
    // Usar el nuevo transformador
    const transformedData = transformSurveyDataForAPI(surveyData);
    
    return {
      ...transformedData,
      // Agregar metadata adicional para el API
      submittedAt: new Date().toISOString(),
      source: 'parish-survey-form',
      version: '2.0' // Indicar que viene de la nueva estructura
    };
  }

  /**
   * Valida los datos antes del envío
   * @param surveyData - Datos a validar
   * @returns true si los datos son válidos
   */
  static validateSurveyData(surveyData: SurveySessionData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar información general
    if (!surveyData.informacionGeneral) {
      errors.push('Falta información general');
    } else {
      if (!surveyData.informacionGeneral.apellido_familiar) {
        errors.push('Falta apellido familiar');
      }
      if (!surveyData.informacionGeneral.direccion) {
        errors.push('Falta dirección');
      }
      if (!surveyData.informacionGeneral.municipio) {
        errors.push('Falta municipio');
      }
    }

    // Validar vivienda
    if (!surveyData.vivienda) {
      errors.push('Falta información de vivienda');
    } else if (!surveyData.vivienda.tipo_vivienda) {
      errors.push('Falta tipo de vivienda');
    }

    // Validar servicios de agua
    if (!surveyData.servicios_agua) {
      errors.push('Falta información de servicios de agua');
    } else if (!surveyData.servicios_agua.sistema_acueducto) {
      errors.push('Falta sistema de acueducto');
    }

    // Validar observaciones
    if (!surveyData.observaciones) {
      errors.push('Falta información de observaciones');
    }

    // Validar metadata
    if (!surveyData.metadata) {
      errors.push('Falta metadata');
    }

    // Validar que tenga al menos un miembro de familia
    if (!surveyData.familyMembers || surveyData.familyMembers.length === 0) {
      errors.push('Debe incluir al menos un miembro de la familia');
    } else {
      // Validar cada miembro de familia
      surveyData.familyMembers.forEach((member, index) => {
        if (!member.nombres) {
          errors.push(`Miembro de familia ${index + 1}: falta nombre`);
        }
        if (!member.numeroIdentificacion) {
          errors.push(`Miembro de familia ${index + 1}: falta número de identificación`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Limpia el localStorage después del envío exitoso
   * @param storageKey - Clave del localStorage a limpiar
   */
  static clearStorageAfterSubmission(storageKey: string = 'parish-survey-draft'): void {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('❌ Error al limpiar localStorage:', error);
    }
  }
}

/**
 * Hook para envío de encuestas (para usar en componentes React)
 */
export function useSurveySubmission() {
  const submitSurvey = async (surveyData: SurveySessionData) => {
    return await SurveySubmissionService.submitSurvey(surveyData);
  };

  const submitFromStorage = async (storageKey?: string) => {
    return await SurveySubmissionService.submitSurveyFromStorage(storageKey);
  };

  return {
    submitSurvey,
    submitFromStorage,
    validateSurveyData: SurveySubmissionService.validateSurveyData
  };
}
