/**
 * Hook personalizado para el manejo de tallas de vestimenta
 * 
 * @description Proporciona funcionalidades para acceder y manipular datos de tallas
 * de manera consistente en toda la aplicación. Incluye validación, búsqueda y
 * utilidades para trabajar con las diferentes categorías de tallas.
 * 
 * @author Sistema MIA - Módulo de Tallas
 * @version 1.0.0
 */

import { useMemo, useCallback } from 'react';
import { TALLAS_DATA, buscarTallas } from '@/data/tallas';
import { TipoTalla, Talla, TallasData, UseTallasReturn } from '@/types/tallas';

/**
 * Hook principal para el manejo de tallas
 * 
 * @returns {UseTallasReturn} Objeto con datos y utilidades de tallas
 * 
 * @example
 * ```tsx
 * const { tallasData, getTallasPorTipo, getTallaNombre } = useTallas();
 * 
 * // Obtener tallas de camisas
 * const tallasCamisa = getTallasPorTipo('camisa');
 * 
 * // Obtener nombre de una talla específica
 * const nombreTalla = getTallaNombre('camisa', 'M');
 * ```
 */
export const useTallas = (): UseTallasReturn => {
  // Memoizar los datos de tallas para optimizar rendimiento
  const tallasData = useMemo<TallasData>(() => TALLAS_DATA, []);

  /**
   * Obtiene las tallas filtradas por tipo, ordenadas por el campo 'orden'
   * 
   * @param tipo - Tipo de talla a filtrar ('camisa', 'pantalon', 'calzado')
   * @returns Array de tallas ordenadas
   */
  const getTallasPorTipo = useCallback((tipo: TipoTalla): Talla[] => {
    switch (tipo) {
      case 'camisa':
        return [...tallasData.camisas].sort((a, b) => a.orden - b.orden);
      case 'pantalon':
        return [...tallasData.pantalones].sort((a, b) => a.orden - b.orden);
      case 'calzado':
        return [...tallasData.calzado].sort((a, b) => a.orden - b.orden);
      default:
        return [];
    }
  }, [tallasData]);

  /**
   * Obtiene el nombre de una talla específica por su ID y tipo
   * 
   * @param tipo - Tipo de talla
   * @param id - ID de la talla
   * @returns Nombre de la talla o string vacío si no se encuentra
   */
  const getTallaNombre = useCallback((tipo: TipoTalla, id: string): string => {
    const tallas = getTallasPorTipo(tipo);
    const talla = tallas.find(t => t.id === id);
    return talla?.nombre || '';
  }, [getTallasPorTipo]);

  /**
   * Valida si un ID de talla existe para un tipo específico
   * 
   * @param tipo - Tipo de talla
   * @param id - ID de la talla a validar
   * @returns true si la talla existe, false en caso contrario
   */
  const isValidTalla = useCallback((tipo: TipoTalla, id: string): boolean => {
    const tallas = getTallasPorTipo(tipo);
    return tallas.some(t => t.id === id);
  }, [getTallasPorTipo]);

  return {
    tallasData,
    getTallasPorTipo,
    getTallaNombre,
    isValidTalla,
  };
};

/**
 * Hook para búsqueda de tallas con funcionalidades avanzadas
 * 
 * @returns Funciones de búsqueda y filtrado
 */
export const useTallasSearch = () => {
  const { getTallasPorTipo } = useTallas();

  /**
   * Busca tallas por texto en nombre o descripción
   * 
   * @param query - Texto de búsqueda
   * @param categoria - Categoría opcional para filtrar
   * @returns Array de tallas que coinciden con la búsqueda
   */
  const searchTallas = useCallback((query: string, categoria?: TipoTalla): Talla[] => {
    if (!query.trim()) {
      return categoria ? getTallasPorTipo(categoria) : [];
    }

    return buscarTallas(query, categoria);
  }, [getTallasPorTipo]);

  /**
   * Obtiene sugerencias de tallas basadas en texto parcial
   * 
   * @param partialText - Texto parcial
   * @param categoria - Categoría de talla
   * @param limit - Número máximo de sugerencias (default: 10)
   * @returns Array limitado de sugerencias
   */
  const getSugerencias = useCallback((
    partialText: string, 
    categoria: TipoTalla, 
    limit: number = 10
  ): Talla[] => {
    const resultados = searchTallas(partialText, categoria);
    return resultados.slice(0, limit);
  }, [searchTallas]);

  return {
    searchTallas,
    getSugerencias,
  };
};

/**
 * Hook para validación de formularios con tallas
 * 
 * @returns Funciones de validación para formularios
 */
export const useTallasValidation = () => {
  const { isValidTalla, getTallaNombre } = useTallas();

  /**
   * Valida un objeto de tallas de formulario
   * 
   * @param tallas - Objeto con las tallas a validar
   * @returns Objeto con errores de validación
   */
  const validateTallasForm = useCallback((tallas: {
    talla_camisa?: string;
    talla_pantalon?: string;
    talla_zapato?: string;
  }) => {
    const errors: Record<string, string> = {};

    // Validar talla de camisa
    if (tallas.talla_camisa && !isValidTalla('camisa', tallas.talla_camisa)) {
      errors.talla_camisa = 'Talla de camisa no válida';
    }

    // Validar talla de pantalón
    if (tallas.talla_pantalon && !isValidTalla('pantalon', tallas.talla_pantalon)) {
      errors.talla_pantalon = 'Talla de pantalón no válida';
    }

    // Validar talla de zapato
    if (tallas.talla_zapato && !isValidTalla('calzado', tallas.talla_zapato)) {
      errors.talla_zapato = 'Talla de zapato no válida';
    }

    return errors;
  }, [isValidTalla]);

  /**
   * Obtiene los nombres legibles de las tallas para mostrar
   * 
   * @param tallas - Objeto con IDs de tallas
   * @returns Objeto con nombres legibles
   */
  const getTallasDisplay = useCallback((tallas: {
    talla_camisa?: string;
    talla_pantalon?: string;
    talla_zapato?: string;
  }) => ({
    camisa: tallas.talla_camisa ? getTallaNombre('camisa', tallas.talla_camisa) : '',
    pantalon: tallas.talla_pantalon ? getTallaNombre('pantalon', tallas.talla_pantalon) : '',
    zapato: tallas.talla_zapato ? getTallaNombre('calzado', tallas.talla_zapato) : '',
  }), [getTallaNombre]);

  return {
    validateTallasForm,
    getTallasDisplay,
  };
};
