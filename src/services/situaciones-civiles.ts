import axios from 'axios';

// Interfaces para Situaciones Civiles
export interface SituacionCivil {
  id_situacion_civil: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SituacionCivilFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface SituacionCivilUpdateData extends SituacionCivilFormData {}

export interface SituacionesCivilesResponse {
  situaciones_civiles: SituacionCivil[];
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

export interface SituacionesCivilesStatsResponse {
  total_situaciones_civiles: number;
  situaciones_civiles_activas: number;
  situaciones_civiles_inactivas: number;
  ultimo_registro?: string;
}

// Servicios para Situaciones Civiles
export const situacionesCivilesService = {
  // Obtener todas las situaciones civiles con paginación
  getSituacionesCiviles: async (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_situacion_civil', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<SituacionesCivilesResponse>> => {
    const response = await axios.get('/api/catalog/situaciones_civiles', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  // Buscar situaciones civiles
  searchSituacionesCiviles: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServerResponse<SituacionesCivilesResponse>> => {
    const response = await axios.get('/api/catalog/situaciones_civiles/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  // Obtener una situación civil por ID
  getSituacionCivilById: async (id: string): Promise<ServerResponse<SituacionCivil>> => {
    const response = await axios.get(`/api/catalog/situaciones_civiles/${id}`);
    return response.data;
  },

  // Crear nueva situación civil
  createSituacionCivil: async (data: SituacionCivilFormData): Promise<ServerResponse<SituacionCivil>> => {
    const response = await axios.post('/api/catalog/situaciones_civiles', data);
    return response.data;
  },

  // Actualizar situación civil
  updateSituacionCivil: async (id: string, data: SituacionCivilUpdateData): Promise<ServerResponse<SituacionCivil>> => {
    const response = await axios.put(`/api/catalog/situaciones_civiles/${id}`, data);
    return response.data;
  },

  // Eliminar situación civil
  deleteSituacionCivil: async (id: string): Promise<ServerResponse<void>> => {
    const response = await axios.delete(`/api/catalog/situaciones_civiles/${id}`);
    return response.data;
  },

  // Obtener situaciones civiles activas
  getActiveSituacionesCiviles: async (): Promise<ServerResponse<SituacionCivil[]>> => {
    const response = await axios.get('/api/catalog/situaciones_civiles/active');
    return response.data;
  },

  // Obtener estadísticas de situaciones civiles
  getSituacionesCivilesStats: async (): Promise<ServerResponse<SituacionesCivilesStatsResponse>> => {
    const response = await axios.get('/api/catalog/situaciones_civiles/stats');
    return response.data;
  },

  // Alternar estado de situación civil
  toggleSituacionCivilStatus: async (id: string): Promise<ServerResponse<SituacionCivil>> => {
    const response = await axios.patch(`/api/catalog/situaciones_civiles/${id}/toggle-status`);
    return response.data;
  },

  // Búsqueda avanzada con filtros
  searchSituacionesCivilesAdvanced: async (
    filters: {
      nombre?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<ServerResponse<SituacionesCivilesResponse>> => {
    const response = await axios.get('/api/catalog/situaciones_civiles/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
