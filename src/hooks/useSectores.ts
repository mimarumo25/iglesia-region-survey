import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { sectoresService } from '@/services/sectores';
import { SectorFormData, SectorUpdateData } from '@/types/sectores';

// Hook personalizado para todas las operaciones de sectores
export const useSectores = () => {
  const queryClient = useQueryClient();

  // Query para obtener sectores con paginación
  const useSectoresQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_sector', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['sectores', page, limit, sortBy, sortOrder],
      queryFn: () => sectoresService.getSectores(page, limit, sortBy, sortOrder),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Query para buscar sectores
  const useSearchSectoresQuery = (search: string, page: number = 1, limit: number = 10) => {
    return useQuery({
      queryKey: ['sectores-search', search, page, limit],
      queryFn: () => sectoresService.searchSectores(search, page, limit),
      enabled: search.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutos para búsquedas
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener un sector por ID
  const useSectorByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['sector', id],
      queryFn: () => sectoresService.getSectorById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener sectores activos
  const useActiveSectoresQuery = () => {
    return useQuery({
      queryKey: ['sectores-active'],
      queryFn: () => sectoresService.getActiveSectores(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useSectoresStatsQuery = () => {
    return useQuery({
      queryKey: ['sectores-stats'],
      queryFn: () => sectoresService.getSectoresStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear sector
  const useCreateSectorMutation = () => {
    return useMutation({
      mutationFn: (data: SectorFormData) => sectoresService.createSector(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['sectores'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-active'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Sector creado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear sector:', error);
        const message = error?.response?.data?.message || 'Error al crear el sector';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar sector
  const useUpdateSectorMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: SectorUpdateData }) => 
        sectoresService.updateSector(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['sectores'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-active'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-stats'] });
        queryClient.invalidateQueries({ queryKey: ['sector', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Sector actualizado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar sector:', error);
        const message = error?.response?.data?.message || 'Error al actualizar el sector';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar sector
  const useDeleteSectorMutation = () => {
    return useMutation({
      mutationFn: (id: string) => sectoresService.deleteSector(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['sectores'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-active'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Sector eliminado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar sector:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el sector';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleSectorStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => sectoresService.toggleSectorStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['sectores'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-active'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado del sector actualizado',
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
    useSectoresQuery,
    useSearchSectoresQuery,
    useSectorByIdQuery,
    useActiveSectoresQuery,
    useSectoresStatsQuery,
    
    // Mutations
    useCreateSectorMutation,
    useUpdateSectorMutation,
    useDeleteSectorMutation,
    useToggleSectorStatusMutation,
  };
};

export default useSectores;
