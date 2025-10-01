import client from '@/interceptors/axios';
import {
  EstadoCivilResponse,
  EstadoCivilCreateResponse,
  EstadoCivilUpdateResponse,
  EstadoCivilDeleteResponse,
  EstadoCivilCreate,
  EstadoCivilUpdate,
} from '@/types/estados-civiles';

/**
 * Servicio para la gestión de Estados Civiles (Situaciones Civiles)
 * Maneja todas las operaciones CRUD relacionadas con los estados civiles
 */

// URL base para el servicio de estados civiles
const BASE_URL = '/api/catalog/situaciones-civiles';

export class EstadosCivilesService {

  /**
   * Obtiene la lista de estados civiles con paginación y filtros
   */
  static async getEstadosCiviles(
    includeInactive: boolean = false,
    limit: number = 10,
    page: number = 1,
    orderBy: string = 'id',
    orderDirection: 'ASC' | 'DESC' = 'ASC'
  ): Promise<EstadoCivilResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      includeInactive: includeInactive.toString(),
      orderBy,
      orderDirection,
    });

    const response = await client.get<EstadoCivilResponse>(
      `${BASE_URL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Busca estados civiles por término de búsqueda
   */
  static async searchEstadosCiviles(
    searchTerm: string,
    includeInactive: boolean = false,
    limit: number = 10,
    page: number = 1,
    orderBy: string = 'id',
    orderDirection: 'ASC' | 'DESC' = 'ASC'
  ): Promise<EstadoCivilResponse> {
    const params = new URLSearchParams({
      search: searchTerm,
      page: page.toString(),
      limit: limit.toString(),
      includeInactive: includeInactive.toString(),
      orderBy,
      orderDirection,
    });

    const response = await client.get<EstadoCivilResponse>(
      `${BASE_URL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Obtiene solo los estados civiles activos
   */
  static async getEstadosCivilesActivos(
    limit: number = 10,
    page: number = 1
  ): Promise<EstadoCivilResponse> {
    return this.getEstadosCiviles(false, limit, page);
  }

  /**
   * Crea un nuevo estado civil
   */
  static async createEstadoCivil(data: EstadoCivilCreate): Promise<EstadoCivilCreateResponse> {
    const response = await client.post<EstadoCivilCreateResponse>(BASE_URL, data);
    return response.data;
  }

  /**
   * Actualiza un estado civil existente
   */
  static async updateEstadoCivil(id: number, data: EstadoCivilUpdate): Promise<EstadoCivilUpdateResponse> {
    const response = await client.put<EstadoCivilUpdateResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Elimina un estado civil
   */
  static async deleteEstadoCivil(id: number): Promise<EstadoCivilDeleteResponse> {
    const response = await client.delete<EstadoCivilDeleteResponse>(`${BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Obtiene un estado civil por ID
   */
  static async getEstadoCivilById(id: number): Promise<{ status: 'success'; data: any }> {
    const response = await client.get(`${BASE_URL}/${id}`);
    return response.data;
  }
}

// Exportar instancia por defecto
export const estadosCivilesService = EstadosCivilesService;
