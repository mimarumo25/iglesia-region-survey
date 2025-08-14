import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { comunidadesCulturalesService } from '@/services/comunidades-culturales';
import { ComunidadCulturalFormData, ComunidadCulturalUpdateData } from '@/types/comunidades-culturales';

// Hook personalizado para todas las operaciones de comunidades culturales
export const useComunidadesCulturales = () => {
  const queryClient = useQueryClient();

  // Query para obtener comunidades culturales con paginación
  const useComunidadesCulturalesQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_comunidad_cultural', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['comunidades-culturales', page, limit, sortBy, sortOrder],
      queryFn: () => comunidadesCulturalesService.getComunidadesCulturales(page, limit, sortBy, sortOrder),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Query para buscar comunidades culturales
  const useSearchComunidadesCulturalesQuery = (search: string, page: number = 1, limit: number = 10) => {
    return useQuery({
      queryKey: ['comunidades-culturales-search', search, page, limit],
      queryFn: () => comunidadesCulturalesService.searchComunidadesCulturales(search, page, limit),
      enabled: search.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutos para búsquedas
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener una comunidad cultural por ID
  const useComunidadCulturalByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['comunidad-cultural', id],
      queryFn: () => comunidadesCulturalesService.getComunidadCulturalById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener comunidades culturales activas
  const useActiveComunidadesCulturalesQuery = () => {
    return useQuery({
      queryKey: ['comunidades-culturales-active'],
      queryFn: () => comunidadesCulturalesService.getActiveComunidadesCulturales(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useComunidadesCulturalesStatsQuery = () => {
    return useQuery({
      queryKey: ['comunidades-culturales-stats'],
      queryFn: () => comunidadesCulturalesService.getComunidadesCulturalesStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear comunidad cultural
  const useCreateComunidadCulturalMutation = () => {
    return useMutation({
      mutationFn: (data: ComunidadCulturalFormData) => comunidadesCulturalesService.createComunidadCultural(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-active'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Comunidad cultural creada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear comunidad cultural:', error);
        const message = error?.response?.data?.message || 'Error al crear la comunidad cultural';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar comunidad cultural
  const useUpdateComunidadCulturalMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: ComunidadCulturalUpdateData }) => 
        comunidadesCulturalesService.updateComunidadCultural(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-active'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-stats'] });
        queryClient.invalidateQueries({ queryKey: ['comunidad-cultural', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Comunidad cultural actualizada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar comunidad cultural:', error);
        const message = error?.response?.data?.message || 'Error al actualizar la comunidad cultural';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar comunidad cultural
  const useDeleteComunidadCulturalMutation = () => {
    return useMutation({
      mutationFn: (id: string) => comunidadesCulturalesService.deleteComunidadCultural(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-active'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Comunidad cultural eliminada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar comunidad cultural:', error);
        const message = error?.response?.data?.message || 'Error al eliminar la comunidad cultural';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleComunidadCulturalStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => comunidadesCulturalesService.toggleComunidadCulturalStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-active'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado de la comunidad cultural actualizado',
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
    useComunidadesCulturalesQuery,
    useSearchComunidadesCulturalesQuery,
    useComunidadCulturalByIdQuery,
    useActiveComunidadesCulturalesQuery,
    useComunidadesCulturalesStatsQuery,
    
    // Mutations
    useCreateComunidadCulturalMutation,
    useUpdateComunidadCulturalMutation,
    useDeleteComunidadCulturalMutation,
    useToggleComunidadCulturalStatusMutation,
  };
};

export default useComunidadesCulturales;
