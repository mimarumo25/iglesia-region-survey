/**
 * Tipos para la gestión de Sistemas de Acueducto
 */

export interface SistemaAcueducto {
  id_sistema_acueducto: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface SistemaAcueductoCreate {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface SistemaAcueductoUpdate {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface SistemasAcueductoResponse {
  sistemasAcueducto: SistemaAcueducto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ServerResponse<T> {
  status: string;
  data: T;
  message?: string;
  timestamp?: string;
}
