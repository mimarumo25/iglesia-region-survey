/**
 * 📊 Servicio de Reportes - Sistema MIA
 * 
 * Maneja todas las consultas de reportes avanzados con filtros
 * para los diferentes módulos del sistema (Familias, Difuntos, Salud, Parroquias)
 * 
 * @module services/reportes
 * @version 1.0.0
 */

import { getApiClient } from '@/config/api';

// ==========================================
// TIPOS E INTERFACES
// ==========================================

/**
 * Respuesta base para todos los reportes
 */
interface ReporteBaseResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T[];
  estadisticas?: Record<string, any>;
  paginacion?: {
    pagina_actual: number;
    total_paginas: number;
    total_registros: number;
    registros_por_pagina: number;
  };
}

/**
 * Filtros para reporte de familias
 */
export interface FiltrosReporteFamilias {
  // Filtros geográficos
  parroquia_id?: number | string;
  municipio_id?: number | string;
  sector_id?: number | string;
  
  // Filtros demográficos
  sexo_id?: number | string;
  parentesco_id?: number | string;
  
  // Filtros especiales
  sin_padre?: boolean;
  sin_madre?: boolean;
  
  // Rangos de edad
  edad_min?: number;
  edad_max?: number;
  
  // Configuración de consulta
  incluir_detalles?: boolean;
  pagina?: number;
  limite?: number;
  offset?: number;
}

/**
 * Datos de una familia en el reporte
 */
export interface FamiliaReporte {
  id: number;
  apellido_familiar: string;
  direccion?: string;
  telefono?: string;
  municipio?: string;
  parroquia?: string;
  sector?: string;
  vereda?: string;
  total_miembros?: number;
  miembros?: MiembroFamilia[];
}

/**
 * Miembro individual de una familia
 */
export interface MiembroFamilia {
  id: number;
  nombres: string;
  apellidos: string;
  identificacion: string;
  fecha_nacimiento?: string;
  edad?: number;
  sexo?: string;
  parentesco?: string;
  telefono?: string;
  email?: string;
}

/**
 * Respuesta completa del reporte de familias
 */
export type ReporteFamiliasResponse = ReporteBaseResponse<FamiliaReporte>;

/**
 * Formato de exportación disponible
 */
export type FormatoExportacion = 'pdf' | 'excel' | 'csv';

// ==========================================
// UTILIDADES INTERNAS
// ==========================================

/**
 * Construye query params para la URL
 */
const buildQueryParams = (filtros?: Record<string, any>): string => {
  if (!filtros) return '';
  
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Convertir booleanos a string
      if (typeof value === 'boolean') {
        params.append(key, value ? 'true' : 'false');
      } else {
        params.append(key, String(value));
      }
    }
  });
  
  return params.toString();
};

/**
 * Construye URL completa con query params
 */
const buildUrl = (endpoint: string, filtros?: Record<string, any>): string => {
  const queryString = buildQueryParams(filtros);
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

/**
 * Maneja errores de API de forma centralizada
 */
const handleApiError = (error: any, contexto: string): never => {
  console.error(`Error en ${contexto}:`, error);
  
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
 * Descarga un archivo blob
 */
const descargarArchivo = (blob: Blob, nombreArchivo: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// ==========================================
// FUNCIONES PÚBLICAS
// ==========================================

/**
 * 👨‍👩‍👧‍👦 REPORTE DE FAMILIAS
 * 
 * Obtiene el reporte consolidado de familias con filtros avanzados
 * 
 * @param filtros - Filtros opcionales para la consulta
 * @returns Promise con el reporte de familias
 * 
 * @example
 * // Consulta simple sin filtros
 * const reporte = await getReporteFamilias();
 * 
 * @example
 * // Familias de una parroquia específica
 * const reporte = await getReporteFamilias({
 *   parroquia_id: 5,
 *   incluir_detalles: true
 * });
 * 
 * @example
 * // Familias sin padre con niños menores de 10 años
 * const reporte = await getReporteFamilias({
 *   sin_padre: true,
 *   edad_max: 10,
 *   incluir_detalles: true
 * });
 */
export const getReporteFamilias = async (
  filtros?: FiltrosReporteFamilias
): Promise<ReporteFamiliasResponse> => {
  try {
    const api = getApiClient();
    const url = buildUrl('/api/familias', filtros);
    
    const response = await api.get<ReporteFamiliasResponse>(url);
    
    // Validar respuesta
    if (!response.data) {
      throw new Error('Respuesta vacía del servidor');
    }
    
    if (!response.data.exito) {
      throw new Error(response.data.mensaje || 'Error en la consulta de familias');
    }
    
    return response.data;
    
  } catch (error: any) {
    return handleApiError(error, 'reporte de familias');
  }
};

/**
 * 📄 EXPORTAR REPORTE DE FAMILIAS
 * 
 * Exporta el reporte de familias en el formato especificado (PDF, Excel, CSV)
 * 
 * @param filtros - Filtros para aplicar al reporte
 * @param formato - Formato de exportación ('pdf' | 'excel' | 'csv')
 * @returns Promise que descarga automáticamente el archivo
 * 
 * @example
 * // Exportar a PDF
 * await exportReporteFamilias({ parroquia_id: 5 }, 'pdf');
 * 
 * @example
 * // Exportar a Excel con todos los filtros
 * await exportReporteFamilias({
 *   parroquia_id: 5,
 *   sin_padre: true,
 *   incluir_detalles: true
 * }, 'excel');
 */
export const exportReporteFamilias = async (
  filtros?: FiltrosReporteFamilias,
  formato: FormatoExportacion = 'pdf'
): Promise<void> => {
  try {
    const api = getApiClient();
    
    // Agregar parámetro de formato a los filtros
    const filtrosConFormato = {
      ...filtros,
      formato: formato
    };
    
    const url = buildUrl('/api/familias/export', filtrosConFormato);
    
    const response = await api.get(url, {
      responseType: 'blob'
    });
    
    // Determinar nombre del archivo y tipo MIME
    const extension = formato === 'excel' ? 'xlsx' : formato;
    const timestamp = new Date().toISOString().split('T')[0];
    const nombreArchivo = `reporte_familias_${timestamp}.${extension}`;
    
    // Descargar archivo
    descargarArchivo(response.data, nombreArchivo);
    
  } catch (error: any) {
    return handleApiError(error, `exportación de familias a ${formato.toUpperCase()}`);
  }
};

// ==========================================
// EXPORTACIONES
// ==========================================

export default {
  getReporteFamilias,
  exportReporteFamilias,
};
