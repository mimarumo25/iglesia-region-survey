/**
 * Tipos TypeScript para el módulo de Difuntos
 * Sistema MIA - Gestión Integral de Iglesias
 */

export interface DifuntoAPI {
  fuente: "personas" | "difuntos_familia";
  id_difunto: string;
  nombre_completo: string;
  fecha_aniversario: string;
  observaciones: string;
  apellido_familiar: string;
  sector: string;
  telefono: string;
  direccion_familia: string;
  // IDs para relaciones
  id_municipio: string;
  id_sector: string;
  id_vereda: string;
  id_parroquia: string | null;
  // Nombres para mostrar
  nombre_municipio: string;
  nombre_sector: string;
  nombre_vereda: string;
  nombre_parroquia: string | null;
  parentesco_real: string;
  id_parentesco: string;
}

export interface DifuntosEstadisticas {
  difuntos_familia: number;
  personas_fallecidas: number;
  filtros_aplicados: Record<string, any>;
}

export interface DifuntosResponse {
  exito: boolean;
  mensaje: string;
  datos: DifuntoAPI[];
  total: number;
  total_sin_filtros: number;
  estadisticas: DifuntosEstadisticas;
}

export interface DifuntosFilters {
  id_parentesco?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_sector?: string;
  id_municipio?: string;
  id_parroquia?: string;
  id_vereda?: string;
  id_corregimiento?: string;
  id_centro_poblado?: string;
  pagina?: number;
  limite?: number;
}

export interface DifuntosTableProps {
  data: DifuntoAPI[];
  isLoading?: boolean;
  total?: number;
}

export interface DifuntosFormProps {
  onSearch: (filters: DifuntosFilters) => void;
  isLoading?: boolean;
  onClearFilters: () => void;
}