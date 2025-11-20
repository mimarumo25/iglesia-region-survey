/**
 * Servicio para obtener estadísticas completas del sistema
 * Endpoint: GET /api/estadisticas/completas
 */

import apiClient from "@/interceptors/axios"
import type { 
  EstadisticasCompletasResponse,
  EstadisticasCompletasDatos 
} from "@/types/estadisticas-completas"

/**
 * Obtiene las estadísticas completas del sistema MIA
 * 
 * Incluye datos de:
 * - Resumen general (personas, familias, usuarios)
 * - Geografía (departamentos, municipios, parroquias)
 * - Población (distribución por sexo, edad, estado civil)
 * - Familias (promedios, distribución)
 * - Salud (enfermedades más comunes)
 * - Educación (profesiones, habilidades)
 * - Vivienda (tipos, servicios públicos)
 * - Catálogos del sistema
 * - Usuarios y roles
 * 
 * @returns Promesa con estadísticas completas
 * @throws Error si la petición falla
 * 
 * @example
 * ```typescript
 * try {
 *   const estadisticas = await obtenerEstadisticasCompletas()
 *   console.log(estadisticas.resumen.totalPersonas)
 * } catch (error) {
 *   console.error('Error:', error)
 * }
 * ```
 */
export const obtenerEstadisticasCompletas = async (): Promise<EstadisticasCompletasDatos> => {
  try {
    const response = await apiClient.get<EstadisticasCompletasResponse>(
      "/api/estadisticas/completas"
    )

    // Validar respuesta
    if (!response.data.exito || !response.data.datos) {
      throw new Error(
        response.data.mensaje || "Error al obtener estadísticas completas"
      )
    }

    return response.data.datos
  } catch (error: any) {
    // Propagar error con mensaje descriptivo
    const errorMessage = error.response?.data?.mensaje 
      || error.message 
      || "Error desconocido al obtener estadísticas completas"
    
    throw new Error(errorMessage)
  }
}
