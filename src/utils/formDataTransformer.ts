/**
 * Utilidades para transformar datos del formulario
 * Convierte strings de selects a objetos ConfigurationItem y viceversa
 */

import { ConfigurationItem } from '@/types/survey';
import { ConfigurationData } from '@/hooks/useConfigurationData';

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
    enfermedad: transformStringToConfigurationItem(
      formData.enfermedad, 
      'enfermedadesOptions', 
      configurationData
    ),
    
    // Para las tallas, las manejamos como strings simples por ahora
    // ya que no parecen estar en ConfigurationData
    talla_camisa: formData.talla_camisa || null,
    talla_pantalon: formData.talla_pantalon || null,
    talla_zapato: formData.talla_zapato || null,
    
    // Transformar la profesión en el objeto profesionMotivoFechaCelebrar
    profesionMotivoFechaCelebrar: formData.profesionMotivoFechaCelebrar ? {
      profesion: transformStringToConfigurationItem(
        formData.profesionMotivoFechaCelebrar.profesion || '',
        'profesionesOptions',
        configurationData
      ),
      motivo: formData.profesionMotivoFechaCelebrar.motivo || '',
      dia: formData.profesionMotivoFechaCelebrar.dia || '',
      mes: formData.profesionMotivoFechaCelebrar.mes || ''
    } : {
      profesion: null,
      motivo: '',
      dia: '',
      mes: ''
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
    return memberWithoutId;
  });
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
    enfermedad: transformConfigurationItemToString(member.enfermedad),
    
    // Las tallas se mantienen como strings
    talla_camisa: member.talla_camisa || '',
    talla_pantalon: member.talla_pantalon || '',
    talla_zapato: member.talla_zapato || '',
    
    // Transformar la profesión en el objeto profesionMotivoFechaCelebrar
    profesionMotivoFechaCelebrar: {
      profesion: transformConfigurationItemToString(member.profesionMotivoFechaCelebrar?.profesion),
      motivo: member.profesionMotivoFechaCelebrar?.motivo || '',
      dia: member.profesionMotivoFechaCelebrar?.dia || '',
      mes: member.profesionMotivoFechaCelebrar?.mes || ''
    }
  };
};
