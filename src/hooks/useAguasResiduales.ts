import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { aguasResidualesService } from '@/services/aguas-residuales';
import {
  AguaResidual,
  AguaResidualCreate,
  AguaResidualUpdate,
  AguaResidualPagination,
  AguasResidualesResponse,
  ServerResponse
} from '@/types/aguas-residuales';

export const useAguasResiduales = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todos los tipos de aguas residuales con paginación y ordenamiento
  const useAguasResidualesQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_tipo_aguas_residuales',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<AguasResidualesResponse>, Error>({
      queryKey: ['aguasResiduales', { page, limit, sortBy, sortOrder }],
      queryFn: () => aguasResidualesService.getAguasResiduales(page, limit, sortBy, sortOrder),
      keepPreviousData: true, // Mantiene los datos anteriores mientras se carga la nueva página
      onError: (error: any) => {
        console.error('Error loading aguas residuales:', error);
        toast({
          title: "Error",
          description: "Error al cargar los tipos de aguas residuales",
          variant: "destructive",
        });
      },
    });
  };

  // Query para buscar tipos de aguas residuales
  const useSearchAguasResidualesQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_tipo_aguas_residuales',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<AguasResidualesResponse>, Error>({
      queryKey: ['aguasResiduales', { searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: () => aguasResidualesService.searchAguasResiduales(searchTerm, page, limit, sortBy, sortOrder),
      enabled: !!searchTerm, // Solo se ejecuta si hay un searchTerm
      keepPreviousData: true,
      onError: (error: any) => {
        console.error('Error searching aguas residuales:', error);
        toast({
          title: "Error",
          description: "Error al buscar tipos de aguas residuales",
          variant: "destructive",
        });
      },
    });
  };

  // Query para obtener un tipo de agua residual por ID
  const useAguaResidualByIdQuery = (id: string) => {
    return useQuery<ServerResponse<AguaResidual>, Error>({
      queryKey: ['aguaResidual', id],
      queryFn: () => aguasResidualesService.getAguaResidualById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
      onError: (error: any) => {
        console.error('Error loading agua residual by ID:', error);
        toast({
          title: "Error",
          description: "Error al cargar el tipo de agua residual",
          variant: "destructive",
        });
      },
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo tipo de agua residual
  const useCreateAguaResidualMutation = () => {
    return useMutation<ServerResponse<AguaResidual>, Error, AguaResidualCreate>({
      mutationFn: aguasResidualesService.createAguaResidual,
      onSuccess: () => {
        queryClient.invalidateQueries(['aguasResiduales']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Tipo de agua residual creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating agua residual:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el tipo de agua residual",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un tipo de agua residual existente
  const useUpdateAguaResidualMutation = () => {
    return useMutation<ServerResponse<AguaResidual>, Error, { id: string; data: AguaResidualUpdate }>({
      mutationFn: ({ id, data }) => aguasResidualesService.updateAguaResidual(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries(['aguasResiduales']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Tipo de agua residual actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating agua residual:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el tipo de agua residual",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un tipo de agua residual
  const useDeleteAguaResidualMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: aguasResidualesService.deleteAguaResidual,
      onSuccess: () => {
        queryClient.invalidateQueries(['aguasResiduales']); // Invalida y refetch los datos de la lista
        toast({
          title: "Éxito",
          description: "Tipo de agua residual eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting agua residual:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el tipo de agua residual",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useAguasResidualesQuery,
    useSearchAguasResidualesQuery,
    useAguaResidualByIdQuery,
    useCreateAguaResidualMutation,
    useUpdateAguaResidualMutation,
    useDeleteAguaResidualMutation,
  };
};