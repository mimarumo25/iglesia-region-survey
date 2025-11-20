import { getApiClient } from '@/config/api';
import { 
  Sexo, 
  SexoCreate, 
  SexoUpdate, 
  SexosResponse, 
  ServerResponse, 
  ApiSexosResponse 
} from '@/types/sexos';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

class SexosService {
  // Obtener todos los sexos con paginación
  async getSexos(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_sexo',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<SexosResponse> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sexos`,
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
      console.error('Error al obtener sexos:', error);
      showErrorToast(error, 'obtener sexos');
      throw error;
    }
  }

  // Obtener un sexo por ID
  async getSexoById(id: string): Promise<ServerResponse<Sexo>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sexos/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener sexo por ID:', error);
      showErrorToast(error, 'obtener sexo por ID');
      throw error;
    }
  }

  // Crear nuevo sexo
  async createSexo(sexo: SexoCreate): Promise<ServerResponse<Sexo>> {
    try {
      const client = getApiClient();
      const response = await client.post(
        `/api/catalog/sexos`,
        sexo
      );
      showSuccessToast('Sexo creado', 'El sexo se ha creado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al crear sexo:', error);
      showErrorToast(error, 'crear sexo');
      throw error;
    }
  }

  // Actualizar sexo existente
  async updateSexo(id: string, sexo: SexoUpdate): Promise<ServerResponse<Sexo>> {
    try {
      const client = getApiClient();
      const response = await client.put(
        `/api/catalog/sexos/${id}`,
        sexo
      );
      showSuccessToast('Sexo actualizado', 'El sexo se ha actualizado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al actualizar sexo:', error);
      showErrorToast(error, 'actualizar sexo');
      throw error;
    }
  }

  // Eliminar sexo
  async deleteSexo(id: string): Promise<void> {
    try {
      const client = getApiClient();
      await client.delete(
        `/api/catalog/sexos/${id}`
      );
      showSuccessToast('Sexo eliminado', 'El sexo se ha eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar sexo:', error);
      showErrorToast(error, 'eliminar sexo');
      throw error;
    }
  }

  // Buscar sexos por nombre
  async searchSexos(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<SexosResponse> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sexos/search`,
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
      console.error('Error al buscar sexos:', error);
      showErrorToast(error, 'buscar sexos');
      throw error;
    }
  }

  // Obtener sexos activos - Como no hay campo activo, simplemente devolver todos
  async getSexosActivos(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<SexosResponse> {
    // Simplemente llamar a getSexos ya que no hay filtro de activo
    return this.getSexos(page, limit, sortBy, sortOrder);
  }

  // Obtener estadísticas de sexos
  async getSexoStatistics(): Promise<ServerResponse<any>> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/sexos/statistics`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de sexos:', error);
      showErrorToast(error, 'obtener estadísticas de sexos');
      throw error;
    }
  }
}

export const sexosService = new SexosService();
export default sexosService;
