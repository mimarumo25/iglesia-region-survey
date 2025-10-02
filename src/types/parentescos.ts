// Tipos para Parentescos
export interface Parentesco {
  id_parentesco: string;
  nombre: string;
  descripcion: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentescoCreate {
  nombre: string;
  descripcion: string;
}

export interface ParentescoUpdate {
  nombre: string;
  descripcion: string;
}

// Respuestas de la API
export interface ParentescosResponse {
  parentescos: Parentesco[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Respuesta del servidor (formato real)
export interface ServerResponse<T> {
  status: string;
  message: string;
  data: T;
}

// Formularios
export interface ParentescoFormData {
  nombre: string;
  descripcion: string;
}

// Paginación
export interface ParentescoPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filtros de búsqueda
export interface ParentescoFilters {
  searchTerm?: string;
  limit?: number;
}
