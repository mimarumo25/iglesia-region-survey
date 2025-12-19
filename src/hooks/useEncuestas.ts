/**
 * @fileoverview Hook de Gestión de Encuestas - Sistema MIA
 * 
 * Hook personalizado para manejo completo del ciclo de vida de encuestas:
 * - Queries: Listado, detalle, estadísticas con caché de React Query
 * - Mutations: Crear, actualizar, eliminar, validar encuestas
 * - Invalidación y prefetch de caché para optimización
 * - Notificaciones toast integradas
 * - Estados de loading centralizados
 * 
 * Integra el servicio de encuestas con React Query para:
 * - ⚡ Caché inteligente con staleTime y gcTime
 * - 🔄 Invalidación automática de queries relacionadas
 * - 📡 Sincronización con API
 * - 🎯 Estados de loading por operación
 * - ✅ Feedback visual con toasts
 * 
 * @module hooks/useEncuestas
 * @version 2.0.0
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { encuestasService, EncuestasSearchParams, EncuestaListItem } from '@/services/encuestas';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Constantes de Query Keys para React Query
 * 
 * Define las claves de caché para las diferentes queries de encuestas,
 * permitiendo invalidación precisa y organización jerárquica del caché.
 * 
 * @constant {Object} ENCUESTAS_QUERY_KEYS
 * @property {ReadonlyArray} all - Clave raíz para todas las encuestas
 * @property {Function} lists - Claves para listados de encuestas
 * @property {Function} list - Clave para listado con parámetros específicos
 * @property {Function} details - Claves para detalles de encuestas
 * @property {Function} detail - Clave para detalle de una encuesta específica
 * @property {Function} stats - Clave para estadísticas agregadas
 * 
 * @example
 * // Invalidar todas las encuestas
 * queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.all });
 * 
 * @example
 * // Invalidar solo listados
 * queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.lists() });
 * 
 * @example
 * // Invalidar detalle específico
 * queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.detail('123') });
 */
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
 * Hook principal para gestión completa de encuestas
 * 
 * Proporciona una API completa para trabajar con encuestas en el frontend:
 * 
 * **Queries (Lectura):**
 * - `getEncuestas(params)` - Lista paginada con filtros y búsqueda
 * - `getEncuestaById(id)` - Detalle completo de una encuesta
 * - `getEncuestasStats()` - Estadísticas agregadas
 * 
 * **Mutations (Escritura):**
 * - `createEncuesta` - Crear nueva encuesta
 * - `updateEncuesta` - Actualizar encuesta existente
 * - `deleteEncuesta` - Eliminar encuesta
 * - `validarEncuesta` - Marcar encuesta como válida
 * 
 * **Utilidades:**
 * - `invalidateEncuestas()` - Forzar recarga de caché
 * - `prefetchEncuesta(id)` - Pre-cargar encuesta en segundo plano
 * 
 * **Estados de Loading:**
 * - `isCreating`, `isUpdating`, `isDeleting`, `isValidating`
 * 
 * @function useEncuestas
 * @returns {Object} API del hook
 * 
 * @example
 * const {
 *   getEncuestas,
 *   getEncuestaById,
 *   createEncuesta,
 *   updateEncuesta,
 *   deleteEncuesta,
 *   isCreating,
 *   isUpdating
 * } = useEncuestas();
 * 
 * // Cargar lista de encuestas
 * const { data: encuestas, isLoading } = getEncuestas({
 *   page: 1,
 *   limit: 10,
 *   busqueda: 'García'
 * });
 * 
 * // Crear nueva encuesta
 * createEncuesta.mutate(nuevaEncuesta);
 * 
 * // Actualizar encuesta
 * updateEncuesta.mutate({
 *   id: '123',
 *   data: { apellido_familiar: 'Nuevo Apellido' }
 * });
 * 
 * // Eliminar encuesta
 * deleteEncuesta.mutate('123');
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
    mutationFn: (data: Omit<EncuestaListItem, 'id_encuesta'>) => 
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
    mutationFn: ({ id, data }: { id: string; data: Partial<EncuestaListItem> }) =>
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