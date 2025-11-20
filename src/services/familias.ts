/**
 * 👨‍👩‍👧‍👦 Servicio de Familias Consolidado - Sistema MIA
 * 
 * Maneja todas las consultas relacionadas con familias consolidadas,
 * incluyendo miembros y difuntos asociados
 * 
 * @module services/familias
 * @version 1.0.0
 */

import { getApiClient } from '@/config/api';
import type {
  FiltrosFamiliasConsolidado,
  FamiliasConsolidadoResponse,
  FamiliaConsolidada
} from '@/types/familias';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

/**
 * Construye query params para la URL
 */
const buildQueryParams = (filtros?: FiltrosFamiliasConsolidado): string => {
  if (!filtros) return '';
  
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
};

/**
 * Maneja errores de API de forma centralizada
 */
const handleApiError = (error: any, contexto: string): never => {
  console.error(`Error en ${contexto}:`, error);
  
  // Mostrar toast de error
  showErrorToast(error, contexto);
  
  if (error.response) {
    const status = error.response.status;
    const mensaje = error.response.data?.mensaje || error.message;
    
    switch (status) {
      case 400:
        throw new Error(`Parámetros inválidos: ${mensaje}`);
      case 401:
        throw new Error('No autorizado. Por favor inicia sesión nuevamente');
      case 403:
        throw new Error('No tienes permisos para acceder a este recurso');
      case 404:
        throw new Error(`No se encontraron registros para ${contexto}`);
      case 500:
        throw new Error(`Error del servidor en ${contexto}`);
      default:
        throw new Error(mensaje || `Error desconocido en ${contexto}`);
    }
  }
  
  throw new Error(error.message || `Error de red en ${contexto}`);
};

/**
 * 🔍 Obtiene el listado consolidado de familias
 * 
 * Consulta todas las familias con sus miembros y difuntos asociados,
 * aplicando los filtros especificados
 * 
 * @param filtros - Filtros opcionales para la consulta
 * @returns Promise con el listado de familias consolidadas
 * 
 * @example
 * // Consulta simple sin filtros
 * const familias = await getFamiliasConsolidado();
 * 
 * @example
 * // Familias de una parroquia específica
 * const familias = await getFamiliasConsolidado({
 *   id_parroquia: 1,
 *   limite: 50
 * });
 * 
 * @example
 * // Familias con múltiples filtros
 * const familias = await getFamiliasConsolidado({
 *   id_parroquia: 1,
 *   id_municipio: 1,
 *   id_sector: 1,
 *   limite: 100,
 *   offset: 0
 * });
 */
export const getFamiliasConsolidado = async (
  filtros?: FiltrosFamiliasConsolidado
): Promise<FamiliaConsolidada[]> => {
  try {
    const api = getApiClient();
    const queryString = buildQueryParams(filtros);
    const url = queryString ? `/api/familias?${queryString}` : '/api/familias';
    
    const response = await api.get<FamiliasConsolidadoResponse>(url);
    
    // Validar respuesta
    if (!response.data) {
      throw new Error('Respuesta vacía del servidor');
    }
    
    if (!response.data.exito) {
      throw new Error(response.data.mensaje || 'Error en la consulta de familias');
    }
    
    return response.data.datos || [];
    
  } catch (error: any) {
    return handleApiError(error, 'consulta de familias consolidado');
  }
};

/**
 * 📊 Obtiene estadísticas de familias
 * 
 * @param filtros - Filtros para calcular estadísticas
 * @returns Estadísticas calculadas de las familias
 */
export const getEstadisticasFamilias = (familias: FamiliaConsolidada[]) => {
  const totalFamilias = familias.length;
  const totalMiembros = familias.reduce(
    (acc, f) => acc + (f.miembros_familia?.length || 0),
    0
  );
  const totalDifuntos = familias.reduce(
    (acc, f) => acc + (f.difuntos_familia?.length || 0),
    0
  );
  const promedioMiembrosPorFamilia = totalFamilias > 0 
    ? (totalMiembros / totalFamilias).toFixed(1) 
    : '0';

  // Estadísticas por municipio
  const familiasPorMunicipio = familias.reduce((acc, f) => {
    const municipio = f.municipio_nombre || 'Sin municipio';
    acc[municipio] = (acc[municipio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Estadísticas por parroquia
  const familiasPorParroquia = familias.reduce((acc, f) => {
    const parroquia = f.parroquia_nombre || 'Sin parroquia';
    acc[parroquia] = (acc[parroquia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalFamilias,
    totalMiembros,
    totalDifuntos,
    promedioMiembrosPorFamilia,
    familiasPorMunicipio,
    familiasPorParroquia
  };
};

/**
 * 📥 Descarga reporte de familias en formato Excel
 * 
 * Genera y descarga un archivo Excel con el consolidado completo de familias,
 * miembros y difuntos aplicando los filtros especificados
 * 
 * @param filtros - Filtros opcionales para el reporte
 * @returns Promise que se resuelve cuando la descarga inicia
 * 
 * @example
 * // Descargar todas las familias (hasta límite por defecto)
 * await exportFamiliasToExcel();
 * 
 * @example
 * // Descargar familias con filtros específicos
 * await exportFamiliasToExcel({
 *   id_parroquia: 1,
 *   id_municipio: 2,
 *   limite: 500
 * });
 */
export const exportFamiliasToExcel = async (
  filtros?: FiltrosFamiliasConsolidado
): Promise<void> => {
  try {
    const api = getApiClient();
    const queryString = buildQueryParams(filtros);
    const url = queryString 
      ? `/api/familias/excel-completo?${queryString}` 
      : '/api/familias/excel-completo';
    
    const response = await api.get(url, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
    
    // Crear blob y descargar archivo
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Generar nombre de archivo con timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `familias-consolidado-${timestamp}.xlsx`;
    
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    // Mostrar toast de éxito
    showSuccessToast('Excel descargado', 'El archivo se ha generado correctamente');
    
  } catch (error: any) {
    return handleApiError(error, 'exportación de familias a Excel');
  }
};

export default {
  getFamiliasConsolidado,
  getEstadisticasFamilias,
  exportFamiliasToExcel
};
