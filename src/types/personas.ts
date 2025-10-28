/**
 * Tipos TypeScript para el módulo de Personas Consolidado
 * Basado en la documentación de Swagger API
 */

/**
 * Interfaz para una persona consolidada
 * ✅ ACTUALIZADA con todos los campos que retorna la API
 */
export interface PersonaConsolidada {
  // Identificación
  id_personas: string;
  nombre_completo: string;
  documento: string;
  tipo_identificacion: string;
  
  // Datos Personales
  edad: string;
  fecha_nacimiento: string;
  sexo: string;
  
  // Contacto
  telefono: string;
  correo_electronico: string;
  direccion_personal: string; // ⚠️ AGREGADO
  
  // Ubicación Geográfica
  municipio: string;
  parroquia: string;
  sector: string;
  vereda: string;
  
  // Información Familiar
  direccion_familia: string; // ⚠️ AGREGADO
  apellido_familiar: string;
  parentesco: string;
  telefono_familia: string; // ⚠️ AGREGADO
  fecha_registro: string;
  
  // Vivienda
  tipo_vivienda: string;
  
  // Servicios Sanitarios (Booleanos)
  pozo_septico: boolean; // ⚠️ AGREGADO
  letrina: boolean; // ⚠️ AGREGADO
  campo_abierto: boolean; // ⚠️ AGREGADO
  
  // Manejo de Basura (Booleanos)
  basura_recolector: boolean; // ⚠️ AGREGADO
  basura_quemada: boolean; // ⚠️ AGREGADO
  basura_enterrada: boolean; // ⚠️ AGREGADO
  basura_recicla: boolean; // ⚠️ AGREGADO
  basura_aire_libre: boolean; // ⚠️ AGREGADO
  
  // Datos Socioeconómicos
  estado_civil: string;
  profesion: string;
  estudios: string;
  comunidad_cultural: string;
  liderazgo: string;
  
  // Tallas
  talla_camisa: string;
  talla_pantalon: string;
  talla_zapato: string;
  
  // Salud
  necesidad_enfermo: string; // ⚠️ AGREGADO
  
  // Celebraciones
  motivo_celebrar: string; // ⚠️ AGREGADO
  dia_celebrar: number; // ⚠️ AGREGADO
  mes_celebrar: number; // ⚠️ AGREGADO
  
  // Destrezas (Array)
  destrezas: string[];
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
  page?: number;
  limit?: number;
  format?: 'json' | 'excel';
}

/**
 * Filtros para reporte general (combina todos los filtros)
 */
export interface FiltrosReporteGeneral extends
  FiltrosGeograficos,
  Omit<FiltrosFamilia, 'page' | 'limit' | 'format'>,
  Omit<FiltrosPersonales, 'page' | 'limit' | 'format'>,
  Omit<FiltrosTallas, 'page' | 'limit' | 'format'>,
  Omit<FiltrosEdad, 'page' | 'limit' | 'format'> {}
