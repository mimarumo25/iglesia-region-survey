import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { estudiosService } from '@/services/estudios';
import { EstudioFormData, EstudioUpdateData, Estudio } from '@/types/estudios';
import { useMemo } from 'react';

// ✅ PATRÓN UNIFICADO - Single Query con búsqueda opcional
export const useEstudiosQuery = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['estudios', searchTerm || 'all'],
    queryFn: () => {
      // Si hay término de búsqueda, usar búsqueda; si no, obtener todos
      return searchTerm && searchTerm.trim()
        ? estudiosService.searchEstudios(searchTerm.trim(), 1, 100)
        : estudiosService.getEstudios(1, 100, 'ordenNivel', 'ASC');
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
  estudios: Estudio[],
  searchTerm: string
): Estudio[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return estudios;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return estudios.filter((estudio) =>
    estudio.nivel.toLowerCase().includes(term) ||
    (estudio.descripcion && estudio.descripcion.toLowerCase().includes(term))
  );
};

// Hook personalizado para todas las operaciones de estudios
export const useEstudios = () => {
  const queryClient = useQueryClient();

  // 🎯 Query principal unificada - reemplaza las dos queries separadas
  const useEstudiosQuery = (searchTerm?: string) => {
    return useQuery({
      queryKey: ['estudios', searchTerm || 'all'],
      queryFn: () => {
        // Si hay término de búsqueda, usar búsqueda; si no, obtener todos
        return searchTerm && searchTerm.trim()
          ? estudiosService.searchEstudios(searchTerm.trim(), 1, 100)
          : estudiosService.getEstudios(1, 100, 'ordenNivel', 'ASC');
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener un estudio por ID
  const useEstudioByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['estudio', id],
      queryFn: () => estudiosService.getEstudioById(id),
      enabled: !!id,
    });
  };

  // Query para obtener estudios activos
  const useActiveEstudiosQuery = () => {
    return useQuery({
      queryKey: ['estudios-active'],
      queryFn: () => estudiosService.getActiveEstudios(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useEstudiosStatsQuery = () => {
    return useQuery({
      queryKey: ['estudios-stats'],
      queryFn: () => estudiosService.getEstudiosStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear estudio
  const useCreateEstudioMutation = () => {
    return useMutation({
      mutationFn: (data: EstudioFormData) => estudiosService.createEstudio(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['estudios'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-active'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estudio creado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear estudio:', error);
        const message = error?.response?.data?.message || 'Error al crear el estudio';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar estudio
  const useUpdateEstudioMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: EstudioUpdateData }) => 
        estudiosService.updateEstudio(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['estudios'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-active'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-stats'] });
        queryClient.invalidateQueries({ queryKey: ['estudio', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Estudio actualizado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar estudio:', error);
        const message = error?.response?.data?.message || 'Error al actualizar el estudio';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar estudio
  const useDeleteEstudioMutation = () => {
    return useMutation({
      mutationFn: (id: string) => estudiosService.deleteEstudio(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['estudios'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-active'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estudio eliminado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar estudio:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el estudio';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleEstudioStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => estudiosService.toggleEstudioStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['estudios'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-active'] });
        queryClient.invalidateQueries({ queryKey: ['estudios-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado del estudio actualizado',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al cambiar estado:', error);
        const message = error?.response?.data?.message || 'Error al cambiar el estado';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  return {
    // ✅ Query principal unificada (reemplaza useEstudiosQuery + useSearchEstudiosQuery)
    useEstudiosQuery,
    
    // Queries mantenidas para compatibilidad
    useEstudioByIdQuery,
    useActiveEstudiosQuery,
    useEstudiosStatsQuery,
    
    // Mutations
    useCreateEstudioMutation,
    useUpdateEstudioMutation,
    useDeleteEstudioMutation,
    useToggleEstudioStatusMutation,

    // 🔧 Helper functions exportadas para uso en componentes
    paginateClientSide,
    filterBySearch,
  };
};

export default useEstudios;