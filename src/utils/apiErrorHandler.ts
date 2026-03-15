/**
 * @fileoverview Utilidades para manejo de errores de API - Sistema MIA
 *
 * - Logging consistente de errores
 * - Conversión entre formatos de datos (AutocompleteOption ↔ ConfigurationItem)
 * - Higher-order function para wrappear llamadas API
 *
 * @module utils/apiErrorHandler
 * @version 3.0.0
 */

import { AutocompleteOption } from "@/components/ui/autocomplete";
import { ConfigurationItem } from "@/types/survey";

/**
 * Convierte AutocompleteOptions a ConfigurationItems
 * 
 * Transforma el formato de UI (AutocompleteOption) al formato
 * de modelo de datos (ConfigurationItem) usado en el sistema.
 * 
 * @function convertToConfigurationItems
 * @param {AutocompleteOption[]} options - Array de opciones de autocomplete
 * @returns {ConfigurationItem[]} Array de items de configuración
 * 
 * @example
 * const autocompleteOptions: AutocompleteOption[] = [
 *   { value: "1", label: "Antioquia", category: "Departamentos" }
 * ];
 * 
 * const configItems = convertToConfigurationItems(autocompleteOptions);
 * // => [{ id: "1", nombre: "Antioquia" }]
 */
export const convertToConfigurationItems = (options: AutocompleteOption[]): ConfigurationItem[] => {
  return options.map(option => ({
    id: option.value,
    nombre: option.label
  }));
};

/**
 * Registra errores de API de forma consistente
 * 
 * Crea un objeto estructurado de error con información contextual
 * para debugging. El logging está silenciado en producción pero
 * mantiene la estructura para monitoreo futuro.
 * 
 * @function logApiError
 * @param {string} entityName - Nombre de la entidad que falló
 * @param {any} error - Objeto de error capturado
 * @param {string} [context] - Contexto adicional de la llamada
 * @returns {void}
 * 
 * @example
 * try {
 *   await fetchMunicipios();
 * } catch (error) {
 *   logApiError('municipios', error, 'Carga inicial del formulario');
 *   // Crea log estructurado con timestamp, status, mensaje
 * }
 */
export const logApiError = (
  entityName: string,
  error: any,
  context?: string
): void => {
  const errorInfo = {
    entity: entityName,
    context: context || 'API call',
    error: error?.message || 'Unknown error',
    status: error?.response?.status || 'No status',
    timestamp: new Date().toISOString()
  };
  
  // Error logging silenciado
};

/**
 * Higher-Order Function para manejo de errores en llamadas API
 * 
 * Wrappea una llamada al API con try-catch automático, logging de errores,
 * y retorno de valor de fallback opcional si falla.
 * 
 * Este patrón permite escribir código de API más limpio sin repetir
 * bloques try-catch en cada hook o servicio.
 * 
 * @function withErrorHandling
 * @template T - Tipo de dato que retorna la llamada API
 * @param {() => Promise<T>} apiCall - Función asíncrona de llamada al API
 * @param {string} entityName - Nombre de entidad para logging
 * @param {T} [fallbackValue] - Valor opcional a retornar si falla
 * @returns {() => Promise<T>} Función envuelta con manejo de errores
 * 
 * @example
 * // Sin fallback - propaga el error
 * const fetchUsers = withErrorHandling(
 *   () => apiClient.get<User[]>('/users'),
 *   'usuarios'
 * );
 * 
 * @example
 * // Con fallback - retorna array vacío si falla
 * const fetchUsers = withErrorHandling(
 *   () => apiClient.get<User[]>('/users'),
 *   'usuarios',
 *   [] // fallback
 * );
 * 
 * // Uso
 * try {
 *   const users = await fetchUsers();
 * } catch (error) {
 *   // Solo llega aquí si no hay fallbackValue
 * }
 */
export const withErrorHandling = <T>(
  apiCall: () => Promise<T>,
  entityName: string,
  fallbackValue?: T
) => {
  return async (): Promise<T> => {
    try {
      return await apiCall();
    } catch (error) {
      logApiError(entityName, error);
      
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
      
      throw error;
    }
  };
};
