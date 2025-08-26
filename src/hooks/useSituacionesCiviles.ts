import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { situacionesCivilesService } from '@/services/situaciones-civiles';
import { SituacionCivilFormData, SituacionCivilUpdateData } from '@/types/situaciones-civiles';

// Hook personalizado para todas las operaciones de situaciones civiles
export const useSituacionesCiviles = () => {
  const queryClient = useQueryClient();

  // Query para obtener situaciones civiles con paginación
  const useSituacionesCivilesQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['situaciones-civiles', page, limit, sortBy, sortOrder],
      queryFn: () => situacionesCivilesService.getSituacionesCiviles(page, limit, sortBy, sortOrder),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Query para buscar situaciones civiles
  const useSearchSituacionesCivilesQuery = (search: string, page: number = 1, limit: number = 10) => {
    return useQuery({
      queryKey: ['situaciones-civiles-search', search, page, limit],
      queryFn: () => situacionesCivilesService.searchSituacionesCiviles(search, page, limit),
      enabled: search.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutos para búsquedas
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener una situación civil por ID
  const useSituacionCivilByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['situacion-civil', id],
      queryFn: () => situacionesCivilesService.getSituacionCivilById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener situaciones civiles activas
  const useActiveSituacionesCivilesQuery = () => {
    return useQuery({
      queryKey: ['situaciones-civiles-active'],
      queryFn: () => situacionesCivilesService.getActiveSituacionesCiviles(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useSituacionesCivilesStatsQuery = () => {
    return useQuery({
      queryKey: ['situaciones-civiles-stats'],
      queryFn: () => situacionesCivilesService.getSituacionesCivilesStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear situación civil
  const useCreateSituacionCivilMutation = () => {
    return useMutation({
      mutationFn: (data: SituacionCivilFormData) => situacionesCivilesService.createSituacionCivil(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles'] });
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles-active'] });
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Situación civil creada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear situación civil:', error);
        const message = error?.response?.data?.message || 'Error al crear la situación civil';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar situación civil
  const useUpdateSituacionCivilMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: SituacionCivilUpdateData }) => 
        situacionesCivilesService.updateSituacionCivil(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles'] });
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles-active'] });
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles-stats'] });
        queryClient.invalidateQueries({ queryKey: ['situacion-civil', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Situación civil actualizada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar situación civil:', error);
        const message = error?.response?.data?.message || 'Error al actualizar la situación civil';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar situación civil
  const useDeleteSituacionCivilMutation = () => {
    return useMutation({
      mutationFn: (id: string) => situacionesCivilesService.deleteSituacionCivil(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles'] });
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles-active'] });
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Situación civil eliminada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar situación civil:', error);
        const message = error?.response?.data?.message || 'Error al eliminar la situación civil';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleSituacionCivilStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => situacionesCivilesService.toggleSituacionCivilStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles'] });
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles-active'] });
        queryClient.invalidateQueries({ queryKey: ['situaciones-civiles-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado de la situación civil actualizado',
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
    useSituacionesCivilesQuery,
    useSearchSituacionesCivilesQuery,
    useSituacionCivilByIdQuery,
    useActiveSituacionesCivilesQuery,
    useSituacionesCivilesStatsQuery,
    
    // Mutations
    useCreateSituacionCivilMutation,
    useUpdateSituacionCivilMutation,
    useDeleteSituacionCivilMutation,
    useToggleSituacionCivilStatusMutation,
  };
};

export default useSituacionesCiviles;
