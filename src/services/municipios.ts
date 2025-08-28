import { apiGet, apiPost, apiPut, apiDelete } from '@/interceptors/axios';

// Interfaces para municipios
export interface Municipio {
  id_municipio: string;
  nombre_municipio: string;
  codigo_dane: string;
  id_departamento: string;
  created_at: string;
  updated_at: string;
  departamento?: {
    id_departamento: string;
    nombre: string;
    codigo_dane: string;
  };
}

export interface CreateMunicipioRequest {
  nombre_municipio: string;
  codigo_dane: string;
  id_departamento: number | string; // Permitir tanto número como string para flexibilidad
}

export interface UpdateMunicipioRequest {
  nombre_municipio: string;
  codigo_dane: string;
  id_departamento: number | string; // Permitir tanto número como string para flexibilidad
}

export interface MunicipiosResponse {
  success: boolean;
  message: string;
  data: {
    municipios: Municipio[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  timestamp: string;
}

export interface MunicipioResponse {
  success: boolean;
  message: string;
  data: Municipio;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: any;
}

// Servicios para municipios
export class MunicipiosService {
  private static baseUrl = '/api/catalog/municipios';

  /**
   * Extraer mensaje de error del backend según diferentes estructuras posibles
   */
  private static extractErrorMessage(error: any, defaultMessage: string): string {
    if (error.response?.data) {
      // Estructura: { success: false, error: { message: "...", code: "...", timestamp: "..." } }
      if (error.response.data.error?.message) {
        return error.response.data.error.message;
      }
      // Estructura alternativa: { success: false, message: "..." }
      else if (error.response.data.message) {
        return error.response.data.message;
      }
      // Estructura simple: string directo
      else if (typeof error.response.data === 'string') {
        return error.response.data;
      }
    }
    return defaultMessage;
  }

  /**
   * Obtener todos los municipios con paginación
   */
  static async getMunicipios(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
  } = {}): Promise<MunicipiosResponse> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'id_municipio',
        sortOrder = 'ASC',
        search
      } = params;

      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (search) {
        searchParams.append('search', search);
      }

      const response = await apiGet<any>(`${MunicipiosService.baseUrl}?${searchParams}`);
      
      // La API devuelve: { success: true, message: "...", data: {...} }
      const apiResponse = response.data;
      
      // Manejar la estructura anidada de datos similar a parroquias
      let municipiosData = [];
      let totalCount = 0;
      
      if (apiResponse.data) {
        if (Array.isArray(apiResponse.data)) {
          // Estructura: { success: true, data: [...], total: 48 }
          municipiosData = apiResponse.data;
          totalCount = apiResponse.total || apiResponse.data.length;
        } else if (apiResponse.data.data && Array.isArray(apiResponse.data.data)) {
          // Estructura: { success: true, data: { status: "success", data: [...], total: 3 } }
          municipiosData = apiResponse.data.data;
          totalCount = apiResponse.data.total || apiResponse.data.data.length;
        } else if (apiResponse.data.municipios) {
          // Estructura: { success: true, data: { municipios: [...], total: 48 } }
          municipiosData = apiResponse.data.municipios;
          totalCount = apiResponse.data.total || apiResponse.data.municipios.length;
        }
      }
      
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;
      
      const transformedResponse: MunicipiosResponse = {
        success: apiResponse.success || true,
        message: apiResponse.message || "Municipios retrieved successfully",
        data: {
          municipios: municipiosData,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            hasNext: hasNext,
            hasPrev: hasPrev,
          }
        },
        timestamp: apiResponse.timestamp || new Date().toISOString()
      };
      
      return transformedResponse;
    } catch (error: any) {
      console.error('Error al obtener municipios:', error);
      const errorMessage = this.extractErrorMessage(error, 'Error al obtener municipios');
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener un municipio por ID
   */
  static async getMunicipioById(id: string): Promise<Municipio> {
    try {
      const response = await apiGet<MunicipioResponse>(`${MunicipiosService.baseUrl}/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al obtener municipio:', error);
      const errorMessage = this.extractErrorMessage(error, 'Error al obtener municipio');
      throw new Error(errorMessage);
    }
  }

  /**
   * Crear un nuevo municipio
   */
  static async createMunicipio(municipio: CreateMunicipioRequest): Promise<Municipio> {
    try {
      // Asegurar conversión correcta de tipos antes de enviar
      const municipioData = {
        nombre_municipio: String(municipio.nombre_municipio).trim(),
        codigo_dane: String(municipio.codigo_dane).trim(),
        id_departamento: Number(municipio.id_departamento)
      };
      
      console.log('🚀 Creando municipio:', municipioData);
      
      const response = await apiPost<MunicipioResponse>(MunicipiosService.baseUrl, municipioData);
      console.log('✅ Municipio creado exitosamente:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error al crear municipio:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      const errorMessage = this.extractErrorMessage(error, 'Error al crear municipio');
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualizar un municipio
   */
  static async updateMunicipio(id: string, municipio: UpdateMunicipioRequest): Promise<Municipio> {
    try {
      const response = await apiPut<MunicipioResponse>(`${MunicipiosService.baseUrl}/${id}`, municipio);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al actualizar municipio:', error);
      const errorMessage = this.extractErrorMessage(error, 'Error al actualizar municipio');
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar un municipio
   */
  static async deleteMunicipio(id: string): Promise<boolean> {
    try {
      await apiDelete(`${MunicipiosService.baseUrl}/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error al eliminar municipio:', error);
      const errorMessage = this.extractErrorMessage(error, 'Error al eliminar municipio');
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener todos los municipios sin paginación (para selects)
   */
  static async getAllMunicipios(): Promise<Municipio[]> {
    try {
      const response = await this.getMunicipios({ limit: 1000 });
      return response.data.municipios;
    } catch (error) {
      console.error('Error al obtener todos los municipios:', error);
      return [];
    }
  }
}

export default MunicipiosService;
