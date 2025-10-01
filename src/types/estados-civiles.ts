// Tipos para Estados Civiles (Situaciones Civiles)

export interface EstadoCivil {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
}

export interface EstadoCivilCreate {
  nombre: string;
  descripcion: string;
}

export interface EstadoCivilUpdate {
  nombre?: string;
  descripcion?: string;
}

export interface EstadoCivilPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EstadoCivilFilters {
  search: string;
  includeInactive: boolean;
  orderBy: string;
  orderDirection: 'ASC' | 'DESC';
}

export interface EstadoCivilResponse {
  status: 'success';
  data: EstadoCivil[];
  pagination: EstadoCivilPagination;
  filters: EstadoCivilFilters;
  total: number;
  message: string;
}

export interface EstadoCivilCreateResponse {
  status: 'success';
  data: EstadoCivil;
  message: string;
}

export interface EstadoCivilUpdateResponse {
  status: 'success';
  data: EstadoCivil;
  message: string;
}

export interface EstadoCivilDeleteResponse {
  status: 'success';
  message: string;
}

// Tipos de request para formularios
export type CreateEstadoCivilRequest = EstadoCivilCreate;
export type UpdateEstadoCivilRequest = EstadoCivilUpdate;
