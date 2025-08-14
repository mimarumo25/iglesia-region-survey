import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { 
  Talla,
  TallaCreate, 
  TallaUpdate, 
  TallasResponse,
  ServerResponse 
} from '@/types/tallas';

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

class TallasService {
  
  // ===== MÉTODOS CRUD CON PAGINACIÓN (para página de administración) =====
  
  // Obtener tallas con paginación completa
  async getTallasWithPagination(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TallasResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/catalog/tallas`, {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
          includeInactive: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener tallas con paginación:', error);
      throw error;
    }
  }

  // Buscar tallas con paginación
  async searchTallasWithPagination(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TallasResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/catalog/tallas/search`, {
        params: {
          q: searchTerm,
          page,
          limit,
          sortBy,
          sortOrder,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar tallas con paginación:', error);
      throw error;
    }
  }

  // Obtener tallas activas con paginación
  async getTallasActivasWithPagination(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<TallasResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/catalog/tallas/activas`, {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener tallas activas con paginación:', error);
      throw error;
    }
  }

  // ===== MÉTODOS SIMPLES (para formularios y autocompletado) =====

  // Obtener todas las tallas
  async getTallas(
    includeInactive: boolean = true,
    limit: number = 10,
    page: number = 1
  ): Promise<Talla[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tallas`,
        {
          params: {
            includeInactive,
            limit,
            page,
          },
        }
      );
      
      // La API devuelve {status: "success", data: [...]}
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener tallas:', error);
      throw error;
    }
  }

  // Obtener una talla por ID
  async getTallaById(id: string): Promise<ServerResponse<Talla>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tallas/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener talla por ID:', error);
      throw error;
    }
  }

  // Crear nueva talla
  async createTalla(talla: TallaCreate): Promise<ServerResponse<Talla>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/tallas`,
        {
          ...talla,
          activo: talla.activo !== undefined ? talla.activo : true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear talla:', error);
      throw error;
    }
  }

  // Actualizar talla existente
  async updateTalla(id: string, talla: TallaUpdate): Promise<ServerResponse<Talla>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/tallas/${id}`,
        talla
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar talla:', error);
      throw error;
    }
  }

  // Eliminar talla
  async deleteTalla(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/tallas/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar talla:', error);
      throw error;
    }
  }

  // Buscar tallas por nombre o descripción
  async searchTallas(
    searchTerm: string,
    includeInactive: boolean = true,
    limit: number = 10,
    page: number = 1
  ): Promise<Talla[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tallas`,
        {
          params: {
            q: searchTerm,
            includeInactive,
            limit,
            page,
          },
        }
      );
      
      // La API devuelve {status: "success", data: [...]}
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al buscar tallas:', error);
      throw error;
    }
  }

  // Obtener tallas activas solamente
  async getTallasActivas(
    limit: number = 10,
    page: number = 1
  ): Promise<Talla[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tallas`,
        {
          params: {
            includeInactive: false,
            limit,
            page,
          },
        }
      );
      
      // La API devuelve {status: "success", data: [...]}
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener tallas activas:', error);
      throw error;
    }
  }

  // Obtener tallas por tipo (camisa, pantalon, calzado)
  async getTallasPorTipo(
    tipo: string,
    limit: number = 10,
    page: number = 1
  ): Promise<Talla[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/tallas`,
        {
          params: {
            tipo,
            includeInactive: false,
            limit,
            page,
          },
        }
      );
      
      // La API devuelve {status: "success", data: [...]}
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener tallas por tipo:', error);
      throw error;
    }
  }
}

export const tallasService = new TallasService();
export default tallasService;
