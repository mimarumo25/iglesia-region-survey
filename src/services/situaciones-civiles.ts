import axios from '@/interceptors/axios';

// Interfaces para Situaciones Civiles
export interface SituacionCivil {
  id: number; // La API devuelve id como número
  nombre: string;
  descripcion?: string;
  codigo?: string;
  orden?: number;
  activo: boolean;
  createdAt?: string; // La API usa camelCase
  updatedAt?: string; // La API usa camelCase
}

export interface SituacionCivilFormData {
  nombre: string;
  descripcion?: string;
  codigo?: string;
  orden?: number;
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
  status: string;  // La API devuelve "status": "success"
  message: string;
  data: T;
}

// Estructura real que devuelve la API para situaciones civiles
export interface ApiSituacionesCivilesResponse {
  data: SituacionCivil[];  // La API devuelve "data" directamente
  total?: number;          // La API podría devolver "total" 
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
    sortBy: string = 'id', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<SituacionesCivilesResponse>> => {
    const response = await axios.get('/api/catalog/situaciones-civiles', {
      params: { page, limit, sortBy, sortOrder }
    });
    
    // Adaptamos la respuesta para que coincida con la estructura esperada por el frontend
    const apiResponse = response.data;
    
    if (apiResponse.status === 'success' && Array.isArray(apiResponse.data)) {
      // Calculamos la paginación basada en los datos recibidos
      const totalCount = apiResponse.data.length; // En este caso usamos el length del array
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        status: apiResponse.status,
        message: apiResponse.message,
        data: {
          situaciones_civiles: apiResponse.data,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          }
        }
      };
    }
    
    // Si no tiene la estructura esperada, devolvemos estructura vacía
    return {
      status: 'error',
      message: 'Error al procesar la respuesta',
      data: {
        situaciones_civiles: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNext: false,
          hasPrev: false,
        }
      }
    };
  },

  // Buscar situaciones civiles
  searchSituacionesCiviles: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServerResponse<SituacionesCivilesResponse>> => {
    const response = await axios.get('/api/catalog/situaciones-civiles/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  // Obtener una situación civil por ID
  getSituacionCivilById: async (id: string): Promise<ServerResponse<SituacionCivil>> => {
    const response = await axios.get(`/api/catalog/situaciones-civiles/${id}`);
    return response.data;
  },

  // Crear nueva situación civil
  createSituacionCivil: async (data: SituacionCivilFormData): Promise<ServerResponse<SituacionCivil>> => {
    const response = await axios.post('/api/catalog/situaciones-civiles', data);
    return response.data;
  },

  // Actualizar situación civil
  updateSituacionCivil: async (id: string, data: SituacionCivilUpdateData): Promise<ServerResponse<SituacionCivil>> => {
    const response = await axios.put(`/api/catalog/situaciones-civiles/${id}`, data);
    return response.data;
  },

  // Eliminar situación civil
  deleteSituacionCivil: async (id: string): Promise<ServerResponse<void>> => {
    const response = await axios.delete(`/api/catalog/situaciones-civiles/${id}`);
    return response.data;
  },

  // Obtener situaciones civiles activas
  getActiveSituacionesCiviles: async (): Promise<ServerResponse<SituacionCivil[]>> => {
    const response = await axios.get('/api/catalog/situaciones-civiles/active');
    
    // Adaptamos la respuesta
    const apiResponse = response.data;
    
    if (apiResponse.status === 'success' && Array.isArray(apiResponse.data)) {
      return {
        status: apiResponse.status,
        message: apiResponse.message,
        data: apiResponse.data
      };
    }
    
    return {
      status: 'error',
      message: 'Error al procesar la respuesta',
      data: []
    };
  },

  // Obtener estadísticas de situaciones civiles
  getSituacionesCivilesStats: async (): Promise<ServerResponse<SituacionesCivilesStatsResponse>> => {
    const response = await axios.get('/api/catalog/situaciones-civiles/stats');
    return response.data;
  },

  // Alternar estado de situación civil
  toggleSituacionCivilStatus: async (id: string): Promise<ServerResponse<SituacionCivil>> => {
    const response = await axios.patch(`/api/catalog/situaciones-civiles/${id}/toggle-status`);
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
    const response = await axios.get('/api/catalog/situaciones-civiles/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
