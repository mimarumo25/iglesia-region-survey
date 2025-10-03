import { getApiClient } from '@/config/api';
import { 
  Parentesco,
  ParentescoCreate, 
  ParentescoUpdate, 
  ParentescosResponse,
  ServerResponse 
} from '@/types/parentescos';

class ParentescosService {
  
  // Obtener todos los parentescos
  async getParentescos(
    limit: number = 10,
    page: number = 1
  ): Promise<Parentesco[]> {
    try {
      const client = getApiClient();
      
      const response = await client.get(
        `/api/catalog/parentescos`,
        {
          params: {
            limit,
            page,
          },
        }
      );
      
      // Probemos diferentes estructuras de respuesta
      if (response.data?.success && response.data?.message?.data && Array.isArray(response.data.message.data)) {
        return response.data.message.data;
      }
      
      // Estructura alternativa: respuesta directa
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Estructura alternativa: data en primer nivel
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
      
    } catch (error: any) {
      console.error('❌ Error en getParentescos:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      // Si es error de autenticación, lanzar error específico
      if (error.response?.status === 401) {
        throw new Error('Debe iniciar sesión para acceder a los datos de parentescos');
      }
      
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
      
      // La API podría tener estructura anidada, manejamos ambos casos
      const parentesco = response.data?.message?.data || response.data?.data || response.data;
      
      return {
        status: response.data?.success ? 'success' : 'error',
        message: response.data?.message?.message || response.data?.data || 'Parentesco obtenido correctamente',
        data: parentesco
      };
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
        parentesco
      );
      
      // La API devuelve {success: true, message: {parentesco_data}, data: "mensaje"}
      const newParentesco = response.data?.message;
      
      return {
        status: response.data?.success ? 'success' : 'error',
        message: response.data?.data || 'Parentesco creado correctamente',
        data: newParentesco
      };
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
      
      // La API podría tener estructura anidada, manejamos ambos casos
      const updatedParentesco = response.data?.message?.data || response.data?.data || response.data?.message;
      
      return {
        status: response.data?.success ? 'success' : 'error',
        message: response.data?.data || 'Parentesco actualizado correctamente',
        data: updatedParentesco
      };
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
            limit,
            page,
          },
        }
      );
      
      // La API devuelve {success: true, message: {status: "success", data: [...], total: X}}
      if (response.data?.success && response.data?.message?.data && Array.isArray(response.data.message.data)) {
        return response.data.message.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al buscar parentescos:', error);
      throw error;
    }
  }
}

export const parentescosService = new ParentescosService();
export default parentescosService;
