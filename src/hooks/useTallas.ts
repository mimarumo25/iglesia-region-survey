import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { tallasService } from '@/services/tallas';
import {
  Talla,
  TallaFormData,
  TallaCreate,
  TallaUpdate,
  TallasResponse,
  ServerResponse
} from '@/types/tallas';

export const useTallas = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todas las tallas con paginación y filtros
  const useTallasQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TallasResponse>, Error>({
      queryKey: ['tallas', { page, limit, sortBy, sortOrder }],
      queryFn: () => tallasService.getTallasWithPagination(page, limit, sortBy, sortOrder),
    });
  };

  // Query para buscar tallas por término de búsqueda
  const useSearchTallasQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TallasResponse>, Error>({
      queryKey: ['tallas', 'search', { searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: () => tallasService.searchTallasWithPagination(searchTerm, page, limit, sortBy, sortOrder),
      enabled: !!searchTerm.trim(), // Solo se ejecuta si hay un searchTerm
    });
  };

  // Query para obtener tallas activas solamente
  const useTallasActivasQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TallasResponse>, Error>({
      queryKey: ['tallas', 'activas', { page, limit, sortBy, sortOrder }],
      queryFn: () => tallasService.getTallasActivasWithPagination(page, limit, sortBy, sortOrder),
    });
  };

  // Query para obtener tallas por tipo
  const useTallasPorTipoQuery = (
    tipo: string,
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery<Talla[], Error>({
      queryKey: ['tallas', 'tipo', tipo, { page, limit }],
      queryFn: () => tallasService.getTallasPorTipo(tipo, limit, page),
      enabled: !!tipo, // Solo se ejecuta si hay un tipo
    });
  };

  // Query para obtener una talla por ID
  const useTallaByIdQuery = (id: string) => {
    return useQuery<ServerResponse<Talla>, Error>({
      queryKey: ['talla', id],
      queryFn: () => tallasService.getTallaById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear una nueva talla
  const useCreateTallaMutation = () => {
    return useMutation<ServerResponse<Talla>, Error, TallaCreate>({
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
    return useMutation<ServerResponse<Talla>, Error, { id: string; data: TallaUpdate }>({
      mutationFn: ({ id, data }) => tallasService.updateTalla(id, data),
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
    return useMutation<void, Error, string>({
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
    useTallasActivasQuery,
    useTallasPorTipoQuery,
    useTallaByIdQuery,
    useCreateTallaMutation,
    useUpdateTallaMutation,
    useDeleteTallaMutation,
  };
};
