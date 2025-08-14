// Tipos para Disposición de Basura

export interface DisposicionBasura {
  id_tipo_disposicion_basura: string;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export interface DisposicionBasuraCreate {
  nombre: string;
  descripcion: string;
}

export interface DisposicionBasuraUpdate {
  nombre?: string;
  descripcion?: string;
}

export interface DisposicionBasuraPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DisposicionBasuraFilters {
  search?: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export interface DisposicionBasuraResponse {
  status: 'success';
  message: string;
  data: {
    tipos: DisposicionBasura[];
    pagination: DisposicionBasuraPagination;
  };
}

export interface DisposicionBasuraCreateResponse {
  status: 'success';
  message: string;
  data: DisposicionBasura;
}

export interface DisposicionBasuraUpdateResponse {
  status: 'success';
  message: string;
  data: DisposicionBasura;
}

export interface DisposicionBasuraDeleteResponse {
  status: 'success';
  message: string;
}

// Tipos de request para formularios
export type CreateDisposicionBasuraRequest = DisposicionBasuraCreate;
export type UpdateDisposicionBasuraRequest = DisposicionBasuraUpdate;
