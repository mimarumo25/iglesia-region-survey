/**
 * Tipos TypeScript para el sistema de Consolidados
 * Sistema MIA - Gestion Integral de Iglesias
 */

export interface ConsolidadoBaseResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T[];
  total: number;
  total_sin_filtros: number;
}

export interface FiltrosBase {
  pagina?: number;
  limite?: number;
}

export interface Tallas {
  camisa_blusa: string;
  pantalon: string;
  calzado: string;
}

export interface MiembroFamilia {
  nombre_completo: string;
  edad: number;
  sexo: string;
  parentesco: string;
  tallas: Tallas;
}

export interface FamiliaConsolidada {
  id_familia: string;
  apellido_familiar: string;
  miembros_familia: MiembroFamilia[];
}
