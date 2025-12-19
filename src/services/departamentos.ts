/**
 * @fileoverview Servicio de Catálogo de Departamentos - Sistema MIA
 * 
 * Gestiona operaciones CRUD para el catálogo de departamentos de Colombia:
 * - Listado con paginación
 * - Consulta por ID
 * - Creación y actualización
 * - Eliminación (soft delete)
 * - Estadísticas de departamentos
 * 
 * Los departamentos son la división administrativa de primer nivel
 * y se usan para filtrado jerárquico en formularios.
 * 
 * Endpoint: /api/catalog/departamentos
 * 
 * @module services/departamentos
 * @version 2.0.0
 */

import { getApiClient } from '@/config/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

/**
 * Entidad de Departamento
 * 
 * @interface Departamento
 * @property {string} id_departamento - ID único del departamento
 * @property {string} nombre - Nombre del departamento
 * @property {string} codigo_dane - Código DANE oficial
 * @property {string} [descripcion] - Descripción adicional
 * @property {boolean} [activo] - Si el departamento está activo
 * @property {string} [created_at] - Fecha de creación
 * @property {string} [updated_at] - Fecha de última actualización
 */
export interface Departamento {
  id_departamento: string;
  nombre: string;
  codigo_dane: string;
  descripcion?: string;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DepartamentoFormData {
  nombre: string;
  codigo_dane: string;
}

export interface DepartamentoUpdateData extends DepartamentoFormData {}

// Nuevo formato de respuesta API
export interface ApiResponse<T> {
  status: string;
  data: T;
  total?: number;
  message?: string;
}

export interface DepartamentosResponse {
  departamentos: Departamento[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}

export interface DepartamentosStatsResponse {
  total_departamentos: number;
  departamentos_activos: number;
  departamentos_inactivos: number;
  ultimo_registro?: string;
}

// Servicios para Departamentos
export const departamentosService = {

  // Obtener un departamento por ID
  getDepartamentoById: async (id: string): Promise<ServerResponse<Departamento>> => {
    try {
      const api = getApiClient();
      const response = await api.get(`/api/catalog/departamentos/${id}`);
      
      // Manejar el nuevo formato de respuesta
      const apiResponse = response.data as ApiResponse<Departamento>;
      
      if (apiResponse.status === 'success' && apiResponse.data) {
        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: apiResponse.data
        };
      }
      
      throw new Error('Formato de respuesta inválido');
    } catch (error: any) {
      console.error('Error al obtener departamento:', error);
      showErrorToast(error, 'obtener departamento');
      throw new Error(error.response?.data?.message || 'Error al obtener departamento');
    }
  },

  // Crear nuevo departamento
  createDepartamento: async (data: DepartamentoFormData): Promise<ServerResponse<Departamento>> => {
    try {
      const api = getApiClient();
      const response = await api.post('/api/catalog/departamentos', data);
      
      // Manejar el nuevo formato de respuesta
      const apiResponse = response.data;
      
      // Verificar si es el nuevo formato
      if (apiResponse.status === 'success') {
        showSuccessToast('Departamento creado', 'El departamento se ha creado correctamente');
        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: apiResponse.data // Puede ser null, lo manejamos
        };
      }
      
      // Formato anterior de éxito
      if (apiResponse.success) {
        showSuccessToast('Departamento creado', 'El departamento se ha creado correctamente');
        return {
          success: true,
          timestamp: apiResponse.timestamp || new Date().toISOString(),
          data: apiResponse.data // Puede ser null, lo manejamos
        };
      }
      
      throw new Error('Formato de respuesta inválido');
    } catch (error: any) {
      console.error('Error al crear departamento:', error);
      
      // Manejar diferentes formatos de error
      let errorMessage = 'Error al crear departamento';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Nuevo formato de error: { status: "error", message: "..." }
        if (errorData.status === 'error' && errorData.message) {
          errorMessage = errorData.message;
        }
        // Formato anterior: { success: false, error: { message: "..." } }
        else if (errorData.success === false && errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
        // Formato directo: { message: "..." }
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      showErrorToast(error, 'crear departamento');
      throw new Error(errorMessage);
    }
  },

  // Actualizar departamento
  updateDepartamento: async (id: string, data: DepartamentoUpdateData): Promise<ServerResponse<Departamento>> => {
    try {
      const api = getApiClient();
      const response = await api.put(`/api/catalog/departamentos/${id}`, data);
      
      // Manejar el nuevo formato de respuesta
      const apiResponse = response.data;
      
      // Verificar si es el nuevo formato
      if (apiResponse.status === 'success' && apiResponse.data) {
        showSuccessToast('Departamento actualizado', 'El departamento se ha actualizado correctamente');
        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: apiResponse.data
        };
      }
      
      // Formato anterior de éxito
      if (apiResponse.success && apiResponse.data) {
        showSuccessToast('Departamento actualizado', 'El departamento se ha actualizado correctamente');
        return {
          success: true,
          timestamp: apiResponse.timestamp || new Date().toISOString(),
          data: apiResponse.data
        };
      }
      
      throw new Error('Formato de respuesta inválido');
    } catch (error: any) {
      console.error('Error al actualizar departamento:', error);
      
      // Manejar diferentes formatos de error
      let errorMessage = 'Error al actualizar departamento';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Nuevo formato de error: { status: "error", message: "..." }
        if (errorData.status === 'error' && errorData.message) {
          errorMessage = errorData.message;
        }
        // Formato anterior: { success: false, error: { message: "..." } }
        else if (errorData.success === false && errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
        // Formato directo: { message: "..." }
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      showErrorToast(error, 'actualizar departamento');
      throw new Error(errorMessage);
    }
  },

  // Eliminar departamento
  deleteDepartamento: async (id: string): Promise<ServerResponse<void>> => {
    try {
      const api = getApiClient();
      const response = await api.delete(`/api/catalog/departamentos/${id}`);
      
      // Manejar el nuevo formato de respuesta
      const apiResponse = response.data as ApiResponse<any>;
      
      if (apiResponse.status === 'success') {
        showSuccessToast('Departamento eliminado', 'El departamento se ha eliminado correctamente');
        return {
          success: true,
          timestamp: new Date().toISOString()
        };
      }
      
      throw new Error('Formato de respuesta inválido');
    } catch (error: any) {
      console.error('Error al eliminar departamento:', error);
      showErrorToast(error, 'eliminar departamento');
      throw new Error(error.response?.data?.message || 'Error al eliminar departamento');
    }
  },

  // Obtener departamentos activos
  getActiveDepartamentos: async (): Promise<ServerResponse<Departamento[]>> => {
    try {
      const api = getApiClient();
      const response = await api.get('/api/catalog/departamentos');
      
      // Manejar el nuevo formato de respuesta
      const apiResponse = response.data as ApiResponse<Departamento[]>;
      
      if (apiResponse.status === 'success' && Array.isArray(apiResponse.data)) {
        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: apiResponse.data
        };
      }
      
      throw new Error('Formato de respuesta inválido');
    } catch (error: any) {
      console.error('Error al obtener departamentos activos:', error);
      showErrorToast(error, 'obtener departamentos activos');
      throw new Error(error.response?.data?.message || 'Error al obtener departamentos activos');
    }
  },

  // Obtener estadísticas de departamentos
  getDepartamentosStats: async (): Promise<ServerResponse<DepartamentosStatsResponse>> => {
    const api = getApiClient();
    const response = await api.get('/api/catalog/departamentos/stats');
    return response.data;
  },

  // Alternar estado de departamento
  toggleDepartamentoStatus: async (id: string): Promise<ServerResponse<Departamento>> => {
    const api = getApiClient();
    const response = await api.patch(`/api/catalog/departamentos/${id}/toggle-status`);
    return response.data;
  },
};
