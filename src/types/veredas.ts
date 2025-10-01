// Tipos para Municipios
export interface Municipio {
  id_municipio: number | string; // API puede devolver string o number
  nombre_municipio?: string; // Nombre que viene de la API
  nombre?: string; // Alias para compatibilidad
  codigo_municipio?: string;
  codigo_dane?: string; // Campo adicional de la API
  id_departamento?: number | string;
  departamento?: {
    id_departamento: string;
    nombre: string;
    codigo_dane: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Tipos para Veredas
export interface Vereda {
  id_vereda: number | string; // API puede devolver string o number
  nombre: string;
  codigo_vereda?: string | null;
  id_municipio_municipios?: number | string; // Campo que viene de la API
  id_municipio?: number; // Campo procesado para compatibilidad
  municipio?: {
    id_municipio: number | string;
    nombre: string;
    codigo: string;
  }; // Para incluir datos del municipio en consultas
  created_at?: string;
  updated_at?: string;
}

export interface VeredaCreate {
  nombre: string;
  id_municipio: number;
}

export interface VeredaUpdate {
  nombre: string;
  id_municipio: number;
}

// Respuestas de la API
export interface MunicipiosResponse {
  data: Municipio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Respuesta del servidor (formato real)
export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface VeredasResponse {
  data: Vereda[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  message?: string;
}

// Respuesta completa de la API (estructura real)
export interface VeredasApiResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    data: Vereda[];
    total: number;
    message: string;
  };
  timestamp: string;
}

// Formularios
export interface VeredaFormData {
  nombre: string;
  id_municipio: number;
}

// Paginación
export interface VeredaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Filtros de búsqueda
export interface VeredaFilters {
  searchTerm?: string;
  id_municipio?: number;
}
