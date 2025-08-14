import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parroquiasService } from '@/services/parroquias';
import {
  Parroquia,
  ParroquiaCreate,
  ParroquiaUpdate,
  ParroquiasResponse,
  ServerResponse
} from '@/types/parroquias';
import { useToast } from '@/hooks/use-toast';

export const useParroquias = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todas las parroquias con paginación
  const useParroquiasQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_parroquia',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['parroquias', { page, limit, sortBy, sortOrder }],
      queryFn: () => parroquiasService.getParroquias(page, limit, sortBy, sortOrder),
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para buscar parroquias
  const useSearchParroquiasQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['parroquias', { search: searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: () => parroquiasService.searchParroquias(searchTerm, page, limit, sortBy, sortOrder),
      enabled: !!searchTerm.trim(),
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener una parroquia por ID
  const useParroquiaByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['parroquia', id],
      queryFn: () => parroquiasService.getParroquiaById(id),
      enabled: !!id,
    });
  };

  // Query para obtener parroquias por municipio
  const useParroquiasByMunicipioQuery = (
    municipioId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['parroquias', { municipio: municipioId, page, limit, sortBy, sortOrder }],
      queryFn: () => parroquiasService.getParroquiasByMunicipio(municipioId, page, limit, sortBy, sortOrder),
      enabled: !!municipioId,
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener estadísticas de parroquias
  const useParroquiaStatisticsQuery = () => {
    return useQuery({
      queryKey: ['parroquias-statistics'],
      queryFn: () => parroquiasService.getParroquiaStatistics(),
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear parroquia
  const useCreateParroquiaMutation = () => {
    return useMutation({
      mutationFn: async (parroquia: ParroquiaCreate) => {
        const response = await parroquiasService.createParroquia(parroquia);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parroquias'] }); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Parroquia creada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al crear parroquia';
        console.error('Error creating parroquia:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar parroquia
  const useUpdateParroquiaMutation = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: ParroquiaUpdate }) => {
        const response = await parroquiasService.updateParroquia(id, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parroquias'] }); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Parroquia actualizada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al actualizar parroquia';
        console.error('Error updating parroquia:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar parroquia
  const useDeleteParroquiaMutation = () => {
    return useMutation({
      mutationFn: parroquiasService.deleteParroquia,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parroquias'] }); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Parroquia eliminada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al eliminar parroquia';
        console.error('Error deleting parroquia:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  return {
    useParroquiasQuery,
    useSearchParroquiasQuery,
    useParroquiaByIdQuery,
    useParroquiasByMunicipioQuery,
    useParroquiaStatisticsQuery,
    useCreateParroquiaMutation,
    useUpdateParroquiaMutation,
    useDeleteParroquiaMutation,
  };
};