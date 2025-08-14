// Interfaces para Sectores
export interface Sector {
  id_sector: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SectorFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface SectorUpdateData extends SectorFormData {}

export interface SectoresResponse {
  sectores: Sector[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SectoresStatsResponse {
  total_sectores: number;
  sectores_activos: number;
  sectores_inactivos: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor
export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}
