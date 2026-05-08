/**
 * Tipos TypeScript para el módulo de Personas Consolidado
 * Basado en la documentación de Swagger API
 */

/**
 * Objeto de ubicación geográfica anidado
 */
export interface UbicacionItem {
  id: number;
  nombre: string;
}

/**
 * Interfaz para una persona consolidada
 * ✅ ACTUALIZADA con estructura anidada que retorna la API v2
 */
export interface PersonaConsolidada {
  // Identificación y datos básicos
  nombres: string;
  identificacion: string;
  tipo_identificacion: string;
  fecha_nacimiento: string;
  sexo: string;

  // Contacto
  telefono: string;
  correo_electronico: string;
  direccion: string;

  // Parentesco y estado personal
  parentesco: string;
  estado_civil: string;
  profesion: string | null;
  nivel_educativo: string;
  comunidad_cultural: string;

  // Tallas (objeto anidado)
  tallas: {
    camisa: string;
    pantalon: string;
    zapato: string;
  };

  // Arrays de textos
  liderazgo: string[];
  necesidad_enfermo: string[];
  destrezas: string[];

  // Celebraciones
  celebraciones: Array<{
    motivo: string;
    dia: number;
    mes: number;
  }>;

  // Información familiar (objeto anidado)
  familia: {
    apellido_familiar: string;
    sustento_familia: string | null;
    observaciones_encuestador: string | null;
    autorizacion_datos: boolean;
    tipo_vivienda: string;
    disposicion_basura: UbicacionItem[];
    sistema_acueducto: UbicacionItem | null;
    aguas_residuales: UbicacionItem[];
  };

  // Ubicación geográfica (objeto anidado)
  ubicacion: {
    municipio: UbicacionItem | null;
    parroquia: UbicacionItem | null;
    sector: UbicacionItem | null;
    vereda: UbicacionItem | null;
    corregimiento: UbicacionItem | null;
    centro_poblado: UbicacionItem | null;
  };
}

/**
 * Respuesta paginada de personas
 */
export interface PersonasResponse {
  total: number;
  page: number;
  limit: number;
  data: PersonaConsolidada[];
}

/**
 * Filtros para consulta geográfica
 */
export interface FiltrosGeograficos {
  id_municipio?: number;
  id_parroquia?: number;
  id_sector?: number;
  id_vereda?: number;
  id_corregimiento?: number;
  id_centro_poblado?: number;
  page?: number;
  limit?: number;
  format?: 'json' | 'excel';
}

/**
 * Filtros para consulta por familia
 */
export interface FiltrosFamilia {
  apellido_familiar?: string;
  id_tipo_vivienda?: number;
  id_parentesco?: number;
  id_municipio?: number;
  id_parroquia?: number;
  id_sector?: number;
  id_vereda?: number;
  id_corregimiento?: number;
  id_centro_poblado?: number;
  page?: number;
  limit?: number;
  format?: 'json' | 'excel';
}

/**
 * Filtros para consulta por datos personales
 * ⚠️ CORREGIDO según Swagger API - NO incluye nombres, apellidos, documento, sexo
 */
export interface FiltrosPersonales {
  id_estado_civil?: number;
  id_profesion?: number;
  id_nivel_educativo?: number; // ⚠️ CORREGIDO: era "id_nivel_estudios"
  id_comunidad_cultural?: number;
  liderazgo?: boolean | string; // ⚠️ Acepta 'all', 'true', 'false', o boolean para UI
  id_destreza?: number; // ⚠️ AGREGADO: faltaba en implementación original
  id_municipio?: number;
  id_parroquia?: number;
  id_sector?: number;
  id_vereda?: number;
  id_corregimiento?: number;
  id_centro_poblado?: number;
  page?: number;
  limit?: number;
  format?: 'json' | 'excel';
}

/**
 * Filtros para consulta por tallas
 * ⚠️ CORREGIDO según Swagger API - Usa valores STRING directos, NO IDs
 * ⚠️ ACTUALIZADO - Agregados filtros de sexo y rango de edad
 */
export interface FiltrosTallas {
  talla_camisa?: string; // ⚠️ CORREGIDO: era "id_talla_camisa" (number), ahora es string ("M", "L", etc.)
  talla_pantalon?: string; // ⚠️ CORREGIDO: era "id_talla_pantalon" (number), ahora es string ("32", "34", etc.)
  talla_zapato?: string; // ⚠️ CORREGIDO: era "id_talla_zapato" (number), ahora es string ("42", "43", etc.)
  id_sexo?: number; // ⚠️ NUEVO: ID del sexo (para filtrar por género)
  sexo?: string; // ⚠️ NUEVO: Nombre del sexo (ej: "Masculino", "Femenino")
  edad_min?: number; // ⚠️ NUEVO: Edad mínima para filtrar
  edad_max?: number; // ⚠️ NUEVO: Edad máxima para filtrar
  id_municipio?: number;
  id_parroquia?: number;
  id_sector?: number;
  id_vereda?: number;
  id_corregimiento?: number;
  id_centro_poblado?: number;
  page?: number;
  limit?: number;
  format?: 'json' | 'excel';
}

/**
 * Filtros para consulta por edad
 * ⚠️ REVISADO - Solo edad_min y edad_max, sin id_sexo
 */
export interface FiltrosEdad {
  edad_min?: number;
  edad_max?: number;
  id_municipio?: number;
  id_parroquia?: number;
  id_sector?: number;
  id_vereda?: number;
  id_corregimiento?: number;
  id_centro_poblado?: number;
  page?: number;
  limit?: number;
  format?: 'json' | 'excel';
}

type GeoKeys = 'id_municipio' | 'id_parroquia' | 'id_sector' | 'id_vereda' | 'id_corregimiento' | 'id_centro_poblado';

/**
 * Filtros para reporte general (combina todos los filtros)
 */
export interface FiltrosReporteGeneral extends
  FiltrosGeograficos,
  Omit<FiltrosFamilia, 'page' | 'limit' | 'format' | GeoKeys>,
  Omit<FiltrosPersonales, 'page' | 'limit' | 'format' | GeoKeys>,
  Omit<FiltrosTallas, 'page' | 'limit' | 'format' | GeoKeys>,
  Omit<FiltrosEdad, 'page' | 'limit' | 'format' | GeoKeys> {
  fecha_registro_desde?: string;
  fecha_registro_hasta?: string;
}
