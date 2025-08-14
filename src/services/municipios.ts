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
  id_departamento: number;
}

export interface UpdateMunicipioRequest {
  nombre_municipio: string;
  codigo_dane: string;
  id_departamento: number;
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

      const response = await apiGet<MunicipiosResponse>(`${this.baseUrl}?${searchParams}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener municipios:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener municipios');
    }
  }

  /**
   * Obtener un municipio por ID
   */
  static async getMunicipioById(id: string): Promise<Municipio> {
    try {
      const response = await apiGet<MunicipioResponse>(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al obtener municipio:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener municipio');
    }
  }

  /**
   * Crear un nuevo municipio
   */
  static async createMunicipio(municipio: CreateMunicipioRequest): Promise<Municipio> {
    try {
      const response = await apiPost<MunicipioResponse>(this.baseUrl, municipio);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al crear municipio:', error);
      throw new Error(error.response?.data?.message || 'Error al crear municipio');
    }
  }

  /**
   * Actualizar un municipio
   */
  static async updateMunicipio(id: string, municipio: UpdateMunicipioRequest): Promise<Municipio> {
    try {
      const response = await apiPut<MunicipioResponse>(`${this.baseUrl}/${id}`, municipio);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al actualizar municipio:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar municipio');
    }
  }

  /**
   * Eliminar un municipio
   */
  static async deleteMunicipio(id: string): Promise<boolean> {
    try {
      await apiDelete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error: any) {
      console.error('Error al eliminar municipio:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar municipio');
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
