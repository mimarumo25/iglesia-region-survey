import axios from 'axios';

// Interfaces para Departamentos
export interface Departamento {
  id_departamento: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DepartamentoFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface DepartamentoUpdateData extends DepartamentoFormData {}

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
  // Obtener todos los departamentos con paginación
  getDepartamentos: async (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_departamento', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ServerResponse<DepartamentosResponse>> => {
    const response = await axios.get('/api/catalog/departamentos', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  // Buscar departamentos
  searchDepartamentos: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServerResponse<DepartamentosResponse>> => {
    const response = await axios.get('/api/catalog/departamentos/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  // Obtener un departamento por ID
  getDepartamentoById: async (id: string): Promise<ServerResponse<Departamento>> => {
    const response = await axios.get(`/api/catalog/departamentos/${id}`);
    return response.data;
  },

  // Crear nuevo departamento
  createDepartamento: async (data: DepartamentoFormData): Promise<ServerResponse<Departamento>> => {
    const response = await axios.post('/api/catalog/departamentos', data);
    return response.data;
  },

  // Actualizar departamento
  updateDepartamento: async (id: string, data: DepartamentoUpdateData): Promise<ServerResponse<Departamento>> => {
    const response = await axios.put(`/api/catalog/departamentos/${id}`, data);
    return response.data;
  },

  // Eliminar departamento
  deleteDepartamento: async (id: string): Promise<ServerResponse<void>> => {
    const response = await axios.delete(`/api/catalog/departamentos/${id}`);
    return response.data;
  },

  // Obtener departamentos activos
  getActiveDepartamentos: async (): Promise<ServerResponse<Departamento[]>> => {
    const response = await axios.get('/api/catalog/departamentos/active');
    return response.data;
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

  // Búsqueda avanzada con filtros
  searchDepartamentosAdvanced: async (
    filters: {
      nombre?: string;
      activo?: boolean;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }
  ): Promise<ServerResponse<DepartamentosResponse>> => {
    const response = await axios.get('/api/catalog/departamentos/advanced-search', {
      params: filters
    });
    return response.data;
  },
};
