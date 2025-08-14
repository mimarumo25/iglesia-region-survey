import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { 
  AguaResidual,
  AguaResidualCreate, 
  AguaResidualUpdate, 
  AguasResidualesResponse,
  ServerResponse 
} from '@/types/aguas-residuales';

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

class AguasResidualesService {
  
  // Obtener todos los tipos de aguas residuales con paginación
  async getAguasResiduales(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_tipo_aguas_residuales',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<AguasResidualesResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/aguas-residuales`,
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
      console.error('Error al obtener tipos de aguas residuales:', error);
      throw error;
    }
  }

  // Obtener un tipo de agua residual por ID
  async getAguaResidualById(id: string): Promise<ServerResponse<AguaResidual>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/aguas-residuales/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipo de agua residual por ID:', error);
      throw error;
    }
  }

  // Crear nuevo tipo de agua residual
  async createAguaResidual(aguaResidual: AguaResidualCreate): Promise<ServerResponse<AguaResidual>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/aguas-residuales`,
        aguaResidual
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear tipo de agua residual:', error);
      throw error;
    }
  }

  // Actualizar tipo de agua residual existente
  async updateAguaResidual(id: string, aguaResidual: AguaResidualUpdate): Promise<ServerResponse<AguaResidual>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/aguas-residuales/${id}`,
        aguaResidual
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar tipo de agua residual:', error);
      throw error;
    }
  }

  // Eliminar tipo de agua residual
  async deleteAguaResidual(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/aguas-residuales/${id}`
      );
    } catch (error) {
      console.error('Error al eliminar tipo de agua residual:', error);
      throw error;
    }
  }

  // Buscar tipos de aguas residuales por nombre o descripción
  async searchAguasResiduales(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_tipo_aguas_residuales',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<AguasResidualesResponse>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/aguas-residuales`,
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
      return response.data;
    } catch (error) {
      console.error('Error al buscar tipos de aguas residuales:', error);
      throw error;
    }
  }
}

export const aguasResidualesService = new AguasResidualesService();
export default aguasResidualesService;
