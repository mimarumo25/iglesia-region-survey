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

export interface DepartamentosStatsResponse {
  total_departamentos: number;
  departamentos_activos: number;
  departamentos_inactivos: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor (formato anterior)
export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}
