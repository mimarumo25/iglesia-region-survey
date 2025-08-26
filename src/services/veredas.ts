import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { 
  Municipio,
  Vereda, 
  VeredaCreate, 
  VeredaUpdate, 
  VeredasResponse,
  MunicipiosResponse,
  ServerResponse 
} from '@/types/veredas';

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

class VeredasService {
  // ===== MÉTODOS PARA MUNICIPIOS =====
  
  // Obtener todos los municipios con paginación
  async getMunicipios(
    page: number = 1,
    limit: number = 32,
    sortBy: string = 'id_municipio',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<MunicipiosResponse> | MunicipiosResponse> {
    try {
      const client = getApiClient();
      const url = `/api/catalog/municipios`;
      
      const response = await client.get(
        url,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener municipios:', error);
      throw error;
    }
  }

  // Obtener un municipio por ID
  async getMunicipioById(id: number): Promise<Municipio> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/municipios/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener municipio por ID:', error);
      throw error;
    }
  }

  // ===== MÉTODOS PARA VEREDAS =====

  // Obtener todas las veredas con paginación
  async getVeredas(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_vereda',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<VeredasResponse> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/veredas`,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );
      
      // La API devuelve: { success: true, data: { data: [...], total: X } }
      const veredas = response.data.data.data;
      const totalCount = response.data.data.total;
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        data: veredas,
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error('Error al obtener veredas:', error);
      throw error;
    }
  }

  // Obtener una vereda por ID
  async getVeredaById(id: number): Promise<Vereda> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/veredas/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener vereda por ID:', error);
      throw error;
    }
  }

  // Crear nueva vereda
  async createVereda(vereda: VeredaCreate): Promise<Vereda> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/veredas`,
        vereda
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear vereda:', error);
      throw error;
    }
  }

  // Actualizar vereda existente
  async updateVereda(id: number, vereda: VeredaUpdate): Promise<Vereda> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/veredas/${id}`,
        vereda
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar vereda:', error);
      throw error;
    }
  }

  // Eliminar vereda
  async deleteVereda(id: number): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/veredas/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar vereda:', error);
      throw error;
    }
  }

  // Buscar veredas por nombre o código
  async searchVeredas(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<VeredasResponse> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/veredas/search`,
        {
          params: {
            q: searchTerm,
            page,
            limit,
          },
        }
      );
      
      // La API devuelve: { success: true, data: { data: [...], total: X } }
      const veredas = response.data.data.data || [];
      const totalCount = response.data.data.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        data: veredas,
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error('Error al buscar veredas:', error);
      throw error;
    }
  }

  // Obtener veredas por municipio
  async getVeredasByMunicipio(
    municipioId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<VeredasResponse> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/veredas/municipio/${municipioId}`,
        {
          params: {
            page,
            limit,
          },
        }
      );
      
      // La API devuelve: { success: true, data: { data: [...], total: X } }
      const veredas = response.data.data.data || [];
      const totalCount = response.data.data.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        data: veredas,
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error('Error al obtener veredas por municipio:', error);
      throw error;
    }
  }
}

export const veredasService = new VeredasService();
export default veredasService;
