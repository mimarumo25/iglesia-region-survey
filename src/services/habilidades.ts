import { apiClient } from '@/interceptors/axios';
import type {
  Habilidad,
  HabilidadFormData,
  HabilidadUpdateData,
  HabilidadesApiResponse,
  ServerResponse,
  HabilidadesStatsResponse
} from '@/types/habilidades';

/**
 * Servicios CRUD completos para Habilidades
 * Patrón: Profesiones-like con operaciones completas de gestión
 */
export const habilidadesService = {
  /**
   * Obtener todas las habilidades con paginación
   */
  getHabilidades: async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_habilidad',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<HabilidadesApiResponse> => {
    const response = await apiClient.get('/api/catalog/habilidades', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  /**
   * Buscar habilidades por término
   */
  searchHabilidades: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<HabilidadesApiResponse> => {
    const response = await apiClient.get('/api/catalog/habilidades/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  /**
   * Obtener una habilidad por ID
   */
  getHabilidadById: async (id: string): Promise<ServerResponse<Habilidad>> => {
    const response = await apiClient.get(`/api/catalog/habilidades/${id}`);
    return response.data;
  },

  /**
   * Crear nueva habilidad
   */
  createHabilidad: async (data: HabilidadFormData): Promise<ServerResponse<Habilidad>> => {
    const response = await apiClient.post('/api/catalog/habilidades', data);
    return response.data;
  },

  /**
   * Actualizar habilidad existente
   */
  updateHabilidad: async (id: string, data: HabilidadUpdateData): Promise<ServerResponse<Habilidad>> => {
    const response = await apiClient.put(`/api/catalog/habilidades/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar habilidad
   */
  deleteHabilidad: async (id: string): Promise<ServerResponse<void>> => {
    const response = await apiClient.delete(`/api/catalog/habilidades/${id}`);
    return response.data;
  },

  /**
   * Obtener habilidades activas (para selectores/autocomplete)
   */
  getActiveHabilidades: async (): Promise<ServerResponse<Habilidad[]>> => {
    const response = await apiClient.get('/api/catalog/habilidades');
    return response.data;
  },

  /**
   * Obtener estadísticas de habilidades
   */
  getHabilidadesStats: async (): Promise<ServerResponse<HabilidadesStatsResponse>> => {
    const response = await apiClient.get('/api/catalog/habilidades/stats');
    return response.data;
  },

  /**
   * Alternar estado activo/inactivo
   */
  toggleHabilidadStatus: async (id: string): Promise<ServerResponse<Habilidad>> => {
    const response = await apiClient.patch(`/api/catalog/habilidades/${id}/toggle-status`);
    return response.data;
  },

  /**
   * Búsqueda avanzada con filtros múltiples
   */
  searchHabilidadesAdvanced: async (
    filters: {
      nombre?: string;
      nivel?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<HabilidadesApiResponse> => {
    const response = await apiClient.get('/api/catalog/habilidades/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
