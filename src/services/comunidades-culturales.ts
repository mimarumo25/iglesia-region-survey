import apiClient from '@/interceptors/axios';
import { 
  ComunidadCultural, 
  ComunidadCulturalFormData, 
  ComunidadCulturalUpdateData, 
  ComunidadesCulturalesResponse,
  ComunidadesCulturalesStatsResponse,
  ServerResponse,
  ApiComunidadesCulturalesData
} from '@/types/comunidades-culturales';

// Servicios para Comunidades Culturales
export const comunidadesCulturalesService = {
  // Obtener todas las comunidades culturales con paginación
  getComunidadesCulturales: async (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_comunidad_cultural', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<ComunidadesCulturalesResponse>> => {
    try {
      const response = await apiClient.get('/api/catalog/comunidades-culturales', {
        params: { page, limit, sortBy, sortOrder }
      });
      
      // Adaptamos la respuesta para que coincida con la estructura esperada
      const apiData = response.data as ServerResponse<ApiComunidadesCulturalesData>;
      
      // Si la respuesta tiene la estructura correcta, devolvemos los datos mapeados
      if (apiData.data && Array.isArray(apiData.data.data)) {
        return {
          success: apiData.success,
          message: apiData.message,
          timestamp: apiData.timestamp,
          data: {
            comunidades_culturales: apiData.data.data,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil((apiData.data.total || 0) / limit),
              totalCount: apiData.data.total || 0,
              hasNext: page < Math.ceil((apiData.data.total || 0) / limit),
              hasPrev: page > 1,
            }
          }
        };
      }
      
      // Si no tiene la estructura esperada, devolvemos estructura vacía
      return {
        success: false,
        message: 'Estructura de respuesta inesperada',
        timestamp: new Date().toISOString(),
        data: {
          comunidades_culturales: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false,
          }
        }
      };
    } catch (error) {
      console.error('Error en getComunidadesCulturales:', error);
      throw error;
    }
  },

  // Buscar comunidades culturales
  searchComunidadesCulturales: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServerResponse<ComunidadesCulturalesResponse>> => {
    const response = await apiClient.get('/api/catalog/comunidades-culturales/search', {
      params: { search, page, limit }
    });
    
    // Adaptamos la respuesta para que coincida con la estructura esperada
    const apiData = response.data as ServerResponse<ApiComunidadesCulturalesData>;
    
    return {
      success: apiData.success,
      message: apiData.message,
      timestamp: apiData.timestamp,
      data: {
        comunidades_culturales: apiData.data?.data || [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((apiData.data?.total || 0) / limit),
          totalCount: apiData.data?.total || 0,
          hasNext: page < Math.ceil((apiData.data?.total || 0) / limit),
          hasPrev: page > 1,
        }
      }
    };
  },

  // Obtener una comunidad cultural por ID
  getComunidadCulturalById: async (id: string): Promise<ServerResponse<ComunidadCultural>> => {
    const response = await apiClient.get(`/api/catalog/comunidades-culturales/${id}`);
    return response.data;
  },

  // Crear nueva comunidad cultural
  createComunidadCultural: async (data: ComunidadCulturalFormData): Promise<ServerResponse<ComunidadCultural>> => {
    const response = await apiClient.post('/api/catalog/comunidades-culturales', data);
    return response.data;
  },

  // Actualizar comunidad cultural
  updateComunidadCultural: async (id: string, data: ComunidadCulturalUpdateData): Promise<ServerResponse<ComunidadCultural>> => {
    const response = await apiClient.put(`/api/catalog/comunidades-culturales/${id}`, data);
    return response.data;
  },

  // Eliminar comunidad cultural
  deleteComunidadCultural: async (id: string): Promise<ServerResponse<void>> => {
    const response = await apiClient.delete(`/api/catalog/comunidades-culturales/${id}`);
    return response.data;
  },

  // Obtener comunidades culturales activas
  getActiveComunidadesCulturales: async (): Promise<ServerResponse<ComunidadCultural[]>> => {
    const response = await apiClient.get('/api/catalog/comunidades-culturales/active');
    
    // Adaptamos la respuesta para extraer solo el array de datos
    const apiData = response.data as ServerResponse<ApiComunidadesCulturalesData>;
    
    return {
      success: apiData.success,
      message: apiData.message,
      timestamp: apiData.timestamp,
      data: apiData.data?.data || []
    };
  },

  // Obtener estadísticas de comunidades culturales
  getComunidadesCulturalesStats: async (): Promise<ServerResponse<ComunidadesCulturalesStatsResponse>> => {
    const response = await apiClient.get('/api/catalog/comunidades-culturales/stats');
    return response.data;
  },

  // Alternar estado de comunidad cultural
  toggleComunidadCulturalStatus: async (id: string): Promise<ServerResponse<ComunidadCultural>> => {
    const response = await apiClient.patch(`/api/catalog/comunidades-culturales/${id}/toggle-status`);
    return response.data;
  },

  // Búsqueda avanzada con filtros
  searchComunidadesCulturalesAdvanced: async (
    filters: {
      nombre?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<ServerResponse<ComunidadesCulturalesResponse>> => {
    const response = await apiClient.get('/api/catalog/comunidades-culturales/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
