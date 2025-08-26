import { apiClient } from '@/interceptors/axios';

// Interfaces para Profesiones
export interface Profesion {
  id_profesion: string;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfesionFormData {
  nombre: string;
  descripcion?: string;
}

export interface ProfesionUpdateData extends ProfesionFormData {}

export interface ProfesionesResponse {
  profesiones: Profesion[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Respuesta real de la API (diferente estructura)
export interface ProfesionesApiResponse {
  status: string;
  data: Profesion[];
  total: number;
  message: string;
}

export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}

export interface ProfesionesStatsResponse {
  total_profesiones: number;
  profesiones_activas: number;
  profesiones_inactivas: number;
  ultimo_registro?: string;
}

// Servicios para Profesiones
export const profesionesService = {
  // Obtener todas las profesiones con paginación
  getProfesiones: async (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_profesion', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ProfesionesApiResponse> => {
    const response = await apiClient.get('/api/catalog/profesiones', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  // Buscar profesiones
  searchProfesiones: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProfesionesApiResponse> => {
    const response = await apiClient.get('/api/catalog/profesiones/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  // Obtener una profesión por ID
  getProfesionById: async (id: string): Promise<ServerResponse<Profesion>> => {
    const response = await apiClient.get(`/api/catalog/profesiones/${id}`);
    return response.data;
  },

  // Crear nueva profesión
  createProfesion: async (data: ProfesionFormData): Promise<ServerResponse<Profesion>> => {
    const response = await apiClient.post('/api/catalog/profesiones', data);
    return response.data;
  },

  // Actualizar profesión
  updateProfesion: async (id: string, data: ProfesionUpdateData): Promise<ServerResponse<Profesion>> => {
    const response = await apiClient.put(`/api/catalog/profesiones/${id}`, data);
    return response.data;
  },

  // Eliminar profesión
  deleteProfesion: async (id: string): Promise<ServerResponse<void>> => {
    const response = await apiClient.delete(`/api/catalog/profesiones/${id}`);
    return response.data;
  },

  // Obtener profesiones activas
  getActiveProfesiones: async (): Promise<ServerResponse<Profesion[]>> => {
    const response = await apiClient.get('/api/catalog/profesiones/active');
    return response.data;
  },

  // Obtener estadísticas de profesiones
  getProfesionesStats: async (): Promise<ServerResponse<ProfesionesStatsResponse>> => {
    const response = await apiClient.get('/api/catalog/profesiones/stats');
    return response.data;
  },

  // Alternar estado de profesión
  toggleProfesionStatus: async (id: string): Promise<ServerResponse<Profesion>> => {
    const response = await apiClient.patch(`/api/catalog/profesiones/${id}/toggle-status`);
    return response.data;
  },

  // Búsqueda avanzada con filtros
  searchProfesionesAdvanced: async (
    filters: {
      nombre?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<ProfesionesApiResponse> => {
    const response = await apiClient.get('/api/catalog/profesiones/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
