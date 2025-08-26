// Interfaces para Comunidades Culturales
export interface ComunidadCultural {
  id_comunidad_cultural: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ComunidadCulturalFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface ComunidadCulturalUpdateData extends ComunidadCulturalFormData {}

export interface ComunidadesCulturalesResponse {
  comunidades_culturales: ComunidadCultural[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ComunidadesCulturalesStatsResponse {
  total_comunidades_culturales: number;
  comunidades_culturales_activas: number;
  comunidades_culturales_inactivas: number;
  ultimo_registro?: string;
}

// Tipo para la respuesta de la API real (estructura anidada)
export interface ApiComunidadesCulturalesData {
  status: string;
  data: ComunidadCultural[];
  total: number;
  message: string;
}

// Tipo para el wrapper de respuesta del servidor
export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
