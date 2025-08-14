import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { 
  TipoVivienda,
  TipoViviendaCreate, 
  TipoViviendaUpdate, 
  TiposViviendaResponse,
  ServerResponse,
  ApiTiposViviendaResponse
} from '@/types/tipos-vivienda';

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

class TiposViviendaService {
  
  // Obtener todos los tipos de vivienda con paginación
  async getTiposVivienda(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TiposViviendaResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-vivienda`,
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
      const apiResponse: ServerResponse<ApiTiposViviendaResponse> = response.data;
      
      // Calcular paginación basada en el total y los parámetros
      const totalCount = apiResponse.data.total;
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      
      const transformedResponse: ServerResponse<TiposViviendaResponse> = {
        status: apiResponse.status,
        message: apiResponse.message,
        data: {
          tiposVivienda: apiResponse.data.tipos, // Mapear "tipos" a "tiposVivienda"
          pagination: {
            currentPage,
            totalPages,
            totalCount,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al obtener tipos de vivienda:', error);
      throw error;
    }
  }

  // Obtener un tipo de vivienda por ID
  async getTipoViviendaById(id: string): Promise<ServerResponse<TipoVivienda>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-vivienda/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipo de vivienda por ID:', error);
      throw error;
    }
  }

  // Crear nuevo tipo de vivienda
  async createTipoVivienda(tipoVivienda: TipoViviendaCreate): Promise<ServerResponse<TipoVivienda>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/tipos-vivienda`,
        tipoVivienda
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear tipo de vivienda:', error);
      throw error;
    }
  }

  // Actualizar tipo de vivienda existente
  async updateTipoVivienda(id: string, tipoVivienda: TipoViviendaUpdate): Promise<ServerResponse<TipoVivienda>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/tipos-vivienda/${id}`,
        tipoVivienda
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar tipo de vivienda:', error);
      throw error;
    }
  }

  // Eliminar tipo de vivienda
  async deleteTipoVivienda(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/tipos-vivienda/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar tipo de vivienda:', error);
      throw error;
    }
  }

  // Buscar tipos de vivienda por nombre o descripción
  async searchTiposVivienda(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TiposViviendaResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-vivienda`,
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
      const apiResponse: ServerResponse<ApiTiposViviendaResponse> = response.data;
      
      // Calcular paginación basada en el total y los parámetros
      const totalCount = apiResponse.data.total;
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      
      const transformedResponse: ServerResponse<TiposViviendaResponse> = {
        status: apiResponse.status,
        message: apiResponse.message,
        data: {
          tiposVivienda: apiResponse.data.tipos, // Mapear "tipos" a "tiposVivienda"
          pagination: {
            currentPage,
            totalPages,
            totalCount,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al buscar tipos de vivienda:', error);
      throw error;
    }
  }

  // Obtener tipos de vivienda activos
  async getTiposViviendaActivos(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TiposViviendaResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tipos-vivienda`,
        {
          params: {
            activo: true,
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );

      // Transformar la respuesta de la API al formato esperado
      const apiResponse: ServerResponse<ApiTiposViviendaResponse> = response.data;
      
      // Calcular paginación basada en el total y los parámetros
      const totalCount = apiResponse.data.total;
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      
      const transformedResponse: ServerResponse<TiposViviendaResponse> = {
        status: apiResponse.status,
        message: apiResponse.message,
        data: {
          tiposVivienda: apiResponse.data.tipos, // Mapear "tipos" a "tiposVivienda"
          pagination: {
            currentPage,
            totalPages,
            totalCount,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error al obtener tipos de vivienda activos:', error);
      throw error;
    }
  }
}

export const tiposViviendaService = new TiposViviendaService();
export default tiposViviendaService;
