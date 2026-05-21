import client from '@/interceptors/axios';
import {
  LiderazgoResponse,
  LiderazgoCreateResponse,
  LiderazgoUpdateResponse,
  LiderazgoDeleteResponse,
  LiderazgoSelectResponse,
  LiderazgoStatsResponse,
  PersonaLiderazgoResponse,
  TipoLiderazgoCreate,
  TipoLiderazgoUpdate,
} from '@/types/liderazgo';

const BASE_URL = '/api/catalog/liderazgo';

export class LiderazgoService {

  /**
   * Obtiene la lista de tipos de liderazgo con paginación y filtros
   */
  static async getLiderazgos(
    includeInactive: boolean = false,
    limit: number = 100,
    page: number = 1,
    orderBy: string = 'id_tipo_liderazgo',
    orderDirection: 'ASC' | 'DESC' = 'ASC'
  ): Promise<LiderazgoResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      includeInactive: includeInactive.toString(),
      orderBy,
      orderDirection,
    });
    const response = await client.get<LiderazgoResponse>(`${BASE_URL}?${params.toString()}`);
    // API devuelve: { success, data: { status, data: [...], total, ... } }
    return response.data;
  }

  /**
   * Busca tipos de liderazgo por término de búsqueda
   */
  static async searchLiderazgos(
    searchTerm: string,
    includeInactive: boolean = false,
    limit: number = 100,
    page: number = 1,
    orderBy: string = 'id_tipo_liderazgo',
    orderDirection: 'ASC' | 'DESC' = 'ASC'
  ): Promise<LiderazgoResponse> {
    const params = new URLSearchParams({
      search: searchTerm,
      page: page.toString(),
      limit: limit.toString(),
      includeInactive: includeInactive.toString(),
      orderBy,
      orderDirection,
    });
    const response = await client.get<LiderazgoResponse>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  }

  /**
   * Obtiene tipos de liderazgo para dropdown/select
   */
  static async getLiderazgosSelect(): Promise<LiderazgoSelectResponse> {
    const response = await client.get<LiderazgoSelectResponse>(`${BASE_URL}/select`);
    return response.data;
  }

  /**
   * Obtiene estadísticas de tipos de liderazgo
   */
  static async getLiderazgosStats(): Promise<LiderazgoStatsResponse> {
    const response = await client.get<LiderazgoStatsResponse>(`${BASE_URL}/stats`);
    return response.data;
  }

  /**
   * Obtiene un tipo de liderazgo por ID
   */
  static async getLiderazgoById(id: string): Promise<LiderazgoCreateResponse> {
    const response = await client.get<LiderazgoCreateResponse>(`${BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Crea un nuevo tipo de liderazgo
   */
  static async createLiderazgo(data: TipoLiderazgoCreate): Promise<LiderazgoCreateResponse> {
    const response = await client.post<LiderazgoCreateResponse>(BASE_URL, data);
    return response.data;
  }

  /**
   * Actualiza un tipo de liderazgo existente
   */
  static async updateLiderazgo(id: string, data: TipoLiderazgoUpdate): Promise<LiderazgoUpdateResponse> {
    const response = await client.put<LiderazgoUpdateResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Desactiva un tipo de liderazgo
   */
  static async deleteLiderazgo(id: string): Promise<LiderazgoDeleteResponse> {
    const response = await client.delete<LiderazgoDeleteResponse>(`${BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Obtiene los liderazgos asignados a una persona
   */
  static async getLiderazgosByPersona(idPersona: number): Promise<PersonaLiderazgoResponse> {
    const response = await client.get<PersonaLiderazgoResponse>(`${BASE_URL}/persona/${idPersona}`);
    return response.data;
  }

  /**
   * Asigna un tipo de liderazgo a una persona
   */
  static async assignLiderazgoToPersona(
    idPersona: number,
    idTipoLiderazgo: number
  ): Promise<{ status: 'success'; message: string }> {
    const response = await client.post(`${BASE_URL}/persona/${idPersona}`, { idTipoLiderazgo });
    return response.data;
  }

  /**
   * Quita un tipo de liderazgo de una persona
   */
  static async removeLiderazgoFromPersona(
    idPersona: number,
    idTipoLiderazgo: number
  ): Promise<LiderazgoDeleteResponse> {
    const response = await client.delete<LiderazgoDeleteResponse>(
      `${BASE_URL}/persona/${idPersona}/${idTipoLiderazgo}`
    );
    return response.data;
  }
}

export const liderazgoService = LiderazgoService;
