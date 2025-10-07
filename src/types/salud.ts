/**
 * 🏥 Tipos TypeScript para el módulo de Salud
 * Sistema MIA - Gestión de Personas con Condiciones de Salud
 */

/**
 * Interfaz para la información de salud de una persona
 */
export interface SaludInfo {
  enfermedades: string[];
  necesidades_medicas: string | null;
  tiene_enfermedades: boolean;
}

/**
 * Interfaz para una persona con condición de salud (según API real)
 */
export interface PersonaSalud {
  id: string;
  documento: string;
  nombre: string;
  edad: string;
  sexo: string;
  telefono: string;
  fecha_nacimiento: string;
  municipio: string;
  sector: string;
  vereda: string;
  parroquia: string;
  direccion: string;
  telefono_familia: string;
  salud: SaludInfo;
}

/**
 * Interfaz para la respuesta de la API de salud
 */
export interface SaludResponse {
  datos: PersonaSalud[];
  total: number;
  filtros_aplicados: Record<string, any>;
}

/**
 * Interfaz para los filtros de consulta de salud
 */
export interface SaludFiltros {
  id_enfermedad?: number;
  enfermedad?: string; // Nombre de la enfermedad (para exportación)
  edad_min?: number;
  edad_max?: number;
  id_sexo?: number;
  id_parroquia?: number;
  id_municipio?: number;
  id_sector?: number;
  limite?: number;
  offset?: number;
}

/**
 * Interfaz para estadísticas de salud
 */
export interface SaludEstadisticas {
  total_personas: number;
  por_enfermedad: {
    id_enfermedad: number;
    enfermedad: string;
    cantidad: number;
  }[];
  por_sexo: {
    id_sexo: number;
    sexo: string;
    cantidad: number;
  }[];
  por_rango_edad: {
    rango: string;
    cantidad: number;
  }[];
}
