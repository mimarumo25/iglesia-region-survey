import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { destrezasService } from '@/services/destrezas';
import type {
  Destreza,
  DestrezaFormData,
  DestrezaUpdateData
} from '@/types/destrezas';

/**
 * Hook unificado para obtener destrezas con búsqueda opcional
 * Patrón: Profesiones-like
 */
export const useDestrezasQuery = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['destrezas', searchTerm || 'all'],
    queryFn: () => {
      // Si hay término de búsqueda, usar búsqueda; si no, obtener todos
      return searchTerm && searchTerm.trim()
        ? destrezasService.searchDestrezas(searchTerm.trim(), 1, 100)
        : destrezasService.getDestrezas(1, 100, 'id_destreza', 'ASC');
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
  items: Destreza[],
  searchTerm: string
): Destreza[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return items;
  }

  const lowercaseSearch = searchTerm.toLowerCase().trim();
  return items.filter(item =>
    item.nombre?.toLowerCase().includes(lowercaseSearch) ||
    item.descripcion?.toLowerCase().includes(lowercaseSearch) ||
    item.categoria?.toLowerCase().includes(lowercaseSearch)
  );
};

/**
 * Hook principal con todas las operaciones CRUD para destrezas
 */
export const useDestrezas = () => {
  const queryClient = useQueryClient();

  // Query para obtener una destreza por ID
  const useDestrezaByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['destreza', id],
      queryFn: () => destrezasService.getDestrezaById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener destrezas activas
  const useActiveDestrezasQuery = () => {
    return useQuery({
      queryKey: ['destrezas-active'],
      queryFn: () => destrezasService.getActiveDestrezas(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener estadísticas
  const useDestrezasStatsQuery = () => {
    return useQuery({
      queryKey: ['destrezas-stats'],
      queryFn: () => destrezasService.getDestrezasStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Mutación para crear destreza
  const useCreateDestrezaMutation = () => {
    return useMutation({
      mutationFn: (data: DestrezaFormData) => destrezasService.createDestreza(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['destrezas'] });
        queryClient.invalidateQueries({ queryKey: ['destrezas-active'] });
        queryClient.invalidateQueries({ queryKey: ['destrezas-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Destreza creada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear destreza:', error);
        const message = error?.response?.data?.message || 'Error al crear la destreza';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar destreza
  const useUpdateDestrezaMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: DestrezaUpdateData }) => 
        destrezasService.updateDestreza(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['destrezas'] });
        queryClient.invalidateQueries({ queryKey: ['destrezas-active'] });
        queryClient.invalidateQueries({ queryKey: ['destrezas-stats'] });
        queryClient.invalidateQueries({ queryKey: ['destreza', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Destreza actualizada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar destreza:', error);
        const message = error?.response?.data?.message || 'Error al actualizar la destreza';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar destreza
  const useDeleteDestrezaMutation = () => {
    return useMutation({
      mutationFn: (id: string) => destrezasService.deleteDestreza(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['destrezas'] });
        queryClient.invalidateQueries({ queryKey: ['destrezas-active'] });
        queryClient.invalidateQueries({ queryKey: ['destrezas-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Destreza eliminada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar destreza:', error);
        const message = error?.response?.data?.message || 'Error al eliminar la destreza';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleDestrezaStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => destrezasService.toggleDestrezaStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['destrezas'] });
        queryClient.invalidateQueries({ queryKey: ['destrezas-active'] });
        queryClient.invalidateQueries({ queryKey: ['destrezas-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado de la destreza actualizado',
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
    useDestrezaByIdQuery,
    useActiveDestrezasQuery,
    useDestrezasStatsQuery,
    
    // Mutations
    useCreateDestrezaMutation,
    useUpdateDestrezaMutation,
    useDeleteDestrezaMutation,
    useToggleDestrezaStatusMutation,
  };
};

export default useDestrezas;
