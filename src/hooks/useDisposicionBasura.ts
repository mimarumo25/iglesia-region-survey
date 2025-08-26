import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { disposicionBasuraService } from '@/services/disposicion-basura';
import {
  DisposicionBasura,
  DisposicionBasuraCreate,
  DisposicionBasuraUpdate,
  DisposicionBasuraResponse,
} from '@/types/disposicion-basura';

export const useDisposicionBasura = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todos los tipos de disposición de basura con paginación y filtros
  const useDisposicionBasuraQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<DisposicionBasuraResponse, Error>({
      queryKey: ['disposicionBasura', { page, limit, sortBy, sortOrder }],
      queryFn: () => disposicionBasuraService.getDisposicionBasura(limit, page, sortBy, sortOrder),
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para buscar tipos de disposición de basura
  const useSearchDisposicionBasuraQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<DisposicionBasuraResponse, Error>({
      queryKey: ['disposicionBasura', { searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: () => disposicionBasuraService.searchDisposicionBasura(searchTerm, limit, page, sortBy, sortOrder),
      enabled: !!searchTerm,
      placeholderData: (previousData) => previousData,
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo tipo de disposición de basura
  const useCreateDisposicionBasuraMutation = () => {
    return useMutation({
      mutationFn: disposicionBasuraService.createDisposicionBasura,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['disposicionBasura'] });
        toast({
          title: "Éxito",
          description: "Tipo de disposición de basura creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating disposicion basura:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el tipo de disposición de basura",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un tipo de disposición de basura existente
  const useUpdateDisposicionBasuraMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: DisposicionBasuraUpdate }) => 
        disposicionBasuraService.updateDisposicionBasura(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['disposicionBasura'] });
        toast({
          title: "Éxito",
          description: "Tipo de disposición de basura actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating disposicion basura:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el tipo de disposición de basura",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un tipo de disposición de basura
  const useDeleteDisposicionBasuraMutation = () => {
    return useMutation({
      mutationFn: disposicionBasuraService.deleteDisposicionBasura,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['disposicionBasura'] });
        toast({
          title: "Éxito",
          description: "Tipo de disposición de basura eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting disposicion basura:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el tipo de disposición de basura",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useDisposicionBasuraQuery,
    useSearchDisposicionBasuraQuery,
    useCreateDisposicionBasuraMutation,
    useUpdateDisposicionBasuraMutation,
    useDeleteDisposicionBasuraMutation,
  };
};