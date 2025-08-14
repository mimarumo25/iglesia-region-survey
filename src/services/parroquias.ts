import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { 
  Parroquia, 
  ParroquiaCreate, 
  ParroquiaUpdate, 
  ParroquiasResponse,
  ServerResponse,
  ApiParroquiasResponse
} from '@/types/parroquias';

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
  // En modo desarrollo y con SKIP_AUTH, usar cliente básico
  if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
    return basicClient;
  }
  return apiClient;
};

class ParroquiasService {
  // Obtener todas las parroquias con paginación
  async getParroquias(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_parroquia',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<ParroquiasResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parroquias`,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );

      // Transformar la respuesta de la API al formato esperado
      const apiResponse: ServerResponse<ApiParroquiasResponse> = response.data;
      
      // La API ya devuelve la paginación completa, no necesitamos calcularla
      const transformedResponse: ServerResponse<ParroquiasResponse> = {
        success: apiResponse.success,
        message: apiResponse.message,
        timestamp: apiResponse.timestamp,
        data: {
          parroquias: apiResponse.data.parroquias || [],
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
      console.error('Error al obtener parroquias:', error);
      throw error;
    }
  }

  // Obtener una parroquia por ID
  async getParroquiaById(id: string): Promise<ServerResponse<Parroquia>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parroquias/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener parroquia por ID:', error);
      throw error;
    }
  }

  // Crear nueva parroquia
  async createParroquia(parroquia: ParroquiaCreate): Promise<ServerResponse<Parroquia>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/parroquias`,
        parroquia
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear parroquia:', error);
      throw error;
    }
  }

  // Actualizar parroquia existente
  async updateParroquia(id: string, parroquia: ParroquiaUpdate): Promise<ServerResponse<Parroquia>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/parroquias/${id}`,
        parroquia
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar parroquia:', error);
      throw error;
    }
  }

  // Eliminar parroquia
  async deleteParroquia(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/parroquias/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar parroquia:', error);
      throw error;
    }
  }

  // Buscar parroquias por nombre
  async searchParroquias(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<ParroquiasResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parroquias/search`,
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
      
      // Transformar la respuesta de la API al formato esperado
      const apiResponse: ServerResponse<ApiParroquiasResponse> = response.data;
      
      // La API ya devuelve la paginación completa
      const transformedResponse: ServerResponse<ParroquiasResponse> = {
        success: apiResponse.success,
        message: apiResponse.message,
        timestamp: apiResponse.timestamp,
        data: {
          parroquias: apiResponse.data.parroquias || [],
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
      console.error('Error al buscar parroquias:', error);
      throw error;
    }
  }

  // Obtener parroquias por municipio
  async getParroquiasByMunicipio(
    municipioId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<ParroquiasResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parroquias/municipio/${municipioId}`,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );

      // Transformar la respuesta de la API al formato esperado
      const apiResponse: ServerResponse<ApiParroquiasResponse> = response.data;
      
      // La API ya devuelve la paginación completa
      const transformedResponse: ServerResponse<ParroquiasResponse> = {
        success: apiResponse.success,
        message: apiResponse.message,
        timestamp: apiResponse.timestamp,
        data: {
          parroquias: apiResponse.data.parroquias || [],
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
      console.error('Error al obtener parroquias por municipio:', error);
      throw error;
    }
  }

  // Obtener estadísticas de parroquias
  async getParroquiaStatistics(): Promise<ServerResponse<any>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parroquias/statistics`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de parroquias:', error);
      throw error;
    }
  }
}

export const parroquiasService = new ParroquiasService();
export default parroquiasService;
