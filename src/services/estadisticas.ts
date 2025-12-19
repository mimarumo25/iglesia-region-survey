/**
 * @fileoverview Servicio de Estadísticas de Encuestas - Sistema MIA
 * 
 * Proporciona funcionalidades para obtener y procesar estadísticas
 * agregadas del sistema de encuestas, incluyendo:
 * - Total de encuestas, familias y personas
 * - Indicadores de completitud
 * - Promedios y métricas calculadas
 * - Cobertura geográfica
 * 
 * Todas las funciones realizan:
 * - Validación de respuestas del API
 * - Conversión de tipos (strings → números)
 * - Manejo de errores robusto
 * - Transformación a tipos TypeScript tipados
 * 
 * @module services/estadisticas
 * @version 1.0.0
 */

import apiClient from "@/interceptors/axios";
import type { 
  EstadisticasEncuestaResponse, 
  EstadisticasDashboard 
} from "@/types/estadisticas";

/**
 * Obtiene estadísticas generales de encuestas
 * 
 * Consulta el endpoint de estadísticas del API y procesa los datos
 * para presentación en el dashboard. Realiza conversiones de tipo
 * y cálculos derivados (familias pendientes).
 * 
 * @async
 * @function obtenerEstadisticasEncuesta
 * @returns {Promise<EstadisticasDashboard>} Estadísticas procesadas para dashboard
 * @throws {Error} Si la petición falla, el status no es "success", o faltan datos
 * 
 * @example
 * ```typescript
 * try {
 *   const stats = await obtenerEstadisticasEncuesta();
 *   console.log(`Total encuestas: ${stats.totalEncuestas}`);
 *   console.log(`Familias completadas: ${stats.familiasCompletadas}`);
 *   console.log(`Promedio tamaño: ${stats.promedioTamañoFamilia}`);
 * } catch (error) {
 *   console.error('Error cargando estadísticas:', error);
 * }
 * ```
 * 
 * @description
 * Endpoint: GET /api/encuesta/estadisticas
 * 
 * Respuesta esperada del API:
 * ```json
 * {
 *   "status": "success",
 *   "data": {
 *     "total_encuestas": "125",
 *     "total_familias": "120",
 *     "familias_completadas": "100",
 *     "total_personas": "450",
 *     "total_difuntos": "15",
 *     "promedio_tamaño_familia": "3.75",
 *     "municipios_cubiertos": "5",
 *     "ultima_encuesta_fecha": "2024-01-15"
 *   }
 * }
 * ```
 * 
 * Endpoint: GET /api/encuesta/estadisticas
 * 
 * @returns Promesa con estadísticas procesadas para el dashboard
 * @throws Error si la petición falla o el formato de respuesta es inválido
 * 
 * @example
 * ```typescript
 * try {
 *   const estadisticas = await obtenerEstadisticasEncuesta();
 *   console.log(estadisticas.totalEncuestas);
 * } catch (error) {
 *   console.error('Error al obtener estadísticas:', error);
 * }
 * ```
 */
export const obtenerEstadisticasEncuesta = async (): Promise<EstadisticasDashboard> => {
  try {
    const response = await apiClient.get<EstadisticasEncuestaResponse>(
      "/api/encuesta/estadisticas"
    );

    // Validar respuesta
    if (response.data.status !== "success" || !response.data.data) {
      throw new Error(
        response.data.message || "Error al obtener estadísticas de encuestas"
      );
    }

    // Convertir strings a números y procesar datos
    const data = response.data.data;
    const totalFamilias = parseInt(data.total_familias, 10) || 0;
    const familiasCompletadas = parseInt(data.familias_completadas, 10) || 0;

    // Retornar datos procesados
    const estadisticas: EstadisticasDashboard = {
      totalEncuestas: parseInt(data.total_encuestas, 10) || 0,
      totalFamilias,
      familiasCompletadas,
      familiasPendientes: totalFamilias - familiasCompletadas,
      totalPersonas: parseInt(data.total_personas, 10) || 0,
      totalDifuntos: parseInt(data.total_difuntos, 10) || 0,
      promedioTamañoFamilia: parseFloat(data.promedio_tamaño_familia) || 0,
      municipiosCubiertos: parseInt(data.municipios_cubiertos, 10) || 0,
      ultimaEncuestaFecha: data.ultima_encuesta_fecha || ""
    };

    return estadisticas;
  } catch (error: any) {
    // Propagar error con mensaje descriptivo
    const errorMessage = error.response?.data?.message 
      || error.message 
      || "Error desconocido al obtener estadísticas";
    
    throw new Error(errorMessage);
  }
};
