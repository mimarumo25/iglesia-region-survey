import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { profesionesService } from '@/services/profesiones';
import { ProfesionFormData, ProfesionUpdateData, Profesion } from '@/types/profesiones';
import { useMemo } from 'react';

// ✅ PATRÓN UNIFICADO - Single Query con búsqueda opcional
export const useProfesionesQuery = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['profesiones', searchTerm || 'all'],
    queryFn: () => {
      // Si hay término de búsqueda, usar búsqueda; si no, obtener todos
      return searchTerm && searchTerm.trim()
        ? profesionesService.searchProfesiones(searchTerm.trim(), 1, 100)
        : profesionesService.getProfesiones(1, 100, 'id_profesion', 'ASC');
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
  items: Profesion[],
  searchTerm: string
): Profesion[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return items;
  }

  const lowercaseSearch = searchTerm.toLowerCase().trim();
  return items.filter(item =>
    item.nombre_profesion?.toLowerCase().includes(lowercaseSearch) ||
    item.descripcion?.toLowerCase().includes(lowercaseSearch)
  );
};

// Hook personalizado para todas las operaciones de profesiones
export const useProfesiones = () => {
  const queryClient = useQueryClient();

  // Query para obtener una profesión por ID
  const useProfesionByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['profesion', id],
      queryFn: () => profesionesService.getProfesionById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener profesiones activas
  const useActiveProfesionesQuery = () => {
    return useQuery({
      queryKey: ['profesiones-active'],
      queryFn: () => profesionesService.getActiveProfesiones(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener estadísticas
  const useProfesionesStatsQuery = () => {
    return useQuery({
      queryKey: ['profesiones-stats'],
      queryFn: () => profesionesService.getProfesionesStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Mutación para crear profesión
  const useCreateProfesionMutation = () => {
    return useMutation({
      mutationFn: (data: ProfesionFormData) => profesionesService.createProfesion(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['profesiones'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-active'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Profesión creada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear profesión:', error);
        const message = error?.response?.data?.message || 'Error al crear la profesión';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar profesión
  const useUpdateProfesionMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: ProfesionUpdateData }) => 
        profesionesService.updateProfesion(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['profesiones'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-active'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-stats'] });
        queryClient.invalidateQueries({ queryKey: ['profesion', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Profesión actualizada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar profesión:', error);
        const message = error?.response?.data?.message || 'Error al actualizar la profesión';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar profesión
  const useDeleteProfesionMutation = () => {
    return useMutation({
      mutationFn: (id: string) => profesionesService.deleteProfesion(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['profesiones'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-active'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Profesión eliminada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar profesión:', error);
        const message = error?.response?.data?.message || 'Error al eliminar la profesión';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleProfesionStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => profesionesService.toggleProfesionStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['profesiones'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-active'] });
        queryClient.invalidateQueries({ queryKey: ['profesiones-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado de la profesión actualizado',
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
    // Queries
    useProfesionByIdQuery,
    useActiveProfesionesQuery,
    useProfesionesStatsQuery,
    
    // Mutations
    useCreateProfesionMutation,
    useUpdateProfesionMutation,
    useDeleteProfesionMutation,
    useToggleProfesionStatusMutation,
  };
};

export default useProfesiones;
