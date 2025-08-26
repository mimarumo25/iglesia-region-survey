// Tipos para Sexos
export interface Sexo {
  id_sexo: string;
  nombre: string;
  codigo?: string; // Agregado según la API real
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SexoCreate {
  nombre: string;
  codigo?: string;
  descripcion?: string;
}

export interface SexoUpdate {
  nombre: string;
  codigo?: string;
  descripcion?: string;
}

// Respuesta del servidor (formato real de la API)
export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Estructura real que devuelve la API para sexos
export interface ApiSexosResponse {
  status: string;
  data: Sexo[];
  total: number;
  message: string;
}

// Respuestas de la API
export interface SexosResponse {
  success: boolean;
  message: string;
  data: ApiSexosResponse;
  timestamp: string;
}

// Formularios
export interface SexoFormData {
  nombre: string;
  codigo: string;
  descripcion: string;
}

// Paginación
export interface SexoPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filtros de búsqueda
export interface SexoFilters {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
