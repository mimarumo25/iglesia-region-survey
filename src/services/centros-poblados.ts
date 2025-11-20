import { getApiClient } from '@/config/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

export interface CentroPoblado {
  id_centro_poblado: string;
  nombre: string;
  codigo_centro_poblado?: string;
  id_municipio_municipios?: string | number | null;
  created_at?: string;
  updated_at?: string;
  municipio?: {
    id_municipio: string;
    nombre_municipio: string;
    codigo_dane?: string;
  } | null;
}

export interface CentrosPobladosResponse {
  success: boolean;
  message: string;
  data: CentroPoblado[];
  total: number;
  timestamp: string;
}

export interface CreateCentroPobladoRequest {
  nombre: string;
  id_municipio_municipios: number;
}

export interface UpdateCentroPobladoRequest {
  nombre: string;
  id_municipio_municipios: number;
}

const baseUrl = '/api/catalog/centros-poblados';

class CentrosPobladosService {
  /**
   * Obtener todos los centros poblados
   */
  async getCentrosPoblados(
    page: number = 1,
    limit: number = 100,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<CentrosPobladosResponse> {
    try {
      const client = getApiClient();
      const params: any = {
        page,
        limit,
      };
      
      // Solo agregar parámetros de sorting si se proporcionan
      if (sortBy) {
        params.sortBy = sortBy;
      }
      if (sortOrder) {
        params.sortOrder = sortOrder;
      }
      
      const response = await client.get(baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener centros poblados:', error);
      showErrorToast(error, 'obtener centros poblados');
      throw error;
    }
  }

  /**
   * Obtener centros poblados por municipio
   */
  async getCentrosPobladosByMunicipio(municipioId: string | number): Promise<CentroPoblado[]> {
    try {
      const client = getApiClient();
      const response = await client.get(`${baseUrl}/municipio/${municipioId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error(`Error al obtener centros poblados para municipio ${municipioId}:`, error);
      showErrorToast(error, 'obtener centros poblados por municipio');
      throw error;
    }
  }

  /**
   * Obtener un centro poblado por ID
   */
  async getCentroPobladoById(id: string): Promise<CentroPoblado> {
    try {
      const client = getApiClient();
      const response = await client.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener centro poblado ${id}:`, error);
      showErrorToast(error, 'obtener centro poblado por ID');
      throw error;
    }
  }

  /**
   * Crear un nuevo centro poblado
   */
  async createCentroPoblado(centroPoblado: CreateCentroPobladoRequest): Promise<CentroPoblado> {
    try {
      const client = getApiClient();
      const response = await client.post(baseUrl, centroPoblado);
      // El backend devuelve { status, message, data }
      const responseData = response.data?.data || response.data;
      showSuccessToast('Centro poblado creado', 'El centro poblado se ha creado correctamente');
      return responseData;
    } catch (error) {
      console.error('Error al crear centro poblado:', error);
      showErrorToast(error, 'crear centro poblado');
      throw error;
    }
  }

  /**
   * Actualizar un centro poblado
   */
  async updateCentroPoblado(id: string, centroPoblado: UpdateCentroPobladoRequest): Promise<CentroPoblado> {
    try {
      const client = getApiClient();
      const response = await client.put(`${baseUrl}/${id}`, centroPoblado);
      // El backend devuelve { status, message, data }
      const responseData = response.data?.data || response.data;
      showSuccessToast('Centro poblado actualizado', 'El centro poblado se ha actualizado correctamente');
      return responseData;
    } catch (error) {
      console.error(`Error al actualizar centro poblado ${id}:`, error);
      showErrorToast(error, 'actualizar centro poblado');
      throw error;
    }
  }

  /**
   * Eliminar un centro poblado
   */
  async deleteCentroPoblado(id: string): Promise<boolean> {
    try {
      const client = getApiClient();
      await client.delete(`${baseUrl}/${id}`);
      showSuccessToast('Centro poblado eliminado', 'El centro poblado se ha eliminado correctamente');
      return true;
    } catch (error) {
      console.error(`Error al eliminar centro poblado ${id}:`, error);
      showErrorToast(error, 'eliminar centro poblado');
      throw error;
    }
  }
}

export const centrosPobladosService = new CentrosPobladosService();
