import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { AXIOS_CONFIG, API_ENDPOINTS, DEV_CONFIG } from '@/config/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

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

      // La API devuelve: { success, message, data: { status, data: [...], total, message } }
      const apiData = response.data?.data || response.data;
      const tiposArray = apiData?.data || apiData || [];
      const total = apiData?.total || tiposArray.length;
      
      const transformedResponse: ServerResponse<TiposIdentificacionResponse> = {
        status: apiData?.status || 'success',
        data: {
          tiposIdentificacion: tiposArray,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            hasNext: (page * limit) < total,
            hasPrev: page > 1
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al obtener tipos de identificación:', error);
      showErrorToast(error, 'obtener tipos de identificación');
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
      showErrorToast(error, 'obtener tipo de identificación');
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
      showSuccessToast('Tipo de identificación creado', 'El registro se ha creado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al crear tipo de identificación:', error);
      showErrorToast(error, 'crear tipo de identificación');
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
      showSuccessToast('Tipo de identificación actualizado', 'El registro se ha actualizado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al actualizar tipo de identificación:', error);
      showErrorToast(error, 'actualizar tipo de identificación');
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
      showSuccessToast('Tipo de identificación eliminado', 'El registro se ha eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar tipo de identificación:', error);
      showErrorToast(error, 'eliminar tipo de identificación');
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
      
      // La API devuelve: { success, message, data: { status, data: [...], total, message } }
      const apiData = response.data?.data || response.data;
      const tiposArray = apiData?.data || apiData || [];
      const total = apiData?.total || tiposArray.length;
      
      const transformedResponse: ServerResponse<TiposIdentificacionResponse> = {
        status: apiData?.status || 'success',
        data: {
          tiposIdentificacion: tiposArray,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            hasNext: (page * limit) < total,
            hasPrev: page > 1
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al buscar tipos de identificación:', error);
      showErrorToast(error, 'buscar tipos de identificación');
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

      // La API devuelve: { success, message, data: { status, data: [...], total, message } }
      const apiData = response.data?.data || response.data;
      const tiposArray = apiData?.data || apiData || [];
      const total = apiData?.total || tiposArray.length;
      
      const transformedResponse: ServerResponse<TiposIdentificacionResponse> = {
        status: apiData?.status || 'success',
        data: {
          tiposIdentificacion: tiposArray,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            hasNext: (page * limit) < total,
            hasPrev: page > 1
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al obtener tipos de identificación activos:', error);
      showErrorToast(error, 'obtener tipos de identificación activos');
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
      showErrorToast(error, 'obtener estadísticas de tipos de identificación');
      throw error;
    }
  }
}

export const tiposIdentificacionService = new TiposIdentificacionService();
export default tiposIdentificacionService;
