/**
 * 🏥 Servicio de API para el módulo de Salud
 * Sistema MIA - Gestión de Personas con Condiciones de Salud
 * 
 * Endpoint base: /api/personas/salud
 */

import { getApiClient } from '@/config/api';
import type { PersonaSalud, SaludFiltros, SaludResponse } from '@/types/salud';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

// Endpoint para el módulo de salud
const SALUD_ENDPOINT = '/api/personas/salud';
const SALUD_EXPORT_ENDPOINT = '/api/personas/salud/reporte/excel';

/**
 * 🔍 Obtiene el listado de personas con condiciones de salud
 * 
 * @param filtros - Filtros opcionales para la consulta
 * @returns Promise con objeto que contiene personas y total
 * 
 * @example
 * ```typescript
 * // Consulta básica
 * const { personas, total } = await getPersonasSalud();
 * 
 * // Con filtros específicos
 * const { personas, total } = await getPersonasSalud({
 *   id_enfermedad: 1,
 *   edad_min: 18,
 *   edad_max: 65,
 *   id_sexo: 1,
 *   id_parroquia: 1,
 *   limite: 100
 * });
 * ```
 */
export const getPersonasSalud = async (filtros?: SaludFiltros): Promise<{ personas: PersonaSalud[], total: number }> => {
  try {
    const api = getApiClient();
    const params = new URLSearchParams();

    // Agregar parámetros solo si están definidos
    if (filtros?.id_enfermedad) params.append('id_enfermedad', filtros.id_enfermedad.toString());
    if (filtros?.edad_min !== undefined) params.append('edad_min', filtros.edad_min.toString());
    if (filtros?.edad_max !== undefined) params.append('edad_max', filtros.edad_max.toString());
    if (filtros?.id_sexo) params.append('id_sexo', filtros.id_sexo.toString());
    if (filtros?.id_parroquia) params.append('id_parroquia', filtros.id_parroquia.toString());
    if (filtros?.id_municipio) params.append('id_municipio', filtros.id_municipio.toString());
    if (filtros?.id_sector) params.append('id_sector', filtros.id_sector.toString());
    if (filtros?.id_corregimiento) params.append('id_corregimiento', filtros.id_corregimiento.toString());
    if (filtros?.id_centro_poblado) params.append('id_centro_poblado', filtros.id_centro_poblado.toString());
    if (filtros?.limite) params.append('limite', filtros.limite.toString());
    if (filtros?.offset !== undefined) params.append('offset', filtros.offset.toString());

    const queryString = params.toString();
    const url = `${SALUD_ENDPOINT}${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<SaludResponse>(url);
    
    // La API devuelve { datos: [...], total: number, filtros_aplicados: {...} }
    return {
      personas: response.data.datos || [],
      total: response.data.total || 0
    };
  } catch (error: any) {
    console.error('Error obteniendo personas con condiciones de salud:', error);
    
    // Mostrar toast de error
    showErrorToast(error, 'obtener personas con condiciones de salud');
    
    throw new Error(
      error.response?.data?.message || 
      'Error al obtener el listado de personas con condiciones de salud'
    );
  }
};

/**
 * 📥 Exporta el reporte de salud a Excel
 * 
 * Endpoint: /api/personas/salud/reporte/excel
 * Límite por defecto: 5000 registros
 * 
 * @param filtros - Filtros opcionales para la exportación
 * 
 * @example
 * ```typescript
 * // Exportación completa
 * await exportSaludToExcel();
 * 
 * // Con filtros específicos
 * await exportSaludToExcel({
 *   id_enfermedad: 1,
 *   enfermedad: 'diabetes', // Nombre de la enfermedad
 *   id_parroquia: 1,
 *   limite: 10000 // Opcional, por defecto 5000
 * });
 * ```
 */
export const exportSaludToExcel = async (filtros?: SaludFiltros): Promise<void> => {
  try {
    const api = getApiClient();
    const params = new URLSearchParams();

    // Agregar parámetros solo si están definidos
    if (filtros?.id_enfermedad) params.append('id_enfermedad', filtros.id_enfermedad.toString());
    if (filtros?.enfermedad) params.append('enfermedad', filtros.enfermedad);
    if (filtros?.edad_min !== undefined) params.append('edad_min', filtros.edad_min.toString());
    if (filtros?.edad_max !== undefined) params.append('edad_max', filtros.edad_max.toString());
    if (filtros?.id_sexo) params.append('id_sexo', filtros.id_sexo.toString());
    if (filtros?.id_parroquia) params.append('id_parroquia', filtros.id_parroquia.toString());
    if (filtros?.id_municipio) params.append('id_municipio', filtros.id_municipio.toString());
    if (filtros?.id_sector) params.append('id_sector', filtros.id_sector.toString());
    if (filtros?.id_corregimiento) params.append('id_corregimiento', filtros.id_corregimiento.toString());
    if (filtros?.id_centro_poblado) params.append('id_centro_poblado', filtros.id_centro_poblado.toString());
    
    // Límite por defecto de 5000 para exportación (como en el ejemplo curl)
    const limite = filtros?.limite || 5000;
    params.append('limite', limite.toString());

    const queryString = params.toString();
    const url = `${SALUD_EXPORT_ENDPOINT}${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url, {
      responseType: 'blob',
    });

    // Crear blob y descargar archivo
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `reporte_salud_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(link.href);
    
    // Toast de éxito
    showSuccessToast('Reporte descargado', 'El archivo Excel se ha generado correctamente');
    
  } catch (error: any) {
    console.error('Error exportando reporte de salud:', error);
    
    // Mostrar toast de error
    showErrorToast(error, 'exportar reporte de salud a Excel');
    
    throw new Error(
      error.response?.data?.message || 
      'Error al exportar el reporte de salud a Excel'
    );
  }
};
