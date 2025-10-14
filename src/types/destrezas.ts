// Interfaces para Destrezas

export interface Destreza {
  id_destreza: string;
  nombre: string;
  descripcion?: string;
  categoria?: string; // Manual, Técnica, Artística, etc.
  created_at?: string;
  updated_at?: string;
}

export interface DestrezaFormData {
  nombre: string;
  descripcion?: string;
  categoria?: string;
}

export interface DestrezaUpdateData extends DestrezaFormData {}

export interface DestrezasResponse {
  destrezas: Destreza[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Respuesta real de la API (estructura estándar del backend)
export interface DestrezasApiResponse {
  status: string;
  data: Destreza[];
  total: number;
  message: string;
}

export interface DestrezasStatsResponse {
  total_destrezas: number;
  destrezas_activas: number;
  destrezas_inactivas: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor
export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}

// Categorías de destreza disponibles
export const CATEGORIAS_DESTREZA = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Técnica', label: 'Técnica' },
  { value: 'Artística', label: 'Artística' },
  { value: 'Artesanal', label: 'Artesanal' },
  { value: 'Digital', label: 'Digital' },
  { value: 'Otra', label: 'Otra' },
] as const;

export type CategoriaDestreza = typeof CATEGORIAS_DESTREZA[number]['value'];
