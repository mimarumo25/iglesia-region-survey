// Tipos para Aguas Residuales
export interface AguaResidual {
  id_tipo_aguas_residuales: string;
  nombre: string;
  descripcion: string;
  created_at?: string;
  updated_at?: string;
}

export interface AguaResidualCreate {
  nombre: string;
  descripcion: string;
}

export interface AguaResidualUpdate {
  nombre: string;
  descripcion: string;
}

// Respuestas de la API
export interface AguasResidualesResponse {
  tiposAguasResiduales: AguaResidual[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Respuesta del servidor (formato real)
export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Formularios
export interface AguaResidualFormData {
  nombre: string;
  descripcion: string;
}

// Paginación
export interface AguaResidualPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filtros de búsqueda
export interface AguaResidualFilters {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
