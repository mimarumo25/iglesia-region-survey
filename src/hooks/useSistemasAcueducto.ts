import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { sistemasAcueductoService } from '@/services/sistemas-acueducto';
import {
  SistemaAcueducto,
  SistemaAcueductoCreate,
  SistemaAcueductoUpdate,
  ServerResponse
} from '@/types/sistemas-acueducto';

export const useSistemasAcueducto = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener todos los sistemas de acueducto con paginación y filtros
  const useSistemasAcueductoQuery = (
    page: number = 1,
    limit: number = 10,
    includeInactive: boolean = false
  ) => {
    return useQuery<SistemaAcueducto[], Error>({
      queryKey: ['sistemas-acueducto', { page, limit, includeInactive }],
      queryFn: () => sistemasAcueductoService.getSistemasAcueducto(includeInactive, limit, page),
    });
  };

  // Query para buscar sistemas de acueducto por término de búsqueda
  const useSearchSistemasAcueductoQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    includeInactive: boolean = false
  ) => {
    return useQuery<SistemaAcueducto[], Error>({
      queryKey: ['sistemas-acueducto', { search: searchTerm, page, limit, includeInactive }],
      queryFn: () => sistemasAcueductoService.searchSistemasAcueducto(searchTerm, includeInactive, limit, page),
      enabled: !!searchTerm, // Solo se ejecuta si hay un searchTerm
    });
  };

  // Query para obtener sistemas de acueducto activos solamente
  const useSistemasAcueductoActivosQuery = (
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery<SistemaAcueducto[], Error>({
      queryKey: ['sistemas-acueducto', 'activos', { page, limit }],
      queryFn: () => sistemasAcueductoService.getSistemasAcueductoActivos(limit, page),
    });
  };

  // Query para obtener un sistema de acueducto por ID
  const useSistemaAcueductoByIdQuery = (id: string) => {
    return useQuery<ServerResponse<SistemaAcueducto>, Error>({
      queryKey: ['sistema-acueducto', id],
      queryFn: () => sistemasAcueductoService.getSistemaAcueductoById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo sistema de acueducto
  const useCreateSistemaAcueductoMutation = () => {
    return useMutation<ServerResponse<SistemaAcueducto>, Error, SistemaAcueductoCreate>({
      mutationFn: sistemasAcueductoService.createSistemaAcueducto,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sistemas-acueducto'] });
        toast({
          title: "Éxito",
          description: "Sistema de acueducto creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating sistema de acueducto:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el sistema de acueducto",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un sistema de acueducto existente
  const useUpdateSistemaAcueductoMutation = () => {
    return useMutation<ServerResponse<SistemaAcueducto>, Error, { id: string; data: SistemaAcueductoUpdate }>({
      mutationFn: ({ id, data }) => sistemasAcueductoService.updateSistemaAcueducto(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sistemas-acueducto'] });
        toast({
          title: "Éxito",
          description: "Sistema de acueducto actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating sistema de acueducto:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el sistema de acueducto",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un sistema de acueducto
  const useDeleteSistemaAcueductoMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: sistemasAcueductoService.deleteSistemaAcueducto,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sistemas-acueducto'] });
        toast({
          title: "Éxito",
          description: "Sistema de acueducto eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting sistema de acueducto:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el sistema de acueducto",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useSistemasAcueductoQuery,
    useSearchSistemasAcueductoQuery,
    useSistemasAcueductoActivosQuery,
    useSistemaAcueductoByIdQuery,
    useCreateSistemaAcueductoMutation,
    useUpdateSistemaAcueductoMutation,
    useDeleteSistemaAcueductoMutation,
  };
};
