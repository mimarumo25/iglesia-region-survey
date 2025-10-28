/**
 * 🏗️ Servicio para gestión completa de encuestas (CRUD)
 * 
 * Este servicio integra con la API "Encuestas" del backend que maneja
 * encuestas familiares completas con información demográfica, vivienda,
 * servicios y miembros de familia.
 * 
 * Endpoints integrados:
 * - GET /api/encuesta - Obtener todas las encuestas con paginación
 * - GET /api/encuesta/{id} - Obtener encuesta por ID
 * - POST /api/encuesta - Crear nueva encuesta familiar completa
 * - DELETE /api/encuesta/{id} - Eliminar encuesta por ID
 */

import { apiClient } from '@/interceptors/axios';

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

/**
 * Tipos de identificación para miembros de familia
 */
export interface TipoIdentificacion {
  id: string;
  nombre: string;
  codigo: string;
}

/**
 * Información básica de una encuesta en la lista (según API real)
 */
export interface EncuestaListItem {
  id_encuesta: string;
  apellido_familiar: string;
  direccion_familia: string;
  telefono: string;
  codigo_familia: string;
  estado_encuesta: 'pending' | 'in_progress' | 'completed' | 'validated';
  numero_encuestas: number;
  fecha_ultima_encuesta: string;
  tipo_vivienda: {
    id: string;
    nombre: string;
  } | null;
  tamaño_familia: number;
  sector: {
    id: string;
    nombre: string;
  } | null;
  municipio: {
    id: string;
    nombre: string;
  } | null;
  vereda: {
    id: string;
    nombre: string;
  } | null;
  parroquia: {
    id: string;
    nombre: string;
  } | null;
  basuras: Array<{
    id: string;
    nombre: string;
  }>;
  acueducto: {
    id: string;
    nombre: string;
  } | null;
  aguas_residuales: {
    id: string;
    nombre: string;
  } | null;
  miembros_familia: {
    total_miembros: number;
    personas: Array<{
      id: string;
      nombre_completo: string;
      identificacion: {
        numero: string;
        tipo: {
          id: string;
          nombre: string;
          codigo: string;
        };
      };
      telefono: string;
      email: string;
      fecha_nacimiento: string;
      direccion: string;
      estudios: {
        id: string;
        nombre: string;
      };
      edad: number;
      sexo: {
        id: string;
        descripcion: string;
      };
      estado_civil: {
        id: number;
        nombre: string;
      };
      tallas: {
        camisa: string;
        pantalon: string;
        zapato: string;
      };
    }>;
  };
  deceasedMembers: Array<{
    nombres: string;
    fechaFallecimiento: string;
    sexo: {
      id: number;
      nombre: string;
    };
    parentesco: {
      id: number;
      nombre: string;
    };
    causaFallecimiento: string;
  }>;
  metadatos: {
    fecha_creacion: string;
    estado: string;
    version: string;
  };
}

/**
 * Miembro de la familia
 */
export interface MiembroFamilia {
  id?: string;
  nombres: string;
  apellidos: string;
  tipo_identificacion?: string;
  numero_identificacion?: string;
  fecha_nacimiento?: string;
  edad?: number;
  sexo?: string;
  parentesco?: string;
  estado_civil?: string;
  nivel_estudios?: string;
  profesion_oficio?: string;
  comunidad_cultural?: string;
  enfermedades_cronicas?: string[];
  discapacidades?: string[];
  motivo_fecha_celebrar?: string;
  dia_fecha_celebrar?: string;
  mes_fecha_celebrar?: string;
  es_jefe_familia: boolean;
  es_beneficiario_programa?: boolean;
  programa_social?: string;
  observaciones?: string;
}

/**
 * Información de vivienda de la encuesta
 */
export interface InformacionVivienda {
  tipo_vivienda?: string;
  material_paredes?: string;
  material_techo?: string;
  material_piso?: string;
  numero_habitaciones?: number;
  numero_banos?: number;
  tiene_cocina?: boolean;
  tipo_cocina?: string;
  tiene_agua_potable?: boolean;
  fuente_agua?: string;
  tiene_energia?: boolean;
  tipo_energia?: string;
  manejo_residuos?: string;
  tiene_internet?: boolean;
  observaciones_vivienda?: string;
}

/**
 * Información socioeconómica de la familia
 */
export interface InformacionSocioeconomica {
  ingresos_mensuales?: number;
  fuente_ingresos?: string;
  tiene_seguridad_social?: boolean;
  tipo_seguridad_social?: string;
  recibe_subsidios?: boolean;
  tipos_subsidios?: string[];
  tiene_creditos?: boolean;
  observaciones_economicas?: string;
}

/**
 * Datos completos de una encuesta familiar
 */
export interface EncuestaCompleta {
  // Información básica
  id_encuesta?: string;
  codigo_familia: string;
  apellido_familiar: string;
  estado_encuesta: 'pending' | 'in_progress' | 'completed' | 'validated';
  
  // Ubicación geográfica
  id_departamento?: string;
  id_municipio?: string;
  id_vereda?: string;
  id_sector?: string;
  direccion?: string;
  coordenadas_gps?: string;
  
  // Información de vivienda
  vivienda: InformacionVivienda;
  
  // Información socioeconómica
  socioeconomica: InformacionSocioeconomica;
  
  // Miembros de la familia
  miembros_familia: MiembroFamilia[];
  
  // Metadatos
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  usuario_creacion?: string;
  usuario_actualizacion?: string;
  observaciones_generales?: string;
}

/**
 * Respuesta paginada de encuestas (según API real)
 */
export interface EncuestasResponse {
  status: string;
  message: string;
  data: EncuestaListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Respuesta de una encuesta individual
 */
export interface EncuestaResponse {
  success: boolean;
  data: EncuestaCompleta;
  message?: string;
}

/**
 * Parámetros para búsqueda de encuestas
 */
export interface EncuestasSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  estado?: string;
  departamento?: string;
  municipio?: string;
  vereda?: string;
  sector?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

// ============================================================================
// SERVICIO DE ENCUESTAS
// ============================================================================

class EncuestasService {
  /**
   * Obtener lista paginada de encuestas
   */
  async getEncuestas(params: EncuestasSearchParams = {}): Promise<EncuestasResponse> {
    try {
      const response = await apiClient.get('/api/encuesta', { 
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          estado: params.estado || '',
          departamento: params.departamento || '',
          municipio: params.municipio || '',
          vereda: params.vereda || '',
          sector: params.sector || '',
          fecha_desde: params.fechaDesde || '',
          fecha_hasta: params.fechaHasta || '',
        }
      });
      
      // La API devuelve directamente el formato esperado
      return response.data;
      
    } catch (error) {
      console.error('❌ Error al obtener encuestas:', error);
      throw this.handleApiError(error, 'obtener encuestas');
    }
  }

  /**
   * Obtener una encuesta por ID
   */
  async getEncuestaById(id: string): Promise<EncuestaResponse> {
    try {
      const response = await apiClient.get(`/api/encuesta/${id}`);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ Error al obtener encuesta ${id}:`, error);
      throw this.handleApiError(error, `obtener encuesta ${id}`);
    }
  }

  /**
   * Crear nueva encuesta familiar completa
   */
  async createEncuesta(encuestaData: Omit<EncuestaCompleta, 'id_encuesta'>): Promise<EncuestaResponse> {
    try {
      const response = await apiClient.post('/api/encuesta', encuestaData);
      
      return response.data;
      return response.data;
      
    } catch (error) {
      console.error('❌ Error al crear encuesta:', error);
      throw this.handleApiError(error, 'crear encuesta');
    }
  }

  /**
   * Actualizar campos específicos de una encuesta existente
   * Usa PATCH para actualización parcial de campos
   */
  async updateEncuesta(id: string, encuestaData: Partial<EncuestaCompleta>): Promise<EncuestaResponse> {
    try {
      const response = await apiClient.patch(`/api/encuesta/${id}`, encuestaData);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ Error al actualizar encuesta ${id}:`, error);
      throw this.handleApiError(error, `actualizar encuesta ${id}`);
    }
  }

  /**
   * Eliminar encuesta
   */
  async deleteEncuesta(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/api/encuesta/${id}`);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ Error al eliminar encuesta ${id}:`, error);
      throw this.handleApiError(error, `eliminar encuesta ${id}`);
    }
  }

  /**
   * Validar encuesta (cambiar estado a validada)
   */
  async validarEncuesta(id: string): Promise<EncuestaResponse> {
    try {
      const response = await apiClient.patch(`/api/encuesta/${id}/validar`);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ Error al validar encuesta ${id}:`, error);
      throw this.handleApiError(error, `validar encuesta ${id}`);
    }
  }

  /**
   * Obtener estadísticas de encuestas
   */
  async getEstadisticas(): Promise<any> {
    try {
      const response = await apiClient.get('/api/encuesta/estadisticas');
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw this.handleApiError(error, 'obtener estadísticas');
    }
  }

  // ============================================================================
  // UTILIDADES Y MANEJO DE ERRORES
  // ============================================================================

  /**
   * Manejo centralizado de errores de la API
   */
  handleApiError(error: any, context: string): Error {
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        `Error desconocido al ${context}`;
    
    const statusCode = error?.response?.status;
    
    console.error(`🚨 Error en ${context}:`, {
      message: errorMessage,
      status: statusCode,
      url: error?.config?.url,
      method: error?.config?.method
    });
    
    // Retornar error personalizado con información útil
    const customError = new Error(errorMessage);
    (customError as any).statusCode = statusCode;
    (customError as any).context = context;
    
    return customError;
  }

  /**
   * Validar datos de encuesta antes del envío
   */
  validateEncuestaData(data: Partial<EncuestaCompleta>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validaciones básicas
    if (!data.codigo_familia?.trim()) {
      errors.push('El código de familia es requerido');
    }
    
    if (!data.apellido_familiar?.trim()) {
      errors.push('El apellido familiar es requerido');
    }
    
    if (!data.miembros_familia || data.miembros_familia.length === 0) {
      errors.push('Debe incluir al menos un miembro de familia');
    }
    
    // Validar que exista un jefe de familia
    const jefesFamilia = data.miembros_familia?.filter(m => m.es_jefe_familia) || [];
    if (jefesFamilia.length === 0) {
      errors.push('Debe designar un jefe de familia');
    } else if (jefesFamilia.length > 1) {
      errors.push('Solo puede haber un jefe de familia');
    }
    
    // Validaciones de miembros
    data.miembros_familia?.forEach((miembro, index) => {
      if (!miembro.nombres?.trim()) {
        errors.push(`Miembro ${index + 1}: Los nombres son requeridos`);
      }
      if (!miembro.apellidos?.trim()) {
        errors.push(`Miembro ${index + 1}: Los apellidos son requeridos`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Instancia del servicio para exportar
export const encuestasService = new EncuestasService();

// Exportar la clase para casos donde se necesite instanciar
export default EncuestasService;

// Re-exportar el hook desde su ubicación correcta para compatibilidad
export { useEncuestas } from '@/hooks/useEncuestas';