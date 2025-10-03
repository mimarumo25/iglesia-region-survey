import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enfermedadesService } from '@/services/enfermedades';
import {
  Enfermedad,
  EnfermedadCreate,
  EnfermedadUpdate,
  EnfermedadesResponse
} from '@/types/enfermedades';
import { useToast } from '@/hooks/use-toast';

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
  items: Enfermedad[],
  searchTerm: string
): Enfermedad[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return items;
  }

  const lowercaseSearch = searchTerm.toLowerCase().trim();
  return items.filter(item =>
    item.nombre?.toLowerCase().includes(lowercaseSearch) ||
    item.descripcion?.toLowerCase().includes(lowercaseSearch)
  );
};

// ✅ PATRÓN UNIFICADO - Single Query con búsqueda opcional
export const useEnfermedadesQuery = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['enfermedades', searchTerm || 'all'],
    queryFn: async () => {
      // Obtener todos los datos del backend
      const response = await enfermedadesService.getEnfermedades(1, 1000, 'id_enfermedad', 'ASC');
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useEnfermedades = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener una enfermedad por ID
  const useEnfermedadByIdQuery = (id: string) => {
    return useQuery<Enfermedad, Error>({
      queryKey: ['enfermedad', id],
      queryFn: () => enfermedadesService.getEnfermedadById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear enfermedad
  const useCreateEnfermedadMutation = () => {
    return useMutation<Enfermedad, Error, EnfermedadCreate>({
      mutationFn: enfermedadesService.createEnfermedad,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['enfermedades'] });
        toast({
          title: 'Éxito',
          description: 'Enfermedad creada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al crear enfermedad';
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
    return useMutation<Enfermedad, Error, { id: string; data: EnfermedadCreate }>({
      mutationFn: ({ id, data }) => enfermedadesService.updateEnfermedad(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['enfermedades'] });
        toast({
          title: 'Éxito',
          description: 'Enfermedad actualizada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al actualizar enfermedad';
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
        queryClient.invalidateQueries({ queryKey: ['enfermedades'] });
        toast({
          title: 'Éxito',
          description: 'Enfermedad eliminada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al eliminar enfermedad';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // ===== RETURN OBJECT =====
  return {
    // Queries
    useEnfermedadesQuery, // ✅ Exportar el hook principal de queries
    useEnfermedadByIdQuery,
    // Mutations
    useCreateEnfermedadMutation,
    useUpdateEnfermedadMutation,
    useDeleteEnfermedadMutation,
  };
};