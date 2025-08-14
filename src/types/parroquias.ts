export interface Parroquia {
  id_parroquia: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  id_municipio?: string;
  municipio?: {
    id_municipio: string;
    nombre_municipio: string;
    codigo_dane: string;
    departamento?: {
      id_departamento: string;
      nombre: string;
      codigo_dane: string;
    };
  };
  created_at?: string;
  updated_at?: string;
}

export interface ParroquiaCreate {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  id_municipio?: string;
}

export interface ParroquiaUpdate {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  id_municipio?: string;
}

// Respuestas de la API
export interface ParroquiasResponse {
  parroquias: Parroquia[];
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
  success: boolean;  // La API devuelve "success" boolean
  message: string;
  data: T;
  timestamp: string; // La API incluye timestamp
}

// Estructura real que devuelve la API para parroquias
export interface ApiParroquiasResponse {
  parroquias: Parroquia[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ParroquiaFormData {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  id_municipio: string;
}

export interface ParroquiaPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filtros de búsqueda
export interface ParroquiaFilters {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  id_municipio?: string;
}
