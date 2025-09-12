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
      // Mock temporal para testing - data del JSON proporcionado
      const mockData = {
        "success": true,
        "message": "Veredas retrieved successfully",
        "data": {
          "status": "success",
          "data": [
            {
              "id_vereda": "1",
              "nombre": "Vereda Central Abejorral",
              "codigo_vereda": "V001",
              "id_municipio_municipios": "1",
              "created_at": "2025-09-05T06:36:25.352Z",
              "updated_at": "2025-09-05T06:36:25.352Z",
              "municipio": {
                "id_municipio": "1",
                "nombre": "Abejorral",
                "codigo": "00013"
              }
            },
            {
              "id_vereda": "2",
              "nombre": "Vereda Central Abrego",
              "codigo_vereda": "V002",
              "id_municipio_municipios": "2",
              "created_at": "2025-09-05T06:36:25.352Z",
              "updated_at": "2025-09-05T06:36:25.352Z",
              "municipio": {
                "id_municipio": "2",
                "nombre": "Abrego",
                "codigo": "00859"
              }
            },
            {
              "id_vereda": "11",
              "nombre": "El Paso",
              "codigo_vereda": "001",
              "id_municipio_municipios": "1",
              "created_at": "2025-09-09T04:20:42.050Z",
              "updated_at": "2025-09-09T04:20:42.050Z",
              "municipio": {
                "id_municipio": "1",
                "nombre": "Abejorral",
                "codigo": "00013"
              }
            },
            {
              "id_vereda": "12",
              "nombre": "Miguel Mariano",
              "codigo_vereda": "dfdfdf",
              "id_municipio_municipios": "1120",
              "created_at": "2025-09-09T04:23:23.959Z",
              "updated_at": "2025-09-09T04:23:23.959Z",
              "municipio": {
                "id_municipio": "1120",
                "nombre": "Zetaquira",
                "codigo": "00324"
              }
            }
          ],
          "total": 12,
          "message": "Se encontraron 12 veredas"
        },
        "timestamp": "2025-09-10T03:52:05.567Z"
      };

      // Para testing, retornar mock data directamente
      if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
        console.log('🧪 MOCK: Usando datos de prueba para veredas');
        
        const veredas = mockData.data.data || [];
        const totalCount = mockData.data.total || 0;
        const totalPages = Math.ceil(totalCount / limit);
        
        // Procesar los datos para asegurar que el id_municipio sea numérico
        const processedVeredas = veredas.map((vereda: any) => ({
          ...vereda,
          id_vereda: parseInt(vereda.id_vereda),
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
        };
      }

      // Lógica normal de la API
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
      // Verificar si hay error en el backend (problema de asociación de tablas)
      if (response.data.data.status === 'error' && response.data.data.message?.includes('not associated')) {
        console.warn('⚠️ Error de backend detectado:', response.data.data.message);
        // Retornar respuesta vacía válida cuando hay error de asociación
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
      
      // Procesar los datos para asegurar que el id_municipio sea numérico
      const processedVeredas = veredas.map((vereda: any) => ({
        ...vereda,
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
      // Verificar si hay error en el backend (problema de asociación de tablas)
      if (response.data.data.status === 'error' && response.data.data.message?.includes('not associated')) {
        console.warn('⚠️ Error de backend detectado en búsqueda:', response.data.data.message);
        // Retornar respuesta vacía válida cuando hay error de asociación
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
      
      // Procesar los datos para asegurar que el id_municipio sea numérico
      const processedVeredas = veredas.map((vereda: any) => ({
        ...vereda,
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
      // Verificar si hay error en el backend (problema de asociación de tablas)
      if (response.data.data.status === 'error' && response.data.data.message?.includes('not associated')) {
        console.warn('⚠️ Error de backend detectado por municipio:', response.data.data.message);
        // Retornar respuesta vacía válida cuando hay error de asociación
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
      
      // Procesar los datos para asegurar que el id_municipio sea numérico
      const processedVeredas = veredas.map((vereda: any) => ({
        ...vereda,
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
      };
    } catch (error) {
      console.error('Error al obtener veredas por municipio:', error);
      throw error;
    }
  }
}

export const veredasService = new VeredasService();
export default veredasService;
