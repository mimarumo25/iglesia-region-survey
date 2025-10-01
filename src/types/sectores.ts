// Interfaces para Sectores
export interface Sector {
  id_sector: string;
  nombre: string;
  id_municipio: string | number | null;
  created_at?: string;
  updated_at?: string;
  /**
   * Nombre del municipio resuelto desde el catálogo general.
   * No proviene del backend de sectores; se calcula en el frontend.
   */
  municipioNombre?: string | null;
}

export interface SectorFormData {
  nombre: string;
  id_municipio: number;
}

export interface SectorUpdateData extends SectorFormData {}

// Interface para municipios disponibles
export interface MunicipioDisponible {
  id_municipio: number;
  nombre_municipio: string;
  codigo_dane?: string;
  departamento?: {
    id_departamento: string;
    nombre: string;
  };
}

// Respuesta del endpoint de municipios disponibles
export interface MunicipiosDisponiblesApiResponse {
  status: string;
  data: MunicipioDisponible[];
  total: number;
  message: string;
}

export interface MunicipiosDisponiblesResponse {
  success: boolean;
  message: string;
  data: MunicipiosDisponiblesApiResponse;
  timestamp: string;
}

// Respuesta interna de la API (el data.data)
export interface ApiSectoresResponse {
  status: string;
  data: Sector[];
  total: number;
  message: string;
}

// Respuesta completa del servidor
export interface SectoresResponse {
  success: boolean;
  message: string;
  data: ApiSectoresResponse;
  timestamp: string;
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
