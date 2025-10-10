/**
 * Tipos de datos para estadísticas de encuestas
 */

/**
 * Respuesta de estadísticas generales de encuestas
 */
export interface EstadisticasEncuestaResponse {
  status: "success" | "error";
  message: string;
  data: EstadisticasEncuestaData;
}

/**
 * Datos de estadísticas de encuestas
 */
export interface EstadisticasEncuestaData {
  /** Total de encuestas realizadas */
  total_encuestas: string;
  
  /** Total de familias registradas */
  total_familias: string;
  
  /** Familias con encuestas completadas */
  familias_completadas: string;
  
  /** Total de personas registradas */
  total_personas: string;
  
  /** Total de difuntos registrados */
  total_difuntos: string;
  
  /** Promedio de tamaño de familia */
  promedio_tamaño_familia: string;
  
  /** Número de municipios cubiertos */
  municipios_cubiertos: string;
  
  /** Fecha de la última encuesta realizada (formato: YYYY-MM-DD) */
  ultima_encuesta_fecha: string;
}

/**
 * Estadísticas procesadas para el dashboard (números convertidos)
 */
export interface EstadisticasDashboard {
  /** Total de encuestas realizadas */
  totalEncuestas: number;
  
  /** Total de familias registradas */
  totalFamilias: number;
  
  /** Familias con encuestas completadas */
  familiasCompletadas: number;
  
  /** Familias pendientes (total - completadas) */
  familiasPendientes: number;
  
  /** Total de personas registradas */
  totalPersonas: number;
  
  /** Total de difuntos registrados */
  totalDifuntos: number;
  
  /** Promedio de tamaño de familia */
  promedioTamañoFamilia: number;
  
  /** Número de municipios cubiertos */
  municipiosCubiertos: number;
  
  /** Fecha de la última encuesta realizada */
  ultimaEncuestaFecha: string;
}
