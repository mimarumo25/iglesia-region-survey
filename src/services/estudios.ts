import axios from 'axios';

// Interfaces para Estudios
export interface Estudio {
  id_estudio: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EstudioFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface EstudioUpdateData extends EstudioFormData {}

export interface EstudiosResponse {
  estudios: Estudio[];
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

export interface EstudiosStatsResponse {
  total_estudios: number;
  estudios_activos: number;
  estudios_inactivos: number;
  ultimo_registro?: string;
}

// Servicios para Estudios
export const estudiosService = {
  // Obtener todos los estudios con paginación
  getEstudios: async (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_estudio', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<EstudiosResponse>> => {
    const response = await axios.get('/api/catalog/estudios', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  // Buscar estudios
  searchEstudios: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServerResponse<EstudiosResponse>> => {
    const response = await axios.get('/api/catalog/estudios/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  // Obtener un estudio por ID
  getEstudioById: async (id: string): Promise<ServerResponse<Estudio>> => {
    const response = await axios.get(`/api/catalog/estudios/${id}`);
    return response.data;
  },

  // Crear nuevo estudio
  createEstudio: async (data: EstudioFormData): Promise<ServerResponse<Estudio>> => {
    const response = await axios.post('/api/catalog/estudios', data);
    return response.data;
  },

  // Actualizar estudio
  updateEstudio: async (id: string, data: EstudioUpdateData): Promise<ServerResponse<Estudio>> => {
    const response = await axios.put(`/api/catalog/estudios/${id}`, data);
    return response.data;
  },

  // Eliminar estudio
  deleteEstudio: async (id: string): Promise<ServerResponse<void>> => {
    const response = await axios.delete(`/api/catalog/estudios/${id}`);
    return response.data;
  },

  // Obtener estudios activos
  getActiveEstudios: async (): Promise<ServerResponse<Estudio[]>> => {
    const response = await axios.get('/api/catalog/estudios/active');
    return response.data;
  },

  // Obtener estadísticas de estudios
  getEstudiosStats: async (): Promise<ServerResponse<EstudiosStatsResponse>> => {
    const response = await axios.get('/api/catalog/estudios/stats');
    return response.data;
  },

  // Alternar estado de estudio
  toggleEstudioStatus: async (id: string): Promise<ServerResponse<Estudio>> => {
    const response = await axios.patch(`/api/catalog/estudios/${id}/toggle-status`);
    return response.data;
  },

  // Búsqueda avanzada con filtros
  searchEstudiosAdvanced: async (
    filters: {
      nombre?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<ServerResponse<EstudiosResponse>> => {
    const response = await axios.get('/api/catalog/estudios/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
