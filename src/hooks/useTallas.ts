import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { tallasService } from '@/services/tallas';
import { TallaFormData, TallaCreate, TallaUpdate } from '@/types/tallas';

// Hook personalizado para todas las operaciones de tallas
export const useTallas = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query para obtener tallas con paginación
  const useTallasQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'talla', 
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery({
      queryKey: ['tallas', page, limit, sortBy, sortOrder],
      queryFn: () => tallasService.getTallas(page, limit, sortBy, sortOrder),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Query para buscar tallas
  const useSearchTallasQuery = (search: string, page: number = 1, limit: number = 10) => {
    return useQuery({
      queryKey: ['tallas-search', search, page, limit],
      queryFn: () => tallasService.searchTallas(search, page, limit),
      enabled: search.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutos para búsquedas
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener una talla por ID
  const useTallaByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['talla', id],
      queryFn: () => tallasService.getTallaById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useTallasStatsQuery = () => {
    return useQuery({
      queryKey: ['tallas-stats'],
      queryFn: () => tallasService.getTallasStats(),
      staleTime: 1000 * 60 * 15, // 15 minutos para estadísticas
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener tallas por tipo
  const useTallasPorTipoQuery = (tipo: string) => {
    return useQuery({
      queryKey: ['tallas-tipo', tipo],
      queryFn: () => tallasService.getTallasPorTipo(tipo),
      enabled: !!tipo,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear una nueva talla
  const useCreateTallaMutation = () => {
    return useMutation({
      mutationFn: tallasService.createTalla,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tallas'] });
        toast({
          title: "Éxito",
          description: "Talla creada correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating talla:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear la talla",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar una talla existente
  const useUpdateTallaMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: TallaUpdate }) => 
        tallasService.updateTalla(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tallas'] });
        toast({
          title: "Éxito",
          description: "Talla actualizada correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating talla:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar la talla",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar una talla
  const useDeleteTallaMutation = () => {
    return useMutation({
      mutationFn: tallasService.deleteTalla,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tallas'] });
        toast({
          title: "Éxito",
          description: "Talla eliminada correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting talla:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar la talla",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useTallasQuery,
    useSearchTallasQuery,
    useTallaByIdQuery,
    useTallasStatsQuery,
    useTallasPorTipoQuery,
    useCreateTallaMutation,
    useUpdateTallaMutation,
    useDeleteTallaMutation,
  };
};
