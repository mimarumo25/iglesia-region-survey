import { apiClient } from '@/interceptors/axios';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL_SERVICES || 'http://206.62.139.100:3000';

// Cliente básico sin autenticación para modo desarrollo
const basicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Función para obtener el cliente correcto
const getApiClient = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
    return basicClient;
  }
  return apiClient;
};

// Interfaces
export interface Sexo {
  id_sexo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SexoCreate {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface SexoUpdate {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface SexosResponse {
  sexos: Sexo[];
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
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiSexosResponse {
  sexos: Sexo[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class SexosService {
  // Obtener todos los sexos con paginación
  async getSexos(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_sexo',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<SexosResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sexos`,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );

      const apiResponse: ServerResponse<ApiSexosResponse> = response.data;
      
      const transformedResponse: ServerResponse<SexosResponse> = {
        success: apiResponse.success,
        message: apiResponse.message,
        timestamp: apiResponse.timestamp,
        data: {
          sexos: apiResponse.data.sexos || [],
          pagination: apiResponse.data.pagination || {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false,
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al obtener sexos:', error);
      throw error;
    }
  }

  // Obtener un sexo por ID
  async getSexoById(id: string): Promise<ServerResponse<Sexo>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sexos/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener sexo por ID:', error);
      throw error;
    }
  }

  // Crear nuevo sexo
  async createSexo(sexo: SexoCreate): Promise<ServerResponse<Sexo>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/sexos`,
        sexo
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear sexo:', error);
      throw error;
    }
  }

  // Actualizar sexo existente
  async updateSexo(id: string, sexo: SexoUpdate): Promise<ServerResponse<Sexo>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/sexos/${id}`,
        sexo
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar sexo:', error);
      throw error;
    }
  }

  // Eliminar sexo
  async deleteSexo(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/sexos/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar sexo:', error);
      throw error;
    }
  }

  // Buscar sexos por nombre
  async searchSexos(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<SexosResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sexos/search`,
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
      
      const apiResponse: ServerResponse<ApiSexosResponse> = response.data;
      
      const transformedResponse: ServerResponse<SexosResponse> = {
        success: apiResponse.success,
        message: apiResponse.message,
        timestamp: apiResponse.timestamp,
        data: {
          sexos: apiResponse.data.sexos || [],
          pagination: apiResponse.data.pagination || {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false,
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al buscar sexos:', error);
      throw error;
    }
  }

  // Obtener sexos activos - Como no hay campo activo, simplemente devolver todos
  async getSexosActivos(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<SexosResponse>> {
    // Simplemente llamar a getSexos ya que no hay filtro de activo
    return this.getSexos(page, limit, sortBy, sortOrder);
  }

  // Obtener estadísticas de sexos
  async getSexoStatistics(): Promise<ServerResponse<any>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sexos/statistics`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de sexos:', error);
      throw error;
    }
  }
}

export const sexosService = new SexosService();
export default sexosService;
