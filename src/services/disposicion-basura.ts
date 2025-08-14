import client from '@/interceptors/axios';
import {
  DisposicionBasuraResponse,
  DisposicionBasuraCreateResponse,
  DisposicionBasuraUpdateResponse,
  DisposicionBasuraDeleteResponse,
  DisposicionBasuraCreate,
  DisposicionBasuraUpdate,
} from '@/types/disposicion-basura';

/**
 * Servicio para la gestión de Disposición de Basura
 * Maneja todas las operaciones CRUD relacionadas con los tipos de disposición de basura
 */
export class DisposicionBasuraService {
  private static readonly BASE_URL = '/api/catalog/disposicion-basura/tipos';

  /**
   * Obtiene la lista de tipos de disposición de basura con paginación y filtros
   */
  static async getDisposicionBasura(
    limit: number = 10,
    page: number = 1,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<DisposicionBasuraResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    const response = await client.get<DisposicionBasuraResponse>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Busca tipos de disposición de basura por término de búsqueda
   */
  static async searchDisposicionBasura(
    searchTerm: string,
    limit: number = 10,
    page: number = 1,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<DisposicionBasuraResponse> {
    const params = new URLSearchParams({
      search: searchTerm,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    const response = await client.get<DisposicionBasuraResponse>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Crea un nuevo tipo de disposición de basura
   */
  static async createDisposicionBasura(data: DisposicionBasuraCreate): Promise<DisposicionBasuraCreateResponse> {
    const response = await client.post<DisposicionBasuraCreateResponse>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Actualiza un tipo de disposición de basura existente
   */
  static async updateDisposicionBasura(id: string, data: DisposicionBasuraUpdate): Promise<DisposicionBasuraUpdateResponse> {
    const response = await client.put<DisposicionBasuraUpdateResponse>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Elimina un tipo de disposición de basura
   */
  static async deleteDisposicionBasura(id: string): Promise<DisposicionBasuraDeleteResponse> {
    const response = await client.delete<DisposicionBasuraDeleteResponse>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Obtiene un tipo de disposición de basura por ID
   */
  static async getDisposicionBasuraById(id: string): Promise<{ status: 'success'; data: any }> {
    const response = await client.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

// Export como instancia para facilitar el uso
export const disposicionBasuraService = DisposicionBasuraService;
