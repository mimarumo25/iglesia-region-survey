import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { estadosCivilesService } from '@/services/estados-civiles';
import {
  EstadoCivil,
  EstadoCivilCreate,
  EstadoCivilUpdate,
  EstadoCivilResponse,
  EstadoCivilCreateResponse,
  EstadoCivilUpdateResponse,
  EstadoCivilDeleteResponse,
} from '@/types/estados-civiles';

export const useEstadosCiviles = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todos los estados civiles con paginación y filtros
  const useEstadosCivilesQuery = (
    page: number = 1,
    limit: number = 10,
    orderBy: string = 'orden',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
    includeInactive: boolean = false
  ) => {
    return useQuery<EstadoCivilResponse, Error>({
      queryKey: ['estadosCiviles', { page, limit, orderBy, orderDirection, includeInactive }],
      queryFn: () => estadosCivilesService.getEstadosCiviles(includeInactive, limit, page, orderBy, orderDirection),
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error loading estados civiles:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al cargar los estados civiles",
          variant: "destructive",
        });
      },
    });
  };

  // Query para buscar estados civiles por término de búsqueda
  const useSearchEstadosCivilesQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    orderBy: string = 'orden',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
    includeInactive: boolean = false
  ) => {
    return useQuery<EstadoCivilResponse, Error>({
      queryKey: ['estadosCiviles', { search: searchTerm, page, limit, orderBy, orderDirection, includeInactive }],
      queryFn: () => estadosCivilesService.searchEstadosCiviles(searchTerm, includeInactive, limit, page, orderBy, orderDirection),
      enabled: !!searchTerm, // Solo se ejecuta si hay un searchTerm
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error searching estados civiles:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al buscar estados civiles",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener solo los estados civiles activos
  const useEstadosCivilesActivosQuery = (
    limit: number = 10,
    page: number = 1
  ) => {
    return useQuery<EstadoCivilResponse, Error>({
      queryKey: ['estadosCiviles', 'activos', { limit, page }],
      queryFn: () => estadosCivilesService.getEstadosCivilesActivos(limit, page),
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error loading active estados civiles:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al cargar los estados civiles activos",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener un estado civil por ID
  const useEstadoCivilByIdQuery = (id: number) => {
    return useQuery<EstadoCivil, Error>({
      queryKey: ['estadoCivil', id],
      queryFn: async () => {
        const response = await estadosCivilesService.getEstadoCivilById(id);
        return response.data; // Asumiendo que la respuesta es { status: 'success', data: EstadoCivil }
      },
      enabled: !!id, // Solo se ejecuta si hay un ID
      onError: (error: any) => {
        console.error('Error loading estado civil by ID:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al cargar el estado civil",
          variant: "destructive",
        });
      },
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo estado civil
  const useCreateEstadoCivilMutation = () => {
    return useMutation<EstadoCivilCreateResponse, Error, EstadoCivilCreate>({
      mutationFn: estadosCivilesService.createEstadoCivil,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['estadosCiviles'] });
        toast({
          title: "Éxito",
          description: "Estado civil creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating estado civil:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el estado civil",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un estado civil existente
  const useUpdateEstadoCivilMutation = () => {
    return useMutation<EstadoCivilUpdateResponse, Error, { id: number; data: EstadoCivilUpdate }>({
      mutationFn: ({ id, data }) => estadosCivilesService.updateEstadoCivil(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['estadosCiviles'] });
        toast({
          title: "Éxito",
          description: "Estado civil actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating estado civil:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el estado civil",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un estado civil
  const useDeleteEstadoCivilMutation = () => {
    return useMutation<EstadoCivilDeleteResponse, Error, number>({
      mutationFn: estadosCivilesService.deleteEstadoCivil,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['estadosCiviles'] });
        toast({
          title: "Éxito",
          description: "Estado civil eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting estado civil:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el estado civil",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useEstadosCivilesQuery,
    useSearchEstadosCivilesQuery,
    useEstadosCivilesActivosQuery,
    useEstadoCivilByIdQuery,
    useCreateEstadoCivilMutation,
    useUpdateEstadoCivilMutation,
    useDeleteEstadoCivilMutation,
  };
};