import { apiClient } from '@/interceptors/axios';

// Interfaces para Sectores
export interface Sector {
  id_sector: string;
  nombre: string;
  descripcion?: string;
  id_municipio?: string | null;
  municipio?: {
    id_municipio: string;
    nombre: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface SectorFormData {
  nombre: string;
  descripcion?: string;
  id_municipio: number;
  codigo?: string;
  estado?: string;
}

export interface SectorUpdateData extends SectorFormData {}

// Interface para municipios disponibles
export interface MunicipioDisponible {
  id_municipio: number;
  nombre_municipio: string;
  codigo_dane?: string;
  departamento?: {
    id_departamento: string;
    nombre: string;
  };
}

// Respuesta del endpoint de municipios disponibles
export interface MunicipiosDisponiblesApiResponse {
  status: string;
  data: MunicipioDisponible[];
  total: number;
  message: string;
}

export interface MunicipiosDisponiblesResponse {
  success: boolean;
  message: string;
  data: MunicipiosDisponiblesApiResponse;
  timestamp: string;
}

// Respuesta interna de la API (el data.data)
export interface ApiSectoresResponse {
  status: string;
  data: Sector[];
  total: number;
  message: string;
}

// Respuesta completa del servidor
export interface SectoresResponse {
  success: boolean;
  message: string;
  data: ApiSectoresResponse;
  timestamp: string;
}

export interface ServerResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data?: T;
}

export interface SectoresStatsResponse {
  total_sectores: number;
  sectores_activos: number;
  sectores_inactivos: number;
  ultimo_registro?: string;
}

// Servicios para Sectores
export const sectoresService = {
  // Obtener todos los sectores con paginación
  getSectores: async (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_sector', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<SectoresResponse> => {
    const response = await apiClient.get('/api/catalog/sectors', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  // Buscar sectores
  searchSectores: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<SectoresResponse> => {
    const response = await apiClient.get('/api/catalog/sectors/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  // Obtener un sector por ID
  getSectorById: async (id: string): Promise<ServerResponse<Sector>> => {
    const response = await apiClient.get(`/api/catalog/sectors/${id}`);
    return response.data;
  },

  // Crear nuevo sector
  createSector: async (data: SectorFormData): Promise<ServerResponse<Sector>> => {
    const response = await apiClient.post('/api/catalog/sectors', data);
    return response.data;
  },

  // Actualizar sector
  updateSector: async (id: string, data: SectorUpdateData): Promise<ServerResponse<Sector>> => {
    const response = await apiClient.put(`/api/catalog/sectors/${id}`, data);
    return response.data;
  },

  // Eliminar sector
  deleteSector: async (id: string): Promise<ServerResponse<void>> => {
    const response = await apiClient.delete(`/api/catalog/sectors/${id}`);
    return response.data;
  },

  // Obtener sectores activos
  getActiveSectores: async (): Promise<ServerResponse<SectoresResponse | Sector[]>> => {
    const response = await apiClient.get('/api/catalog/sectors', {
      params: { 
        estado: 'activo',
        limit: 100 // Obtener hasta 100 sectores activos
      }
    });
    return response.data;
  },

  // Obtener estadísticas de sectores
  getSectoresStats: async (): Promise<ServerResponse<SectoresStatsResponse>> => {
    const response = await apiClient.get('/api/catalog/sectors/stats');
    return response.data;
  },

  // Alternar estado de sector
  toggleSectorStatus: async (id: string): Promise<ServerResponse<Sector>> => {
    const response = await apiClient.patch(`/api/catalog/sectors/${id}/toggle-status`);
    return response.data;
  },

  // Obtener municipios disponibles para sectores (alternativo usando endpoint regular de municipios)
  getMunicipiosDisponibles: async (): Promise<MunicipiosDisponiblesResponse> => {
    try {
      // Intentar primero el endpoint específico de sectores
      const response = await apiClient.get('/api/catalog/sectors/municipios');
      return response.data;
    } catch (error) {
      // Si falla, usar el endpoint regular de municipios como alternativa
      console.warn('Endpoint /api/catalog/sectors/municipios no disponible, usando endpoint de municipios regular');
      const response = await apiClient.get('/api/catalog/municipios');
      
      // Transformar la respuesta del endpoint regular al formato esperado
      return {
        success: response.data.success || true,
        message: response.data.message || 'Municipios obtenidos exitosamente',
        data: {
          status: 'success',
          data: response.data.data?.municipios || response.data.data || [],
          total: response.data.data?.total || response.data.total || 0,
          message: 'Municipios disponibles para sectores'
        },
        timestamp: response.data.timestamp || new Date().toISOString()
      };
    }
  },

  // Búsqueda avanzada con filtros
  searchSectoresAdvanced: async (
    filters: {
      nombre?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<SectoresResponse> => {
    const response = await apiClient.get('/api/catalog/sectors/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
