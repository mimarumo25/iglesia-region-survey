/**
 * Servicio para la gestión de familias consolidadas
 * Maneja las llamadas al endpoint /api/familias
 */

import { getApiClient, API_ENDPOINTS } from '@/config/api';
import type { 
  FamiliasConsolidadasResponse,
  FamiliasConsultaParams,
  FamiliaConsolidada 
} from '@/types/familias-consolidadas';

// Agregamos el endpoint de familias a la configuración de API
const FAMILIAS_ENDPOINT = '/api/familias';

/**
 * Obtener familias consolidadas con parámetros de filtrado
 */
export async function obtenerFamiliasConsolidadas(
  params: FamiliasConsultaParams = {}
): Promise<FamiliasConsolidadasResponse> {
  try {
    const client = getApiClient();
    
    // Configurar parámetros por defecto
    const consultaParams = {
      limite: 100, // Límite por defecto
      offset: 0,   // Offset por defecto
      ...params
    };

    // Construir query parameters
    const queryParams = new URLSearchParams();
    
    Object.entries(consultaParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${FAMILIAS_ENDPOINT}?${queryParams.toString()}`;
    
    const response = await client.get<FamiliasConsolidadasResponse>(url);
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }

    if (!response.data.exito) {
      throw new Error(response.data.mensaje || 'Error en la consulta de familias');
    }

    console.log('✅ Familias consolidadas obtenidas:', {
      total: response.data.total,
      familias: response.data.datos.length,
      estadisticas: response.data.estadisticas
    });

    return response.data;
    
  } catch (error: any) {
    console.error('❌ Error obteniendo familias consolidadas:', error);
    
    // Manejo específico de errores de red/HTTP
    if (error.response) {
      const statusCode = error.response.status;
      const serverMessage = error.response.data?.mensaje || error.response.data?.message;
      
      switch (statusCode) {
        case 401:
          throw new Error('No tienes autorización para acceder a los datos de familias');
        case 403:
          throw new Error('No tienes permisos para consultar familias');
        case 404:
          throw new Error('El servicio de familias no está disponible');
        case 500:
          throw new Error('Error interno del servidor al consultar familias');
        default:
          throw new Error(serverMessage || `Error del servidor: ${statusCode}`);
      }
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } else {
      throw new Error(error.message || 'Error desconocido al consultar familias');
    }
  }
}

/**
 * Obtener una familia específica por ID
 */
export async function obtenerFamiliaPorId(familiaId: string): Promise<FamiliaConsolidada> {
  try {
    const response = await obtenerFamiliasConsolidadas();
    
    const familia = response.datos.find(f => f.familia_id === familiaId);
    
    if (!familia) {
      throw new Error(`No se encontró la familia con ID: ${familiaId}`);
    }
    
    return familia;
    
  } catch (error: any) {
    console.error('❌ Error obteniendo familia por ID:', error);
    throw error;
  }
}

/**
 * Buscar familias por apellido familiar
 */
export async function buscarFamiliasPorApellido(
  apellido: string,
  limite: number = 50
): Promise<FamiliasConsolidadasResponse> {
  try {
    return await obtenerFamiliasConsolidadas({
      apellido_familiar: apellido,
      limite
    });
  } catch (error: any) {
    console.error('❌ Error buscando familias por apellido:', error);
    throw error;
  }
}

/**
 * Filtrar familias por ubicación
 */
export async function filtrarFamiliasPorUbicacion(
  ubicacion: {
    departamento?: string;
    municipio?: string;
    parroquia?: string;
    sector?: string;
    vereda?: string;
  },
  limite: number = 100
): Promise<FamiliasConsolidadasResponse> {
  try {
    return await obtenerFamiliasConsolidadas({
      ...ubicacion,
      limite
    });
  } catch (error: any) {
    console.error('❌ Error filtrando familias por ubicación:', error);
    throw error;
  }
}

/**
 * Obtener estadísticas generales de familias
 */
export async function obtenerEstadisticasFamilias(): Promise<{
  total_familias: number;
  total_personas: number;
  total_vivos: number;
  total_difuntos: number;
  total_menores: number;
  total_adultos: number;
  familias_con_telefono: number;
  familias_con_email: number;
}> {
  try {
    const response = await obtenerFamiliasConsolidadas({ limite: 1 });
    return response.estadisticas;
  } catch (error: any) {
    console.error('❌ Error obteniendo estadísticas de familias:', error);
    throw error;
  }
}

/**
 * Obtener todas las ubicaciones únicas disponibles
 */
export async function obtenerUbicacionesDisponibles(): Promise<{
  departamentos: string[];
  municipios: string[];
  parroquias: string[];
  sectores: string[];
  veredas: string[];
}> {
  try {
    // Obtener una muestra representativa de familias
    const response = await obtenerFamiliasConsolidadas({ limite: 1000 });
    
    const ubicaciones = {
      departamentos: new Set<string>(),
      municipios: new Set<string>(),
      parroquias: new Set<string>(),
      sectores: new Set<string>(),
      veredas: new Set<string>()
    };
    
    response.datos.forEach(familia => {
      const { ubicacion } = familia;
      
      if (ubicacion.departamento) ubicaciones.departamentos.add(ubicacion.departamento);
      if (ubicacion.municipio) ubicaciones.municipios.add(ubicacion.municipio);
      if (ubicacion.parroquia) ubicaciones.parroquias.add(ubicacion.parroquia);
      if (ubicacion.sector) ubicaciones.sectores.add(ubicacion.sector);
      if (ubicacion.vereda) ubicaciones.veredas.add(ubicacion.vereda);
    });
    
    return {
      departamentos: Array.from(ubicaciones.departamentos).sort(),
      municipios: Array.from(ubicaciones.municipios).sort(),
      parroquias: Array.from(ubicaciones.parroquias).sort(),
      sectores: Array.from(ubicaciones.sectores).sort(),
      veredas: Array.from(ubicaciones.veredas).sort()
    };
    
  } catch (error: any) {
    console.error('❌ Error obteniendo ubicaciones disponibles:', error);
    throw error;
  }
}