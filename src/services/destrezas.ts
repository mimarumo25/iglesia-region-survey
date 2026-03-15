import { apiClient } from '@/interceptors/axios';
import type {
  Destreza,
  DestrezaFormData,
  DestrezaUpdateData,
  DestrezasApiResponse,
  ServerResponse,
  DestrezasStatsResponse
} from '@/types/destrezas';

/**
 * Servicios CRUD completos para Destrezas
 * Patrón: Profesiones-like con operaciones completas de gestión
 */
export const destrezasService = {
  /**
   * Obtener todas las destrezas con paginación
   */
  getDestrezas: async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_destreza',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<DestrezasApiResponse> => {
    const response = await apiClient.get('/api/catalog/destrezas', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  /**
   * Buscar destrezas por término
   */
  searchDestrezas: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<DestrezasApiResponse> => {
    const response = await apiClient.get('/api/catalog/destrezas/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  /**
   * Obtener una destreza por ID
   */
  getDestrezaById: async (id: string): Promise<ServerResponse<Destreza>> => {
    const response = await apiClient.get(`/api/catalog/destrezas/${id}`);
    return response.data;
  },

  /**
   * Crear nueva destreza
   */
  createDestreza: async (data: DestrezaFormData): Promise<ServerResponse<Destreza>> => {
    const response = await apiClient.post('/api/catalog/destrezas', data);
    return response.data;
  },

  /**
   * Actualizar destreza existente
   */
  updateDestreza: async (id: string, data: DestrezaUpdateData): Promise<ServerResponse<Destreza>> => {
    const response = await apiClient.put(`/api/catalog/destrezas/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar destreza
   */
  deleteDestreza: async (id: string): Promise<ServerResponse<void>> => {
    const response = await apiClient.delete(`/api/catalog/destrezas/${id}`);
    return response.data;
  },

  /**
   * Obtener destrezas activas (para selectores/autocomplete)
   */
  getActiveDestrezas: async (): Promise<ServerResponse<Destreza[]>> => {
    const response = await apiClient.get('/api/catalog/destrezas');
    return response.data;
  },

  /**
   * Obtener estadísticas de destrezas
   */
  getDestrezasStats: async (): Promise<ServerResponse<DestrezasStatsResponse>> => {
    const response = await apiClient.get('/api/catalog/destrezas/stats');
    return response.data;
  },

  /**
   * Alternar estado activo/inactivo
   */
  toggleDestrezaStatus: async (id: string): Promise<ServerResponse<Destreza>> => {
    const response = await apiClient.patch(`/api/catalog/destrezas/${id}/toggle-status`);
    return response.data;
  },

  /**
   * Búsqueda avanzada con filtros múltiples
   */
  searchDestrezasAdvanced: async (
    filters: {
      nombre?: string;
      categoria?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<DestrezasApiResponse> => {
    const response = await apiClient.get('/api/catalog/destrezas/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
