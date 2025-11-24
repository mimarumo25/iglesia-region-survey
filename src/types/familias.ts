/**
 * 📋 Tipos TypeScript para el módulo de Familias Consolidado
 * Sistema MIA - Gestión Integral de Iglesias
 * 
 * @module types/familias
 * @version 1.0.0
 */

/**
 * Celebración especial de un miembro
 */
export interface CelebracionMiembro {
  id_persona: string;
  id: string;
  motivo: string;
  dia: number;
  mes: number;
  created_at: string;
  updated_at: string;
  nombre_completo: string;
}

/**
 * Enfermedad de un miembro
 */
export interface EnfermedadMiembro {
  id_persona: string;
  id: string;
  nombre: string;
  nombre_completo: string;
}

/**
 * Miembro individual de una familia
 */
export interface MiembroFamiliaConsolidado {
  tipo_identificacio: string;
  numero_identificacion: string;
  nombre_completo: string;
  telefono_personal: string;
  email_personal: string;
  fecha_nacimiento: string;
  edad: number;
  sexo: string;
  parentesco: string;
  situacion_civil: string;
  estudios: string;
  profesion: string;
  comunidad_cultural: string;
  enfermedades: string;
  liderazgo: string;
  destrezas: string;
  necesidades_enfermo: string;
  comunion_casa: boolean;
  tallas: {
    id_persona?: string;
    nombre_completo?: string;
    camisa_blusa: string;
    pantalon: string;
    calzado: string;
  };
  celebracion?: {
    motivo: string;
    dia: string;
    mes: string;
  };
  todas_las_celebraciones: CelebracionMiembro[];
  todas_las_enfermedades: EnfermedadMiembro[];
}

/**
 * Difunto registrado en una familia
 */
export interface DifuntoFamilia {
  nombre_difunto: string;
  fecha_fallecimiento: string;
  sexo: string;
  parentesco: string;
  causa_fallecimiento: string;
}

/**
 * Familia consolidada completa con todos sus datos
 */
export interface FamiliaConsolidada {
  id_familia: string;
  codigo_familia: string;
  apellido_familiar: string;
  direccion_familia: string;
  telefono: string;
  parroquia_nombre: string;
  municipio_nombre: string;
  departamento_nombre: string;
  sector_nombre: string;
  vereda_nombre: string;
  corregimiento_nombre: string;
  centro_poblado_nombre: string;
  tipo_vivienda: string;
  dispocision_basura: string;
  tipos_agua_residuales: string;
  sistema_acueducto: string;
  miembros_familia: MiembroFamiliaConsolidado[];
  difuntos_familia: DifuntoFamilia[];
}

/**
 * Filtros para consultar familias consolidadas
 */
export interface FiltrosFamiliasConsolidado {
  id_parroquia?: number | string;
  id_municipio?: number | string;
  id_sector?: number | string;
  id_vereda?: number | string;
  id_corregimiento?: number | string;
  id_centro_poblado?: number | string;
  limite?: number;
  offset?: number;
}

/**
 * Respuesta de la API de familias consolidadas
 */
export interface FamiliasConsolidadoResponse {
  exito: boolean;
  mensaje: string;
  datos: FamiliaConsolidada[];
}
