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
    console.log('🚀 Servicio: Iniciando getParentescos con limit:', limit, 'page:', page);
    
    try {
      const client = getApiClient();
      console.log('📡 Servicio: Cliente obtenido, haciendo petición...');
      
      const response = await client.get(
        `/api/catalog/parentescos`,
        {
          params: {
            limit,
            page,
          },
        }
      );
      
      console.log('🔍 Respuesta completa de la API parentescos:', response.data);
      console.log('🔍 Estructura de response.data.message:', response.data?.message);
      console.log('🔍 Datos array:', response.data?.message?.data);
      console.log('🔍 Success flag:', response.data?.success);
      
      // Probemos diferentes estructuras de respuesta
      if (response.data?.success && response.data?.message?.data && Array.isArray(response.data.message.data)) {
        console.log('✅ Parentescos encontrados (estructura anidada):', response.data.message.data.length);
        return response.data.message.data;
      }
      
      // Estructura alternativa: respuesta directa
      if (response.data && Array.isArray(response.data)) {
        console.log('✅ Parentescos encontrados (estructura directa):', response.data.length);
        return response.data;
      }
      
      // Estructura alternativa: data en primer nivel
      if (response.data?.data && Array.isArray(response.data.data)) {
        console.log('✅ Parentescos encontrados (data en primer nivel):', response.data.data.length);
        return response.data.data;
      }
      
      console.log('⚠️ No se encontraron parentescos o estructura incorrecta');
      console.log('🔍 Estructura completa:', JSON.stringify(response.data, null, 2));
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
