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

  // Query unificada para obtener todos los tipos de disposición de basura
  const useDisposicionBasuraQuery = () => {
    return useQuery<DisposicionBasuraResponse, Error>({
      queryKey: ['disposicionBasura'],
      queryFn: async () => {
        console.log('🔄 Hook: Ejecutando query para disposición basura...');
        
        // Obtener todos los datos sin paginación del backend
        const response = await disposicionBasuraService.getDisposicionBasura(1000, 1);
        console.log('📦 Hook: Respuesta del servicio:', response);
        
        return response;
      },
      placeholderData: (previousData) => previousData,
    });
  };

  // Función helper para paginación del lado del cliente
  const paginateClientSide = <T>(data: T[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      items: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalCount: data.length,
        hasNext: page < Math.ceil(data.length / limit),
        hasPrev: page > 1,
        limit: limit
      }
    };
  };

  // Función helper para filtrar por búsqueda del lado del cliente
  const filterBySearch = (items: DisposicionBasura[], searchTerm: string): DisposicionBasura[] => {
    if (!searchTerm || !searchTerm.trim()) {
      return items;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return items.filter(disposicion => 
      disposicion.nombre?.toLowerCase().includes(term) ||
      disposicion.descripcion?.toLowerCase().includes(term)
    );
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
    paginateClientSide,
    filterBySearch,
    useCreateDisposicionBasuraMutation,
    useUpdateDisposicionBasuraMutation,
    useDeleteDisposicionBasuraMutation,
  };
};