import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { AXIOS_CONFIG, API_ENDPOINTS, DEV_CONFIG } from '@/config/api';

// Cliente básico sin autenticación para modo desarrollo
const basicClient = axios.create(AXIOS_CONFIG);

// Función para obtener el cliente correcto
const getApiClient = () => {
  if (DEV_CONFIG.IS_DEVELOPMENT && DEV_CONFIG.SKIP_AUTH) {
    return basicClient;
  }
  return apiClient;
};

// Interfaces
export interface TipoIdentificacion {
  id_tipo_identificacion: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TipoIdentificacionCreate {
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
}

export interface TipoIdentificacionUpdate {
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
}

export interface TiposIdentificacionResponse {
  tiposIdentificacion: TipoIdentificacion[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ServerResponse<T> {
  status: string;
  data: T;
}

export interface ApiTiposIdentificacionResponse {
  tiposIdentificacion?: TipoIdentificacion[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class TiposIdentificacionService {
  // Obtener todos los tipos de identificación con paginación
  async getTiposIdentificacion(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_tipo_identificacion',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TiposIdentificacionResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-identificacion`,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );

      // La API devuelve directamente un array en la propiedad data
      const apiResponse: { status: string; data: TipoIdentificacion[] } = response.data;
      
      const transformedResponse: ServerResponse<TiposIdentificacionResponse> = {
        status: apiResponse.status,
        data: {
          tiposIdentificacion: apiResponse.data || [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil((apiResponse.data?.length || 0) / limit),
            totalCount: apiResponse.data?.length || 0,
            hasNext: false,
            hasPrev: false,
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al obtener tipos de identificación:', error);
      throw error;
    }
  }

  // Obtener un tipo de identificación por ID
  async getTipoIdentificacionById(id: string): Promise<ServerResponse<TipoIdentificacion>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-identificacion/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipo de identificación por ID:', error);
      throw error;
    }
  }

  // Crear nuevo tipo de identificación
  async createTipoIdentificacion(tipo: TipoIdentificacionCreate): Promise<ServerResponse<TipoIdentificacion>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/tipos-identificacion`,
        tipo
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear tipo de identificación:', error);
      throw error;
    }
  }

  // Actualizar tipo de identificación existente
  async updateTipoIdentificacion(id: string, tipo: TipoIdentificacionUpdate): Promise<ServerResponse<TipoIdentificacion>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/tipos-identificacion/${id}`,
        tipo
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar tipo de identificación:', error);
      throw error;
    }
  }

  // Eliminar tipo de identificación
  async deleteTipoIdentificacion(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/tipos-identificacion/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar tipo de identificación:', error);
      throw error;
    }
  }

  // Buscar tipos de identificación por nombre o código
  async searchTiposIdentificacion(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TiposIdentificacionResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-identificacion/search`,
        {
          params: {
            q: searchTerm,
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );
      
      // La API devuelve directamente un array en la propiedad data
      const apiResponse: { status: string; data: TipoIdentificacion[] } = response.data;
      
      const transformedResponse: ServerResponse<TiposIdentificacionResponse> = {
        status: apiResponse.status,
        data: {
          tiposIdentificacion: apiResponse.data || [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil((apiResponse.data?.length || 0) / limit),
            totalCount: apiResponse.data?.length || 0,
            hasNext: false,
            hasPrev: false,
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al buscar tipos de identificación:', error);
      throw error;
    }
  }

  // Obtener tipos de identificación activos
  async getTiposIdentificacionActivos(
    page: number = 1,
    limit: number = 100,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TiposIdentificacionResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-identificacion`,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
            // activo: true, // Comentado ya que la API no parece soportar este filtro
          },
        }
      );

      // La API devuelve directamente un array en la propiedad data
      const apiResponse: { status: string; data: TipoIdentificacion[] } = response.data;
      
      const transformedResponse: ServerResponse<TiposIdentificacionResponse> = {
        status: apiResponse.status,
        data: {
          tiposIdentificacion: apiResponse.data || [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil((apiResponse.data?.length || 0) / limit),
            totalCount: apiResponse.data?.length || 0,
            hasNext: false,
            hasPrev: false,
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al obtener tipos de identificación activos:', error);
      throw error;
    }
  }

  // Obtener estadísticas de tipos de identificación
  async getTipoIdentificacionStatistics(): Promise<ServerResponse<any>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-identificacion/statistics`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de tipos de identificación:', error);
      throw error;
    }
  }
}

export const tiposIdentificacionService = new TiposIdentificacionService();
export default tiposIdentificacionService;
