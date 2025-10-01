import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { veredasService } from '@/services/veredas';
import { useMunicipios } from '@/hooks/useMunicipios';
import {
  Vereda,
  VeredaCreate,
  VeredaUpdate,
  VeredasResponse,
} from '@/types/veredas';

// ===== FUNCIONES DE PAGINACIÓN Y FILTRADO CLIENT-SIDE =====
export const paginateClientSide = <T>(
  data: T[],
  page: number,
  limit: number
) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: data.length,
    page,
    limit,
    totalPages: Math.ceil(data.length / limit),
  };
};

export const filterBySearch = (
  veredas: Vereda[],
  searchTerm: string
): Vereda[] => {
  if (!searchTerm.trim()) return veredas;
  
  const term = searchTerm.toLowerCase().trim();
  return veredas.filter(
    (vereda) =>
      vereda.nombre?.toLowerCase().includes(term) ||
      (vereda.municipio?.nombre?.toLowerCase().includes(term)) ||
      vereda.id_vereda?.toString().includes(term)
  );
};

export const filterByMunicipio = (
  veredas: Vereda[],
  municipioId: string
): Vereda[] => {
  if (!municipioId || municipioId === 'all') return veredas;
  
  const id = parseInt(municipioId);
  if (isNaN(id)) return veredas;
  
  return veredas.filter(vereda => vereda.id_municipio === id);
};

export const useVeredas = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const municipiosHook = useMunicipios();

  // ===== QUERY UNIFICADA PARA VEREDAS =====
  const useVeredasQuery = (searchTerm: string = '', municipioFilter: string = '', page: number = 1, limit: number = 10) => {
    return useQuery<VeredasResponse, Error>({
      queryKey: ['veredas', { searchTerm, municipioFilter, page, limit }],
      queryFn: async () => {
        // Obtener todas las veredas desde el servidor
        const response = await veredasService.getVeredas(1, 1000, 'id_vereda', 'ASC');
        
        let filteredVeredas = response.data || [];
        
        // Aplicar filtro por municipio primero
        if (municipioFilter && municipioFilter !== 'all') {
          filteredVeredas = filterByMunicipio(filteredVeredas, municipioFilter);
        }
        
        // Aplicar filtro de búsqueda
        if (searchTerm.trim()) {
          filteredVeredas = filterBySearch(filteredVeredas, searchTerm);
        }
        
        // Aplicar paginación client-side
        const paginatedResult = paginateClientSide(filteredVeredas, page, limit);
        
        return {
          data: paginatedResult.data,
          page: paginatedResult.page,
          limit: paginatedResult.limit,
          total: paginatedResult.total,
          totalPages: paginatedResult.totalPages,
        };
      },
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para municipios (reutilizando el hook existente)
  const useMunicipiosQuery = municipiosHook.useAllMunicipiosQuery;

  // ===== MUTATIONS =====
  const useCreateVeredaMutation = () => {
    return useMutation<Vereda, Error, VeredaCreate>({
      mutationFn: veredasService.createVereda,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['veredas'] });
        toast({
          title: "Éxito",
          description: "Vereda creada correctamente",
        });
      },
      onError: (error: Error & { response?: { data?: { message?: string } } }) => {
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
        queryClient.invalidateQueries({ queryKey: ['veredas'] });
        toast({
          title: "Éxito",
          description: "Vereda actualizada correctamente",
        });
      },
      onError: (error: Error & { response?: { data?: { message?: string } } }) => {
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
        queryClient.invalidateQueries({ queryKey: ['veredas'] });
        toast({
          title: "Éxito",
          description: "Vereda eliminada correctamente",
        });
      },
      onError: (error: Error & { response?: { data?: { message?: string } } }) => {
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
    useVeredasQuery,
    useMunicipiosQuery,
    useCreateVeredaMutation,
    useUpdateVeredaMutation,
    useDeleteVeredaMutation,
  };
};