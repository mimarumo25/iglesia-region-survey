// Interfaces para Estudios
export interface Estudio {
  id_estudio: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EstudioFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface EstudioUpdateData extends EstudioFormData {}

export interface EstudiosResponse {
  estudios: Estudio[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface EstudiosStatsResponse {
  total_estudios: number;
  estudios_activos: number;
  estudios_inactivos: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor
export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}
