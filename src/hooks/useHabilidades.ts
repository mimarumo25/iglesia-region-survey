import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { habilidadesService } from '@/services/habilidades';
import type {
  Habilidad,
  HabilidadFormData,
  HabilidadUpdateData
} from '@/types/habilidades';

/**
 * Hook unificado para obtener habilidades con búsqueda opcional
 * Patrón: Profesiones-like
 */
export const useHabilidadesQuery = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['habilidades', searchTerm || 'all'],
    queryFn: () => {
      // Si hay término de búsqueda, usar búsqueda; si no, obtener todos
      return searchTerm && searchTerm.trim()
        ? habilidadesService.searchHabilidades(searchTerm.trim(), 1, 100)
        : habilidadesService.getHabilidades(1, 100, 'id_habilidad', 'ASC');
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Helper function para paginación del lado del cliente
 */
export const paginateClientSide = <T>(
  items: T[],
  page: number,
  limit: number
): {
  paginatedItems: T[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
} => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / limit);

  return {
    paginatedItems,
    totalPages,
    currentPage: page,
    totalCount: items.length,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Helper function para filtrar búsquedas del lado del cliente
 */
export const filterBySearch = (
  items: Habilidad[],
  searchTerm: string
): Habilidad[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return items;
  }

  const lowercaseSearch = searchTerm.toLowerCase().trim();
  return items.filter(item =>
    item.nombre?.toLowerCase().includes(lowercaseSearch) ||
    item.descripcion?.toLowerCase().includes(lowercaseSearch) ||
    item.nivel?.toLowerCase().includes(lowercaseSearch)
  );
};

/**
 * Hook principal con todas las operaciones CRUD para habilidades
 */
export const useHabilidades = () => {
  const queryClient = useQueryClient();

  // Query para obtener una habilidad por ID
  const useHabilidadByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['habilidad', id],
      queryFn: () => habilidadesService.getHabilidadById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener habilidades activas
  const useActiveHabilidadesQuery = () => {
    return useQuery({
      queryKey: ['habilidades-active'],
      queryFn: () => habilidadesService.getActiveHabilidades(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener estadísticas
  const useHabilidadesStatsQuery = () => {
    return useQuery({
      queryKey: ['habilidades-stats'],
      queryFn: () => habilidadesService.getHabilidadesStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Mutación para crear habilidad
  const useCreateHabilidadMutation = () => {
    return useMutation({
      mutationFn: (data: HabilidadFormData) => habilidadesService.createHabilidad(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['habilidades'] });
        queryClient.invalidateQueries({ queryKey: ['habilidades-active'] });
        queryClient.invalidateQueries({ queryKey: ['habilidades-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Habilidad creada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear habilidad:', error);
        const message = error?.response?.data?.message || 'Error al crear la habilidad';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar habilidad
  const useUpdateHabilidadMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: HabilidadUpdateData }) => 
        habilidadesService.updateHabilidad(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['habilidades'] });
        queryClient.invalidateQueries({ queryKey: ['habilidades-active'] });
        queryClient.invalidateQueries({ queryKey: ['habilidades-stats'] });
        queryClient.invalidateQueries({ queryKey: ['habilidad', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Habilidad actualizada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar habilidad:', error);
        const message = error?.response?.data?.message || 'Error al actualizar la habilidad';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar habilidad
  const useDeleteHabilidadMutation = () => {
    return useMutation({
      mutationFn: (id: string) => habilidadesService.deleteHabilidad(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['habilidades'] });
        queryClient.invalidateQueries({ queryKey: ['habilidades-active'] });
        queryClient.invalidateQueries({ queryKey: ['habilidades-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Habilidad eliminada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar habilidad:', error);
        const message = error?.response?.data?.message || 'Error al eliminar la habilidad';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleHabilidadStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => habilidadesService.toggleHabilidadStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['habilidades'] });
        queryClient.invalidateQueries({ queryKey: ['habilidades-active'] });
        queryClient.invalidateQueries({ queryKey: ['habilidades-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado de la habilidad actualizado',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al cambiar estado:', error);
        const message = error?.response?.data?.message || 'Error al cambiar el estado';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  return {
    // Queries
    useHabilidadByIdQuery,
    useActiveHabilidadesQuery,
    useHabilidadesStatsQuery,
    
    // Mutations
    useCreateHabilidadMutation,
    useUpdateHabilidadMutation,
    useDeleteHabilidadMutation,
    useToggleHabilidadStatusMutation,
  };
};

export default useHabilidades;
