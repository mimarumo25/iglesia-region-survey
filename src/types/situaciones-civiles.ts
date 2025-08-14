// Interfaces para Situaciones Civiles
export interface SituacionCivil {
  id_situacion_civil: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SituacionCivilFormData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface SituacionCivilUpdateData extends SituacionCivilFormData {}

export interface SituacionesCivilesResponse {
  situaciones_civiles: SituacionCivil[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SituacionesCivilesStatsResponse {
  total_situaciones_civiles: number;
  situaciones_civiles_activas: number;
  situaciones_civiles_inactivas: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor
export interface ServerResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}
