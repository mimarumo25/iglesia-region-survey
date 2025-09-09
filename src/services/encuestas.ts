/**
 * 🏗️ Servicio para gestión completa de encuestas (CRUD)
 * 
 * Este servicio integra con la API "Encuestas" del backend que maneja
 * encuestas familiares completas con información demográfica, viviend    } catch (error) {
         } catch (error) {
          } catch (error) {
      console.error(`❌ Error al eliminar encuesta ${id}:`, error);
      throw encuestasService.handleApiError(error, `eliminar encuesta ${id}`);
    }ole.error(`❌ Error al obtener encuesta ${id}:`, error);
      throw encuestasService.handleApiError(error, `obtener encuesta ${id}`);
    }sole.error('❌ Error al obtener encuestas:', error);
      throw encuestasService.handleApiError(error, 'obtener encuestas');
    } * servicios y miembros de familia.
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
 * Información de identificación de una persona
 */
export interface Identificacion {
  numero: string;
  tipo: TipoIdentificacion | null;
}

/**
 * Información de estudios de una persona
 */
export interface Estudios {
  id: string;
  nombre: string;
}

/**
 * Información de sexo de una persona
 */
export interface Sexo {
  id: string;
  descripcion: string;
}

/**
 * Información de estado civil de una persona
 */
export interface EstadoCivil {
  id: number;
  nombre: string;
}

/**
 * Tallas de una persona
 */
export interface Tallas {
  camisa: string;
  pantalon: string;
  zapato: string;
}

/**
 * Miembro de familia vivo
 */
export interface MiembroFamilia {
  id: string;
  nombre_completo: string;
  identificacion: Identificacion;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  direccion: string;
  estudios: Estudios;
  edad: number;
  sexo: Sexo;
  estado_civil: EstadoCivil;
  tallas: Tallas;
}

/**
 * Miembro de familia fallecido
 */
export interface MiembroFallecido {
  id: string;
  nombre_completo: string;
  identificacion: Identificacion;
  fecha_fallecimiento: string;
  era_padre: boolean;
  era_madre: boolean;
  causa_fallecimiento: string;
  es_fallecido: boolean;
}

/**
 * Información de miembros de familia
 */
export interface MiembrosFamilia {
  total_miembros: number;
  personas: MiembroFamilia[];
}

/**
 * Información de personas fallecidas
 */
export interface PersonasFallecidas {
  total_fallecidos: number;
  fallecidos: MiembroFallecido[];
}

/**
 * Información básica con ID y nombre
 */
export interface InfoBasica {
  id: string;
  nombre: string;
}

/**
 * Tipo de vivienda
 */
export interface TipoVivienda {
  id: string;
  nombre: string;
}

/**
 * Metadatos de la encuesta
 */
export interface MetadatosEncuesta {
  fecha_creacion: string;
  estado: string;
  version: string;
}

/**
 * Estructura básica de una encuesta en el listado
 */
export interface EncuestaListItem {
  id_encuesta: string;
  apellido_familiar: string;
  direccion_familia: string;
  telefono: string;
  codigo_familia: string;
  estado_encuesta: string;
  numero_encuestas: number;
  fecha_ultima_encuesta: string;
  tipo_vivienda: TipoVivienda;
  tamaño_familia: number;
  sector: InfoBasica;
  municipio: InfoBasica;
  vereda: InfoBasica;
  parroquia: InfoBasica;
  basuras: any[]; // Tipo específico según necesidad
  acueducto: InfoBasica;
  aguas_residuales: InfoBasica | null;
  miembros_familia: MiembrosFamilia;
  personas_fallecidas: PersonasFallecidas;
  metadatos: MetadatosEncuesta;
  
  // Campos calculados para compatibilidad con UI existente
  id?: number;
  direccion?: string;
  fecha?: string;
  created_at?: string;
  updated_at?: string;
  familySize?: number;
  surveyor?: string;
  status?: 'completed' | 'pending' | 'in_progress' | 'cancelled';
}

/**
 * Encuesta completa con todos los detalles
 */
export interface EncuestaCompleta extends EncuestaListItem {
  informacionGeneral: {
    municipio: { id: number; nombre: string; };
    parroquia: { id: number; nombre: string; };
    sector: { id: number; nombre: string; };
    vereda: { id: number; nombre: string; };
    fecha: string;
    apellido_familiar: string;
    direccion: string;
    telefono: string;
    numero_contrato_epm: string;
    comunionEnCasa: boolean;
  };
  vivienda: {
    tipo_vivienda: { id: number; nombre: string; };
    disposicion_basuras: {
      recolector: boolean;
      quemada: boolean;
      enterrada: boolean;
      recicla: boolean;
      aire_libre: boolean;
      no_aplica: boolean;
    };
  };
  servicios_agua: {
    sistema_acueducto: { id: number; nombre: string; };
    aguas_residuales: { id: number; nombre: string; } | null;
    pozo_septico: boolean;
    letrina: boolean;
    campo_abierto: boolean;
  };
  observaciones: {
    sustento_familia: string;
    observaciones_encuestador: string;
    autorizacion_datos: boolean;
  };
  familyMembers: any[];
  deceasedMembers: any[];
}

/**
 * Parámetros para filtrar encuestas
 */
export interface EncuestasFilters {
  page?: number;
  limit?: number;
  search?: string;
  municipio_id?: number;
  parroquia_id?: number;
  sector_id?: number;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Respuesta de la API para listado de encuestas
 */
export interface EncuestasListResponse {
  success: boolean;
  message: string;
  data: {
    encuestas: EncuestaListItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    stats?: {
      total: number;
      completed: number;
      pending: number;
      in_progress: number;
      cancelled: number;
    };
  };
}

/**
 * Respuesta de la API para una encuesta específica
 */
export interface EncuestaDetailResponse {
  success: boolean;
  message: string;
  data: EncuestaCompleta;
}

/**
 * Respuesta estándar para operaciones CUD
 */
export interface EncuestaOperationResponse {
  success: boolean;
  message: string;
  data?: {
    id?: number;
    [key: string]: any;
  };
  error?: string;
}

// ============================================================================
// SERVICIO PRINCIPAL
// ============================================================================

export const encuestasService = {

  /**
   * 📋 Obtener todas las encuestas con paginación y filtros
   * 
   * @param filters - Filtros opcionales para la búsqueda
   * @returns Lista de encuestas con información de paginación
   */
  async getEncuestas(filters: EncuestasFilters = {}): Promise<EncuestasListResponse> {
    try {
      console.log('🔍 Obteniendo encuestas con filtros:', filters);
      
      const params = new URLSearchParams();
      
      // Paginación
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      // Búsqueda
      if (filters.search) params.append('search', filters.search);
      
      // Filtros geográficos
      if (filters.municipio_id) params.append('municipio_id', filters.municipio_id.toString());
      if (filters.parroquia_id) params.append('parroquia_id', filters.parroquia_id.toString());
      if (filters.sector_id) params.append('sector_id', filters.sector_id.toString());
      
      // Filtros de estado y fecha
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
      if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);
      
      // Ordenamiento
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      const queryString = params.toString();
      const url = `/api/encuesta${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      
      console.log('✅ Encuestas obtenidas exitosamente:', response.data);
      
      // Procesar y enriquecer los datos
      return encuestasService.processEncuestasResponse(response.data);
      
    } catch (error: any) {
      console.error('❌ Error al obtener encuestas:', error);
      throw encuestasService.handleApiError(error, 'obtener encuestas');
    }
  },

  /**
   * 🔍 Obtener una encuesta específica por ID
   * 
   * @param id - ID de la encuesta
   * @returns Encuesta completa con todos los detalles
   */
  async getEncuestaById(id: number): Promise<EncuestaDetailResponse> {
    try {
      console.log(`🔍 Obteniendo encuesta con ID: ${id}`);
      
      const response = await apiClient.get(`/api/encuesta/${id}`);
      
      console.log('✅ Encuesta obtenida exitosamente:', response.data);
      
      return {
        success: true,
        message: 'Encuesta obtenida exitosamente',
        data: response.data.data || response.data
      };
      
    } catch (error: any) {
      console.error(`❌ Error al obtener encuesta ${id}:`, error);
      throw encuestasService.handleApiError(error, `obtener encuesta ${id}`);
    }
  },

  /**
   * 🗑️ Eliminar una encuesta por ID
   * 
   * @param id - ID de la encuesta a eliminar
   * @returns Confirmación de eliminación
   */
  async deleteEncuesta(id: number): Promise<EncuestaOperationResponse> {
    try {
      console.log(`🗑️ Eliminando encuesta con ID: ${id}`);
      
      const response = await apiClient.delete(`/api/encuesta/${id}`);
      
      console.log('✅ Encuesta eliminada exitosamente:', response.data);
      
      return {
        success: true,
        message: 'Encuesta eliminada exitosamente',
        data: { id }
      };
      
    } catch (error: any) {
      console.error(`❌ Error al eliminar encuesta ${id}:`, error);
      throw encuestasService.handleApiError(error, `eliminar encuesta ${id}`);
    }
  },

  /**
   * 📊 Obtener estadísticas de encuestas
   * 
   * @returns Estadísticas generales de encuestas
   */
  async getEncuestasStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    in_progress: number;
    cancelled: number;
  }> {
    try {
      // Obtener una muestra grande para calcular estadísticas
      const response = await this.getEncuestas({ limit: 1000 });
      
      const stats = {
        total: response.data.pagination.totalItems,
        completed: 0,
        pending: 0,
        in_progress: 0,
        cancelled: 0
      };
      
      // Calcular estadísticas basadas en los datos disponibles
      response.data.encuestas.forEach(encuesta => {
        if (encuesta.status) {
          stats[encuesta.status]++;
        }
      });
      
      return stats;
      
    } catch (error: any) {
      console.error('❌ Error al obtener estadísticas:', error);
      return { total: 0, completed: 0, pending: 0, in_progress: 0, cancelled: 0 };
    }
  },

  // ========================================================================
  // MÉTODOS AUXILIARES
  // ========================================================================

  /**
   * Procesar y enriquecer la respuesta de la API
   */
  processEncuestasResponse(rawResponse: any): EncuestasListResponse {
    const data = rawResponse.data || rawResponse;
    
    // Si la respuesta es un array directo (sin paginación)
    if (Array.isArray(data)) {
      return {
        success: true,
        message: 'Encuestas obtenidas exitosamente',
        data: {
          encuestas: data.map(encuestasService.enrichEncuestaItem),
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: data.length,
            itemsPerPage: data.length,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    }
    
    // Si la respuesta tiene estructura de paginación
    return {
      success: true,
      message: 'Encuestas obtenidas exitosamente',
      data: {
        encuestas: (data.encuestas || data.items || data).map(encuestasService.enrichEncuestaItem),
        pagination: data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: (data.encuestas || data.items || data).length,
          itemsPerPage: (data.encuestas || data.items || data).length,
          hasNext: false,
          hasPrev: false
        },
        stats: data.stats
      }
    };
  },

  /**
   * Enriquecer cada item de encuesta con campos calculados
   */
  enrichEncuestaItem(item: any): EncuestaListItem {
    return {
      // Datos principales de la nueva estructura
      id_encuesta: item.id_encuesta || item.id?.toString() || item.surveyId,
      apellido_familiar: item.apellido_familiar || item.familyHead,
      direccion_familia: item.direccion_familia || item.direccion || item.address,
      telefono: item.telefono || item.phone,
      codigo_familia: item.codigo_familia || item.familyCode,
      estado_encuesta: item.estado_encuesta || item.estado || item.status || 'pending',
      numero_encuestas: item.numero_encuestas || 1,
      fecha_ultima_encuesta: item.fecha_ultima_encuesta || item.fecha || item.date,
      tipo_vivienda: item.tipo_vivienda || { id: '', nombre: '' },
      tamaño_familia: item.tamaño_familia || item.familySize || item.miembros_familia?.total_miembros || 0,
      sector: item.sector || { id: '', nombre: '' },
      municipio: item.municipio || { id: '', nombre: '' },
      vereda: item.vereda || { id: '', nombre: '' },
      parroquia: item.parroquia || { id: '', nombre: '' },
      basuras: item.basuras || [],
      acueducto: item.acueducto || { id: '', nombre: '' },
      aguas_residuales: item.aguas_residuales,
      miembros_familia: item.miembros_familia || { total_miembros: 0, personas: [] },
      personas_fallecidas: item.personas_fallecidas || { total_fallecidos: 0, fallecidos: [] },
      metadatos: item.metadatos || {
        fecha_creacion: item.created_at || item.fecha,
        estado: item.estado_encuesta || 'pending',
        version: '1.0'
      },
      
      // Campos calculados para compatibilidad con UI existente
      id: parseInt(item.id_encuesta || item.id) || 0,
      direccion: item.direccion_familia || item.direccion || item.address,
      fecha: item.fecha_ultima_encuesta || item.fecha || item.date,
      created_at: item.metadatos?.fecha_creacion || item.created_at || item.fecha,
      updated_at: item.updated_at || item.fecha_ultima_encuesta,
      familySize: item.tamaño_familia || item.miembros_familia?.total_miembros,
      surveyor: item.surveyor || item.encuestador,
      status: encuestasService.mapEstadoToStatus(item.estado_encuesta || item.estado || item.status)
    };
  },

  /**
   * Mapear estados del backend a estados del frontend
   */
  mapEstadoToStatus(estado: string): 'completed' | 'pending' | 'in_progress' | 'cancelled' {
    const estadoLower = (estado || '').toLowerCase();
    
    if (estadoLower.includes('complet') || estadoLower === 'finished') return 'completed';
    if (estadoLower.includes('progreso') || estadoLower === 'active') return 'in_progress';
    if (estadoLower.includes('cancelad') || estadoLower === 'cancelled') return 'cancelled';
    
    return 'pending';
  },

  /**
   * Manejo centralizado de errores de API
   */
  handleApiError(error: any, operation: string): Error {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    switch (status) {
      case 404:
        return new Error(`No se encontró la encuesta solicitada`);
      case 403:
        return new Error(`No tienes permisos para ${operation}`);
      case 401:
        return new Error(`Debes iniciar sesión para ${operation}`);
      case 500:
        return new Error(`Error interno del servidor al ${operation}`);
      default:
        return new Error(`Error al ${operation}: ${message}`);
    }
  }
};

// ============================================================================
// HOOKS PARA REACT
// ============================================================================

/**
 * 🎣 Hook para gestión de encuestas en componentes React
 */
export function useEncuestas() {
  return {
    // Métodos del servicio
    getEncuestas: encuestasService.getEncuestas,
    getEncuestaById: encuestasService.getEncuestaById,
    deleteEncuesta: encuestasService.deleteEncuesta,
    getEncuestasStats: encuestasService.getEncuestasStats,
    
    // Utilidades
    mapEstadoToStatus: encuestasService.mapEstadoToStatus,
  };
}

// ============================================================================
// EXPORTACIONES DEFAULT
// ============================================================================

export default encuestasService;
