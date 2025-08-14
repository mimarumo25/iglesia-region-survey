// Interfaces para Profesiones
export interface Profesion {
  id_profesion: string;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfesionFormData {
  nombre: string;
  descripcion?: string;
}

export interface ProfesionUpdateData extends ProfesionFormData {}

export interface ProfesionesResponse {
  profesiones: Profesion[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Respuesta real de la API (diferente estructura)
export interface ProfesionesApiResponse {
  profesiones: Profesion[];
  total: number;
}

export interface ProfesionesStatsResponse {
  total_profesiones: number;
  profesiones_activas: number;
  profesiones_inactivas: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor
export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}
