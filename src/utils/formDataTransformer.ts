/**
 * Utilidades para transformar datos del formulario
 * Convierte strings de selects a objetos ConfigurationItem y viceversa
 */

import { ConfigurationItem } from '@/types/survey';
import { ConfigurationData } from '@/hooks/useConfigurationData';

const createCelebracionId = (): string => {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid ?? `celebracion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const normalizeCelebracionesStructure = (raw: any) => {
  const celebracionesArray = Array.isArray(raw?.celebraciones) ? raw.celebraciones : [];

  const normalized = celebracionesArray
    .map((item) => ({
      id: item?.id || createCelebracionId(),
      motivo: item?.motivo?.trim?.() || '',
      dia: item?.dia?.trim?.() || '',
      mes: item?.mes?.trim?.() || '',
    }))
    .filter((item) => item.motivo || item.dia || item.mes);

  if (normalized.length === 0 && raw) {
    const motivo = raw?.motivo?.trim?.() || '';
    const dia = raw?.dia?.trim?.() || '';
    const mes = raw?.mes?.trim?.() || '';

    if (motivo || dia || mes) {
      normalized.push({
        id: createCelebracionId(),
        motivo,
        dia,
        mes,
      });
    }
  }

  return normalized;
};

/**
 * Encuentra un ConfigurationItem por su ID en una lista
 */
export const findConfigurationItemById = (id: string, items: ConfigurationItem[]): ConfigurationItem | null => {
  if (!id || !items.length) return null;
  return items.find(item => item.id === id) || null;
};

/**
 * Transforma un string (ID) a un objeto ConfigurationItem usando la configuración disponible
 */
export const transformStringToConfigurationItem = (
  value: string,
  configKey: keyof ConfigurationData,
  configurationData: ConfigurationData
): ConfigurationItem | null => {
  if (!value) return null;
  
  // Obtener la lista de opciones basada en el configKey
  const getOptionsList = (): ConfigurationItem[] => {
    switch (configKey) {
      case 'tiposIdentificacionOptions':
        return configurationData.tiposIdentificacionItems;
      case 'sexoOptions':
        return configurationData.sexoItems;
      case 'estadoCivilOptions':
        return configurationData.estadoCivilItems;
      case 'estudiosOptions':
        return configurationData.estudiosItems;
      case 'parentescosOptions':
        return configurationData.parentescosItems;
      case 'comunidadesCulturalesOptions':
        return configurationData.comunidadesCulturalesItems;
      case 'enfermedadesOptions':
        return configurationData.enfermedadesItems;
      case 'profesionesOptions':
        return configurationData.profesionesItems;
      default:
        return [];
    }
  };

  const optionsList = getOptionsList();
  return findConfigurationItemById(value, optionsList);
};

/**
 * Transforma los datos de un miembro de familia del formulario (strings) a la estructura final (ConfigurationItems)
 */
export const transformFamilyMemberFormData = (
  formData: any,
  configurationData: ConfigurationData,
  keepTempId: boolean = false
): any => {
  const transformedData = {
    ...formData,
    
    // Transformar strings a ConfigurationItems
    tipoIdentificacion: transformStringToConfigurationItem(
      formData.tipoIdentificacion, 
      'tiposIdentificacionOptions', 
      configurationData
    ),
    sexo: transformStringToConfigurationItem(
      formData.sexo, 
      'sexoOptions', 
      configurationData
    ),
    situacionCivil: transformStringToConfigurationItem(
      formData.situacionCivil, 
      'estadoCivilOptions', 
      configurationData
    ),
    estudio: transformStringToConfigurationItem(
      formData.estudio, 
      'estudiosOptions', 
      configurationData
    ),
    parentesco: transformStringToConfigurationItem(
      formData.parentesco, 
      'parentescosOptions', 
      configurationData
    ),
    comunidadCultural: transformStringToConfigurationItem(
      formData.comunidadCultural, 
      'comunidadesCulturalesOptions', 
      configurationData
    ),
    
    // Para las tallas, las manejamos como strings simples por ahora
    // ya que no parecen estar en ConfigurationData
    talla_camisa: formData.talla_camisa || null,
    talla_pantalon: formData.talla_pantalon || null,
    talla_zapato: formData.talla_zapato || null,
    
    // Transformar la profesión y celebraciones en el objeto profesionMotivoFechaCelebrar
    profesionMotivoFechaCelebrar: {
      profesion: transformStringToConfigurationItem(
        formData.profesionMotivoFechaCelebrar?.profesion || '',
        'profesionesOptions',
        configurationData
      ),
      celebraciones: normalizeCelebracionesStructure(formData.profesionMotivoFechaCelebrar),
    }
  };

  // Solo eliminar ID si no lo necesitamos para la UI
  if (!keepTempId) {
    delete transformedData.id;
  }

  return transformedData;
};

/**
 * Transforma un objeto ConfigurationItem de vuelta a string (para editar en el formulario)
 */
export const transformConfigurationItemToString = (item: ConfigurationItem | null | string): string => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.id || '';
};

/**
 * Obtiene el nombre para mostrar de un ConfigurationItem o string
 */
export const getDisplayName = (item: ConfigurationItem | null | string): string => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.nombre || '';
};

/**
 * Prepara los family members para ser enviados al backend eliminando los IDs temporales
 */
export const prepareFamilyMembersForSubmission = (familyMembers: any[]): any[] => {
  return familyMembers.map(member => {
    const { id, ...memberWithoutId } = member;
    // También eliminar los IDs temporales de las celebraciones
    return removeCelebracionIds(memberWithoutId);
  });
};

/**
 * Prepara los difuntos para la presentación eliminando el ID temporal del frontend
 * El ID se usa solo en el frontend para edición/eliminación, pero no debe guardarse en API/localStorage
 * 
 * @param deceasedMembers - Array de miembros difuntos con IDs temporales
 * @returns Array de miembros difuntos sin el campo id
 * 
 * @example
 * Input: [{ id: '1702657452927', nombres: 'Juan', sexo: { id: 1, nombre: 'Masculino' } }]
 * Output: [{ nombres: 'Juan', sexo: { id: 1, nombre: 'Masculino' } }]
 */
export const prepareDeceasedMembersForSubmission = (deceasedMembers: any[]): any[] => {
  return deceasedMembers.map(member => {
    const { id, ...memberWithoutId } = member;
    return memberWithoutId;
  });
};

/**
 * Elimina los IDs temporales de las celebraciones de un miembro de familia
 * Los IDs se usan solo en el frontend para edición/eliminación, pero no deben guardarse en API/localStorage
 * 
 * @param member - Miembro de familia con celebraciones que tienen IDs temporales
 * @returns Miembro de familia sin los IDs temporales en las celebraciones
 * 
 * @example
 * Input: {
 *   nombres: 'Juan',
 *   profesionMotivoFechaCelebrar: {
 *     celebraciones: [
 *       { id: 'celebracion-1702657452927-abc123', motivo: 'Cumpleaños', dia: '25', mes: '12' }
 *     ]
 *   }
 * }
 * Output: {
 *   nombres: 'Juan',
 *   profesionMotivoFechaCelebrar: {
 *     celebraciones: [
 *       { motivo: 'Cumpleaños', dia: '25', mes: '12' }
 *     ]
 *   }
 * }
 */
export const removeCelebracionIds = (member: any): any => {
  if (!member?.profesionMotivoFechaCelebrar?.celebraciones) {
    return member;
  }

  return {
    ...member,
    profesionMotivoFechaCelebrar: {
      ...member.profesionMotivoFechaCelebrar,
      celebraciones: member.profesionMotivoFechaCelebrar.celebraciones.map((celebracion: any) => {
        const { id, ...celebracionWithoutId } = celebracion;
        return celebracionWithoutId;
      })
    }
  };
};

/**
 * Transforma los datos de un miembro de familia desde la estructura final (ConfigurationItems) al formulario (strings)
 */
export const transformFamilyMemberForEdit = (member: any): any => {
  return {
    ...member,
    // Convertir ConfigurationItems a strings para el formulario
    tipoIdentificacion: transformConfigurationItemToString(member.tipoIdentificacion),
    sexo: transformConfigurationItemToString(member.sexo),
    situacionCivil: transformConfigurationItemToString(member.situacionCivil),
    estudio: transformConfigurationItemToString(member.estudio),
    parentesco: transformConfigurationItemToString(member.parentesco),
    comunidadCultural: transformConfigurationItemToString(member.comunidadCultural),
    
    // Las tallas ya son strings simples, se pasan directamente
    talla_camisa: member.talla_camisa || '',
    talla_pantalon: member.talla_pantalon || '',
    talla_zapato: member.talla_zapato || '',
    
    // Transformar la profesión y celebraciones en el objeto profesionMotivoFechaCelebrar
    profesionMotivoFechaCelebrar: {
      profesion: transformConfigurationItemToString(member.profesionMotivoFechaCelebrar?.profesion),
      celebraciones: normalizeCelebracionesStructure(member.profesionMotivoFechaCelebrar),
    }
  };
};
