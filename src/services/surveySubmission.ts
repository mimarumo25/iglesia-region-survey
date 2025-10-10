/**
 * 📤 Servicio de Envío de Encuestas - Sistema MIA
 * 
 * Maneja el envío completo de encuestas al servidor con las siguientes características:
 * 
 * ✨ **Funcionalidades Principales:**
 * - Transformación automática de datos al formato API
 * - Validación de datos antes del envío
 * - Envío asíncrono con manejo de errores robusto
 * - Limpieza automática del localStorage tras envío exitoso
 * - Logging detallado para debugging
 * 
 * 🔧 **Características Técnicas:**
 * - Compatible con React Hook Form y formularios del sistema
 * - Soporte para encuestas completas con miembros de familia y fallecidos
 * - Validación de integridad de datos antes del envío
 * - Manejo de errores HTTP con mensajes descriptivos
 * 
 * 🧹 **Gestión del Storage:**
 * - Limpieza automática del localStorage después del envío exitoso
 * - Previene acumulación de borradores antiguos
 * - Mantiene la sincronización entre datos locales y del servidor
 * 
 * @version 2.0
 * @since Sistema MIA v1.0
 */

import { apiPost, apiPatch } from '@/interceptors/axios';
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
      
      const response = await apiPost('/api/encuesta', apiData);
      
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
   * Actualiza una encuesta existente en el servidor
   * Usa PATCH para actualizar solo los campos específicos modificados
   * @param surveyId - ID de la encuesta a actualizar
   * @param surveyData - Datos de la encuesta en formato SurveySessionData
   * @returns Respuesta del servidor
   */
  static async updateSurvey(surveyId: string, surveyData: SurveySessionData): Promise<SurveySubmissionResponse> {
    try {
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
        console.log('📤 Actualizando encuesta con PATCH:', surveyId);
        logDataDifferences(surveyData, apiData);
      }
      
      // Usar PATCH para actualizar solo campos específicos
      const response = await apiPatch(`/api/encuesta/${surveyId}`, apiData);
      
      return {
        success: true,
        message: 'Encuesta actualizada correctamente',
        data: response.data,
        surveyId: surveyId
      };
      
    } catch (error: any) {
      console.error('❌ Error al actualizar encuesta:', error);
      console.error('📋 Datos que causaron el error:', surveyData);
      
      // Extraer información detallada del error
      const errorResponse = error.response?.data;
      let errorMessage = 'Error desconocido al actualizar la encuesta';
      
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
   * Envía encuesta desde localStorage y limpia el storage si es exitoso
   * @param storageKey - Clave del localStorage (por defecto 'parish-survey-draft')
   * @param autoCleanup - Si debe limpiar automáticamente el storage tras envío exitoso (por defecto true)
   * @returns Respuesta del servidor
   */
  static async submitSurveyFromStorage(
    storageKey: string = 'parish-survey-draft', 
    autoCleanup: boolean = true
  ): Promise<SurveySubmissionResponse> {
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
      const result = await this.submitSurvey(surveyData);
      
      // Si fue exitoso y autoCleanup está habilitado, limpiar storage
      if (result.success && autoCleanup) {
        this.clearStorageAfterSubmission();
      }
      
      return result;
      
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
   * 🧹 Limpia el localStorage después del envío exitoso de una encuesta
   * 
   * Esta funcionalidad automáticamente remueve los datos temporales del navegador
   * una vez que la encuesta se ha guardado exitosamente en el servidor.
   * 
   * **Beneficios:**
   * - ✅ Libera espacio de almacenamiento en el navegador
   * - ✅ Evita confusión entre borradores antiguos y nuevos
   * - ✅ Mantiene el localStorage limpio y organizado
   * - ✅ Previene problemas de sincronización de datos
   * 
   * **Claves por defecto que se limpian:**
   * - `parish-survey-draft` - Borrador de la encuesta en progreso
   * - `parish-survey-completed` - Encuesta completada pendiente de envío
   * - `survey-session-data` - Datos de sesión temporal
   * 
   * @param {...string} storageKeys - Clave(s) específica(s) del localStorage a limpiar. 
   *                                  Si no se proporciona ninguna, limpia todas las claves de encuesta por defecto
   * 
   * @example
   * ```typescript
   * // Limpiar todas las claves por defecto
   * SurveySubmissionService.clearStorageAfterSubmission();
   * 
   * // Limpiar claves específicas
   * SurveySubmissionService.clearStorageAfterSubmission('custom-draft', 'temp-data');
   * 
   * // Limpiar solo el borrador principal
   * SurveySubmissionService.clearStorageAfterSubmission('parish-survey-draft');
   * ```
   * 
   * @since v1.2.0
   */
  static clearStorageAfterSubmission(...storageKeys: string[]): void {
    try {
      // Si no se proporcionan claves específicas, limpiar todas las claves relacionadas con encuestas
      if (storageKeys.length === 0) {
        const defaultKeys = ['parish-survey-draft', 'parish-survey-completed', 'survey-session-data'];
        storageKeys = defaultKeys;
      }

      // Limpiar cada clave especificada
      storageKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });
      
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
    const result = await SurveySubmissionService.submitSurvey(surveyData);
    
    // Si fue exitoso, limpiar storage automáticamente
    if (result.success) {
      SurveySubmissionService.clearStorageAfterSubmission();
    }
    
    return result;
  };

  const submitFromStorage = async (storageKey?: string, autoCleanup: boolean = true) => {
    return await SurveySubmissionService.submitSurveyFromStorage(storageKey, autoCleanup);
  };

  const clearStorage = (...storageKeys: string[]) => {
    SurveySubmissionService.clearStorageAfterSubmission(...storageKeys);
  };

  return {
    submitSurvey,
    submitFromStorage,
    clearStorage,
    validateSurveyData: SurveySubmissionService.validateSurveyData
  };
}
