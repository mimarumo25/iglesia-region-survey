import { getApiClient } from '@/config/api';
import { 
  Municipio,
  Vereda, 
  VeredaCreate, 
  VeredaUpdate, 
  VeredasResponse,
  MunicipiosResponse,
  ServerResponse 
} from '@/types/veredas';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

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
      showErrorToast(error, 'obtener municipios');
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
      showErrorToast(error, 'obtener municipio por ID');
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
      
      // Verificar si hay error en el backend
      if (!response.data.success || response.data.data.status === 'error') {
        return {
          data: [],
          total: 0,
          page: page,
          limit: limit,
          totalPages: 0,
        };
      }
      
      const veredas = response.data.data.data || [];
      const totalCount = response.data.data.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Procesar los datos para asegurar compatibilidad
      const processedVeredas = veredas.map((vereda: any) => ({
        ...vereda,
        id_vereda: typeof vereda.id_vereda === 'string' 
          ? parseInt(vereda.id_vereda) 
          : vereda.id_vereda,
        // Mapear id_municipio_municipios a id_municipio para compatibilidad
        id_municipio: typeof vereda.id_municipio_municipios === 'string' 
          ? parseInt(vereda.id_municipio_municipios) 
          : vereda.id_municipio_municipios || vereda.id_municipio,
        // Asegurar que el objeto municipio tenga la estructura correcta
        municipio: vereda.municipio ? {
          ...vereda.municipio,
          id_municipio: typeof vereda.municipio.id_municipio === 'string'
            ? parseInt(vereda.municipio.id_municipio)
            : vereda.municipio.id_municipio
        } : undefined
      }));
      
      return {
        data: processedVeredas,
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
        message: response.data.data.message,
      };
    } catch (error) {
      console.error('❌ Error al obtener veredas:', error);
      showErrorToast(error, 'obtener veredas');
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
      showErrorToast(error, 'obtener vereda por ID');
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
      showSuccessToast('Vereda creada', 'La vereda se ha creado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al crear vereda:', error);
      showErrorToast(error, 'crear vereda');
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
      showSuccessToast('Vereda actualizada', 'La vereda se ha actualizado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al actualizar vereda:', error);
      showErrorToast(error, 'actualizar vereda');
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
      showSuccessToast('Vereda eliminada', 'La vereda se ha eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar vereda:', error);
      showErrorToast(error, 'eliminar vereda');
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
      
      // Verificar si hay error en el backend
      if (!response.data.success || response.data.data.status === 'error') {
        return {
          data: [],
          total: 0,
          page: page,
          limit: limit,
          totalPages: 0,
        };
      }
      
      const veredas = response.data.data.data || [];
      const totalCount = response.data.data.total || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Procesar los datos para asegurar compatibilidad
      const processedVeredas = veredas.map((vereda: any) => ({
        ...vereda,
        id_vereda: typeof vereda.id_vereda === 'string' 
          ? parseInt(vereda.id_vereda) 
          : vereda.id_vereda,
        // Mapear id_municipio_municipios a id_municipio para compatibilidad
        id_municipio: typeof vereda.id_municipio_municipios === 'string' 
          ? parseInt(vereda.id_municipio_municipios) 
          : vereda.id_municipio_municipios || vereda.id_municipio,
        municipio: vereda.municipio ? {
          ...vereda.municipio,
          id_municipio: typeof vereda.municipio.id_municipio === 'string'
            ? parseInt(vereda.municipio.id_municipio)
            : vereda.municipio.id_municipio
        } : undefined
      }));
      
      return {
        data: processedVeredas,
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
        message: response.data.data.message,
      };
    } catch (error) {
      console.error('❌ Error al buscar veredas:', error);
      showErrorToast(error, 'buscar veredas');
      throw error;
    }
  }

  // Obtener veredas por municipio (sin paginación)
  async getVeredasByMunicipio(
    municipioId: number
  ): Promise<Vereda[]> {
    try {
      const client = getApiClient();
      const response = await client.get(
        `/api/catalog/veredas/municipio/${municipioId}`
      );
      
      // Verificar si hay error en el backend
      if (!response.data.success) {
        return [];
      }
      
      const veredas = response.data.data || [];
      
      // Procesar los datos para asegurar compatibilidad
      const processedVeredas = veredas.map((vereda: any) => ({
        ...vereda,
        id_vereda: typeof vereda.id_vereda === 'string' 
          ? parseInt(vereda.id_vereda) 
          : vereda.id_vereda,
        // Mapear id_municipio_municipios a id_municipio para compatibilidad
        id_municipio: typeof vereda.id_municipio_municipios === 'string' 
          ? parseInt(vereda.id_municipio_municipios) 
          : vereda.id_municipio_municipios || vereda.id_municipio,
        municipio: vereda.municipio ? {
          ...vereda.municipio,
          id_municipio: typeof vereda.municipio.id_municipio === 'string'
            ? parseInt(vereda.municipio.id_municipio)
            : vereda.municipio.id_municipio
        } : undefined
      }));
      
      return processedVeredas;
    } catch (error) {
      console.error('❌ Error al obtener veredas por municipio:', error);
      showErrorToast(error, 'obtener veredas por municipio');
      throw error;
    }
  }
}

export const veredasService = new VeredasService();
export default veredasService;
