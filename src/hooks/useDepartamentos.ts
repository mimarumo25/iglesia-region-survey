import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { departamentosService } from '@/services/departamentos';
import { DepartamentoFormData, DepartamentoUpdateData } from '@/types/departamentos';

// Hook personalizado para todas las operaciones de departamentos
export const useDepartamentos = () => {
  const queryClient = useQueryClient();

  // Query para obtener departamentos con paginación
  const useDepartamentosQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_departamento', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['departamentos', page, limit, sortBy, sortOrder],
      queryFn: () => departamentosService.getDepartamentos(page, limit, sortBy, sortOrder),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Query para buscar departamentos
  const useSearchDepartamentosQuery = (search: string, page: number = 1, limit: number = 10) => {
    return useQuery({
      queryKey: ['departamentos-search', search, page, limit],
      queryFn: () => departamentosService.searchDepartamentos(search, page, limit),
      enabled: search.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutos para búsquedas
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener un departamento por ID
  const useDepartamentoByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['departamento', id],
      queryFn: () => departamentosService.getDepartamentoById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener departamentos activos
  const useActiveDepartamentosQuery = () => {
    return useQuery({
      queryKey: ['departamentos-active'],
      queryFn: () => departamentosService.getActiveDepartamentos(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useDepartamentosStatsQuery = () => {
    return useQuery({
      queryKey: ['departamentos-stats'],
      queryFn: () => departamentosService.getDepartamentosStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear departamento
  const useCreateDepartamentoMutation = () => {
    return useMutation({
      mutationFn: (data: DepartamentoFormData) => departamentosService.createDepartamento(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['departamentos'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-active'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Departamento creado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear departamento:', error);
        const message = error?.response?.data?.message || 'Error al crear el departamento';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar departamento
  const useUpdateDepartamentoMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: DepartamentoUpdateData }) => 
        departamentosService.updateDepartamento(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['departamentos'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-active'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-stats'] });
        queryClient.invalidateQueries({ queryKey: ['departamento', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Departamento actualizado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar departamento:', error);
        const message = error?.response?.data?.message || 'Error al actualizar el departamento';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar departamento
  const useDeleteDepartamentoMutation = () => {
    return useMutation({
      mutationFn: (id: string) => departamentosService.deleteDepartamento(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['departamentos'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-active'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Departamento eliminado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar departamento:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el departamento';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleDepartamentoStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => departamentosService.toggleDepartamentoStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['departamentos'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-active'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado del departamento actualizado',
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
    useDepartamentosQuery,
    useSearchDepartamentosQuery,
    useDepartamentoByIdQuery,
    useActiveDepartamentosQuery,
    useDepartamentosStatsQuery,
    
    // Mutations
    useCreateDepartamentoMutation,
    useUpdateDepartamentoMutation,
    useDeleteDepartamentoMutation,
    useToggleDepartamentoStatusMutation,
  };
};

export default useDepartamentos;
