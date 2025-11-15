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
  "talla_camisa/blusa": string; // Nota: la API espera este formato específico
  talla_pantalon: string;
  talla_zapato: string;
  profesion: {
    id: number | string;
    nombre: string;
  } | null;
  motivoFechaCelebrar: {
    motivo: string;
    dia: string;
    mes: string;
  };
  // Campos adicionales que pueden estar presentes
  enQueEresLider?: string | string[];
  correoElectronico?: string;
  necesidadesEnfermo?: string | string[];
  solicitudComunionCasa?: boolean;
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
    comunionEnCasa: boolean; // Campo requerido por API
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
}

/**
 * Convierte ConfigurationItem a formato API asegurando que el ID sea numérico
 */
function transformConfigurationItem(item: ConfigurationItem | null): { id: number; nombre: string } | null {
  if (!item) return null;
  
  // Convertir ID a número si es string
  const id = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
  
  return {
    id: isNaN(id) ? 1 : id, // Fallback a 1 si no se puede convertir
    nombre: item.nombre || ''
  };
}

/**
 * Convierte fecha de Date o string a formato ISO date (solo fecha, sin tiempo)
 */
function transformDate(date: Date | string | null): string {
  if (!date) return new Date().toISOString().split('T')[0];
  
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  
  // Si es string, intentar parsear y convertir
  try {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
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

  const [primaryCelebracion] = celebraciones;

  // Extraer motivo y fecha de celebración (se envía el primer registro para compatibilidad con la API actual)
  const motivoFechaCelebrar = {
    motivo: primaryCelebracion?.motivo || '',
    dia: primaryCelebracion?.dia || '',
    mes: primaryCelebracion?.mes || ''
  };

  return {
    nombres: member.nombres || '',
    numeroIdentificacion: member.numeroIdentificacion || '',
    tipoIdentificacion: transformConfigurationItem(member.tipoIdentificacion) || { id: 1, nombre: 'CC' },
    fechaNacimiento: transformDate(member.fechaNacimiento),
    sexo: transformConfigurationItem(member.sexo) || { id: 1, nombre: 'Masculino' },
    telefono: member.telefono || '',
    situacionCivil: transformConfigurationItem(member.situacionCivil) || { id: 1, nombre: 'Soltero' },
    estudio: transformConfigurationItem(member.estudio) || { id: 1, nombre: 'Primaria' },
    parentesco: transformConfigurationItem(member.parentesco) || { id: 1, nombre: 'Jefe de Hogar' },
    comunidadCultural: transformConfigurationItem(member.comunidadCultural) || { id: 1, nombre: 'Ninguna' },
    "talla_camisa/blusa": member.talla_camisa || 'M', // Transformar nombre de campo
    talla_pantalon: member.talla_pantalon || '32',
    talla_zapato: member.talla_zapato || '38',
    profesion: profesion,
    motivoFechaCelebrar: motivoFechaCelebrar,
    // Campos opcionales
    enQueEresLider: Array.isArray(member.enQueEresLider) ? member.enQueEresLider.join(', ') : (member.enQueEresLider as any),
    correoElectronico: member.correoElectronico,
    necesidadesEnfermo: Array.isArray(member.necesidadesEnfermo) ? member.necesidadesEnfermo.join(', ') : (member.necesidadesEnfermo as any),
    solicitudComunionCasa: member.solicitudComunionCasa
  };
}

/**
 * Transforma DeceasedFamilyMember del formato interno al formato API
 */
function transformDeceasedMember(member: DeceasedFamilyMember): APIDeceasedMember {
  return {
    nombres: member.nombres || '',
    fechaFallecimiento: transformDate(member.fechaFallecimiento),
    sexo: transformConfigurationItem(member.sexo) || { id: 1, nombre: 'Masculino' },
    parentesco: transformConfigurationItem(member.parentesco) || { id: 1, nombre: 'Padre' },
    causaFallecimiento: member.causaFallecimiento || ''
  };
}

/**
 * Función principal para transformar SurveySessionData al formato API
 */
export function transformSurveyDataForAPI(data: SurveySessionData): APIEncuestaFormat {
  // Transformar información general
  const informacionGeneral = {
    municipio: transformConfigurationItem(data.informacionGeneral.municipio) || { id: 1, nombre: 'Medellín' },
    parroquia: transformConfigurationItem(data.informacionGeneral.parroquia) || { id: 1, nombre: 'San José' },
    sector: transformConfigurationItem(data.informacionGeneral.sector) || { id: 1, nombre: 'Centro' },
    vereda: transformConfigurationItem(data.informacionGeneral.vereda) || { id: 1, nombre: 'Centro' },
    corregimiento: transformConfigurationItem(data.informacionGeneral.corregimiento),
    centro_poblado: transformConfigurationItem(data.informacionGeneral.centro_poblado),
    fecha: transformDate(data.informacionGeneral.fecha),
    apellido_familiar: data.informacionGeneral.apellido_familiar || '',
    direccion: data.informacionGeneral.direccion || '',
    telefono: data.informacionGeneral.telefono || '',
    numero_contrato_epm: data.informacionGeneral.numero_contrato_epm || '',
    // comunionEnCasa se calcula como true si algún miembro solicita comunión en casa
    comunionEnCasa: data.familyMembers.some(member => member.solicitudComunionCasa === true)
  };

  // Transformar vivienda
  const vivienda = {
    tipo_vivienda: transformConfigurationItem(data.vivienda.tipo_vivienda) || { id: 1, nombre: 'Casa' },
    disposicion_basuras: data.vivienda.disposicion_basuras
  };

  // Transformar servicios de agua
  const servicios_agua = {
    sistema_acueducto: transformConfigurationItem(data.servicios_agua.sistema_acueducto) || { id: 1, nombre: 'Acueducto Público' },
    aguas_residuales: data.servicios_agua.aguas_residuales,
  };

  // Transformar miembros de familia
  const familyMembers = data.familyMembers.map(transformFamilyMember);

  // Transformar miembros fallecidos
  const deceasedMembers = data.deceasedMembers.map(transformDeceasedMember);

  const transformedData: APIEncuestaFormat = {
    informacionGeneral,
    vivienda,
    servicios_agua,
    observaciones: data.observaciones,
    familyMembers,
    deceasedMembers,
    metadata: data.metadata
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
  if (!data.informacionGeneral.direccion) {
    errors.push('informacionGeneral.direccion es requerido');
  }

  // Validar vivienda
  if (!data.vivienda.tipo_vivienda?.id) {
    errors.push('vivienda.tipo_vivienda.id es requerido');
  }

  // Validar servicios de agua
  if (!data.servicios_agua.sistema_acueducto?.id) {
    errors.push('servicios_agua.sistema_acueducto.id es requerido');
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
