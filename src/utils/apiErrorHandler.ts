/**
 * @fileoverview Utilidades para manejo de errores de API - Sistema MIA
 * 
 * Proporciona funcionalidades robustas para manejar fallos de API:
 * - Datos de fallback para prevenir crashes de aplicación
 * - Logging consistente de errores
 * - Conversión entre formatos de datos (AutocompleteOption ↔ ConfigurationItem)
 * - Higher-order function para wrappear llamadas API
 * - Mapeo de campos de entidades
 * 
 * Este módulo asegura que la aplicación continúe funcionando incluso
 * cuando servicios externos están caídos, usando datos estáticos de respaldo.
 * 
 * @module utils/apiErrorHandler
 * @version 2.0.0
 */

import { AutocompleteOption } from "@/components/ui/autocomplete";
import { ConfigurationItem } from "@/types/survey";

/**
 * Configuración para datos de fallback
 * 
 * Define el tipo de entidad y metadata para generar datos de respaldo
 * cuando el API no responde o falla.
 * 
 * @interface FallbackDataConfig
 * @property {'departamentos' | 'municipios' | 'parroquias' | 'sectores' | ...} type - Tipo de entidad
 * @property {string} [category] - Categoría para agrupar en UI
 * @property {string} [description] - Descripción por defecto para opciones
 * 
 * @example
 * const config: FallbackDataConfig = {
 *   type: 'departamentos',
 *   category: 'Geografía',
 *   description: 'Departamento de Colombia'
 * };
 */
export interface FallbackDataConfig {
  type: 'departamentos' | 'municipios' | 'parroquias' | 'sectores' | 'disposicion_basura' | 
        'aguas_residuales' | 'tipos_vivienda' | 'sexos' | 'estados_civiles' | 
        'tipos_identificacion' | 'parentescos' | 'estudios' | 'profesiones' | 
        'enfermedades' | 'comunidades_culturales' | 'sistemas_acueducto';
  category?: string;
  description?: string;
}

/**
 * Datos de fallback por defecto para diferentes tipos de entidades
 * 
 * Catálogo estático de datos críticos del sistema que se usan cuando
 * el API no está disponible. Incluye:
 * - Departamentos de Colombia (32 departamentos)
 * - Sistemas de acueducto
 * - Métodos de disposición de basura
 * - Sexos
 * - Estados civiles
 * - Tipos de identificación
 * 
 * @constant {Record<string, any[]>} FALLBACK_DATA
 * @private
 */
const FALLBACK_DATA: Record<string, any[]> = {
  departamentos: [
    { id_departamento: '1', nombre: 'Amazonas' },
    { id_departamento: '2', nombre: 'Antioquia' },
    { id_departamento: '3', nombre: 'Arauca' },
    { id_departamento: '4', nombre: 'Atlántico' },
    { id_departamento: '5', nombre: 'Bolívar' },
    { id_departamento: '6', nombre: 'Boyacá' },
    { id_departamento: '7', nombre: 'Caldas' },
    { id_departamento: '8', nombre: 'Caquetá' },
    { id_departamento: '9', nombre: 'Casanare' },
    { id_departamento: '10', nombre: 'Cauca' },
    { id_departamento: '11', nombre: 'Cesar' },
    { id_departamento: '12', nombre: 'Chocó' },
    { id_departamento: '13', nombre: 'Córdoba' },
    { id_departamento: '14', nombre: 'Cundinamarca' },
    { id_departamento: '15', nombre: 'Guainía' },
    { id_departamento: '16', nombre: 'Guaviare' },
    { id_departamento: '17', nombre: 'Huila' },
    { id_departamento: '18', nombre: 'La Guajira' },
    { id_departamento: '19', nombre: 'Magdalena' },
    { id_departamento: '20', nombre: 'Meta' },
    { id_departamento: '21', nombre: 'Nariño' },
    { id_departamento: '22', nombre: 'Norte de Santander' },
    { id_departamento: '23', nombre: 'Putumayo' },
    { id_departamento: '24', nombre: 'Quindío' },
    { id_departamento: '25', nombre: 'Risaralda' },
    { id_departamento: '26', nombre: 'San Andrés y Providencia' },
    { id_departamento: '27', nombre: 'Santander' },
    { id_departamento: '28', nombre: 'Sucre' },
    { id_departamento: '29', nombre: 'Tolima' },
    { id_departamento: '30', nombre: 'Valle del Cauca' },
    { id_departamento: '31', nombre: 'Vaupés' },
    { id_departamento: '32', nombre: 'Vichada' }
  ],
  
  sistemas_acueducto: [
    { id_sistema_acueducto: '1', nombre: 'Acueducto municipal' },
    { id_sistema_acueducto: '2', nombre: 'Pozo propio' },
    { id_sistema_acueducto: '3', nombre: 'Aljibe' },
    { id_sistema_acueducto: '4', nombre: 'Agua de lluvia' },
    { id_sistema_acueducto: '5', nombre: 'Carrotanque' },
    { id_sistema_acueducto: '6', nombre: 'Río o quebrada' },
  ],
  
  disposicion_basura: [
    { id_tipo_disposicion_basura: '1', nombre: 'Recolección Municipal', descripcion: 'Servicio de recolección pública municipal' },
    { id_tipo_disposicion_basura: '2', nombre: 'Empresa Privada', descripcion: 'Servicio de recolección por empresa privada' },
    { id_tipo_disposicion_basura: '3', nombre: 'Incineración', descripcion: 'Quema de basura en el hogar' },
    { id_tipo_disposicion_basura: '4', nombre: 'Enterrado', descripcion: 'Enterrar la basura en terreno propio' },
    { id_tipo_disposicion_basura: '5', nombre: 'Botadero', descripcion: 'Depositar en botadero o lote baldío' },
    { id_tipo_disposicion_basura: '6', nombre: 'Reciclaje', descripcion: 'Separación y reciclaje de materiales' }
  ],
  
  sexos: [
    { id_sexo: '1', nombre: 'Masculino' },
    { id_sexo: '2', nombre: 'Femenino' }
  ],
  
  estados_civiles: [
    { id_situacion_civil: '1', nombre: 'Soltero/a' },
    { id_situacion_civil: '2', nombre: 'Casado/a' },
    { id_situacion_civil: '3', nombre: 'Unión libre' },
    { id_situacion_civil: '4', nombre: 'Viudo/a' },
    { id_situacion_civil: '5', nombre: 'Divorciado/a' },
    { id_situacion_civil: '6', nombre: 'Separado/a' }
  ],
  
  tipos_identificacion: [
    { codigo: 'CC', nombre: 'Cédula de Ciudadanía' },
    { codigo: 'TI', nombre: 'Tarjeta de Identidad' },
    { codigo: 'CE', nombre: 'Cédula de Extranjería' },
    { codigo: 'PA', nombre: 'Pasaporte' },
    { codigo: 'RC', nombre: 'Registro Civil' }
  ]
};

/**
 * Mapeo de nombres de campos por tipo de entidad
 * 
 * Define qué campos usar como ID y nombre para cada tipo de entidad,
 * permitiendo acceso consistente independientemente de la estructura
 * de datos del backend.
 * 
 * @constant {Record<string, {id: string; name: string}>} FIELD_MAPPING
 * @private
 * 
 * @example
 * // Para departamentos:
 * FIELD_MAPPING.departamentos // => { id: 'id_departamento', name: 'nombre' }
 * 
 * // Para tipos de identificación:
 * FIELD_MAPPING.tipos_identificacion // => { id: 'codigo', name: 'nombre' }
 */
const FIELD_MAPPING: Record<string, { id: string; name: string }> = {
  departamentos: { id: 'id_departamento', name: 'nombre' },
  sistemas_acueducto: { id: 'id_sistema_acueducto', name: 'nombre' },
  disposicion_basura: { id: 'id_tipo_disposicion_basura', name: 'nombre' },
  sexos: { id: 'id_sexo', name: 'nombre' },
  estados_civiles: { id: 'id_situacion_civil', name: 'nombre' },
  tipos_identificacion: { id: 'codigo', name: 'nombre' },
  municipios: { id: 'id_municipio', name: 'nombre' },
  parroquias: { id: 'id_parroquia', name: 'nombre' },
  sectores: { id: 'id_sector', name: 'nombre' },
  aguas_residuales: { id: 'id_tipo_aguas_residuales', name: 'nombre' },
  tipos_vivienda: { id: 'id_tipo_vivienda', name: 'nombre' },
  parentescos: { id: 'id_parentesco', name: 'nombre' },
  estudios: { id: 'id', name: 'nivel' },
  profesiones: { id: 'id_profesion', name: 'nombre' },
  enfermedades: { id: 'id_enfermedad', name: 'nombre' },
  comunidades_culturales: { id: 'id_comunidad_cultural', name: 'nombre' }
};

/**
 * Maneja errores de API y provee datos de fallback
 * 
 * Cuando una llamada al API falla, esta función retorna datos estáticos
 * de respaldo en formato AutocompleteOption para que la UI continúe
 * funcionando sin crashes.
 * 
 * @function handleApiError
 * @param {any} data - Datos originales del API (usualmente null/undefined en error)
 * @param {any} error - Objeto de error de la petición
 * @param {FallbackDataConfig} config - Configuración del tipo de entidad
 * @returns {AutocompleteOption[]} Array de opciones de fallback para autocomplete
 * 
 * @example
 * try {
 *   const data = await fetchDepartamentos();
 *   return mapToOptions(data);
 * } catch (error) {
 *   return handleApiError(null, error, {
 *     type: 'departamentos',
 *     category: 'Geografía',
 *     description: 'Departamento de Colombia'
 *   });
 * }
 */
export const handleApiError = (
  data: any,
  error: any,
  config: FallbackDataConfig
): AutocompleteOption[] => {
  if (error) {
    const fallbackItems = FALLBACK_DATA[config.type] || [];
    const fieldMapping = FIELD_MAPPING[config.type];
    
    return fallbackItems.map((item: any, index: number) => ({
      value: item[fieldMapping?.id] || item.id?.toString() || `fallback-${index}`,
      label: item[fieldMapping?.name] || item.nombre || item.name || 'Sin nombre',
      description: config.description || item.descripcion || `${config.category || config.type}`,
      category: config.category || 'General',
      popular: false
    }));
  }
  
  return [];
};

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
