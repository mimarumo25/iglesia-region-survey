import axios from 'axios';
import { buildApiUrl } from '@/config/api';

// Interfaces para Departamentos
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
      const response = await axios.get(`/api/catalog/departamentos/${id}`);
      
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
      throw new Error(error.response?.data?.message || 'Error al obtener departamento');
    }
  },

  // Crear nuevo departamento
  createDepartamento: async (data: DepartamentoFormData): Promise<ServerResponse<Departamento>> => {
    try {
      const response = await axios.post('/api/catalog/departamentos', data);
      
      // Manejar el nuevo formato de respuesta
      const apiResponse = response.data;
      
      // Verificar si es el nuevo formato
      if (apiResponse.status === 'success') {
        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: apiResponse.data // Puede ser null, lo manejamos
        };
      }
      
      // Formato anterior de éxito
      if (apiResponse.success) {
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
      
      throw new Error(errorMessage);
    }
  },

  // Actualizar departamento
  updateDepartamento: async (id: string, data: DepartamentoUpdateData): Promise<ServerResponse<Departamento>> => {
    try {
      const response = await axios.put(`/api/catalog/departamentos/${id}`, data);
      
      // Manejar el nuevo formato de respuesta
      const apiResponse = response.data;
      
      // Verificar si es el nuevo formato
      if (apiResponse.status === 'success' && apiResponse.data) {
        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: apiResponse.data
        };
      }
      
      // Formato anterior de éxito
      if (apiResponse.success && apiResponse.data) {
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
      
      throw new Error(errorMessage);
    }
  },

  // Eliminar departamento
  deleteDepartamento: async (id: string): Promise<ServerResponse<void>> => {
    try {
      const response = await axios.delete(`/api/catalog/departamentos/${id}`);
      
      // Manejar el nuevo formato de respuesta
      const apiResponse = response.data as ApiResponse<any>;
      
      if (apiResponse.status === 'success') {
        return {
          success: true,
          timestamp: new Date().toISOString()
        };
      }
      
      throw new Error('Formato de respuesta inválido');
    } catch (error: any) {
      console.error('Error al eliminar departamento:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar departamento');
    }
  },

  // Obtener departamentos activos
  getActiveDepartamentos: async (): Promise<ServerResponse<Departamento[]>> => {
    try {
      const response = await axios.get('/api/catalog/departamentos');
      
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
      throw new Error(error.response?.data?.message || 'Error al obtener departamentos activos');
    }
  },

  // Obtener estadísticas de departamentos
  getDepartamentosStats: async (): Promise<ServerResponse<DepartamentosStatsResponse>> => {
    const response = await axios.get('/api/catalog/departamentos/stats');
    return response.data;
  },

  // Alternar estado de departamento
  toggleDepartamentoStatus: async (id: string): Promise<ServerResponse<Departamento>> => {
    const response = await axios.patch(`/api/catalog/departamentos/${id}/toggle-status`);
    return response.data;
  },
};
