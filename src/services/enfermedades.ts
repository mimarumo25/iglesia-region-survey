import { apiClient } from '@/interceptors/axios';
import { 
  Enfermedad, 
  EnfermedadCreate, 
  EnfermedadUpdate, 
  EnfermedadesResponse,
  ApiResponse,
  EnfermedadesData
} from '@/types/enfermedades';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://206.62.139.100:3000';

class EnfermedadesService {
  // Obtener todas las enfermedades con paginación
  async getEnfermedades(
    page: number = 1,
    limit: number = 50,
    sortBy: string = 'id_enfermedad',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<EnfermedadesResponse> {
    try {
      const response = await apiClient.get<ApiResponse<EnfermedadesData>>(
        `/api/catalog/enfermedades`,
        {
          params: {
            sortBy,
            sortOrder,
          },
        }
      );
      
      const { enfermedades, totalCount } = response.data.data;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Aplicar paginación local si es necesaria
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = enfermedades.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: totalCount,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Error al obtener enfermedades:', error);
      throw error;
    }
  }

  // Obtener una enfermedad por ID
  async getEnfermedadById(id: string): Promise<Enfermedad> {
    try {
      const response = await apiClient.get<ApiResponse<Enfermedad>>(
        `/api/catalog/enfermedades/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener enfermedad por ID:', error);
      throw error;
    }
  }

  // Crear nueva enfermedad
  async createEnfermedad(enfermedad: EnfermedadCreate): Promise<Enfermedad> {
    try {
      const response = await apiClient.post<ApiResponse<Enfermedad>>(
        `/api/catalog/enfermedades`,
        enfermedad
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al crear enfermedad:', error);
      throw error;
    }
  }

  // Actualizar enfermedad existente
  async updateEnfermedad(id: string, enfermedad: EnfermedadUpdate): Promise<Enfermedad> {
    try {
      const response = await apiClient.put<ApiResponse<Enfermedad>>(
        `/api/catalog/enfermedades/${id}`,
        enfermedad
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar enfermedad:', error);
      throw error;
    }
  }

  // Eliminar enfermedad
  async deleteEnfermedad(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/catalog/enfermedades/${id}`);
    } catch (error) {
      console.error('Error al eliminar enfermedad:', error);
      throw error;
    }
  }

  // Buscar enfermedades por nombre o categoría (implementación local)
  async searchEnfermedades(
    searchTerm: string,
    page: number = 1,
    limit: number = 50
  ): Promise<EnfermedadesResponse> {
    try {
      // Por ahora buscamos localmente hasta que el backend implemente búsqueda
      const allEnfermedades = await this.getEnfermedades(1, 1000);
      const filteredData = allEnfermedades.data.filter(enfermedad =>
        enfermedad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enfermedad.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const totalCount = filteredData.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: totalCount,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Error al buscar enfermedades:', error);
      throw error;
    }
  }

  // Obtener enfermedades por categoría (implementación local)
  async getEnfermedadesByCategoria(
    categoria: string,
    page: number = 1,
    limit: number = 50
  ): Promise<EnfermedadesResponse> {
    try {
      // Por ahora filtramos localmente hasta que el backend implemente filtrado
      const allEnfermedades = await this.getEnfermedades(1, 1000);
      const filteredData = allEnfermedades.data.filter(enfermedad =>
        enfermedad.categoria === categoria
      );
      
      const totalCount = filteredData.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: totalCount,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Error al obtener enfermedades por categoría:', error);
      throw error;
    }
  }
}

export const enfermedadesService = new EnfermedadesService();
export default enfermedadesService;
