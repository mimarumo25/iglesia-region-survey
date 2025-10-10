/**
 * Servicio para obtener estadísticas de encuestas
 */

import apiClient from "@/interceptors/axios";
import type { 
  EstadisticasEncuestaResponse, 
  EstadisticasDashboard 
} from "@/types/estadisticas";

/**
 * Obtiene las estadísticas generales de encuestas desde el API
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
