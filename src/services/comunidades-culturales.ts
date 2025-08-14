import axios from 'axios';

// Interfaces para Comunidades Culturales
export interface ComunidadCultural {
  id_comunidad_cultural: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ComunidadCulturalFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface ComunidadCulturalUpdateData extends ComunidadCulturalFormData {}

export interface ComunidadesCulturalesResponse {
  comunidades_culturales: ComunidadCultural[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}

export interface ComunidadesCulturalesStatsResponse {
  total_comunidades_culturales: number;
  comunidades_culturales_activas: number;
  comunidades_culturales_inactivas: number;
  ultimo_registro?: string;
}

// Servicios para Comunidades Culturales
export const comunidadesCulturalesService = {
  // Obtener todas las comunidades culturales con paginación
  getComunidadesCulturales: async (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_comunidad_cultural', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<ComunidadesCulturalesResponse>> => {
    const response = await axios.get('/api/catalog/comunidades_culturales', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  // Buscar comunidades culturales
  searchComunidadesCulturales: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServerResponse<ComunidadesCulturalesResponse>> => {
    const response = await axios.get('/api/catalog/comunidades_culturales/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  // Obtener una comunidad cultural por ID
  getComunidadCulturalById: async (id: string): Promise<ServerResponse<ComunidadCultural>> => {
    const response = await axios.get(`/api/catalog/comunidades_culturales/${id}`);
    return response.data;
  },

  // Crear nueva comunidad cultural
  createComunidadCultural: async (data: ComunidadCulturalFormData): Promise<ServerResponse<ComunidadCultural>> => {
    const response = await axios.post('/api/catalog/comunidades_culturales', data);
    return response.data;
  },

  // Actualizar comunidad cultural
  updateComunidadCultural: async (id: string, data: ComunidadCulturalUpdateData): Promise<ServerResponse<ComunidadCultural>> => {
    const response = await axios.put(`/api/catalog/comunidades_culturales/${id}`, data);
    return response.data;
  },

  // Eliminar comunidad cultural
  deleteComunidadCultural: async (id: string): Promise<ServerResponse<void>> => {
    const response = await axios.delete(`/api/catalog/comunidades_culturales/${id}`);
    return response.data;
  },

  // Obtener comunidades culturales activas
  getActiveComunidadesCulturales: async (): Promise<ServerResponse<ComunidadCultural[]>> => {
    const response = await axios.get('/api/catalog/comunidades_culturales/active');
    return response.data;
  },

  // Obtener estadísticas de comunidades culturales
  getComunidadesCulturalesStats: async (): Promise<ServerResponse<ComunidadesCulturalesStatsResponse>> => {
    const response = await axios.get('/api/catalog/comunidades_culturales/stats');
    return response.data;
  },

  // Alternar estado de comunidad cultural
  toggleComunidadCulturalStatus: async (id: string): Promise<ServerResponse<ComunidadCultural>> => {
    const response = await axios.patch(`/api/catalog/comunidades_culturales/${id}/toggle-status`);
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
    const response = await axios.get('/api/catalog/comunidades_culturales/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
