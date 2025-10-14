// Interfaces para Habilidades

export interface Habilidad {
  id_habilidad: string;
  nombre: string;
  descripcion?: string;
  nivel?: string; // Básico, Intermedio, Avanzado, Experto
  created_at?: string;
  updated_at?: string;
}

export interface HabilidadFormData {
  nombre: string;
  descripcion?: string;
  nivel?: string;
}

export interface HabilidadUpdateData extends HabilidadFormData {}

export interface HabilidadesResponse {
  habilidades: Habilidad[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Respuesta real de la API (estructura estándar del backend)
export interface HabilidadesApiResponse {
  status: string;
  data: Habilidad[];
  total: number;
  message: string;
}

export interface HabilidadesStatsResponse {
  total_habilidades: number;
  habilidades_activas: number;
  habilidades_inactivas: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor
export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}

// Niveles de habilidad disponibles
export const NIVELES_HABILIDAD = [
  { value: 'Básico', label: 'Básico' },
  { value: 'Intermedio', label: 'Intermedio' },
  { value: 'Avanzado', label: 'Avanzado' },
  { value: 'Experto', label: 'Experto' },
] as const;

export type NivelHabilidad = typeof NIVELES_HABILIDAD[number]['value'];
