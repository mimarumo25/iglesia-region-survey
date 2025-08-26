// Interfaces para Estudios - Alineadas con la respuesta real de la API
export interface Estudio {
  id: string;
  nivel: string;
  descripcion?: string;
  ordenNivel: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface EstudioFormData {
  nivel: string;
  descripcion?: string;
  ordenNivel?: number;
  activo: boolean;
}

export interface EstudioUpdateData extends EstudioFormData {}

export interface EstudiosResponse {
  estudios: Estudio[];
  total: number;
  message: string;
}

// Estructura de respuesta real de la API
export interface ApiEstudiosResponse {
  success: boolean;
  message: {
    status: string;
    data: Estudio[];
    total: number;
    message: string;
  };
  data: string;
  timestamp: string;
  meta: {
    hasSearch: boolean;
  };
}

export interface EstudiosStatsResponse {
  total_estudios: number;
  estudios_activos: number;
  estudios_inactivos: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor - simplificado
export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}
