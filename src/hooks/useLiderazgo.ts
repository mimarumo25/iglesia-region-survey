import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { liderazgoService } from '@/services/liderazgo';
import {
  TipoLiderazgo,
  TipoLiderazgoCreate,
  TipoLiderazgoUpdate,
  LiderazgoResponse,
  LiderazgoCreateResponse,
  LiderazgoUpdateResponse,
  LiderazgoDeleteResponse,
} from '@/types/liderazgo';

// ✅ PATRÓN UNIFICADO - Single Query con búsqueda opcional
export const useLiderazgoQuery = (searchTerm?: string, includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ['liderazgo', searchTerm || 'all', includeInactive],
    queryFn: () => {
      return searchTerm && searchTerm.trim()
        ? liderazgoService.searchLiderazgos(searchTerm.trim(), includeInactive, 100, 1, 'id', 'ASC')
        : liderazgoService.getLiderazgos(includeInactive, 100, 1, 'id', 'ASC');
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};

// 🔧 Helper: paginación del lado del cliente
export const paginateClientSide = <T>(
  items: T[],
  page: number,
  limit: number
): {
  paginatedItems: T[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
} => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / limit);
  return {
    paginatedItems,
    totalPages,
    currentPage: page,
    totalCount: items.length,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// 🔍 Helper: filtrar por búsqueda del lado del cliente
export const filterBySearch = (items: TipoLiderazgo[], searchTerm: string): TipoLiderazgo[] => {
  if (!searchTerm || !searchTerm.trim()) return items;
  const lower = searchTerm.toLowerCase().trim();
  return items.filter(
    (item) =>
      item.nombre?.toLowerCase().includes(lower) ||
      item.descripcion?.toLowerCase().includes(lower)
  );
};

export const useLiderazgo = () => {
  const queryClient = useQueryClient();

  const useCreateLiderazgoMutation = () => {
    return useMutation<LiderazgoCreateResponse, Error, TipoLiderazgoCreate>({
      mutationFn: liderazgoService.createLiderazgo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['liderazgo'] });
        toast({ title: 'Éxito', description: 'Tipo de liderazgo creado correctamente' });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Error al crear el tipo de liderazgo',
          variant: 'destructive',
        });
      },
    });
  };

  const useUpdateLiderazgoMutation = () => {
    return useMutation<LiderazgoUpdateResponse, Error, { id: string; data: TipoLiderazgoUpdate }>({
      mutationFn: ({ id, data }) => liderazgoService.updateLiderazgo(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['liderazgo'] });
        toast({ title: 'Éxito', description: 'Tipo de liderazgo actualizado correctamente' });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Error al actualizar el tipo de liderazgo',
          variant: 'destructive',
        });
      },
    });
  };

  const useDeleteLiderazgoMutation = () => {
    return useMutation<LiderazgoDeleteResponse, Error, string>({
      mutationFn: liderazgoService.deleteLiderazgo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['liderazgo'] });
        toast({ title: 'Éxito', description: 'Tipo de liderazgo desactivado correctamente' });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Error al desactivar el tipo de liderazgo',
          variant: 'destructive',
        });
      },
    });
  };

  return {
    useCreateLiderazgoMutation,
    useUpdateLiderazgoMutation,
    useDeleteLiderazgoMutation,
  };
};
