/**
 * Tipos para la gestión de Tallas
 */

export interface Talla {
  id_talla: string;
  tipo_prenda: string;
  talla: string;
  genero?: string;
  descripcion?: string;
  equivalencia_numerica?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TallaFormData {
  tipo_prenda: string;
  talla: string;
  genero?: string;
  descripcion?: string;
  equivalencia_numerica?: string;
  activo: boolean;
}

export interface TallaCreate {
  tipo_prenda: string;
  talla: string;
  genero?: string;
  descripcion?: string;
  equivalencia_numerica?: string;
  activo?: boolean;
}

export interface TallaUpdate {
  tipo_prenda?: string;
  talla?: string;
  genero?: string;
  descripcion?: string;
  equivalencia_numerica?: string;
  activo?: boolean;
}

// Respuesta de la API para tallas (estructura anidada)
export interface TallasApiResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    data: Talla[];
    total: number;
    message: string;
  };
  timestamp: string;
}

export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}

export interface TallasStatsResponse {
  total_tallas: number;
  tallas_activas: number;
  tallas_inactivas: number;
  ultimo_registro?: string;
}
