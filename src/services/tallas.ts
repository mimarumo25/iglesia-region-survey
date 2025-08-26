import { apiClient } from '@/interceptors/axios';
import { 
  Talla,
  TallaCreate, 
  TallaUpdate, 
  TallasApiResponse,
  ServerResponse,
  TallasStatsResponse
} from '@/types/tallas';

// Servicios para Tallas
export const tallasService = {
  // Obtener todas las tallas con paginación
  getTallas: async (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'talla', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<TallasApiResponse> => {
    const response = await apiClient.get('/api/catalog/tallas', {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  },

  // Buscar tallas
  searchTallas: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TallasApiResponse> => {
    const response = await apiClient.get('/api/catalog/tallas/search', {
      params: { search, page, limit }
    });
    return response.data;
  },

  // Obtener una talla por ID
  getTallaById: async (id: string): Promise<ServerResponse<Talla>> => {
    const response = await apiClient.get(`/api/catalog/tallas/${id}`);
    return response.data;
  },

  // Crear una nueva talla
  createTalla: async (talla: TallaCreate): Promise<ServerResponse<Talla>> => {
    const response = await apiClient.post('/api/catalog/tallas', talla);
    return response.data;
  },

  // Actualizar una talla existente
  updateTalla: async (id: string, talla: TallaUpdate): Promise<ServerResponse<Talla>> => {
    const response = await apiClient.put(`/api/catalog/tallas/${id}`, talla);
    return response.data;
  },

  // Eliminar una talla
  deleteTalla: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/catalog/tallas/${id}`);
  },

  // Obtener estadísticas de tallas
  getTallasStats: async (): Promise<ServerResponse<TallasStatsResponse>> => {
    const response = await apiClient.get('/api/catalog/tallas/stats');
    return response.data;
  },

  // Obtener tallas por tipo de prenda
  getTallasPorTipo: async (tipo: string): Promise<TallasApiResponse> => {
    const response = await apiClient.get(`/api/catalog/tallas/tipo/${tipo}`);
    return response.data;
  },
};
