/**
 * 🎣 Hook para gestión de encuestas
 * 
 * Hook personalizado que integra el servicio de encuestas con React Query
 * para manejo de estado, caché y sincronización con la API.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { encuestasService, EncuestasSearchParams, EncuestaCompleta } from '@/services/encuestas';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const ENCUESTAS_QUERY_KEYS = {
  all: ['encuestas'] as const,
  lists: () => [...ENCUESTAS_QUERY_KEYS.all, 'list'] as const,
  list: (params: EncuestasSearchParams) => [...ENCUESTAS_QUERY_KEYS.lists(), params] as const,
  details: () => [...ENCUESTAS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ENCUESTAS_QUERY_KEYS.details(), id] as const,
  stats: () => [...ENCUESTAS_QUERY_KEYS.all, 'stats'] as const,
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook principal para gestión de encuestas
 */
export const useEncuestas = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Obtener lista de encuestas
   */
  const getEncuestas = (params: EncuestasSearchParams = {}) => {
    return useQuery({
      queryKey: ENCUESTAS_QUERY_KEYS.list(params),
      queryFn: () => encuestasService.getEncuestas(params),
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos
    });
  };

  /**
   * Obtener encuesta por ID
   */
  const getEncuestaById = (id: string) => {
    return useQuery({
      queryKey: ENCUESTAS_QUERY_KEYS.detail(id),
      queryFn: () => encuestasService.getEncuestaById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };

  /**
   * Obtener estadísticas de encuestas
   */
  const getEncuestasStats = () => {
    return useQuery({
      queryKey: ENCUESTAS_QUERY_KEYS.stats(),
      queryFn: () => encuestasService.getEstadisticas(),
      staleTime: 1000 * 60 * 2, // 2 minutos
    });
  };

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  /**
   * Crear nueva encuesta
   */
  const createEncuesta = useMutation({
    mutationFn: (data: Omit<EncuestaCompleta, 'id_encuesta'>) => 
      encuestasService.createEncuesta(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.stats() });
      
      toast({
        title: "Encuesta creada",
        description: "La encuesta ha sido creada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error al crear encuesta",
        description: error.message || "Hubo un problema al crear la encuesta",
      });
    },
  });

  /**
   * Actualizar encuesta
   */
  const updateEncuesta = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EncuestaCompleta> }) =>
      encuestasService.updateEncuesta(id, data),
    onSuccess: (data, variables) => {
      // Actualizar caché específico
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.lists() });
      
      toast({
        title: "Encuesta actualizada",
        description: "Los cambios han sido guardados exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.message || "Hubo un problema al actualizar la encuesta",
      });
    },
  });

  /**
   * Eliminar encuesta
   */
  const deleteEncuesta = useMutation({
    mutationFn: (id: string) => encuestasService.deleteEncuesta(id),
    onSuccess: (data, id) => {
      // Limpiar caché
      queryClient.removeQueries({ queryKey: ENCUESTAS_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.stats() });
      
      toast({
        title: "Encuesta eliminada",
        description: "La encuesta ha sido eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error.message || "Hubo un problema al eliminar la encuesta",
      });
    },
  });

  /**
   * Validar encuesta
   */
  const validarEncuesta = useMutation({
    mutationFn: (id: string) => encuestasService.validarEncuesta(id),
    onSuccess: (data, id) => {
      // Actualizar caché
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.stats() });
      
      toast({
        title: "Encuesta validada",
        description: "La encuesta ha sido validada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error al validar",
        description: error.message || "Hubo un problema al validar la encuesta",
      });
    },
  });

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Invalidar caché de encuestas
   */
  const invalidateEncuestas = () => {
    queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.all });
  };

  /**
   * Prefetch de una encuesta
   */
  const prefetchEncuesta = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: ENCUESTAS_QUERY_KEYS.detail(id),
      queryFn: () => encuestasService.getEncuestaById(id),
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };

  // ============================================================================
  // RETURN DEL HOOK
  // ============================================================================

  return {
    // Queries
    getEncuestas,
    getEncuestaById,
    getEncuestasStats,
    
    // Mutations
    createEncuesta,
    updateEncuesta,
    deleteEncuesta,
    validarEncuesta,
    
    // Utilidades
    invalidateEncuestas,
    prefetchEncuesta,
    
    // Estados de loading globales
    isCreating: createEncuesta.isPending,
    isUpdating: updateEncuesta.isPending,
    isDeleting: deleteEncuesta.isPending,
    isValidating: validarEncuesta.isPending,
  };
};

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

/**
 * Hook simplificado para lista de encuestas
 */
export const useEncuestasList = (params: EncuestasSearchParams = {}) => {
  const { getEncuestas } = useEncuestas();
  return getEncuestas(params);
};

/**
 * Hook simplificado para obtener una encuesta
 */
export const useEncuesta = (id: string) => {
  const { getEncuestaById } = useEncuestas();
  return getEncuestaById(id);
};

/**
 * Hook simplificado para estadísticas
 */
export const useEncuestasStatistics = () => {
  const { getEncuestasStats } = useEncuestas();
  return getEncuestasStats();
};

// Exportar todo como default también para compatibilidad
export default useEncuestas;