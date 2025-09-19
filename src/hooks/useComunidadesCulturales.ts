import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { comunidadesCulturalesService } from '@/services/comunidades-culturales';
import { ComunidadCulturalFormData, ComunidadCulturalUpdateData, ComunidadCultural } from '@/types/comunidades-culturales';
import { useMemo } from 'react';

// ✅ PATRÓN UNIFICADO - Single Query con búsqueda opcional
export const useComunidadesCulturalesQuery = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['comunidades-culturales', searchTerm || 'all'],
    queryFn: () => {
      // Si hay término de búsqueda, usar búsqueda; si no, obtener todos
      return searchTerm && searchTerm.trim()
        ? comunidadesCulturalesService.searchComunidadesCulturales(searchTerm.trim(), 1, 100)
        : comunidadesCulturalesService.getComunidadesCulturales(1, 100, 'nombre', 'ASC');
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
  comunidades: ComunidadCultural[],
  searchTerm: string
): ComunidadCultural[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return comunidades;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return comunidades.filter((comunidad) =>
    comunidad.nombre.toLowerCase().includes(term) ||
    (comunidad.descripcion && comunidad.descripcion.toLowerCase().includes(term))
  );
};

// Hook personalizado para todas las operaciones de comunidades culturales
export const useComunidadesCulturales = () => {
  const queryClient = useQueryClient();

  // 🎯 Query principal unificada - reemplaza las dos queries separadas
  const useComunidadesCulturalesQuery = (searchTerm?: string) => {
    return useQuery({
      queryKey: ['comunidades-culturales', searchTerm || 'all'],
      queryFn: () => {
        // Si hay término de búsqueda, usar búsqueda; si no, obtener todos
        return searchTerm && searchTerm.trim()
          ? comunidadesCulturalesService.searchComunidadesCulturales(searchTerm.trim(), 1, 100)
          : comunidadesCulturalesService.getComunidadesCulturales(1, 100, 'nombre', 'ASC');
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener una comunidad cultural por ID
  const useComunidadCulturalByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['comunidad-cultural', id],
      queryFn: () => comunidadesCulturalesService.getComunidadCulturalById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener comunidades culturales activas
  const useActiveComunidadesCulturalesQuery = () => {
    return useQuery({
      queryKey: ['comunidades-culturales-active'],
      queryFn: () => comunidadesCulturalesService.getActiveComunidadesCulturales(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useComunidadesCulturalesStatsQuery = () => {
    return useQuery({
      queryKey: ['comunidades-culturales-stats'],
      queryFn: () => comunidadesCulturalesService.getComunidadesCulturalesStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear comunidad cultural
  const useCreateComunidadCulturalMutation = () => {
    return useMutation({
      mutationFn: (data: ComunidadCulturalFormData) => comunidadesCulturalesService.createComunidadCultural(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-active'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Comunidad cultural creada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear comunidad cultural:', error);
        const message = error?.response?.data?.message || 'Error al crear la comunidad cultural';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar comunidad cultural
  const useUpdateComunidadCulturalMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: ComunidadCulturalUpdateData }) => 
        comunidadesCulturalesService.updateComunidadCultural(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-active'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-stats'] });
        queryClient.invalidateQueries({ queryKey: ['comunidad-cultural', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Comunidad cultural actualizada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar comunidad cultural:', error);
        const message = error?.response?.data?.message || 'Error al actualizar la comunidad cultural';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar comunidad cultural
  const useDeleteComunidadCulturalMutation = () => {
    return useMutation({
      mutationFn: (id: string) => comunidadesCulturalesService.deleteComunidadCultural(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-active'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Comunidad cultural eliminada correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar comunidad cultural:', error);
        const message = error?.response?.data?.message || 'Error al eliminar la comunidad cultural';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleComunidadCulturalStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => comunidadesCulturalesService.toggleComunidadCulturalStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-active'] });
        queryClient.invalidateQueries({ queryKey: ['comunidades-culturales-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado de la comunidad cultural actualizado',
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
    // ✅ Query principal unificada (reemplaza useComunidadesCulturalesQuery + useSearchComunidadesCulturalesQuery)
    useComunidadesCulturalesQuery,
    
    // Queries mantenidas para compatibilidad
    useComunidadCulturalByIdQuery,
    useActiveComunidadesCulturalesQuery,
    useComunidadesCulturalesStatsQuery,
    
    // Mutations
    useCreateComunidadCulturalMutation,
    useUpdateComunidadCulturalMutation,
    useDeleteComunidadCulturalMutation,
    useToggleComunidadCulturalStatusMutation,

    // 🔧 Helper functions exportadas para uso en componentes
    paginateClientSide,
    filterBySearch,
  };
};

export default useComunidadesCulturales;