import { useCallback } from 'react';
import { useConfigurationData } from './useConfigurationData';
import {
  procesarDisposicionBasura,
  reporteMapeoDisposicionBasura,
  validarMapeoCompleto,
  DISPOSICION_BASURA_CATEGORIAS
} from '@/utils/disposicionBasuraMapping';

export interface DisposicionBasuraResult {
  basuras_recolector: boolean;
  basuras_quemada: boolean;
  basuras_enterrada: boolean;
  basuras_recicla: boolean;
  basuras_aire_libre: boolean;
  basuras_no_aplica: boolean;
}

export interface DisposicionBasuraHookReturn {
  // Procesar IDs seleccionados y obtener booleanos
  mapearDisposicionBasura: (selectedIds: string[]) => DisposicionBasuraResult;
  
  // Obtener todas las opciones disponibles
  opcionesDisponibles: any[];
  
  // Obtener una categoría por ID
  obtenerCategoria: (id: string) => string | null;
  
  // Validar que todas las opciones estén mapeadas
  validarMapeo: () => { valido: boolean; noMapeados: string[] };
  
  // Obtener reporte de debug
  obtenerReporte: () => string;
  
  // Obtener configuración de categorías
  categorias: typeof DISPOSICION_BASURA_CATEGORIAS;
  
  // Obtener solo los booleanos que estén en true
  obtenerSeleccionados: (booleanos: DisposicionBasuraResult) => string[];
  
  // Resetear todos los booleanos a false
  resetear: () => DisposicionBasuraResult;
}

/**
 * Hook para manejo 100% dinámico de disposición de basura
 * 
 * EJEMPLO DE USO:
 * ```tsx
 * const { mapearDisposicionBasura, obtenerSeleccionados } = useDisposicionBasuraMapping();
 * 
 * // Procesar IDs seleccionados
 * const resultado = mapearDisposicionBasura(['id-1', 'id-3']);
 * console.log(resultado);
 * // { basuras_recolector: true, basuras_quemada: false, ... }
 * 
 * // Obtener solo los seleccionados
 * const seleccionados = obtenerSeleccionados(resultado);
 * console.log(seleccionados); // ['basuras_recolector']
 * ```
 */
export const useDisposicionBasuraMapping = (): DisposicionBasuraHookReturn => {
  const configurationData = useConfigurationData();
  
  // Procesar IDs seleccionados
  const mapearDisposicionBasura = useCallback(
    (selectedIds: string[]): DisposicionBasuraResult => {
      return procesarDisposicionBasura(
        selectedIds,
        configurationData.disposicionBasuraOptions || []
      );
    },
    [configurationData.disposicionBasuraOptions]
  );
  
  // Obtener categoría por ID
  const obtenerCategoria = useCallback(
    (id: string): string | null => {
      const option = (configurationData.disposicionBasuraOptions || []).find(
        (opt: any) => opt.value === id
      );
      return option?.label || null;
    },
    [configurationData.disposicionBasuraOptions]
  );
  
  // Validar mapeo
  const validarMapeo = useCallback(() => {
    return validarMapeoCompleto(configurationData.disposicionBasuraOptions || []);
  }, [configurationData.disposicionBasuraOptions]);
  
  // Obtener reporte
  const obtenerReporte = useCallback(() => {
    return reporteMapeoDisposicionBasura(configurationData.disposicionBasuraOptions || []);
  }, [configurationData.disposicionBasuraOptions]);
  
  // Obtener seleccionados (booleanos en true)
  const obtenerSeleccionados = useCallback((booleanos: DisposicionBasuraResult): string[] => {
    return Object.entries(booleanos)
      .filter(([, valor]) => valor === true)
      .map(([clave]) => clave);
  }, []);
  
  // Resetear a false
  const resetear = useCallback((): DisposicionBasuraResult => {
    return {
      basuras_recolector: false,
      basuras_quemada: false,
      basuras_enterrada: false,
      basuras_recicla: false,
      basuras_aire_libre: false,
      basuras_no_aplica: false
    };
  }, []);
  
  return {
    mapearDisposicionBasura,
    opcionesDisponibles: configurationData.disposicionBasuraOptions || [],
    obtenerCategoria,
    validarMapeo,
    obtenerReporte,
    categorias: DISPOSICION_BASURA_CATEGORIAS,
    obtenerSeleccionados,
    resetear
  };
};
