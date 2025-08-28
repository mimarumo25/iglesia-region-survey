/**
 * Utilidades para integración del sistema de tallas con formularios existentes
 * 
 * @description Funciones helper para facilitar la integración del sistema de tallas
 * con formularios ya existentes en la aplicación, incluyendo transformadores de datos
 * y validadores compatibles con react-hook-form y otras librerías.
 * 
 * @author Sistema MIA - Módulo de Tallas
 * @version 1.0.0
 */

import { z } from 'zod';
import { TALLAS_DATA } from '@/data/tallas';
import { TipoTalla, TallasFormData } from '@/types/tallas';

/**
 * Obtiene todos los IDs válidos para un tipo de talla
 */
const getValidTallaIds = (tipo: TipoTalla): string[] => {
  switch (tipo) {
    case 'camisa':
      return TALLAS_DATA.camisas.map(t => t.id);
    case 'pantalon':
      return TALLAS_DATA.pantalones.map(t => t.id);
    case 'calzado':
      return TALLAS_DATA.calzado.map(t => t.id);
    default:
      return [];
  }
};

/**
 * Esquemas de validación Zod para las tallas
 */
export const tallasValidationSchemas = {
  // Validación básica - permite strings vacíos
  basic: {
    talla_camisa: z.string().optional(),
    talla_pantalon: z.string().optional(),
    talla_zapato: z.string().optional(),
  },

  // Validación estricta - solo IDs válidos
  strict: {
    talla_camisa: z.string()
      .optional()
      .refine(
        (val) => !val || getValidTallaIds('camisa').includes(val),
        { message: 'Talla de camisa no válida' }
      ),
    talla_pantalon: z.string()
      .optional()
      .refine(
        (val) => !val || getValidTallaIds('pantalon').includes(val),
        { message: 'Talla de pantalón no válida' }
      ),
    talla_zapato: z.string()
      .optional()
      .refine(
        (val) => !val || getValidTallaIds('calzado').includes(val),
        { message: 'Talla de calzado no válida' }
      ),
  },

  // Validación requerida - todas las tallas son obligatorias
  required: {
    talla_camisa: z.string()
      .min(1, 'Talla de camisa es requerida')
      .refine(
        (val) => getValidTallaIds('camisa').includes(val),
        { message: 'Talla de camisa no válida' }
      ),
    talla_pantalon: z.string()
      .min(1, 'Talla de pantalón es requerida')
      .refine(
        (val) => getValidTallaIds('pantalon').includes(val),
        { message: 'Talla de pantalón no válida' }
      ),
    talla_zapato: z.string()
      .min(1, 'Talla de calzado es requerida')
      .refine(
        (val) => getValidTallaIds('calzado').includes(val),
        { message: 'Talla de calzado no válida' }
      ),
  },
};

/**
 * Esquemas Zod completos para diferentes casos de uso
 */
export const TallasZodSchemas = {
  basic: z.object(tallasValidationSchemas.basic),
  strict: z.object(tallasValidationSchemas.strict),
  required: z.object(tallasValidationSchemas.required),
};

/**
 * Tipos TypeScript inferidos de los esquemas Zod
 */
export type TallasBasicForm = z.infer<typeof TallasZodSchemas.basic>;
export type TallasStrictForm = z.infer<typeof TallasZodSchemas.strict>;
export type TallasRequiredForm = z.infer<typeof TallasZodSchemas.required>;

/**
 * Transformador de datos para integración con backend
 */
export const tallasDataTransformer = {
  /**
   * Transforma datos de tallas del frontend al formato del backend
   */
  toBackend: (tallasData: TallasFormData) => ({
    talla_camisa: tallasData.talla_camisa || null,
    talla_pantalon: tallasData.talla_pantalon || null,
    talla_zapato: tallasData.talla_zapato || null,
  }),

  /**
   * Transforma datos del backend al formato del frontend
   */
  fromBackend: (backendData: any): TallasFormData => ({
    talla_camisa: backendData.talla_camisa || '',
    talla_pantalon: backendData.talla_pantalon || '',
    talla_zapato: backendData.talla_zapato || '',
  }),

  /**
   * Limpia datos eliminando valores vacíos
   */
  clean: (tallasData: TallasFormData) => {
    const cleaned: Partial<TallasFormData> = {};
    if (tallasData.talla_camisa) cleaned.talla_camisa = tallasData.talla_camisa;
    if (tallasData.talla_pantalon) cleaned.talla_pantalon = tallasData.talla_pantalon;
    if (tallasData.talla_zapato) cleaned.talla_zapato = tallasData.talla_zapato;
    return cleaned;
  },
};

/**
 * Generador de valores por defecto para formularios
 */
export const tallasDefaultValues = {
  empty: (): TallasFormData => ({
    talla_camisa: '',
    talla_pantalon: '',
    talla_zapato: '',
  }),

  /**
   * Genera valores con tallas comunes (útil para testing o demos)
   */
  common: (): TallasFormData => ({
    talla_camisa: 'M',
    talla_pantalon: '32',
    talla_zapato: '39',
  }),

  /**
   * Genera valores desde datos existentes, con fallback a vacío
   */
  fromData: (data: Partial<TallasFormData>): TallasFormData => ({
    talla_camisa: data.talla_camisa || '',
    talla_pantalon: data.talla_pantalon || '',
    talla_zapato: data.talla_zapato || '',
  }),
};

/**
 * Utilidades para mensajes de error localizados
 */
export const tallasErrorMessages = {
  es: {
    required: {
      talla_camisa: 'La talla de camisa/blusa es requerida',
      talla_pantalon: 'La talla de pantalón es requerida',
      talla_zapato: 'La talla de calzado es requerida',
    },
    invalid: {
      talla_camisa: 'La talla de camisa/blusa seleccionada no es válida',
      talla_pantalon: 'La talla de pantalón seleccionada no es válida',
      talla_zapato: 'La talla de calzado seleccionada no es válida',
    },
    generic: {
      selectOption: 'Por favor selecciona una opción',
      noOptions: 'No hay opciones disponibles',
      searchNoResults: 'No se encontraron resultados para la búsqueda',
    }
  }
};

/**
 * Helper para validación manual (sin Zod)
 */
export const validateTallasManual = (data: TallasFormData) => {
  const errors: Record<string, string> = {};
  
  // Validar que las tallas seleccionadas existan en los datos
  if (data.talla_camisa && !getValidTallaIds('camisa').includes(data.talla_camisa)) {
    errors.talla_camisa = tallasErrorMessages.es.invalid.talla_camisa;
  }
  
  if (data.talla_pantalon && !getValidTallaIds('pantalon').includes(data.talla_pantalon)) {
    errors.talla_pantalon = tallasErrorMessages.es.invalid.talla_pantalon;
  }
  
  if (data.talla_zapato && !getValidTallaIds('calzado').includes(data.talla_zapato)) {
    errors.talla_zapato = tallasErrorMessages.es.invalid.talla_zapato;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Helper para convertir datos de tallas a formato legible
 */
export const formatTallasForDisplay = (data: TallasFormData) => {
  const camisa = data.talla_camisa ? TALLAS_DATA.camisas.find(t => t.id === data.talla_camisa) : null;
  const pantalon = data.talla_pantalon ? TALLAS_DATA.pantalones.find(t => t.id === data.talla_pantalon) : null;
  const zapato = data.talla_zapato ? TALLAS_DATA.calzado.find(t => t.id === data.talla_zapato) : null;

  return {
    camisa: camisa ? `${camisa.nombre}${camisa.descripcion ? ` (${camisa.descripcion})` : ''}` : 'No seleccionada',
    pantalon: pantalon ? `${pantalon.nombre}${pantalon.descripcion ? ` (${pantalon.descripcion})` : ''}` : 'No seleccionada',
    zapato: zapato ? `${zapato.nombre}${zapato.descripcion ? ` (${zapato.descripcion})` : ''}` : 'No seleccionada',
  };
};

/**
 * Helper para generar opciones para select tradicionales (no nuestros componentes)
 */
export const generateSelectOptions = (tipo: TipoTalla) => {
  const tallas = tipo === 'camisa' ? TALLAS_DATA.camisas 
                : tipo === 'pantalon' ? TALLAS_DATA.pantalones 
                : TALLAS_DATA.calzado;

  return tallas
    .sort((a, b) => a.orden - b.orden)
    .map(talla => ({
      value: talla.id,
      label: talla.nombre,
      description: talla.descripcion,
    }));
};
