import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { 
  SistemaAcueducto,
  SistemaAcueductoCreate, 
  SistemaAcueductoUpdate, 
  SistemasAcueductoResponse,
  ServerResponse 
} from '@/types/sistemas-acueducto';

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

class SistemasAcueductoService {
  
  // Obtener todos los sistemas de acueducto
  async getSistemasAcueducto(
    includeInactive: boolean = true,
    limit: number = 10,
    page: number = 1
  ): Promise<SistemaAcueducto[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sistemas-acueducto`,
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
      console.error('Error al obtener sistemas de acueducto:', error);
      throw error;
    }
  }

  // Obtener un sistema de acueducto por ID
  async getSistemaAcueductoById(id: string): Promise<ServerResponse<SistemaAcueducto>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sistemas-acueducto/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener sistema de acueducto por ID:', error);
      throw error;
    }
  }

  // Crear nuevo sistema de acueducto
  async createSistemaAcueducto(sistema: SistemaAcueductoCreate): Promise<ServerResponse<SistemaAcueducto>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/sistemas-acueducto`,
        {
          ...sistema,
          activo: sistema.activo !== undefined ? sistema.activo : true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear sistema de acueducto:', error);
      throw error;
    }
  }

  // Actualizar sistema de acueducto existente
  async updateSistemaAcueducto(id: string, sistema: SistemaAcueductoUpdate): Promise<ServerResponse<SistemaAcueducto>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/sistemas-acueducto/${id}`,
        sistema
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar sistema de acueducto:', error);
      throw error;
    }
  }

  // Eliminar sistema de acueducto
  async deleteSistemaAcueducto(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/sistemas-acueducto/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar sistema de acueducto:', error);
      throw error;
    }
  }

  // Buscar sistemas de acueducto por nombre o descripción
  async searchSistemasAcueducto(
    searchTerm: string,
    includeInactive: boolean = true,
    limit: number = 10,
    page: number = 1
  ): Promise<SistemaAcueducto[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sistemas-acueducto`,
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
      console.error('Error al buscar sistemas de acueducto:', error);
      throw error;
    }
  }

  // Obtener sistemas de acueducto activos solamente
  async getSistemasAcueductoActivos(
    limit: number = 10,
    page: number = 1
  ): Promise<SistemaAcueducto[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sistemas-acueducto`,
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
      console.error('Error al obtener sistemas de acueducto activos:', error);
      throw error;
    }
  }
}

export const sistemasAcueductoService = new SistemasAcueductoService();
export default sistemasAcueductoService;
