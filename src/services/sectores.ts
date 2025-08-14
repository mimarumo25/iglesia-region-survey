import { apiClient } from '@/interceptors/axios';

// Interfaces para Sectores
export interface Sector {
  id_sector: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SectorFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface SectorUpdateData extends SectorFormData {}

export interface SectoresResponse {
  sectors: Sector[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
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
  ): Promise<ServerResponse<SectoresResponse>> => {
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
  ): Promise<ServerResponse<SectoresResponse>> => {
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
  ): Promise<ServerResponse<SectoresResponse>> => {
    const response = await apiClient.get('/api/catalog/sectors/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
