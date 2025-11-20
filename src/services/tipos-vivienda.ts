import { getApiClient } from '@/config/api';
import { 
  TipoVivienda,
  TipoViviendaCreate, 
  TipoViviendaUpdate, 
  TiposViviendaResponse,
  ServerResponse,
  ApiTiposViviendaResponse
} from '@/types/tipos-vivienda';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

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

      // La API devuelve: { status: "success", data: { data: [...], total: X } }
      const tiposVivienda = response.data.data.data;
      const totalCount = response.data.data.total;
      const totalPages = Math.ceil(totalCount / limit);
      
      const transformedResponse: ServerResponse<TiposViviendaResponse> = {
        status: response.data.status,
        message: response.data.message,
        data: {
          tiposVivienda: tiposVivienda,
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
      console.error('Error al obtener tipos de vivienda:', error);
      showErrorToast(error, 'obtener tipos de vivienda');
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
      
      // La API podría devolver la estructura anidada o directa, manejamos ambos casos
      const tipoVivienda = response.data.data?.data || response.data.data || response.data;
      
      return {
        status: response.data.status || 'success',
        message: response.data.message || 'Tipo de vivienda obtenido correctamente',
        data: tipoVivienda
      };
    } catch (error) {
      console.error('Error al obtener tipo de vivienda por ID:', error);
      showErrorToast(error, 'obtener tipo de vivienda por ID');
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
      
      // La API podría devolver la estructura anidada o directa, manejamos ambos casos
      const newTipoVivienda = response.data.data?.data || response.data.data || response.data;
      
      showSuccessToast('Tipo de vivienda creado', 'El tipo de vivienda se ha creado correctamente');
      
      return {
        status: response.data.status || 'success',
        message: response.data.message || 'Tipo de vivienda creado correctamente',
        data: newTipoVivienda
      };
    } catch (error) {
      console.error('Error al crear tipo de vivienda:', error);
      showErrorToast(error, 'crear tipo de vivienda');
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
      
      // La API podría devolver la estructura anidada o directa, manejamos ambos casos
      const updatedTipoVivienda = response.data.data?.data || response.data.data || response.data;
      
      showSuccessToast('Tipo de vivienda actualizado', 'El tipo de vivienda se ha actualizado correctamente');
      
      return {
        status: response.data.status || 'success',
        message: response.data.message || 'Tipo de vivienda actualizado correctamente',
        data: updatedTipoVivienda
      };
    } catch (error) {
      console.error('Error al actualizar tipo de vivienda:', error);
      showErrorToast(error, 'actualizar tipo de vivienda');
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
      showSuccessToast('Tipo de vivienda eliminado', 'El tipo de vivienda se ha eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar tipo de vivienda:', error);
      showErrorToast(error, 'eliminar tipo de vivienda');
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

      // La API devuelve: { status: "success", data: { data: [...], total: X } }
      const tiposVivienda = response.data.data.data || [];
      const totalCount = response.data.data.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      const transformedResponse: ServerResponse<TiposViviendaResponse> = {
        status: response.data.status,
        message: response.data.message,
        data: {
          tiposVivienda: tiposVivienda,
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
      console.error('Error al buscar tipos de vivienda:', error);
      showErrorToast(error, 'buscar tipos de vivienda');
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

      // La API devuelve: { status: "success", data: { data: [...], total: X } }
      const tiposVivienda = response.data.data.data || [];
      const totalCount = response.data.data.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      const transformedResponse: ServerResponse<TiposViviendaResponse> = {
        status: response.data.status,
        message: response.data.message,
        data: {
          tiposVivienda: tiposVivienda,
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
      console.error('Error al obtener tipos de vivienda activos:', error);
      showErrorToast(error, 'obtener tipos de vivienda activos');
      throw error;
    }
  }
}

export const tiposViviendaService = new TiposViviendaService();
export default tiposViviendaService;
