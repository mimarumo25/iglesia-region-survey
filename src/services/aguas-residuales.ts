import { apiClient } from '@/interceptors/axios';
import axios from 'axios';
import { 
  AguaResidual,
  AguaResidualCreate, 
  AguaResidualUpdate, 
  AguasResidualesResponse,
  ServerResponse 
} from '@/types/aguas-residuales';
import { AXIOS_CONFIG, API_ENDPOINTS } from '@/config/api';

// Cliente básico sin autenticación para modo desarrollo
const basicClient = axios.create(AXIOS_CONFIG);

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
        API_ENDPOINTS.CATALOG.AGUAS_RESIDUALES,
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
      const aguasResiduales = response.data.data.data;
      const totalCount = response.data.data.total;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Transformar al formato esperado por el frontend
      const transformedResponse: ServerResponse<AguasResidualesResponse> = {
        success: response.data.success,
        message: response.data.message,
        timestamp: response.data.timestamp,
        data: {
          tiposAguasResiduales: aguasResiduales,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          }
        }
      };
      
      return transformedResponse;
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
      
      // La API podría devolver la estructura anidada o directa, manejamos ambos casos
      const aguaResidual = response.data.data?.data || response.data.data || response.data;
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Tipo de agua residual obtenido correctamente',
        timestamp: response.data.timestamp || new Date().toISOString(),
        data: aguaResidual
      };
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
      
      // La API podría devolver la estructura anidada o directa, manejamos ambos casos
      const newAguaResidual = response.data.data?.data || response.data.data || response.data;
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Tipo de agua residual creado correctamente',
        timestamp: response.data.timestamp || new Date().toISOString(),
        data: newAguaResidual
      };
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
      
      // La API podría devolver la estructura anidada o directa, manejamos ambos casos
      const updatedAguaResidual = response.data.data?.data || response.data.data || response.data;
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Tipo de agua residual actualizado correctamente',
        timestamp: response.data.timestamp || new Date().toISOString(),
        data: updatedAguaResidual
      };
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
      
      // La API devuelve: { success: true, data: { data: [...], total: X } }
      const aguasResiduales = response.data.data.data || [];
      const totalCount = response.data.data.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Transformar al formato esperado por el frontend
      const transformedResponse: ServerResponse<AguasResidualesResponse> = {
        success: response.data.success,
        message: response.data.message,
        timestamp: response.data.timestamp,
        data: {
          tiposAguasResiduales: aguasResiduales,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          }
        }
      };
      
      return transformedResponse;
    } catch (error) {
      console.error('Error al buscar tipos de aguas residuales:', error);
      throw error;
    }
  }
}

export const aguasResidualesService = new AguasResidualesService();
export default aguasResidualesService;
