import { getApiClient } from '@/config/api';

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

class SectoresService {
  // Obtener todos los sectores con paginación
  async getSectores(
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_sector', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<SectoresResponse> {
    try {
      const client = getApiClient();
      const response = await client.get('/api/catalog/sectores', {
        params: { page, limit, sortBy, sortOrder }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener sectores:', error);
      throw error;
    }
  }

  // Buscar sectores
  async searchSectores(
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<SectoresResponse> {
    try {
      const client = getApiClient();
      const response = await client.get('/api/catalog/sectores/search', {
        params: { search, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar sectores:', error);
      throw error;
    }
  }

  // Obtener un sector por ID
  async getSectorById(id: string): Promise<ServerResponse<Sector>> {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/catalog/sectores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener sector por ID:', error);
      throw error;
    }
  }

  // Crear nuevo sector
  async createSector(data: SectorFormData): Promise<ServerResponse<Sector>> {
    try {
      const client = getApiClient();
      const response = await client.post('/api/catalog/sectores', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear sector:', error);
      throw error;
    }
  }

  // Actualizar sector
  async updateSector(id: string, data: SectorUpdateData): Promise<ServerResponse<Sector>> {
    try {
      const client = getApiClient();
      const response = await client.put(`/api/catalog/sectores/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar sector:', error);
      throw error;
    }
  }

  // Eliminar sector
  async deleteSector(id: string): Promise<ServerResponse<void>> {
    try {
      const client = getApiClient();
      const response = await client.delete(`/api/catalog/sectores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar sector:', error);
      throw error;
    }
  }

  // Obtener sectores activos
  async getActiveSectores(): Promise<ServerResponse<SectoresResponse | Sector[]>> {
    try {
      const client = getApiClient();
      const response = await client.get('/api/catalog/sectores', {
        params: { 
          estado: 'activo',
          limit: 100 // Obtener hasta 100 sectores activos
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener sectores activos:', error);
      throw error;
    }
  }

  // Obtener estadísticas de sectores
  async getSectoresStatistics(): Promise<ServerResponse<SectoresStatsResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get('/api/catalog/sectores/statistics');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de sectores:', error);
      throw error;
    }
  }

  // Alternar estado de sector
  async toggleSectorStatus(id: string): Promise<ServerResponse<Sector>> {
    try {
      const client = getApiClient();
      const response = await client.patch(`/api/catalog/sectores/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error al alternar estado de sector:', error);
      throw error;
    }
  }

  // Obtener municipios disponibles para sectores (alternativo usando endpoint regular de municipios)
  async getMunicipiosDisponibles(): Promise<MunicipiosDisponiblesResponse> {
    try {
      const client = getApiClient();
      // Intentar primero el endpoint específico de sectores
      const response = await client.get('/api/catalog/sectores/municipios');
      return response.data;
    } catch (error) {
      // Si falla, usar el endpoint regular de municipios como alternativa
      console.warn('Endpoint /api/catalog/sectores/municipios no disponible, usando endpoint de municipios regular');
      try {
        const client = getApiClient();
        const response = await client.get('/api/catalog/municipios');
        
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
      } catch (fallbackError) {
        console.error('Error al obtener municipios disponibles:', fallbackError);
        throw fallbackError;
      }
    }
  }

  // Búsqueda avanzada con filtros
  async searchSectoresAdvanced(
    filters: {
      nombre?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<SectoresResponse> {
    try {
      const client = getApiClient();
      const response = await client.get('/api/catalog/sectores/advanced-search', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error en búsqueda avanzada de sectores:', error);
      throw error;
    }
  }
}

export const sectoresService = new SectoresService();
export default sectoresService;