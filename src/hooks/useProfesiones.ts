import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { profesionesService } from '@/services/profesiones';
import { ProfesionFormData, ProfesionUpdateData } from '@/types/profesiones';

// Hook personalizado para todas las operaciones de profesiones
export const useProfesiones = () => {
  const queryClient = useQueryClient();

  // Query para obtener profesiones con paginación
  const useProfesionesQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_profesion', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['profesiones', page, limit, sortBy, sortOrder],
      queryFn: () => profesionesService.getProfesiones(page, limit, sortBy, sortOrder),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Query para buscar profesiones
  const useSearchProfesionesQuery = (search: string, page: number = 1, limit: number = 10) => {
    return useQuery({
      queryKey: ['profesiones-search', search, page, limit],
      queryFn: () => profesionesService.searchProfesiones(search, page, limit),
      enabled: search.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutos para búsquedas
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener una profesión por ID
  const useProfesionByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['profesion', id],
      queryFn: () => profesionesService.getProfesionById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener profesiones activas
  const useActiveProfesionesQuery = () => {
    return useQuery({
      queryKey: ['profesiones-active'],
      queryFn: () => profesionesService.getActiveProfesiones(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useProfesionesStatsQuery = () => {
    return useQuery({
      queryKey: ['profesiones-stats'],
      queryFn: () => profesionesService.getProfesionesStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear profesión
  const useCreateProfesionMutation = () => {
    return useMutation({
      mutationFn: (data: ProfesionFormData) => profesionesService.createProfesion(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['profesiones'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-active'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Profesión creada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear profesión:', error);
        const message = error?.response?.data?.message || 'Error al crear la profesión';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar profesión
  const useUpdateProfesionMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: ProfesionUpdateData }) => 
        profesionesService.updateProfesion(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['profesiones'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-active'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-stats'] });
        queryClient.invalidateQueries({ queryKey: ['profesion', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Profesión actualizada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar profesión:', error);
        const message = error?.response?.data?.message || 'Error al actualizar la profesión';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar profesión
  const useDeleteProfesionMutation = () => {
    return useMutation({
      mutationFn: (id: string) => profesionesService.deleteProfesion(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['profesiones'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-active'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Profesión eliminada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar profesión:', error);
        const message = error?.response?.data?.message || 'Error al eliminar la profesión';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleProfesionStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => profesionesService.toggleProfesionStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['profesiones'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-active'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado de la profesión actualizado',
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
    useProfesionesQuery,
    useSearchProfesionesQuery,
    useProfesionByIdQuery,
    useActiveProfesionesQuery,
    useProfesionesStatsQuery,
    
    // Mutations
    useCreateProfesionMutation,
    useUpdateProfesionMutation,
    useDeleteProfesionMutation,
    useToggleProfesionStatusMutation,
  };
};

export default useProfesiones;
