import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { estudiosService } from '@/services/estudios';
import { EstudioFormData, EstudioUpdateData } from '@/types/estudios';

// Hook personalizado para todas las operaciones de estudios
export const useEstudios = () => {
  const queryClient = useQueryClient();

  // Query para obtener estudios con paginación
  const useEstudiosQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_estudio', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['estudios', page, limit, sortBy, sortOrder],
      queryFn: () => estudiosService.getEstudios(page, limit, sortBy, sortOrder),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Query para buscar estudios
  const useSearchEstudiosQuery = (search: string, page: number = 1, limit: number = 10) => {
    return useQuery({
      queryKey: ['estudios-search', search, page, limit],
      queryFn: () => estudiosService.searchEstudios(search, page, limit),
      enabled: search.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutos para búsquedas
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener un estudio por ID
  const useEstudioByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['estudio', id],
      queryFn: () => estudiosService.getEstudioById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estudios activos
  const useActiveEstudiosQuery = () => {
    return useQuery({
      queryKey: ['estudios-active'],
      queryFn: () => estudiosService.getActiveEstudios(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useEstudiosStatsQuery = () => {
    return useQuery({
      queryKey: ['estudios-stats'],
      queryFn: () => estudiosService.getEstudiosStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear estudio
  const useCreateEstudioMutation = () => {
    return useMutation({
      mutationFn: (data: EstudioFormData) => estudiosService.createEstudio(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['estudios'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-active'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estudio creado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear estudio:', error);
        const message = error?.response?.data?.message || 'Error al crear el estudio';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar estudio
  const useUpdateEstudioMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: EstudioUpdateData }) => 
        estudiosService.updateEstudio(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['estudios'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-active'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-stats'] });
        queryClient.invalidateQueries({ queryKey: ['estudio', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Estudio actualizado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar estudio:', error);
        const message = error?.response?.data?.message || 'Error al actualizar el estudio';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar estudio
  const useDeleteEstudioMutation = () => {
    return useMutation({
      mutationFn: (id: string) => estudiosService.deleteEstudio(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['estudios'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-active'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estudio eliminado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar estudio:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el estudio';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleEstudioStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => estudiosService.toggleEstudioStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['estudios'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-active'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado del estudio actualizado',
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
    useEstudiosQuery,
    useSearchEstudiosQuery,
    useEstudioByIdQuery,
    useActiveEstudiosQuery,
    useEstudiosStatsQuery,
    
    // Mutations
    useCreateEstudioMutation,
    useUpdateEstudioMutation,
    useDeleteEstudioMutation,
    useToggleEstudioStatusMutation,
  };
};

export default useEstudios;
