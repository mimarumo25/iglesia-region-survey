import { getApiClient } from '@/config/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

export interface Corregimiento {
  id_corregimiento: number;
  nombre: string;
  codigo_corregimiento?: string;
  id_municipio_municipios?: string | number;
  created_at?: string;
  updated_at?: string;
  municipio?: {
    id_municipio: string | number;
    nombre_municipio: string;
    codigo_dane?: string;
    id_departamento?: string | number;
    departamento?: {
      id_departamento: string | number;
      nombre: string;
      codigo_dane: string;
    };
  };
}

export interface CorregimientosResponse {
  success: boolean;
  message: string;
  data: Corregimiento[];
  total: number;
  timestamp: string;
}

export interface CreateCorregimientoRequest {
  nombre: string;
  id_municipio?: number;
  id_municipio_municipios?: number;
}

export interface UpdateCorregimientoRequest {
  nombre: string;
  id_municipio?: number;
  id_municipio_municipios?: number;
}

const baseUrl = '/api/catalog/corregimientos';

class CorregimientosService {
  /**
   * Obtener todos los corregimientos
   */
  async getCorregimientos(
    page: number = 1,
    limit: number = 100,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<CorregimientosResponse> {
    try {
      const client = getApiClient();
      const response = await client.get(baseUrl, {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener corregimientos:', error);
      showErrorToast(error, 'obtener corregimientos');
      throw error;
    }
  }

  /**
   * Obtener corregimientos por municipio
   */
  async getCorregimientosByMunicipio(municipioId: string | number): Promise<Corregimiento[]> {
    try {
      const client = getApiClient();
      const response = await client.get(`${baseUrl}/municipio/${municipioId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error(`Error al obtener corregimientos para municipio ${municipioId}:`, error);
      showErrorToast(error, 'obtener corregimientos por municipio');
      throw error;
    }
  }

  /**
   * Obtener un corregimiento por ID
   */
  async getCorregimientoById(id: string | number): Promise<Corregimiento> {
    try {
      const client = getApiClient();
      const response = await client.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener corregimiento ${id}:`, error);
      showErrorToast(error, 'obtener corregimiento por ID');
      throw error;
    }
  }

  /**
   * Crear un nuevo corregimiento
   */
  async createCorregimiento(corregimiento: CreateCorregimientoRequest): Promise<Corregimiento> {
    try {
      const client = getApiClient();
      // El backend espera id_municipio_municipios en la request
      const payload = {
        nombre: corregimiento.nombre,
        id_municipio_municipios: corregimiento.id_municipio || corregimiento.id_municipio_municipios,
      };
      const response = await client.post(baseUrl, payload);
      showSuccessToast('Corregimiento creado', 'El corregimiento se ha creado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al crear corregimiento:', error);
      showErrorToast(error, 'crear corregimiento');
      throw error;
    }
  }

  /**
   * Actualizar un corregimiento
   */
  async updateCorregimiento(id: string | number, corregimiento: UpdateCorregimientoRequest): Promise<Corregimiento> {
    try {
      const client = getApiClient();
      // El backend espera id_municipio_municipios en la request
      const payload = {
        nombre: corregimiento.nombre,
        id_municipio_municipios: corregimiento.id_municipio || corregimiento.id_municipio_municipios,
      };
      const response = await client.put(`${baseUrl}/${id}`, payload);
      showSuccessToast('Corregimiento actualizado', 'El corregimiento se ha actualizado correctamente');
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar corregimiento ${id}:`, error);
      showErrorToast(error, 'actualizar corregimiento');
      throw error;
    }
  }

  /**
   * Eliminar un corregimiento
   */
  async deleteCorregimiento(id: string | number): Promise<boolean> {
    try {
      const client = getApiClient();
      await client.delete(`${baseUrl}/${id}`);
      showSuccessToast('Corregimiento eliminado', 'El corregimiento se ha eliminado correctamente');
      return true;
    } catch (error) {
      console.error(`Error al eliminar corregimiento ${id}:`, error);
      showErrorToast(error, 'eliminar corregimiento');
      throw error;
    }
  }
}

export const corregimientosService = new CorregimientosService();
