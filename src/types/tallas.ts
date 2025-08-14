/**
 * Tipos para la gestión de Tallas
 */

export interface Talla {
  id_talla: string;
  nombre: string;
  descripcion?: string | null;
  tipo?: string; // ej: "camisa", "pantalon", "calzado"
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TallaFormData {
  nombre: string;
  descripcion: string;
  tipo: string;
  activo: boolean;
}

export interface TallaCreate {
  nombre: string;
  descripcion?: string | null;
  tipo?: string;
  activo?: boolean;
}

export interface TallaUpdate {
  nombre?: string;
  descripcion?: string | null;
  tipo?: string;
  activo?: boolean;
}

export interface TallasResponse {
  tallas: Talla[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ServerResponse<T> {
  status: string;
  data: T;
  message?: string;
  timestamp?: string;
}
