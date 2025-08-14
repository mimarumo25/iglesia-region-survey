import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sexosService } from '@/services/sexos';
import {
  Sexo,
  SexoCreate,
  SexoUpdate,
  SexosResponse,
  ServerResponse
} from '@/types/sexos';
import { useToast } from '@/hooks/use-toast';

export const useSexos = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todos los sexos con paginación
  const useSexosQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_sexo',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['sexos', { page, limit, sortBy, sortOrder }],
      queryFn: () => sexosService.getSexos(page, limit, sortBy, sortOrder),
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para buscar sexos
  const useSearchSexosQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['sexos', { search: searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: () => sexosService.searchSexos(searchTerm, page, limit, sortBy, sortOrder),
      enabled: !!searchTerm.trim(),
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener un sexo por ID
  const useSexoByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['sexo', id],
      queryFn: () => sexosService.getSexoById(id),
      enabled: !!id,
    });
  };

  // Query para obtener sexos activos
  const useSexosActivosQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['sexos', { activos: true, page, limit, sortBy, sortOrder }],
      queryFn: () => sexosService.getSexosActivos(page, limit, sortBy, sortOrder),
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener estadísticas de sexos
  const useSexoStatisticsQuery = () => {
    return useQuery({
      queryKey: ['sexos-statistics'],
      queryFn: () => sexosService.getSexoStatistics(),
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear sexo
  const useCreateSexoMutation = () => {
    return useMutation({
      mutationFn: async (sexo: SexoCreate) => {
        const response = await sexosService.createSexo(sexo);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sexos'] });
        toast({
          title: 'Éxito',
          description: 'Sexo creado correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al crear sexo';
        console.error('Error creating sexo:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar sexo
  const useUpdateSexoMutation = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: SexoUpdate }) => {
        const response = await sexosService.updateSexo(id, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sexos'] });
        toast({
          title: 'Éxito',
          description: 'Sexo actualizado correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al actualizar sexo';
        console.error('Error updating sexo:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar sexo
  const useDeleteSexoMutation = () => {
    return useMutation({
      mutationFn: sexosService.deleteSexo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sexos'] });
        toast({
          title: 'Éxito',
          description: 'Sexo eliminado correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al eliminar sexo';
        console.error('Error deleting sexo:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  return {
    useSexosQuery,
    useSearchSexosQuery,
    useSexoByIdQuery,
    useSexosActivosQuery,
    useSexoStatisticsQuery,
    useCreateSexoMutation,
    useUpdateSexoMutation,
    useDeleteSexoMutation,
  };
};
