/**
 * 🔄 Transformador de datos de API a formato de formulario
 * 
 * Convierte la estructura EncuestaCompleta o EncuestaListItem devuelta por la API
 * al formato necesario para el formulario SurveyForm
 */

import { EncuestaListItem, EncuestaCompleta } from '@/services/encuestas';
import { FamilyMember, DeceasedFamilyMember, ConfigurationItem } from '@/types/survey';

const createCelebracionId = (): string => {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid ?? `celebracion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

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
  // 📊 Logging detallado para debugging
  console.group('🔄 Transformando encuesta a formulario');
  console.log('📥 Datos de entrada:', {
    id: encuesta.id_encuesta,
    apellido: encuesta.apellido_familiar,
    corregimiento: encuesta.corregimiento,
    numero_contrato_epm: encuesta.numero_contrato_epm,
    basuras: encuesta.basuras,
    aguas_residuales: encuesta.aguas_residuales,
    sustento_familia: (encuesta as any).sustento_familia
  });
  
  // ⚠️ Advertencias para campos no disponibles
  const camposNoDisponibles = [];
  if (!encuesta.numero_contrato_epm) camposNoDisponibles.push('numero_contrato_epm');
  if (!(encuesta as any).sustento_familia) camposNoDisponibles.push('sustento_familia');
  if (!encuesta.corregimiento) camposNoDisponibles.push('corregimiento');
  if (!encuesta.aguas_residuales || (Array.isArray(encuesta.aguas_residuales) && encuesta.aguas_residuales.length === 0)) {
    camposNoDisponibles.push('aguas_residuales');
  }
  if (!encuesta.basuras || encuesta.basuras.length === 0) camposNoDisponibles.push('disposicion_basura');
  
  if (camposNoDisponibles.length > 0) {
    console.warn('⚠️ Campos sin datos en la base de datos:', camposNoDisponibles.join(', '));
  }
  
  // 1. Transformar información general del formulario
  const formData: Record<string, any> = {
    // Información general
    municipio: encuesta.municipio?.id ? String(encuesta.municipio.id) : '',
    parroquia: encuesta.parroquia?.id ? String(encuesta.parroquia.id) : '',
    sector: encuesta.sector?.id ? String(encuesta.sector.id) : '',
    vereda: encuesta.vereda?.id ? String(encuesta.vereda.id) : '',
    corregimiento: (encuesta as any)?.corregimiento?.id ? String((encuesta as any).corregimiento.id) : '',
    centro_poblado: (encuesta as any)?.centro_poblado?.id ? String((encuesta as any).centro_poblado.id) : '',
    // Guardar datos completos para transformador
    sector_data: encuesta.sector || null,
    vereda_data: encuesta.vereda || null,
    corregimiento_data: (encuesta as any)?.corregimiento || null,
    centro_poblado_data: (encuesta as any)?.centro_poblado || null,
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
    
    // Reconstruir el array disposicion_basura a partir de los booleanos
    disposicion_basura: (() => {
      const basuraArray: string[] = [];
      if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recolector'))) {
        basuraArray.push('1'); // Recolección municipal
      }
      if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('quemada'))) {
        basuraArray.push('3'); // Incineración
      }
      if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('enterrada'))) {
        basuraArray.push('4'); // Enterrado
      }
      if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('recicla'))) {
        basuraArray.push('6'); // Reciclaje
      }
      if (encuesta.basuras?.some(b => b.nombre.toLowerCase().includes('aire libre'))) {
        basuraArray.push('5'); // Botadero
      }
      return basuraArray;
    })(),
    
    // Servicios de agua - ⚠️ Backend devuelve ARRAYS, tomamos primer elemento
    sistema_acueducto: Array.isArray(encuesta.acueducto) && encuesta.acueducto.length > 0 
      ? encuesta.acueducto[0].id 
      : (encuesta.acueducto as any)?.id || '',
    
    // 🔄 aguas_residuales: Backend devuelve array, extraemos IDs
    aguas_residuales: Array.isArray(encuesta.aguas_residuales) 
      ? encuesta.aguas_residuales.map(ar => ar.id)
      : (encuesta.aguas_residuales as any)?.id ? [(encuesta.aguas_residuales as any).id] : [],
    
    // Observaciones y consentimiento
    sustento_familia: '', // No disponible en respuesta actual
    observaciones_encuestador: encuesta.metadatos?.estado || '',
    autorizacion_datos: true, // Asumido si la encuesta existe
  };

  // 2. Transformar miembros de familia
  console.log(`👥 Transformando ${encuesta.miembros_familia?.personas?.length || 0} miembros de familia`);
  
  const familyMembers: FamilyMember[] = (encuesta.miembros_familia?.personas || []).map((persona, index) => {
    console.log(`  Miembro ${index + 1}: ${persona.nombre_completo}`, {
      profesion: (persona as any).profesion,
      habilidades: (persona as any).habilidades,
      destrezas: (persona as any).destrezas
    });
    
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
      // 🔄 parentesco: Mapear desde la respuesta del backend
      parentesco: (persona as any).parentesco ? {
        id: String((persona as any).parentesco.id),
        nombre: (persona as any).parentesco.nombre
      } : null,
      talla_camisa: persona.tallas?.camisa || '',
      talla_pantalon: persona.tallas?.pantalon || '',
      talla_zapato: persona.tallas?.zapato || '',
      estudio,
      // 🔄 comunidadCultural: Mapear desde la respuesta del backend
      comunidadCultural: (persona as any).comunidad_cultural ? {
        id: String((persona as any).comunidad_cultural.id),
        nombre: (persona as any).comunidad_cultural.nombre
      } : null,
      telefono: persona.telefono || '',
      // 🔄 en_que_eres_lider: Backend devuelve STRING o null
      enQueEresLider: (persona as any).en_que_eres_lider 
        ? [(persona as any).en_que_eres_lider] 
        : [],
      correoElectronico: persona.email || '',
      // 🔄 enfermedades: Array con {id_persona, id, nombre}
      enfermedades: ((persona as any).enfermedades || []).map((e: any) => ({
        id: e.id || 0,
        nombre: e.nombre || ''
      })),
      // 🔄 necesidad_enfermo: STRING singular (no array)
      necesidadesEnfermo: (persona as any).necesidad_enfermo 
        ? [(persona as any).necesidad_enfermo]
        : [],
      solicitudComunionCasa: (persona as any).solicitudComunionCasa || false,
      profesionMotivoFechaCelebrar: {
        profesion: (persona as any).profesion ? {
          id: (persona as any).profesion.id,
          nombre: (persona as any).profesion.nombre
        } : null,
        // 🔄 celebraciones: Backend incluye {id_persona, id, motivo, dia, mes, created_at, updated_at}
        celebraciones: ((persona as any).celebraciones || []).map((c: any) => ({
          id: c.id ? String(c.id) : createCelebracionId(),
          motivo: c.motivo || '',
          dia: String(c.dia || ''),
          mes: String(c.mes || '')
        }))
      },
      // Campos de habilidades y destrezas
      habilidades: ((persona as any).habilidades || []).map((h: any) => ({
        id: h.id || 0,
        nombre: h.nombre || '',
        nivel: h.nivel || ''
      })),
      destrezas: ((persona as any).destrezas || []).map((d: any) => ({
        id: d.id || 0,
        nombre: d.nombre || ''
      }))
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

  console.log('📤 Resultado de la transformación:', {
    formData: {
      corregimiento: formData.corregimiento,
      numero_contrato_epm: formData.numero_contrato_epm,
      disposicion_basura: formData.disposicion_basura,
      aguas_residuales: formData.aguas_residuales,
      sustento_familia: formData.sustento_familia
    },
    familyMembers: familyMembers.length,
    deceasedMembers: deceasedMembers.length
  });
  console.groupEnd();

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
    municipio: encuesta.id_municipio ? String(encuesta.id_municipio) : '',
    parroquia: '', // No disponible directamente en EncuestaCompleta
    sector: encuesta.id_sector ? String(encuesta.id_sector) : '',
    vereda: encuesta.id_vereda ? String(encuesta.id_vereda) : '',
    corregimiento: (encuesta as any)?.id_corregimiento ? String((encuesta as any).id_corregimiento) : '',
    centro_poblado: (encuesta as any)?.id_centro_poblado ? String((encuesta as any).id_centro_poblado) : '',
    // Guardar datos completos para transformador
    sector_data: (encuesta as any)?.sector || null,
    vereda_data: (encuesta as any)?.vereda || null,
    corregimiento_data: (encuesta as any)?.corregimiento || null,
    centro_poblado_data: (encuesta as any)?.centro_poblado || null,
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
    
    // Reconstruir el array disposicion_basura a partir del campo manejo_residuos
    disposicion_basura: (() => {
      const basuraArray: string[] = [];
      const residuos = encuesta.vivienda?.manejo_residuos?.toLowerCase() || '';
      if (residuos.includes('recolector')) {
        basuraArray.push('1'); // Recolección municipal
      }
      if (residuos.includes('quemada')) {
        basuraArray.push('3'); // Incineración
      }
      if (residuos.includes('enterrada')) {
        basuraArray.push('4'); // Enterrado
      }
      if (residuos.includes('recicla')) {
        basuraArray.push('6'); // Reciclaje
      }
      if (residuos.includes('aire libre')) {
        basuraArray.push('5'); // Botadero
      }
      return basuraArray;
    })(),
    
    // Servicios de agua
    sistema_acueducto: '', // No directamente disponible
    // 🔄 NUEVO: aguas_residuales ahora es un array de IDs (estructura dinámica)
    aguas_residuales: [],
    
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
      talla_camisa: (miembro as any).talla_camisa || '',
      talla_pantalon: (miembro as any).talla_pantalon || '',
      talla_zapato: (miembro as any).talla_zapato || '',
      estudio: miembro.nivel_estudios ? {
        id: miembro.nivel_estudios,
        nombre: miembro.nivel_estudios
      } : null,
      comunidadCultural: miembro.comunidad_cultural ? {
        id: miembro.comunidad_cultural,
        nombre: miembro.comunidad_cultural
      } : null,
      telefono: (miembro as any).telefono || '',
      enQueEresLider: (miembro as any).enQueEresLider || [],
      correoElectronico: (miembro as any).correo_electronico || (miembro as any).email || '',
      enfermedades: (miembro as any).enfermedades || [],
      necesidadesEnfermo: (miembro as any).necesidadesEnfermo || [],
      solicitudComunionCasa: (miembro as any).solicitudComunionCasa || false,
      profesionMotivoFechaCelebrar: {
        profesion: miembro.profesion_oficio ? {
          id: miembro.profesion_oficio,
          nombre: miembro.profesion_oficio
        } : (miembro as any).profesionMotivoFechaCelebrar?.profesion || null,
        celebraciones: (() => {
          // Si ya viene en el nuevo formato
          if ((miembro as any).profesionMotivoFechaCelebrar?.celebraciones) {
            return (miembro as any).profesionMotivoFechaCelebrar.celebraciones;
          }
          
          // Si viene en formato legacy (campos separados)
          const legacyMember = miembro as any;
          const motivo = legacyMember?.motivo_fecha_celebrar?.trim?.() || '';
          const dia = legacyMember?.dia_fecha_celebrar?.trim?.() || '';
          const mes = legacyMember?.mes_fecha_celebrar?.trim?.() || '';

          if (motivo || dia || mes) {
            return [{
              id: createCelebracionId(),
              motivo,
              dia,
              mes,
            }];
          }

          return [];
        })(),
      },
      // Campos de habilidades y destrezas
      habilidades: (miembro as any).habilidades || [],
      destrezas: (miembro as any).destrezas || []
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
