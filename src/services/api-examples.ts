// Ejemplo de servicios que usan el cliente autenticado
import { apiGet, apiPost, apiPut, apiDelete } from '@/interceptors/axios';

/**
 * Ejemplo de servicio para gestión de encuestas
 * Demuestra cómo usar el cliente API autenticado
 */
export class SurveyService {
  /**
   * Obtener todas las encuestas del usuario actual
   */
  static async getSurveys() {
    try {
      const response = await apiGet('/api/surveys');
      return response.data;
    } catch (error) {
      console.error('Error al obtener encuestas:', error);
      throw error;
    }
  }

  /**
   * Crear una nueva encuesta
   * @param surveyData - Datos de la encuesta
   */
  static async createSurvey(surveyData: any) {
    try {
      const response = await apiPost('/api/surveys', surveyData);
      return response.data;
    } catch (error) {
      console.error('Error al crear encuesta:', error);
      throw error;
    }
  }

  /**
   * Actualizar una encuesta existente
   * @param surveyId - ID de la encuesta
   * @param surveyData - Datos actualizados
   */
  static async updateSurvey(surveyId: string, surveyData: any) {
    try {
      const response = await apiPut(`/api/surveys/${surveyId}`, surveyData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar encuesta:', error);
      throw error;
    }
  }

  /**
   * Eliminar una encuesta
   * @param surveyId - ID de la encuesta
   */
  static async deleteSurvey(surveyId: string) {
    try {
      const response = await apiDelete(`/api/surveys/${surveyId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar encuesta:', error);
      throw error;
    }
  }
}

/**
 * Ejemplo de servicio para gestión de familias
 */
export class FamilyService {
  static async getFamilies() {
    const response = await apiGet('/api/families');
    return response.data;
  }

  static async getFamilyById(familyId: string) {
    const response = await apiGet(`/api/families/${familyId}`);
    return response.data;
  }

  static async createFamily(familyData: any) {
    const response = await apiPost('/api/families', familyData);
    return response.data;
  }
}

/**
 * Ejemplo de servicio para gestión de sectores
 */
export class SectorService {
  static async getSectors() {
    const response = await apiGet('/api/sectors');
    return response.data;
  }

  static async createSector(sectorData: any) {
    const response = await apiPost('/api/sectors', sectorData);
    return response.data;
  }
}

/**
 * Ejemplo de servicio para reportes
 */
export class ReportService {
  static async getDashboardStats() {
    const response = await apiGet('/api/reports/dashboard');
    return response.data;
  }

  static async getDetailedReport(reportType: string, filters: any) {
    const response = await apiPost(`/api/reports/${reportType}`, filters);
    return response.data;
  }
}

/**
 * Ejemplo de servicio para gestión de usuarios (solo admin)
 */
export class UserService {
  static async getUsers() {
    const response = await apiGet('/api/users');
    return response.data;
  }

  static async createUser(userData: any) {
    const response = await apiPost('/api/users', userData);
    return response.data;
  }

  static async updateUser(userId: string, userData: any) {
    const response = await apiPut(`/api/users/${userId}`, userData);
    return response.data;
  }

  static async deleteUser(userId: string) {
    const response = await apiDelete(`/api/users/${userId}`);
    return response.data;
  }
}
