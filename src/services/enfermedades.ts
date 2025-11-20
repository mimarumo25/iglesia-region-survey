import { apiClient } from '@/interceptors/axios';
import { 
  Enfermedad, 
  EnfermedadCreate, 
  EnfermedadUpdate, 
  EnfermedadesResponse,
  ApiResponse
} from '@/types/enfermedades';
import { API_ENDPOINTS } from '@/config/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

class EnfermedadesService {
  // Obtener todas las enfermedades con paginación
  async getEnfermedades(
    page: number = 1,
    limit: number = 50,
    sortBy: string = 'id_enfermedad',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<EnfermedadesResponse> {
    try {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.CATALOG.ENFERMEDADES,
        {
          params: {
            sortBy,
            sortOrder,
          },
        }
      );
      
      // La API devuelve directamente el array de enfermedades en data
      const enfermedades = response.data.data;
      const totalCount = response.data.total || enfermedades.length;
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
      showErrorToast(error, 'obtener enfermedades');
      throw error;
    }
  }

  // Obtener una enfermedad por ID
  async getEnfermedadById(id: string): Promise<Enfermedad> {
    try {
      const response = await apiClient.get<ApiResponse<Enfermedad>>(
        `${API_ENDPOINTS.CATALOG.ENFERMEDADES}/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener enfermedad por ID:', error);
      showErrorToast(error, 'obtener enfermedad por ID');
      throw error;
    }
  }

  // Crear nueva enfermedad
  async createEnfermedad(enfermedad: EnfermedadCreate): Promise<Enfermedad> {
    try {
      const response = await apiClient.post<ApiResponse<Enfermedad>>(
        API_ENDPOINTS.CATALOG.ENFERMEDADES,
        enfermedad
      );
      showSuccessToast('Enfermedad creada', 'La enfermedad se ha registrado correctamente');
      return response.data.data;
    } catch (error) {
      console.error('Error al crear enfermedad:', error);
      showErrorToast(error, 'crear enfermedad');
      throw error;
    }
  }

  // Actualizar enfermedad existente
  async updateEnfermedad(id: string, enfermedad: EnfermedadUpdate): Promise<Enfermedad> {
    try {
      const response = await apiClient.put<ApiResponse<Enfermedad>>(
        `${API_ENDPOINTS.CATALOG.ENFERMEDADES}/${id}`,
        enfermedad
      );
      showSuccessToast('Enfermedad actualizada', 'Los cambios se han guardado correctamente');
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar enfermedad:', error);
      showErrorToast(error, 'actualizar enfermedad');
      throw error;
    }
  }

  // Eliminar enfermedad
  async deleteEnfermedad(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.CATALOG.ENFERMEDADES}/${id}`);
      showSuccessToast('Enfermedad eliminada', 'El registro se ha eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar enfermedad:', error);
      showErrorToast(error, 'eliminar enfermedad');
      throw error;
    }
  }

  // Buscar enfermedades por nombre o descripción (implementación local)
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
        (enfermedad.descripcion && enfermedad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
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
      showErrorToast(error, 'buscar enfermedades');
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
      // Nota: El modelo Enfermedad no tiene campo categoria, se filtra por descripción
      const allEnfermedades = await this.getEnfermedades(1, 1000);
      const filteredData = allEnfermedades.data.filter(enfermedad =>
        enfermedad.descripcion?.toLowerCase().includes(categoria.toLowerCase()) ||
        enfermedad.nombre.toLowerCase().includes(categoria.toLowerCase())
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
      showErrorToast(error, 'obtener enfermedades por categoría');
      throw error;
    }
  }
}

export const enfermedadesService = new EnfermedadesService();
export default enfermedadesService;
