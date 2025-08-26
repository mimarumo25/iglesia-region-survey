import { ServerResponse } from '@/services/departamentos';
import { Departamento } from '@/services/departamentos';

/**
 * Fallback service for departamentos when the main API is unavailable
 * Provides static Colombian departamentos data
 */


export const departamentosFallbackService = {
  /**
   * Provides fallback data when the main departamentos API is unavailable
   */
  getActiveDepartamentos: async (): Promise<ServerResponse<Departamento[]>> => {
    console.warn('Using fallback departamentos data due to API unavailability');
    
    // Simulate async behavior
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: DEPARTAMENTOS_FALLBACK.filter(dept => dept.activo)
    };
  },

  /**
   * Get all departamentos (including inactive)
   */
  getAllDepartamentos: () => DEPARTAMENTOS_FALLBACK,

  /**
   * Get departamento by ID
   */
  getDepartamentoById: (id: string): Departamento | undefined => {
    return DEPARTAMENTOS_FALLBACK.find(dept => dept.id_departamento === id);
  },

  /**
   * Search departamentos by name
   */
  searchByName: (searchTerm: string): Departamento[] => {
    const term = searchTerm.toLowerCase();
    return DEPARTAMENTOS_FALLBACK.filter(dept => 
      dept.nombre.toLowerCase().includes(term)
    );
  }
};
