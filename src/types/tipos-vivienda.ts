// Tipos para Tipos de Vivienda
export interface TipoVivienda {
  id_tipo_vivienda: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TipoViviendaCreate {
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface TipoViviendaUpdate {
  nombre: string;
  descripcion: string;
  activo: boolean;
}

// Respuestas de la API
export interface TiposViviendaResponse {
  tiposVivienda: TipoVivienda[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Respuesta del servidor (formato real de la API)
export interface ServerResponse<T> {
  status: string;  // Cambio de "success" a "status"
  message: string;
  data: T;
}

// Estructura real que devuelve la API para tipos de vivienda
export interface ApiTiposViviendaResponse {
  tipos: TipoVivienda[];  // La API devuelve "tipos", no "tiposVivienda"
  total: number;          // La API devuelve "total", no un objeto pagination completo
}

// Formularios
export interface TipoViviendaFormData {
  nombre: string;
  descripcion: string;
  activo: boolean;
}

// Paginación
export interface TipoViviendaPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filtros de búsqueda
export interface TipoViviendaFilters {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  activo?: boolean;
}
