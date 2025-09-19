import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { tiposViviendaService } from '@/services/tipos-vivienda';
import {
  TipoVivienda,
  TipoViviendaCreate,
  TipoViviendaUpdate,
  TiposViviendaResponse,
  ServerResponse
} from '@/types/tipos-vivienda';

export const useTiposVivienda = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query unificada para tipos de vivienda con parámetro de búsqueda opcional
  const useTiposViviendaQuery = (
    searchTerm?: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TiposViviendaResponse>, Error>({
      queryKey: ['tiposVivienda', { searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: () => {
        if (searchTerm && searchTerm.trim()) {
          return tiposViviendaService.searchTiposVivienda(searchTerm.trim(), page, limit, sortBy, sortOrder);
        }
        return tiposViviendaService.getTiposVivienda(page, limit, sortBy, sortOrder);
      },
      placeholderData: (previousData) => previousData,
    });
  };

  // Función helper para paginación del lado del cliente
  const paginateClientSide = (items: TipoVivienda[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(items.length / limit);
    const currentPage = Math.min(page, Math.max(1, totalPages));
    
    return {
      items: paginatedItems,
      pagination: {
        currentPage,
        totalPages,
        totalCount: items.length,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  };

  // Función helper para filtrar por búsqueda del lado del cliente
  const filterBySearch = (items: TipoVivienda[], searchTerm: string): TipoVivienda[] => {
    if (!searchTerm || !searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase().trim();
    return items.filter((tipo) => 
      tipo.nombre.toLowerCase().includes(term) ||
      (tipo.descripcion && tipo.descripcion.toLowerCase().includes(term))
    );
  };

  // Query para obtener un tipo de vivienda por ID
  const useTipoViviendaByIdQuery = (id: string) => {
    return useQuery<ServerResponse<TipoVivienda>, Error>({
      queryKey: ['tipoVivienda', id],
      queryFn: () => tiposViviendaService.getTipoViviendaById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo tipo de vivienda
  const useCreateTipoViviendaMutation = () => {
    return useMutation<ServerResponse<TipoVivienda>, Error, TipoViviendaCreate>({
      mutationFn: tiposViviendaService.createTipoVivienda,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tiposVivienda'] });
        toast({
          title: "Éxito",
          description: "Tipo de vivienda creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating tipo de vivienda:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el tipo de vivienda",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un tipo de vivienda existente
  const useUpdateTipoViviendaMutation = () => {
    return useMutation<ServerResponse<TipoVivienda>, Error, { id: string; data: TipoViviendaUpdate }>({
      mutationFn: ({ id, data }) => tiposViviendaService.updateTipoVivienda(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tiposVivienda'] });
        toast({
          title: "Éxito",
          description: "Tipo de vivienda actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating tipo de vivienda:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el tipo de vivienda",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un tipo de vivienda
  const useDeleteTipoViviendaMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: tiposViviendaService.deleteTipoVivienda,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tiposVivienda'] });
        toast({
          title: "Éxito",
          description: "Tipo de vivienda eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting tipo de vivienda:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el tipo de vivienda",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useTiposViviendaQuery,
    useTipoViviendaByIdQuery,
    paginateClientSide,
    filterBySearch,
    useCreateTipoViviendaMutation,
    useUpdateTipoViviendaMutation,
    useDeleteTipoViviendaMutation,
  };
};