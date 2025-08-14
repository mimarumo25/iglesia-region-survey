import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { tiposIdentificacionService } from '@/services/tipos-identificacion';
import {
  TipoIdentificacion,
  TipoIdentificacionCreate,
  TipoIdentificacionUpdate,
  TiposIdentificacionResponse,
  ServerResponse
} from '@/services/tipos-identificacion';

export const useTiposIdentificacion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todos los tipos de identificación con paginación y ordenamiento
  const useTiposIdentificacionQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_tipo_identificacion',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TiposIdentificacionResponse>, Error>({
      queryKey: ['tiposIdentificacion', { page, limit, sortBy, sortOrder }],
      queryFn: () => tiposIdentificacionService.getTiposIdentificacion(page, limit, sortBy, sortOrder),
      keepPreviousData: true, // Mantiene los datos anteriores mientras se carga la nueva página
      onError: (error: any) => {
        console.error('Error loading tipos identificación:', error);
        toast({
          title: "Error",
          description: "Error al cargar los tipos de identificación",
          variant: "destructive",
        });
      },
    });
  };

  // Query para buscar tipos de identificación
  const useSearchTiposIdentificacionQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TiposIdentificacionResponse>, Error>({
      queryKey: ['tiposIdentificacion', { searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: () => tiposIdentificacionService.searchTiposIdentificacion(searchTerm, page, limit, sortBy, sortOrder),
      enabled: !!searchTerm, // Solo se ejecuta si hay un searchTerm
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error searching tipos identificación:', error);
        toast({
          title: "Error",
          description: "Error al buscar tipos de identificación",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener un tipo de identificación por ID
  const useTipoIdentificacionByIdQuery = (id: string) => {
    return useQuery<ServerResponse<TipoIdentificacion>, Error>({
      queryKey: ['tipoIdentificacion', id],
      queryFn: () => tiposIdentificacionService.getTipoIdentificacionById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
      onError: (error: any) => {
        console.error('Error loading tipo identificación by ID:', error);
        toast({
          title: "Error",
          description: "Error al cargar el tipo de identificación",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener tipos de identificación activos (para formularios)
  const useTiposIdentificacionActivosQuery = (
    page: number = 1,
    limit: number = 100,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<TiposIdentificacionResponse>, Error>({
      queryKey: ['tiposIdentificacionActivos', { page, limit, sortBy, sortOrder }],
      queryFn: () => tiposIdentificacionService.getTiposIdentificacionActivos(page, limit, sortBy, sortOrder),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      onError: (error: any) => {
        console.error('Error loading tipos identificación activos:', error);
        toast({
          title: "Error",
          description: "Error al cargar los tipos de identificación activos",
          variant: "destructive",
        });
      },
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo tipo de identificación
  const useCreateTipoIdentificacionMutation = () => {
    return useMutation<ServerResponse<TipoIdentificacion>, Error, TipoIdentificacionCreate>({
      mutationFn: tiposIdentificacionService.createTipoIdentificacion,
      onSuccess: () => {
        queryClient.invalidateQueries(['tiposIdentificacion']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Tipo de identificación creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating tipo identificación:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el tipo de identificación",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un tipo de identificación existente
  const useUpdateTipoIdentificacionMutation = () => {
    return useMutation<ServerResponse<TipoIdentificacion>, Error, { id: string; data: TipoIdentificacionUpdate }>({
      mutationFn: ({ id, data }) => tiposIdentificacionService.updateTipoIdentificacion(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries(['tiposIdentificacion']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Tipo de identificación actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating tipo identificación:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el tipo de identificación",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un tipo de identificación
  const useDeleteTipoIdentificacionMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: tiposIdentificacionService.deleteTipoIdentificacion,
      onSuccess: () => {
        queryClient.invalidateQueries(['tiposIdentificacion']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Tipo de identificación eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting tipo identificación:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el tipo de identificación",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useTiposIdentificacionQuery,
    useSearchTiposIdentificacionQuery,
    useTipoIdentificacionByIdQuery,
    useTiposIdentificacionActivosQuery,
    useCreateTipoIdentificacionMutation,
    useUpdateTipoIdentificacionMutation,
    useDeleteTipoIdentificacionMutation,
  };
};
