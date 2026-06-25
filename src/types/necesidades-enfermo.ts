export interface NecesidadEnfermo {
  id_tipo_necesidad_enfermo: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NecesidadEnfermoOption {
  id: number;
  nombre: string;
}

export interface NecesidadEnfermoCreate {
  nombre: string;
  descripcion?: string;
}

export interface NecesidadEnfermoUpdate extends Partial<NecesidadEnfermoCreate> {
  activo?: boolean;
}

export interface NecesidadesEnfermoParams {
  search?: string;
  activo?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface NecesidadesEnfermoResponse {
  data: NecesidadEnfermo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
