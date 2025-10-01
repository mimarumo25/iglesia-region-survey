/**
 * Tipos TypeScript para el API de familias consolidadas
 * Basado en la respuesta del endpoint /api/familias
 */

/**
 * Miembro individual de una familia
 */
export interface MiembroFamilia {
  persona_id: number;
  nombre_completo: string;
  cedula: string;
  telefono: string;
  email: string;
  edad: number;
  salud: string | null;
  destrezas: string | null;
  tipo_miembro: string;
  es_difunto: boolean;
  es_menor: boolean;
  fecha_defuncion: string | null;
  causa_muerte: string | null;
  observaciones_difunto: string | null;
}

/**
 * Estructura de miembros agrupados por tipo
 */
export interface MiembrosFamilia {
  padres: MiembroFamilia[];
  madres: MiembroFamilia[];
  hijos_vivos: MiembroFamilia[];
  otros_miembros: MiembroFamilia[];
  difuntos: MiembroFamilia[];
}

/**
 * Ubicación geográfica de la familia
 */
export interface UbicacionFamilia {
  parroquia: string | null;
  municipio: string | null;
  departamento: string | null;
  sector: string | null;
  vereda: string | null;
}

/**
 * Estadísticas calculadas de la familia
 */
export interface EstadisticasFamilia {
  total_miembros: number;
  total_vivos: number;
  total_difuntos: number;
  total_menores: number;
  total_adultos: number;
  tiene_telefono: boolean;
  tiene_email: boolean;
}

/**
 * Información pastoral de la familia
 */
export interface ResumenPastoral {
  necesidades_salud: string[];
  destrezas_disponibles: string[];
  observaciones_generales: string;
}

/**
 * Familia consolidada completa
 */
export interface FamiliaConsolidada {
  familia_id: string;
  codigo_familia: string;
  apellido_familiar: string;
  ubicacion: UbicacionFamilia;
  miembros: MiembrosFamilia;
  estadisticas: EstadisticasFamilia;
  resumen_pastoral: ResumenPastoral;
}

/**
 * Estadísticas generales del conjunto de familias
 */
export interface EstadisticasGenerales {
  total_familias: number;
  total_personas: number;
  total_vivos: number;
  total_difuntos: number;
  total_menores: number;
  total_adultos: number;
  familias_con_telefono: number;
  familias_con_email: number;
}

/**
 * Filtros aplicados en la consulta
 */
export interface FiltrosAplicados {
  limite?: number;
  offset?: number;
  municipio?: string;
  parroquia?: string;
  departamento?: string;
  sector?: string;
  vereda?: string;
  apellido_familiar?: string;
}

/**
 * Estructura de metadatos de la respuesta
 */
export interface EstructuraRespuesta {
  descripcion: string;
  campos_principales: string[];
}

/**
 * Respuesta completa del endpoint /api/familias
 */
export interface FamiliasConsolidadasResponse {
  exito: boolean;
  mensaje: string;
  datos: FamiliaConsolidada[];
  total: number;
  estadisticas: EstadisticasGenerales;
  filtros_aplicados: FiltrosAplicados;
  tipo_datos: string;
  estructura: EstructuraRespuesta;
}

/**
 * Parámetros para la consulta de familias
 */
export interface FamiliasConsultaParams {
  limite?: number;
  offset?: number;
  municipio?: string;
  parroquia?: string;
  departamento?: string;
  sector?: string;
  vereda?: string;
  apellido_familiar?: string;
}

/**
 * Estado del hook useFamiliasConsolidadas
 */
export interface FamiliasConsolidadasState {
  familias: FamiliaConsolidada[];
  estadisticas: EstadisticasGenerales | null;
  filtros: FiltrosAplicados;
  isLoading: boolean;
  error: string | null;
  total: number;
}

/**
 * Tipos para la tabla de familias
 */
export interface FamiliaTableRow {
  familia_id: string;
  codigo_familia: string;
  apellido_familiar: string;
  ubicacion_completa: string;
  total_miembros: number;
  total_vivos: number;
  total_difuntos: number;
  total_menores: number;
  total_adultos: number;
  tiene_contacto: boolean;
  parroquia: string | null;
  municipio: string | null;
  departamento: string | null;
}