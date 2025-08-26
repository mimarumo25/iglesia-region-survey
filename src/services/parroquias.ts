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

      // La API devuelve: { success: true, message: "...", data: {...} }
      const apiResponse = response.data;
      
      // Determinar estructura de datos - puede que la API devuelva data directamente como array o como objeto
      let parroquiasData: Parroquia[] = [];
      let totalCount = 0;
      
      if (apiResponse.data) {
        if (Array.isArray(apiResponse.data)) {
          // Estructura: { success: true, data: [...], total: 48 }
          parroquiasData = apiResponse.data;
          totalCount = apiResponse.total || apiResponse.data.length;
        } else if (apiResponse.data.data && Array.isArray(apiResponse.data.data)) {
          // Estructura: { success: true, data: { status: "success", data: [...], total: 3 } }
          parroquiasData = apiResponse.data.data;
          totalCount = apiResponse.data.total || apiResponse.data.data.length;
        } else if (apiResponse.data.parroquias) {
          // Estructura: { success: true, data: { parroquias: [...], total: 48 } }
          parroquiasData = apiResponse.data.parroquias;
          totalCount = apiResponse.data.total || apiResponse.data.parroquias.length;
        } else {
          // Estructura desconocida, try to extract data
          parroquiasData = [];
          totalCount = 0;
        }
      }
      
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      // Transformar al formato esperado por el frontend
      const transformedResponse: ServerResponse<ParroquiasResponse> = {
        status: apiResponse.success ? 'success' : 'error',
        message: apiResponse.message,
        total: totalCount,
        data: {
          parroquias: parroquiasData,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            hasNext: hasNext,
            hasPrev: hasPrev,
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
      
      // La API devuelve: { status: "success", data: [...], total: 48, message: "..." }
      const apiResponse = response.data;
      
      // Calcular paginación basándose en el total y la página actual
      const totalCount = apiResponse.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      // Transformar al formato esperado por el frontend
      const transformedResponse: ServerResponse<ParroquiasResponse> = {
        status: apiResponse.status,
        message: apiResponse.message,
        total: totalCount,
        data: {
          parroquias: apiResponse.data || [],
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            hasNext: hasNext,
            hasPrev: hasPrev,
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

      // La API devuelve: { status: "success", data: [...], total: 48, message: "..." }
      const apiResponse = response.data;
      
      // Calcular paginación basándose en el total y la página actual
      const totalCount = apiResponse.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      // Transformar al formato esperado por el frontend
      const transformedResponse: ServerResponse<ParroquiasResponse> = {
        status: apiResponse.status,
        message: apiResponse.message,
        total: totalCount,
        data: {
          parroquias: apiResponse.data || [],
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            hasNext: hasNext,
            hasPrev: hasPrev,
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
