// Tipos para el catálogo de Liderazgo

export interface TipoLiderazgo {
  id_tipo_liderazgo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TipoLiderazgoCreate {
  nombre: string;
  descripcion: string;
}

export interface TipoLiderazgoUpdate {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

// Forma real de la respuesta de la API: { success, data: { status, data: [...], total, page, limit, totalPages } }
export interface LiderazgoInnerResponse {
  status: 'success';
  data: TipoLiderazgo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message: string;
}

export interface LiderazgoResponse {
  success: boolean;
  message: string;
  data: LiderazgoInnerResponse;
  timestamp: string;
}

export interface LiderazgoSelectItem {
  id_tipo_liderazgo: string;
  nombre: string;
}

export interface LiderazgoSelectResponse {
  status: 'success';
  data: LiderazgoSelectItem[];
  message: string;
}

export interface LiderazgoCreateResponse {
  status: 'success';
  data: TipoLiderazgo;
  message: string;
}

export interface LiderazgoUpdateResponse {
  status: 'success';
  data: TipoLiderazgo;
  message: string;
}

export interface LiderazgoDeleteResponse {
  status: 'success';
  message: string;
}

export interface LiderazgoStatsResponse {
  status: 'success';
  data: {
    total: number;
    activos: number;
    inactivos: number;
  };
  message: string;
}

// Tipos para asignación a personas
export interface PersonaLiderazgo {
  idPersona: number;
  idTipoLiderazgo: string;
  tipoLiderazgo: TipoLiderazgo;
}

export interface PersonaLiderazgoResponse {
  status: 'success';
  data: PersonaLiderazgo[];
  message: string;
}

// Tipos de request para formularios
export type CreateTipoLiderazgoRequest = TipoLiderazgoCreate;
export type UpdateTipoLiderazgoRequest = TipoLiderazgoUpdate;
