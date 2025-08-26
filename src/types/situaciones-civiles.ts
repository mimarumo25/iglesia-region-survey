// Interfaces para Situaciones Civiles
export interface SituacionCivil {
  id: number; // La API devuelve id como número
  nombre: string;
  descripcion?: string;
  codigo?: string;
  orden?: number;
  activo: boolean;
  createdAt?: string; // La API usa camelCase
  updatedAt?: string; // La API usa camelCase
}

export interface SituacionCivilFormData {
  nombre: string;
  descripcion?: string;
  codigo?: string;
  orden?: number;
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

// Estructura real que devuelve la API para situaciones civiles
export interface ApiSituacionesCivilesResponse {
  data: SituacionCivil[];  // La API devuelve "data" directamente
  total?: number;          // La API podría devolver "total" 
}

export interface SituacionesCivilesStatsResponse {
  total_situaciones_civiles: number;
  situaciones_civiles_activas: number;
  situaciones_civiles_inactivas: number;
  ultimo_registro?: string;
}

// Tipo para el wrapper de respuesta del servidor
export interface ServerResponse<T> {
  status: string;  // La API devuelve "status": "success"
  message: string;
  data: T;
}
