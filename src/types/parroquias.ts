export interface Parroquia {
  [x: string]: string;
  id_parroquia: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  id_municipio?: string;
  descripcion?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  municipio?: {
    id_municipio: string;
    nombre_municipio: string;
    codigo_dane: string;
    id_departamento: string;
    departamento?: {
      id_departamento: string;
      nombre: string;
      codigo_dane: string;
    };
  };
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
  status: string;  // La API devuelve "success" string
  message: string;
  data: T;
  total: number; // La API incluye total
}

// Estructura real que devuelve la API para parroquias (según la documentación)
export interface ApiParroquiasResponse {
  status: string;
  data: Parroquia[];
  total: number;
  message: string;
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
