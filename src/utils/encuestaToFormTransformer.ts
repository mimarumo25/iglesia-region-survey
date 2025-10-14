/**
 * 🔄 Transformador de datos de API a formato de formulario
 * 
 * Convierte la estructura EncuestaCompleta o EncuestaListItem devuelta por la API
 * al formato necesario para el formulario SurveyForm
 */

import { EncuestaListItem, EncuestaCompleta } from '@/services/encuestas';
import { FamilyMember, DeceasedFamilyMember, ConfigurationItem } from '@/types/survey';

/**
 * Resultado de la transformación de encuesta a formulario
 */
export interface FormDataFromEncuesta {
  formData: Record<string, any>;
  familyMembers: FamilyMember[];
  deceasedMembers: DeceasedFamilyMember[];
}

/**
 * Convierte datos de la API (EncuestaListItem o EncuestaCompleta) al formato del formulario
 */
export const transformEncuestaToFormData = (encuesta: EncuestaListItem | EncuestaCompleta): FormDataFromEncuesta => {
  // Detectar si es EncuestaListItem (tiene miembros_familia.personas) o EncuestaCompleta (tiene miembros_familia[])
  const isListItem = 'miembros_familia' in encuesta && encuesta.miembros_familia && 'personas' in encuesta.miembros_familia;
  
  if (isListItem) {
    return transformEncuestaListItemToFormData(encuesta as EncuestaListItem);
  } else {
    return transformEncuestaCompletaToFormData(encuesta as EncuestaCompleta);
  }
};

/**
 * Transforma EncuestaListItem (del listado) a FormData
 */
const transformEncuestaListItemToFormData = (encuesta: EncuestaListItem): FormDataFromEncuesta => {
  // ⚠️ Advertencia: El campo numero_contrato_epm no está disponible en la API
  console.warn('⚠️ Campo "numero_contrato_epm" no disponible en respuesta de API. El usuario deberá volver a ingresarlo si desea modificarlo.');
  
  // 1. Transformar información general del formulario
  const formData: Record<string, any> = {
    // Información general
    municipio: encuesta.municipio?.id || '',
    parroquia: encuesta.parroquia?.id || '',
    sector: encuesta.sector?.id || '',
    vereda: encuesta.vereda?.id || '',
    fecha: encuesta.fecha_ultima_encuesta ? new Date(encuesta.fecha_ultima_encuesta) : new Date(),
    apellido_familiar: encuesta.apellido_familiar || '',
    direccion: encuesta.direccion_familia || '',
    telefono: encuesta.telefono || '',
    numero_contrato_epm: '', // No disponible en la respuesta actual
    
    // Información de vivienda
    tipo_vivienda: encuesta.tipo_vivienda?.id || '',
    
    // Disposición de basuras - transformar array a booleans individuales
    basuras_recolector: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recolector')) || false,
    basuras_quemada: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('quemada')) || false,
    basuras_enterrada: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('enterrada')) || false,
    basuras_recicla: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recicla')) || false,
    basuras_aire_libre: encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('aire libre')) || false,
    basuras_no_aplica: encuesta.basuras?.length === 0 || false,
    
    // Servicios de agua
    sistema_acueducto: encuesta.acueducto?.id || '',
    aguas_residuales: encuesta.aguas_residuales?.id || '',
    pozo_septico: false, // TODO: Obtener de campo específico si está disponible
    letrina: false,
    campo_abierto: false,
    
    // Observaciones y consentimiento
    sustento_familia: '', // No disponible en respuesta actual
    observaciones_encuestador: encuesta.metadatos?.estado || '',
    autorizacion_datos: true, // Asumido si la encuesta existe
  };

  // 2. Transformar miembros de familia
  const familyMembers: FamilyMember[] = (encuesta.miembros_familia?.personas || []).map((persona) => {
    // Crear objetos ConfigurationItem para campos complejos
    const tipoIdentificacion: ConfigurationItem | null = persona.identificacion?.tipo ? {
      id: persona.identificacion.tipo.id,
      nombre: persona.identificacion.tipo.nombre
    } : null;

    const sexo: ConfigurationItem | null = persona.sexo ? {
      id: String(persona.sexo.id),
      nombre: persona.sexo.descripcion
    } : null;

    const situacionCivil: ConfigurationItem | null = persona.estado_civil ? {
      id: String(persona.estado_civil.id),
      nombre: persona.estado_civil.nombre
    } : null;

    const estudio: ConfigurationItem | null = persona.estudios ? {
      id: persona.estudios.id,
      nombre: persona.estudios.nombre
    } : null;

    return {
      id: persona.id,
      nombres: persona.nombre_completo || '',
      fechaNacimiento: persona.fecha_nacimiento ? new Date(persona.fecha_nacimiento) : null,
      tipoIdentificacion,
      numeroIdentificacion: persona.identificacion?.numero || '',
      sexo,
      situacionCivil,
      parentesco: null, // TODO: No disponible en respuesta actual
      talla_camisa: persona.tallas?.camisa || '',
      talla_pantalon: persona.tallas?.pantalon || '',
      talla_zapato: persona.tallas?.zapato || '',
      estudio,
      comunidadCultural: null, // TODO: Mapear si está disponible
      telefono: persona.telefono || '',
      enQueEresLider: '', // No disponible en respuesta actual
      correoElectronico: persona.email || '',
      enfermedad: null, // TODO: Mapear enfermedades
      necesidadesEnfermo: '', // No disponible
      solicitudComunionCasa: false, // No disponible
      profesionMotivoFechaCelebrar: {
        profesion: null,
        motivo: '',
        dia: '',
        mes: ''
      },
      // Campos de habilidades y destrezas (arrays vacíos por defecto)
      habilidades: [],
      destrezas: []
    };
  });

  // 3. Transformar miembros difuntos
  const deceasedMembers: DeceasedFamilyMember[] = (encuesta.deceasedMembers || []).map((difunto) => {
    const sexo: ConfigurationItem | null = difunto.sexo ? {
      id: String(difunto.sexo.id),
      nombre: difunto.sexo.nombre
    } : null;

    const parentesco: ConfigurationItem | null = difunto.parentesco ? {
      id: String(difunto.parentesco.id),
      nombre: difunto.parentesco.nombre
    } : null;

    return {
      id: crypto.randomUUID(), // Generar ID temporal si no existe
      nombres: difunto.nombres || '',
      fechaFallecimiento: difunto.fechaFallecimiento ? new Date(difunto.fechaFallecimiento) : null,
      sexo,
      parentesco,
      causaFallecimiento: difunto.causaFallecimiento || ''
    };
  });

  return {
    formData,
    familyMembers,
    deceasedMembers
  };
};

/**
 * Transforma EncuestaCompleta (de endpoint individual) a FormData
 */
const transformEncuestaCompletaToFormData = (encuesta: EncuestaCompleta): FormDataFromEncuesta => {
  // ⚠️ Advertencia: El campo numero_contrato_epm no está disponible en la API
  console.warn('⚠️ Campo "numero_contrato_epm" no disponible en respuesta de API. El usuario deberá volver a ingresarlo si desea modificarlo.');
  
  // 1. Transformar información general del formulario
  const formData: Record<string, any> = {
    // Información general - solo IDs
    municipio: encuesta.id_municipio || '',
    parroquia: '', // No disponible directamente en EncuestaCompleta
    sector: encuesta.id_sector || '',
    vereda: encuesta.id_vereda || '',
    fecha: encuesta.fecha_creacion ? new Date(encuesta.fecha_creacion) : new Date(),
    apellido_familiar: encuesta.apellido_familiar || '',
    direccion: encuesta.direccion || '',
    telefono: '', // No disponible directamente
    numero_contrato_epm: '', // No disponible
    
    // Información de vivienda
    tipo_vivienda: encuesta.vivienda?.tipo_vivienda || '',
    
    // Disposición de basuras - extraer de vivienda
    basuras_recolector: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('recolector') || false,
    basuras_quemada: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('quemada') || false,
    basuras_enterrada: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('enterrada') || false,
    basuras_recicla: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('recicla') || false,
    basuras_aire_libre: encuesta.vivienda?.manejo_residuos?.toLowerCase().includes('aire libre') || false,
    basuras_no_aplica: !encuesta.vivienda?.manejo_residuos,
    
    // Servicios de agua
    sistema_acueducto: '', // No directamente disponible
    aguas_residuales: '', // No directamente disponible
    pozo_septico: encuesta.vivienda?.fuente_agua?.toLowerCase().includes('pozo') || false,
    letrina: false, // No disponible
    campo_abierto: false, // No disponible
    
    // Observaciones y consentimiento
    sustento_familia: encuesta.socioeconomica?.fuente_ingresos || '',
    observaciones_encuestador: encuesta.observaciones_generales || '',
    autorizacion_datos: true, // Asumido si la encuesta existe
  };

  // 2. Transformar miembros de familia
  const familyMembers: FamilyMember[] = (encuesta.miembros_familia || []).map((miembro) => {
    return {
      id: miembro.id || crypto.randomUUID(),
      nombres: `${miembro.nombres} ${miembro.apellidos || ''}`.trim(),
      fechaNacimiento: miembro.fecha_nacimiento ? new Date(miembro.fecha_nacimiento) : null,
      tipoIdentificacion: miembro.tipo_identificacion ? {
        id: miembro.tipo_identificacion,
        nombre: miembro.tipo_identificacion
      } : null,
      numeroIdentificacion: miembro.numero_identificacion || '',
      sexo: miembro.sexo ? {
        id: miembro.sexo,
        nombre: miembro.sexo
      } : null,
      situacionCivil: miembro.estado_civil ? {
        id: miembro.estado_civil,
        nombre: miembro.estado_civil
      } : null,
      parentesco: miembro.parentesco ? {
        id: miembro.parentesco,
        nombre: miembro.parentesco
      } : null,
      talla_camisa: '',
      talla_pantalon: '',
      talla_zapato: '',
      estudio: miembro.nivel_estudios ? {
        id: miembro.nivel_estudios,
        nombre: miembro.nivel_estudios
      } : null,
      comunidadCultural: miembro.comunidad_cultural ? {
        id: miembro.comunidad_cultural,
        nombre: miembro.comunidad_cultural
      } : null,
      telefono: '',
      enQueEresLider: '',
      correoElectronico: '',
      enfermedad: null,
      necesidadesEnfermo: '',
      solicitudComunionCasa: false,
      profesionMotivoFechaCelebrar: {
        profesion: miembro.profesion_oficio ? {
          id: miembro.profesion_oficio,
          nombre: miembro.profesion_oficio
        } : null,
        motivo: '',
        dia: '',
        mes: ''
      },
      // Campos de habilidades y destrezas (arrays vacíos por defecto)
      habilidades: [],
      destrezas: []
    };
  });

  // 3. Transformar miembros difuntos - vacío por defecto para EncuestaCompleta
  const deceasedMembers: DeceasedFamilyMember[] = [];

  return {
    formData,
    familyMembers,
    deceasedMembers
  };
};

/**
 * Valida que los datos transformados sean válidos para el formulario
 */
export const validateTransformedData = (transformedData: FormDataFromEncuesta): boolean => {
  const { formData, familyMembers } = transformedData;
  
  // Validar campos críticos
  const hasRequiredFields = !!(
    formData.apellido_familiar &&
    formData.direccion
  );

  const hasFamilyMembers = familyMembers.length > 0;

  return hasRequiredFields && hasFamilyMembers;
};
