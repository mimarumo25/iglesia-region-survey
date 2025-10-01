import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { estadosCivilesService } from '@/services/estados-civiles';
import { useMemo } from 'react';
import {
  EstadoCivil,
  EstadoCivilCreate,
  EstadoCivilUpdate,
  EstadoCivilResponse,
  EstadoCivilCreateResponse,
  EstadoCivilUpdateResponse,
  EstadoCivilDeleteResponse,
} from '@/types/estados-civiles';

// ✅ PATRÓN UNIFICADO - Single Query con búsqueda opcional
export const useEstadosCivilesQuery = (searchTerm?: string, includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ['estadosCiviles', searchTerm || 'all', includeInactive],
    queryFn: () => {
      // Si hay término de búsqueda, usar búsqueda; si no, obtener todos
      return searchTerm && searchTerm.trim()
        ? estadosCivilesService.searchEstadosCiviles(searchTerm.trim(), includeInactive, 100, 1, 'id', 'ASC')
        : estadosCivilesService.getEstadosCiviles(includeInactive, 100, 1, 'id', 'ASC');
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};

// 🔧 Helper function para paginación del lado del cliente
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

// 🔍 Helper function para filtrar búsquedas del lado del cliente
export const filterBySearch = (
  items: EstadoCivil[],
  searchTerm: string
): EstadoCivil[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return items;
  }

  const lowercaseSearch = searchTerm.toLowerCase().trim();
  return items.filter(item =>
    item.nombre?.toLowerCase().includes(lowercaseSearch) ||
    item.descripcion?.toLowerCase().includes(lowercaseSearch)
  );
};

export const useEstadosCiviles = () => {
  const queryClient = useQueryClient();

  // ===== QUERIES =====

  // Query para obtener solo los estados civiles activos
  const useEstadosCivilesActivosQuery = (
    limit: number = 100,
    page: number = 1
  ) => {
    return useQuery({
      queryKey: ['estadosCiviles', 'activos', { limit, page }],
      queryFn: () => estadosCivilesService.getEstadosCivilesActivos(limit, page),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener un estado civil por ID
  const useEstadoCivilByIdQuery = (id: number) => {
    return useQuery({
      queryKey: ['estadoCivil', id],
      queryFn: async () => {
        const response = await estadosCivilesService.getEstadoCivilById(id);
        return response.data;
      },
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
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
    useEstadosCivilesActivosQuery,
    useEstadoCivilByIdQuery,
    useCreateEstadoCivilMutation,
    useUpdateEstadoCivilMutation,
    useDeleteEstadoCivilMutation,
  };
};