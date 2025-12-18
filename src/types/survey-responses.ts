/**
 * 📋 Tipos TypeScript para Respuestas del API de Encuestas
 * Sistema MIA - Gestión Integral de Iglesias
 * 
 * Define las interfaces para las respuestas del endpoint GET /api/encuestas
 * con estructura mejorada que incluye corregimiento, centro_poblado y datos expandidos
 * 
 * @module types/survey-responses
 * @version 2.0.0
 */

/**
 * Elemento básico de configuración con ID y nombre
 * Usado para: municipio, parroquia, sector, vereda, corregimiento, etc.
 */
export interface LocationItem {
  id: string | number;
  nombre: string;
}

/**
 * Datos de ubicación geográfica completa
 * Incluye nuevos campos: corregimiento y centro_poblado
 */
export interface SurveyLocationData {
  municipio: LocationItem;
  parroquia: LocationItem;
  sector: LocationItem;
  vereda: LocationItem;
  corregimiento: LocationItem | null;
  centro_poblado: LocationItem | null;
}

/**
 * Información de identificación de una persona
 */
export interface PersonIdentification {
  numero: string;
  tipo: LocationItem;
}

/**
 * Tallas de ropa de una persona
 */
export interface PersonSize {
  camisa: string;
  pantalon: string;
  zapato: string;
}

/**
 * Registro de celebración de una persona
 * Incluye: cumpleaños, aniversarios, primeras comuniones, etc.
 */
export interface PersonCelebration {
  id_personas: string;
  id: number;
  motivo: string;
  dia: string;
  mes: string;
  created_at: string;
  updated_at: string;
}

/**
 * Habilidad o competencia de una persona
 * Incluye: nombre, descripción y nivel
 */
export interface PersonSkill {
  id: number;
  nombre: string;
  descripcion?: string;
  nivel?: "Básico" | "Intermedio" | "Avanzado" | string;
}

/**
 * Persona/miembro de familia de una encuesta
 * Estructura completa con todos sus atributos
 */
export interface SurveyPerson {
  id: string;
  nombre_completo: string;
  identificacion: PersonIdentification;
  telefono: string;
  email: string;
  fecha_nacimiento: string; // ISO 8601: YYYY-MM-DD
  direccion: string;
  estudios: LocationItem;
  edad: number;
  sexo: LocationItem;
  estado_civil: LocationItem;
  tallas: PersonSize;
  destrezas: LocationItem[];
  habilidades: PersonSkill[];
  en_que_eres_lider: string | null;
  profesion: LocationItem | null;
  parentesco: LocationItem;
  comunidad_cultural: LocationItem;
  celebraciones: PersonCelebration[];
  enfermedades: Array<{ id: number; nombre: string }>;
  solicitudComunionCasa?: boolean; // ✅ NUEVO
  necesidad_enfermo?: string; // ✅ NUEVO
  
  // Campos deprecated (mantener para compatibilidad)
  motivo_celebrar_deprecated?: string | null;
  dia_celebrar_deprecated?: number | null;
  mes_celebrar_deprecated?: number | null;
  necesidad_enfermo_deprecated?: string | null;
}

/**
 * Contenedor de miembros vivos de la familia
 * Incluye: total_miembros y array de personas
 */
export interface SurveyFamilyMembers {
  total_miembros: number;
  personas: SurveyPerson[];
}

/**
 * Registro de miembro fallecido
 */
export interface DeceasedMember {
  nombres: string;
  fechaFallecimiento: string; // ISO 8601: YYYY-MM-DD
  sexo: LocationItem;
  parentesco: LocationItem;
  causaFallecimiento: string;
}

/**
 * Metadata de control de la encuesta
 */
export interface SurveyMetadata {
  fecha_creacion: string; // ISO 8601: YYYY-MM-DD
  estado: "completed" | "in_progress" | "pending" | "draft";
  version: string;
}

/**
 * Respuesta completa de una encuesta individual
 * Estructura principal que contiene todos los datos de una familia
 */
export interface SurveyResponseData {
  // ========================================
  // 🆔 IDENTIFICADORES
  // ========================================
  id_encuesta: string;
  codigo_familia: string;
  
  // ========================================
  // 👨‍👩‍👧‍👦 INFORMACIÓN FAMILIAR BÁSICA
  // ========================================
  apellido_familiar: string;
  direccion_familia: string;
  telefono: string;
  tamaño_familia: number;
  
  // ========================================
  // 📊 ESTADO DE LA ENCUESTA
  // ========================================
  estado_encuesta: "completed" | "in_progress" | "pending" | "draft";
  numero_encuestas: number;
  fecha_ultima_encuesta: string; // ISO 8601: YYYY-MM-DD
  
  // ========================================
  // 📍 UBICACIÓN GEOGRÁFICA (MEJORADO)
  // ========================================
  sector: LocationItem;
  municipio: LocationItem;
  vereda: LocationItem;
  parroquia: LocationItem;
  corregimiento: LocationItem | null; // ✅ NUEVO
  centro_poblado: LocationItem | null; // ✅ NUEVO
  
  // ========================================
  // 🏠 INFORMACIÓN DE VIVIENDA
  // ========================================
  tipo_vivienda: LocationItem;
  basuras: LocationItem[];
  acueducto: LocationItem;
  aguas_residuales: LocationItem | null;
  comunion_en_casa: boolean;
  numero_contrato_epm: string | null;
  
  // ========================================
  // 📝 OBSERVACIONES Y OTROS (NUEVO)
  // ========================================
  observaciones?: {
    sustento_familia?: string;
    observaciones_encuestador?: string;
    autorizacion_datos?: boolean;
  };
  // Deprecated fields for backward compatibility
  sustento_familia?: string;
  observaciones_encuestador?: string;
  autorizacion_datos?: boolean;
  
  // ========================================
  // �👥 MIEMBROS (MEJORADO)
  // ========================================
  miembros_familia: SurveyFamilyMembers;
  deceasedMembers: DeceasedMember[];
  
  // ========================================
  // 📅 METADATA
  // ========================================
  metadatos: SurveyMetadata;
}

/**
 * Información de paginación de la respuesta
 */
export interface SurveysPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Respuesta completa del endpoint GET /api/encuestas
 * Incluye lista de encuestas con paginación
 */
export interface SurveysListResponse {
  status: "success" | "error";
  message: string;
  data: SurveyResponseData[];
  pagination: SurveysPaginationInfo;
}

/**
 * Tipo para parsear y almacenar una encuesta local
 * Útil para manejo de estado y persistencia
 */
export interface SurveyStorageData extends SurveyResponseData {
  // Campos adicionales para almacenamiento local
  syncedAt?: string;
  lastModified?: string;
  isDraft?: boolean;
}

/**
 * Filtros disponibles para consultar encuestas
 */
export interface SurveysQueryFilters {
  page?: number;
  limit?: number;
  estado?: SurveyResponseData["estado_encuesta"];
  municipio?: string | number;
  parroquia?: string | number;
  sector?: string | number;
  vereda?: string | number;
  corregimiento?: string | number;
  centro_poblado?: string | number;
  apellido_familiar?: string;
}

/**
 * Estado de carga de encuestas
 */
export interface SurveysLoadState {
  isLoading: boolean;
  error: string | null;
  data: SurveyResponseData[];
  pagination: SurveysPaginationInfo;
}

/**
 * Resumen de estadísticas de una encuesta
 * Útil para dashboards y reportes
 */
export interface SurveySummaryStats {
  id_encuesta: string;
  codigo_familia: string;
  apellido_familiar: string;
  total_miembros_vivos: number;
  total_miembros_fallecidos: number;
  total_edad_promedio: number;
  tiene_menores: boolean;
  tiene_adultos_mayores: boolean;
  ubicacion_completa: string;
  estado: SurveyResponseData["estado_encuesta"];
  fecha_ultima_actualizacion: string;
}
