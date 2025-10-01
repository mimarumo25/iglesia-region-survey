/**
 * Servicio API para Difuntos
 * Sistema MIA - Gestión Integral de Iglesias
 * 
 * Este servicio maneja todas las operaciones relacionadas con la consulta
 * de difuntos a través del endpoint /api/difuntos
 */

import { getApiClient, API_ENDPOINTS } from '@/config/api';
import { DifuntosResponse, DifuntosFilters } from '@/types/difuntos';

/**
 * Obtiene la lista de difuntos con filtros opcionales
 * 
 * @param filters - Filtros a aplicar en la consulta
 * @returns Promise con la respuesta que contiene difuntos, total y filtros aplicados
 * 
 * @example
 * ```typescript
 * // Consulta básica
 * const response = await getDifuntos();
 * 
 * // Consulta con filtros
 * const response = await getDifuntos({
 *   id_parentesco: '1',
 *   fecha_inicio: '2020-01-01',
 *   fecha_fin: '2023-12-31',
 *   id_municipio: '1',
 *   id_parroquia: '1'
 * });
 * ```
 */
export const getDifuntos = async (filters?: DifuntosFilters): Promise<DifuntosResponse> => {
  try {
    const api = getApiClient();
    
    // Construir query parameters filtrando valores vacíos o nulos
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.DIFUNTOS}?${queryString}` : API_ENDPOINTS.DIFUNTOS;
    
    const response = await api.get<DifuntosResponse>(url);
    
    // Validar que la respuesta tenga la estructura esperada
    if (!response.data || typeof response.data.exito === 'undefined') {
      throw new Error('Respuesta de la API en formato inesperado');
    }
    
    // Si la API indica error en la respuesta
    if (!response.data.exito) {
      throw new Error(response.data.mensaje || 'Error en la consulta de difuntos');
    }
    
    return response.data;
    
  } catch (error: any) {
    console.error('Error fetching difuntos:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response?.status === 404) {
      throw new Error('No se encontraron registros de difuntos');
    } else if (error.response?.status === 400) {
      throw new Error('Los filtros proporcionados no son válidos');
    } else if (error.response?.status === 401) {
      throw new Error('No está autorizado para consultar esta información');
    } else if (error.response?.status >= 500) {
      throw new Error('Error interno del servidor. Por favor, inténtelo más tarde');
    } else {
      throw new Error(error.message || 'Error al consultar los difuntos');
    }
  }
};

/**
 * Descarga el reporte de difuntos en formato Excel
 * Usa el endpoint específico /api/difuntos/reporte/excel
 * 
 * @param filters - Filtros aplicados en la consulta (mismo formato que getDifuntos)
 * @returns Promise con el blob del Excel generado
 */
export const downloadDifuntosExcelReport = async (filters?: DifuntosFilters): Promise<Blob> => {
  try {
    const api = getApiClient();
    
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.DIFUNTOS}/reporte/excel?${queryString}` : `${API_ENDPOINTS.DIFUNTOS}/reporte/excel`;
    
    const response = await api.get(url, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
    
    return response.data;
    
  } catch (error: any) {
    console.error('Error downloading difuntos Excel report:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response?.status === 404) {
      throw new Error('No se encontraron registros de difuntos para generar el reporte');
    } else if (error.response?.status === 400) {
      throw new Error('Los filtros proporcionados no son válidos para el reporte');
    } else if (error.response?.status === 401) {
      throw new Error('No está autorizado para descargar este reporte');
    } else if (error.response?.status >= 500) {
      throw new Error('Error interno del servidor al generar el reporte. Por favor, inténtelo más tarde');
    } else {
      throw new Error(error.message || 'Error al descargar el reporte de difuntos');
    }
  }
};

/**
 * Exporta los difuntos consultados a PDF
 * 
 * @param filters - Filtros aplicados en la consulta
 * @returns Promise con el blob del PDF generado
 */
export const exportDifuntosToPDF = async (filters?: DifuntosFilters): Promise<Blob> => {
  try {
    const api = getApiClient();
    
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    // Agregar parámetro de formato
    queryParams.append('formato', 'pdf');
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.DIFUNTOS}/export?${queryString}` : `${API_ENDPOINTS.DIFUNTOS}/export?formato=pdf`;
    
    const response = await api.get(url, {
      responseType: 'blob'
    });
    
    return response.data;
    
  } catch (error: any) {
    console.error('Error exporting difuntos to PDF:', error);
    throw new Error('Error al generar el PDF de difuntos');
  }
};

/**
 * Exporta los difuntos consultados a Excel
 * 
 * @param filters - Filtros aplicados en la consulta
 * @returns Promise con el blob del Excel generado
 */
export const exportDifuntosToExcel = async (filters?: DifuntosFilters): Promise<Blob> => {
  try {
    const api = getApiClient();
    
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    // Agregar parámetro de formato
    queryParams.append('formato', 'excel');
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.DIFUNTOS}/export?${queryString}` : `${API_ENDPOINTS.DIFUNTOS}/export?formato=excel`;
    
    const response = await api.get(url, {
      responseType: 'blob'
    });
    
    return response.data;
    
  } catch (error: any) {
    console.error('Error exporting difuntos to Excel:', error);
    throw new Error('Error al generar el Excel de difuntos');
  }
};