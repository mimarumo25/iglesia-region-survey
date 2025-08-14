import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enfermedadesService } from '@/services/enfermedades';
import {
  Enfermedad,
  EnfermedadCreate,
  EnfermedadUpdate,
  EnfermedadesResponse,
} from '@/types/enfermedades';
import { useToast } from '@/hooks/use-toast';

export const useEnfermedades = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todas las enfermedades con paginación
  const useEnfermedadesQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_enfermedad',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<EnfermedadesResponse, Error>({
      queryKey: ['enfermedades', { page, limit, sortBy, sortOrder }],
      queryFn: () => enfermedadesService.getEnfermedades(page, limit, sortBy, sortOrder),
      keepPreviousData: true,
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al cargar enfermedades';
        console.error('Error loading enfermedades:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Query para buscar enfermedades
  const useSearchEnfermedadesQuery = (
    query: string,
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery<EnfermedadesResponse, Error>({
      queryKey: ['enfermedades', { search: query, page, limit }],
      queryFn: () => enfermedadesService.searchEnfermedades(query, page, limit),
      enabled: !!query.trim(),
      keepPreviousData: true,
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al buscar enfermedades';
        console.error('Error searching enfermedades:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Query para filtrar enfermedades por categoría
  const useEnfermedadesByCategoriaQuery = (
    categoria: string,
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery<EnfermedadesResponse, Error>({
      queryKey: ['enfermedades', { category: categoria, page, limit }],
      queryFn: () => enfermedadesService.getEnfermedadesByCategoria(categoria, page, limit),
      enabled: !!categoria.trim(),
      keepPreviousData: true,
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al filtrar enfermedades por categoría';
        console.error('Error filtering enfermedades by category:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Query para obtener una enfermedad por ID
  const useEnfermedadByIdQuery = (id: string) => {
    return useQuery<Enfermedad, Error>({
      queryKey: ['enfermedad', id],
      queryFn: () => enfermedadesService.getEnfermedadById(id),
      enabled: !!id,
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al obtener enfermedad';
        console.error('Error getting enfermedad by ID:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear enfermedad
  const useCreateEnfermedadMutation = () => {
    return useMutation<Enfermedad, Error, EnfermedadCreate>({
      mutationFn: enfermedadesService.createEnfermedad,
      onSuccess: () => {
        queryClient.invalidateQueries(['enfermedades']); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Enfermedad creada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al crear enfermedad';
        console.error('Error creating enfermedad:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar enfermedad
  const useUpdateEnfermedadMutation = () => {
    return useMutation<Enfermedad, Error, { id: string; data: EnfermedadUpdate }>({
      mutationFn: ({ id, data }) => enfermedadesService.updateEnfermedad(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries(['enfermedades']); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Enfermedad actualizada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al actualizar enfermedad';
        console.error('Error updating enfermedad:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar enfermedad
  const useDeleteEnfermedadMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: enfermedadesService.deleteEnfermedad,
      onSuccess: () => {
        queryClient.invalidateQueries(['enfermedades']); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Enfermedad eliminada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al eliminar enfermedad';
        console.error('Error deleting enfermedad:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  return {
    useEnfermedadesQuery,
    useSearchEnfermedadesQuery,
    useEnfermedadesByCategoriaQuery,
    useEnfermedadByIdQuery,
    useCreateEnfermedadMutation,
    useUpdateEnfermedadMutation,
    useDeleteEnfermedadMutation,
  };
};