/**
 * Utilidad para transformar datos de encuesta desde SurveySessionData
 * al formato requerido por la API según documentación Swagger
 */

import { SurveySessionData, FamilyMember, DeceasedFamilyMember, ConfigurationItem, DynamicSelectionMap } from '@/types/survey';

/**
 * Tipo para el formato API de FamilyMember según documentación Swagger
 */
interface APIFamilyMember {
  nombres: string;
  numeroIdentificacion: string;
  tipoIdentificacion: {
    id: number | string;
    nombre: string;
  };
  fechaNacimiento: string; // Formato ISO date string
  sexo: {
    id: number | string;
    nombre: string;
  };
  telefono: string;
  situacionCivil: {
    id: number | string;
    nombre: string;
  };
  estudio: {
    id: number | string;
    nombre: string;
  };
  parentesco: {
    id: number | string;
    nombre: string;
  };
  comunidadCultural: {
    id: number | string;
    nombre: string;
  };
  talla_camisa: string;
  talla_pantalon: string;
  talla_zapato: string;
  // Campos adicionales que pueden estar presentes
  enQueEresLider?: string[];
  correo_electronico?: string;
  enfermedades?: Array<{ id: number; nombre: string }>;
  necesidadesEnfermo?: string[];
  solicitudComunionCasa?: boolean;
  profesionMotivoFechaCelebrar?: {
    profesion: {
      id: number | string;
      nombre: string;
    } | null;
    celebraciones: Array<{
      motivo: string;
      dia: string;
      mes: string;
    }>;
  };
  habilidades?: Array<{ id: number; nombre: string; nivel?: string }>;
  destrezas?: Array<{ id: number; nombre: string }>;
}

/**
 * Tipo para el formato API de DeceasedMember según documentación Swagger
 */
interface APIDeceasedMember {
  nombres: string;
  fechaFallecimiento: string; // Formato ISO date string
  sexo: {
    id: number | string;
    nombre: string;
  };
  parentesco: {
    id: string | number;
    nombre: string;
  };
  causaFallecimiento: string;
}

/**
 * Tipo para el formato completo esperado por la API
 */
export interface APIEncuestaFormat {
  informacionGeneral: {
    municipio: {
      id: number;
      nombre: string;
    };
    parroquia: {
      id: number;
      nombre: string;
    };
    sector: {
      id: number;
      nombre: string;
    };
    vereda: {
      id: number;
      nombre: string;
    };
    corregimiento: {
      id: number;
      nombre: string;
    } | null;
    centro_poblado: {
      id: number;
      nombre: string;
    } | null;
    fecha: string; // Formato ISO date string (sin tiempo)
    apellido_familiar: string;
    direccion: string;
    telefono: string;
    numero_contrato_epm: string;
  };
  vivienda: {
    tipo_vivienda: {
      id: number;
      nombre: string;
    };
    disposicion_basuras: DynamicSelectionMap;
  };
  servicios_agua: {
    sistema_acueducto: {
      id: number;
      nombre: string;
    };
    aguas_residuales: DynamicSelectionMap;
  };
  observaciones: {
    sustento_familia: string;
    observaciones_encuestador: string;
    autorizacion_datos: boolean;
  };
  familyMembers: APIFamilyMember[];
  deceasedMembers: APIDeceasedMember[];
  metadata: {
    timestamp: string;
    completed: boolean;
    currentStage: number;
  };
  estado_encuesta?: 'pending' | 'in_progress' | 'completed' | 'validated';
  version: string;
}

/**
 * Convierte ConfigurationItem a formato API asegurando que el ID sea numérico
 */
function transformConfigurationItem(item: ConfigurationItem | null): { id: number; nombre: string } | null {
  if (!item) return null;
  
  // Convertir ID a número si es string
  const id = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
  
  // Si el ID no es válido, no enviar datos inventados
  if (isNaN(id) || id <= 0) return null;

  return {
    id,
    nombre: item.nombre || ''
  };
}

/**
 * Convierte fecha de Date o string a formato ISO date (solo fecha, sin tiempo).
 * Retorna string vacío si no hay fecha — nunca envía la fecha de hoy como default.
 */
function transformDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  if (date instanceof Date) {
    if (isNaN(date.getTime())) return '';
    // Usar componentes locales para evitar desfase de zona horaria
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  
  // Si es string en formato ISO o similar, retornar solo la parte de fecha
  try {
    const parts = date.split('T')[0];
    // Validar que tenga formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(parts)) return parts;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    const y = parsedDate.getFullYear();
    const mo = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const d = String(parsedDate.getDate()).padStart(2, '0');
    return `${y}-${mo}-${d}`;
  } catch {
    return '';
  }
}

/**
 * Transforma FamilyMember del formato interno al formato API
 */
function transformFamilyMember(member: FamilyMember): APIFamilyMember {
  // Extraer profesión del objeto anidado
  const profesion = member.profesionMotivoFechaCelebrar?.profesion ? 
    transformConfigurationItem(member.profesionMotivoFechaCelebrar.profesion) : null;
  
  const celebraciones = Array.isArray(member.profesionMotivoFechaCelebrar?.celebraciones)
    ? member.profesionMotivoFechaCelebrar?.celebraciones ?? []
    : [];

  // Mapear celebraciones sin el campo 'id'
  const celebracionesMapeadas = celebraciones.map(c => ({
    motivo: c.motivo || '',
    dia: c.dia || '',
    mes: c.mes || ''
  }));

  return {
    nombres: member.nombres || '',
    numeroIdentificacion: member.numeroIdentificacion || '',
    tipoIdentificacion: transformConfigurationItem(member.tipoIdentificacion) ?? { id: 0, nombre: '' },
    fechaNacimiento: transformDate(member.fechaNacimiento),
    sexo: transformConfigurationItem(member.sexo) ?? { id: 0, nombre: '' },
    telefono: member.telefono || '',
    situacionCivil: transformConfigurationItem(member.situacionCivil) ?? { id: 0, nombre: '' },
    estudio: transformConfigurationItem(member.estudio) ?? { id: 0, nombre: '' },
    parentesco: transformConfigurationItem(member.parentesco) ?? { id: 0, nombre: '' },
    comunidadCultural: transformConfigurationItem(member.comunidadCultural) ?? { id: 0, nombre: '' },
    talla_camisa: member.talla_camisa || '',
    talla_pantalon: member.talla_pantalon || '',
    talla_zapato: member.talla_zapato || '',
    // ↑ Tallas vacías si el usuario no las ingresó — sin defaults inventados
    // Campos opcionales - mantener como arrays/objetos según schema
    enQueEresLider: Array.isArray(member.enQueEresLider) ? member.enQueEresLider : [],
    correo_electronico: member.correoElectronico || '',
    enfermedades: member.enfermedades || [],
    necesidadesEnfermo: Array.isArray(member.necesidadesEnfermo) ? member.necesidadesEnfermo : [],
    solicitudComunionCasa: member.solicitudComunionCasa || false,
    profesionMotivoFechaCelebrar: {
      profesion: profesion,
      celebraciones: celebracionesMapeadas
    },
    habilidades: member.habilidades || [],
    destrezas: member.destrezas || []
  };
}

/**
 * Transforma DeceasedFamilyMember del formato interno al formato API
 */
function transformDeceasedMember(member: DeceasedFamilyMember): APIDeceasedMember {
  return {
    nombres: member.nombres || '',
    fechaFallecimiento: transformDate(member.fechaFallecimiento),
    sexo: transformConfigurationItem(member.sexo) ?? { id: 0, nombre: '' },
    parentesco: transformConfigurationItem(member.parentesco) ?? { id: 0, nombre: '' },
    causaFallecimiento: member.causaFallecimiento || ''
  };
}

/**
 * Función principal para transformar SurveySessionData al formato API
 */
export function transformSurveyDataForAPI(data: SurveySessionData): APIEncuestaFormat {
  // Transformar información general — sin fallbacks inventados
  const informacionGeneral = {
    municipio: transformConfigurationItem(data.informacionGeneral.municipio) ?? { id: 0, nombre: '' },
    parroquia: transformConfigurationItem(data.informacionGeneral.parroquia) ?? { id: 0, nombre: '' },
    sector: transformConfigurationItem(data.informacionGeneral.sector) ?? { id: 0, nombre: '' },
    vereda: transformConfigurationItem(data.informacionGeneral.vereda) ?? { id: 0, nombre: '' },
    corregimiento: transformConfigurationItem(data.informacionGeneral.corregimiento),
    centro_poblado: transformConfigurationItem(data.informacionGeneral.centro_poblado),
    fecha: transformDate(data.informacionGeneral.fecha),
    apellido_familiar: data.informacionGeneral.apellido_familiar || '',
    direccion: data.informacionGeneral.direccion || '',
    telefono: data.informacionGeneral.telefono || '',
    numero_contrato_epm: data.informacionGeneral.numero_contrato_epm || ''
  };

  // Transformar vivienda — sin fallbacks inventados
  const vivienda = {
    tipo_vivienda: transformConfigurationItem(data.vivienda.tipo_vivienda) ?? { id: 0, nombre: '' },
    disposicion_basuras: data.vivienda.disposicion_basuras
  };

  // Transformar servicios de agua — sin fallbacks inventados
  const servicios_agua = {
    sistema_acueducto: transformConfigurationItem(data.servicios_agua.sistema_acueducto) ?? { id: 0, nombre: '' },
    aguas_residuales: data.servicios_agua.aguas_residuales,
  };

  // Transformar miembros de familia
  const familyMembers = data.familyMembers.map(transformFamilyMember);

  // Transformar miembros fallecidos
  const deceasedMembers = data.deceasedMembers.map(transformDeceasedMember);

  // Determinar estado_encuesta basado en metadata.completed
  const estado_encuesta = data.metadata?.completed ? 'completed' : 'in_progress';

  const transformedData: APIEncuestaFormat = {
    informacionGeneral,
    vivienda,
    servicios_agua,
    observaciones: data.observaciones,
    familyMembers,
    deceasedMembers,
    metadata: data.metadata,
    estado_encuesta, // ⭐ Agregar estado basado en metadata
    version: '2.0'
  };

  return transformedData;
}

/**
 * Valida que los datos transformados tengan la estructura correcta
 */
export function validateAPIFormat(data: APIEncuestaFormat): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar información general
  if (!data.informacionGeneral.municipio?.id) {
    errors.push('informacionGeneral.municipio.id es requerido');
  }
  if (!data.informacionGeneral.apellido_familiar) {
    errors.push('informacionGeneral.apellido_familiar es requerido');
  }

  // Validar miembros de familia - Validación mejorada
  if (!data.familyMembers || data.familyMembers.length === 0) {
    errors.push('Debe incluir al menos un miembro de la familia');
  } else {
    data.familyMembers.forEach((member, index) => {
      if (!member.nombres || member.nombres.trim() === '') {
        errors.push(`familyMembers[${index}].nombres es requerido`);
      }
      if (!member.numeroIdentificacion || member.numeroIdentificacion.trim() === '') {
        errors.push(`familyMembers[${index}].numeroIdentificacion es requerido`);
      }
      if (!member.tipoIdentificacion?.id) {
        errors.push(`familyMembers[${index}].tipoIdentificacion es requerido`);
      }
      if (!member.parentesco?.id) {
        errors.push(`familyMembers[${index}].parentesco es requerido`);
      }
      // Validaciones adicionales que podrían ser útiles
      if (member.numeroIdentificacion && member.numeroIdentificacion.length < 5) {
        errors.push(`familyMembers[${index}].numeroIdentificacion debe tener al menos 5 caracteres`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Función de utilidad para logging de diferencias (para debugging)
 */
export function logDataDifferences(original: SurveySessionData, transformed: APIEncuestaFormat) {
  // Logging silenciado en producción
}
