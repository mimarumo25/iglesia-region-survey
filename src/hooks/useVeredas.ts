import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { veredasService } from '@/services/veredas';
import {
  Vereda,
  VeredaCreate,
  VeredaUpdate,
  VeredasResponse,
} from '@/types/veredas';
import { useMunicipios } from '@/hooks/useMunicipios'; // Importar el hook useMunicipios

export const useVeredas = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const municipiosHook = useMunicipios(); // Obtener el hook de municipios

  // ===== QUERIES =====

  // Query para obtener municipios (reutilizando el hook de municipios)
  const useMunicipiosQuery = municipiosHook.useAllMunicipiosQuery;

  // Query para obtener veredas con paginación
  const useVeredasQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_vereda',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<VeredasResponse, Error>({
      queryKey: ['veredas', { page, limit, sortBy, sortOrder }],
      queryFn: () => veredasService.getVeredas(page, limit, sortBy, sortOrder),
    });
  };

  const useSearchVeredasQuery = (searchTerm: string) => {
    return useQuery<VeredasResponse, Error>({
      queryKey: ['veredas', { searchTerm }],
      queryFn: () => veredasService.searchVeredas(searchTerm),
      enabled: !!searchTerm, // Solo se ejecuta si hay un searchTerm
    });
  };

  const useVeredasByMunicipioQuery = (municipioId: number) => {
    return useQuery<VeredasResponse, Error>({
      queryKey: ['veredas', { municipioId }],
      queryFn: () => veredasService.getVeredasByMunicipio(municipioId),
      enabled: !!municipioId, // Solo se ejecuta si hay un municipioId
    });
  };

  // ===== MUTATIONS =====
  const useCreateVeredaMutation = () => {
    return useMutation<Vereda, Error, VeredaCreate>({
      mutationFn: veredasService.createVereda,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['veredas'] }); // Invalida y refetch las veredas
        toast({
          title: "Éxito",
          description: "Vereda creada correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error al crear vereda:', error);
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Error al crear la vereda",
          variant: "destructive",
        });
      },
    });
  };

  const useUpdateVeredaMutation = () => {
    return useMutation<Vereda, Error, { id: number; data: VeredaUpdate }>({
      mutationFn: ({ id, data }) => veredasService.updateVereda(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['veredas'] }); // Invalida y refetch las veredas
        toast({
          title: "Éxito",
          description: "Vereda actualizada correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar vereda:', error);
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Error al actualizar la vereda",
          variant: "destructive",
        });
      },
    });
  };

  const useDeleteVeredaMutation = () => {
    return useMutation<void, Error, number>({
      mutationFn: veredasService.deleteVereda,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['veredas'] }); // Invalida y refetch las veredas
        toast({
          title: "Éxito",
          description: "Vereda eliminada correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar vereda:', error);
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Error al eliminar la vereda",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useMunicipiosQuery,
    useVeredasQuery,
    useSearchVeredasQuery,
    useVeredasByMunicipioQuery,
    useCreateVeredaMutation,
    useUpdateVeredaMutation,
    useDeleteVeredaMutation,
  };
};
