/**
 * Tipos para gestión de Corregimientos
 */

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

export interface CorregimientoCreate {
  nombre: string;
  id_municipio?: number;
  id_municipio_municipios?: number;
}

export interface CorregimientoUpdate {
  nombre: string;
  id_municipio?: number;
  id_municipio_municipios?: number;
}

// Respuestas de la API
export interface CorregimientosResponse {
  status: string;
  message: string;
  data: Corregimiento[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  total?: number;
}

export interface CorregimientoPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

// Estructura para respuestas paginadas
export interface ApiCorregimientosResponse {
  status: string;
  data: Corregimiento[];
  total: number;
  message: string;
  pagination: CorregimientoPagination;
}

export interface CorregimientoFormData {
  nombre: string;
  id_municipio: string;
}

// Filtros de búsqueda
export interface CorregimientoFilters {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  id_municipio?: string;
}
