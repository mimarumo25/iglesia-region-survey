import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { 
  Parentesco,
  ParentescoCreate, 
  ParentescoUpdate, 
  ParentescosResponse,
  ServerResponse 
} from '@/types/parentescos';

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

class ParentescosService {
  
  // Obtener todos los parentescos
  async getParentescos(
    includeInactive: boolean = true,
    limit: number = 10,
    page: number = 1
  ): Promise<Parentesco[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parentescos`,
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
      console.error('Error al obtener parentescos:', error);
      throw error;
    }
  }

  // Obtener un parentesco por ID
  async getParentescoById(id: string): Promise<ServerResponse<Parentesco>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parentescos/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener parentesco por ID:', error);
      throw error;
    }
  }

  // Crear nuevo parentesco
  async createParentesco(parentesco: ParentescoCreate): Promise<ServerResponse<Parentesco>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/parentescos`,
        {
          ...parentesco,
          activo: parentesco.activo !== undefined ? parentesco.activo : true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear parentesco:', error);
      throw error;
    }
  }

  // Actualizar parentesco existente
  async updateParentesco(id: string, parentesco: ParentescoUpdate): Promise<ServerResponse<Parentesco>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/parentescos/${id}`,
        parentesco
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar parentesco:', error);
      throw error;
    }
  }

  // Eliminar parentesco
  async deleteParentesco(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/parentescos/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar parentesco:', error);
      throw error;
    }
  }

  // Buscar parentescos por nombre o descripción
  async searchParentescos(
    searchTerm: string,
    includeInactive: boolean = true,
    limit: number = 10,
    page: number = 1
  ): Promise<Parentesco[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parentescos`,
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
      console.error('Error al buscar parentescos:', error);
      throw error;
    }
  }

  // Obtener parentescos activos solamente
  async getParentescosActivos(
    limit: number = 10,
    page: number = 1
  ): Promise<Parentesco[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/parentescos`,
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
      console.error('Error al obtener parentescos activos:', error);
      throw error;
    }
  }
}

export const parentescosService = new ParentescosService();
export default parentescosService;
