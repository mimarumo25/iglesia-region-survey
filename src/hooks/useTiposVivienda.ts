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

  // Query para obtener todos los tipos de vivienda con paginación y ordenamiento
  const useTiposViviendaQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TiposViviendaResponse>, Error>({
      queryKey: ['tiposVivienda', { page, limit, sortBy, sortOrder }],
      queryFn: () => tiposViviendaService.getTiposVivienda(page, limit, sortBy, sortOrder),
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error loading tipos de vivienda:', error);
        toast({
          title: "Error",
          description: "Error al cargar los tipos de vivienda",
          variant: "destructive",
        });
      },
    });
  };

  // Query para buscar tipos de vivienda
  const useSearchTiposViviendaQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TiposViviendaResponse>, Error>({
      queryKey: ['tiposVivienda', { search: searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: () => tiposViviendaService.searchTiposVivienda(searchTerm, page, limit, sortBy, sortOrder),
      enabled: !!searchTerm, // Solo se ejecuta si hay un searchTerm
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error searching tipos de vivienda:', error);
        toast({
          title: "Error",
          description: "Error al buscar tipos de vivienda",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener tipos de vivienda activos
  const useTiposViviendaActivosQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TiposViviendaResponse>, Error>({
      queryKey: ['tiposVivienda', 'activos', { page, limit, sortBy, sortOrder }],
      queryFn: () => tiposViviendaService.getTiposViviendaActivos(page, limit, sortBy, sortOrder),
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error loading active tipos de vivienda:', error);
        toast({
          title: "Error",
          description: "Error al cargar los tipos de vivienda activos",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener un tipo de vivienda por ID
  const useTipoViviendaByIdQuery = (id: string) => {
    return useQuery<ServerResponse<TipoVivienda>, Error>({
      queryKey: ['tipoVivienda', id],
      queryFn: () => tiposViviendaService.getTipoViviendaById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
      onError: (error: any) => {
        console.error('Error loading tipo de vivienda by ID:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al cargar el tipo de vivienda",
          variant: "destructive",
        });
      },
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo tipo de vivienda
  const useCreateTipoViviendaMutation = () => {
    return useMutation<ServerResponse<TipoVivienda>, Error, TipoViviendaCreate>({
      mutationFn: tiposViviendaService.createTipoVivienda,
      onSuccess: () => {
        queryClient.invalidateQueries(['tiposVivienda']); // Invalida y refetch los datos de la lista
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
        queryClient.invalidateQueries(['tiposVivienda']); // Invalida y refetch los datos de la lista
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
        queryClient.invalidateQueries(['tiposVivienda']); // Invalida y refetch los datos de la lista
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
    useSearchTiposViviendaQuery,
    useTiposViviendaActivosQuery,
    useTipoViviendaByIdQuery,
    useCreateTipoViviendaMutation,
    useUpdateTipoViviendaMutation,
    useDeleteTipoViviendaMutation,
  };
};