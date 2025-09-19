import { getApiClient } from '@/config/api';
import { 
  Estudio, 
  EstudioFormData, 
  EstudioUpdateData, 
  EstudiosResponse,
  ApiEstudiosResponse
} from '@/types/estudios';

class EstudiosService {
  // Obtener todos los estudios con paginación
  async getEstudios(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<EstudiosResponse> {
    try {
      const client = getApiClient();
      const response = await client.get<ApiEstudiosResponse>(
        `/api/catalog/estudios`,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
          },
        }
      );

      // La API devuelve la estructura: { success: true, message: { data: [...], total: 1 } }
      const apiResponse = response.data;
      
      let estudiosData: Estudio[] = [];
      let totalCount = 0;
      
      if (apiResponse.message && apiResponse.message.data) {
        estudiosData = apiResponse.message.data;
        totalCount = apiResponse.message.total || apiResponse.message.data.length;
      }

      // Transformar al formato esperado por el frontend
      return {
        estudios: estudiosData,
        total: totalCount,
        message: apiResponse.message?.message || "Estudios obtenidos exitosamente"
      };
    } catch (error) {
      console.error('Error al obtener estudios:', error);
      throw error;
    }
  }

  // Buscar estudios
  async searchEstudios(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<EstudiosResponse> {
    try {
      const client = getApiClient();
      const response = await client.get<ApiEstudiosResponse>(
        `/api/catalog/estudios/search`,
        {
          params: {
            search: searchTerm,
            page,
            limit,
          },
        }
      );

      const apiResponse = response.data;
      
      let estudiosData: Estudio[] = [];
      let totalCount = 0;
      
      if (apiResponse.message && apiResponse.message.data) {
        estudiosData = apiResponse.message.data;
        totalCount = apiResponse.message.total || apiResponse.message.data.length;
      }

      return {
        estudios: estudiosData,
        total: totalCount,
        message: apiResponse.message?.message || "Búsqueda completada exitosamente"
      };
    } catch (error) {
      console.error('Error al buscar estudios:', error);
      throw error;
    }
  }

  // Obtener un estudio por ID
  async getEstudioById(id: string): Promise<Estudio> {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/catalog/estudios/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estudio por ID:', error);
      throw error;
    }
  }

  // Crear nuevo estudio
  async createEstudio(estudio: EstudioFormData): Promise<Estudio> {
    try {
      const client = getApiClient();
      const response = await client.post(`/api/catalog/estudios`, estudio);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear estudio:', error);
      throw error;
    }
  }

  // Actualizar estudio existente
  async updateEstudio(id: string, estudio: EstudioUpdateData): Promise<Estudio> {
    try {
      const client = getApiClient();
      const response = await client.put(`/api/catalog/estudios/${id}`, estudio);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar estudio:', error);
      throw error;
    }
  }

  // Eliminar estudio
  async deleteEstudio(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(`/api/catalog/estudios/${id}`);
    } catch (error) {
      console.error('Error al eliminar estudio:', error);
      throw error;
    }
  }

  // Obtener estudios activos
  async getActiveEstudios(): Promise<Estudio[]> {
    try {
      const response = await this.getEstudios(1, 1000); // Obtener todos
      return response.estudios.filter(estudio => estudio.activo);
    } catch (error) {
      console.error('Error al obtener estudios activos:', error);
      return [];
    }
  }

  // Obtener estadísticas de estudios
  async getEstudiosStats(): Promise<any> {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/catalog/estudios/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Alternar estado de estudio
  async toggleEstudioStatus(id: string): Promise<Estudio> {
    try {
      const client = getApiClient();
      const response = await client.patch(`/api/catalog/estudios/${id}/toggle-status`);
      return response.data.data;
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  }
}

export const estudiosService = new EstudiosService();
export default estudiosService;
