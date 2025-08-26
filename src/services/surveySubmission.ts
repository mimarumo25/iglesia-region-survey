/**
 * Servicio para envío de encuestas al servidor
 * Maneja el envío de la estructura de datos nueva al endpoint de surveys
 */

import { apiPost } from '@/interceptors/axios';
import { SurveySessionData } from '@/types/survey';

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
      const response = await apiPost('/api/encuesta', surveyData);
      
      return {
        success: true,
        message: 'Encuesta enviada correctamente',
        data: response.data,
        surveyId: response.data?.id || response.data?.surveyId
      };
      
    } catch (error: any) {
      console.error('❌ Error al enviar encuesta:', error);
      
      // Extraer información del error
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error desconocido al enviar la encuesta';
      
      const statusCode = error.response?.status || 500;
      
      return {
        success: false,
        message: `Error ${statusCode}: ${errorMessage}`,
        data: error.response?.data
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
    // Por ahora enviaremos tal como está
    // Si el API necesita un formato específico, se puede transformar aquí
    
    return {
      ...surveyData,
      // Agregar cualquier transformación necesaria para el API
      submittedAt: new Date().toISOString(),
      source: 'parish-survey-form'
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
      if (!surveyData.informacionGeneral.municipio) {
        errors.push('Falta municipio');
      }
      if (!surveyData.informacionGeneral.parroquia) {
        errors.push('Falta parroquia');
      }
    }

    // Validar metadata
    if (!surveyData.metadata) {
      errors.push('Falta metadata');
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
