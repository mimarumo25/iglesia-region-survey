import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { parentescosService } from '@/services/parentescos';
import {
  Parentesco,
  ParentescoCreate,
  ParentescoUpdate,
  ParentescosResponse,
  ServerResponse
} from '@/types/parentescos';

export const useParentescos = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todos los parentescos con paginación y filtros
  const useParentescosQuery = (
    page: number = 1,
    limit: number = 10,
    includeInactive: boolean = false
  ) => {
    return useQuery<Parentesco[], Error>({
      queryKey: ['parentescos', { page, limit, includeInactive }],
      queryFn: () => parentescosService.getParentescos(includeInactive, limit, page),
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error loading parentescos:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al cargar los parentescos",
          variant: "destructive",
        });
      },
    });
  };

  // Query para buscar parentescos por término de búsqueda
  const useSearchParentescosQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    includeInactive: boolean = false
  ) => {
    return useQuery<ServerResponse<ParentescosResponse>, Error>({
      queryKey: ['parentescos', { search: searchTerm, page, limit, includeInactive }],
      queryFn: () => parentescosService.searchParentescos(searchTerm, includeInactive, limit, page),
      enabled: !!searchTerm, // Solo se ejecuta si hay un searchTerm
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error searching parentescos:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al buscar parentescos",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener parentescos activos solamente
  const useParentescosActivosQuery = (
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery<ServerResponse<ParentescosResponse>, Error>({
      queryKey: ['parentescos', 'activos', { page, limit }],
      queryFn: () => parentescosService.getParentescosActivos(limit, page),
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error loading active parentescos:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al cargar los parentescos activos",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener un parentesco por ID
  const useParentescoByIdQuery = (id: string) => {
    return useQuery<ServerResponse<Parentesco>, Error>({
      queryKey: ['parentesco', id],
      queryFn: () => parentescosService.getParentescoById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
      onError: (error: any) => {
        console.error('Error loading parentesco by ID:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al cargar el parentesco",
          variant: "destructive",
        });
      },
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo parentesco
  const useCreateParentescoMutation = () => {
    return useMutation<ServerResponse<Parentesco>, Error, ParentescoCreate>({
      mutationFn: parentescosService.createParentesco,
      onSuccess: () => {
        queryClient.invalidateQueries(['parentescos']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Parentesco creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating parentesco:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el parentesco",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un parentesco existente
  const useUpdateParentescoMutation = () => {
    return useMutation<ServerResponse<Parentesco>, Error, { id: string; data: ParentescoUpdate }>({
      mutationFn: ({ id, data }) => parentescosService.updateParentesco(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries(['parentescos']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Parentesco actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating parentesco:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el parentesco",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un parentesco
  const useDeleteParentescoMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: parentescosService.deleteParentesco,
      onSuccess: () => {
        queryClient.invalidateQueries(['parentescos']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Parentesco eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting parentesco:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el parentesco",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useParentescosQuery,
    useSearchParentescosQuery,
    useParentescosActivosQuery,
    useParentescoByIdQuery,
    useCreateParentescoMutation,
    useUpdateParentescoMutation,
    useDeleteParentescoMutation,
  };
};