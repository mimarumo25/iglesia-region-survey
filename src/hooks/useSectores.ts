import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { sectoresService } from '@/services/sectores';
import { SectorFormData, SectorUpdateData, Sector } from '@/types/sectores';

// Función para filtrar sectores del lado del cliente
const filterBySearch = (sectores: Sector[], searchTerm: string): Sector[] => {
  if (!searchTerm.trim()) return sectores;
  
  const term = searchTerm.toLowerCase().trim();
  return sectores.filter((sector) => 
    sector.nombre.toLowerCase().includes(term) ||
    sector.descripcion?.toLowerCase().includes(term) ||
    sector.codigo?.toLowerCase().includes(term) ||
    sector.municipio?.nombre?.toLowerCase().includes(term) ||
    sector.municipio?.nombre_municipio?.toLowerCase().includes(term) || false
  );
};

// Función para paginación del lado del cliente
const paginateClientSide = (sectores: Sector[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedSectores = sectores.slice(startIndex, endIndex);
  
  return {
    sectores: paginatedSectores,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(sectores.length / limit),
      totalCount: sectores.length,
      hasNext: endIndex < sectores.length,
      hasPrev: page > 1,
      page: page // Para compatibilidad con el componente existente
    }
  };
};

// Hook personalizado para todas las operaciones de sectores
export const useSectores = () => {
  const queryClient = useQueryClient();

  // Query para obtener sectores con paginación (mejorado con cliente-side)
  const useSectoresQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_sector', 
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    searchTerm?: string
  ) => {
    return useQuery({
      queryKey: ['sectores', { page, limit, sortBy, sortOrder, searchTerm }],
      queryFn: async () => {
        try {
          // Obtener todos los sectores para paginación del lado del cliente
          const allSectoresResponse = await sectoresService.getSectores(1, 1000, sortBy, sortOrder);
          const allSectores = allSectoresResponse.data.data || [];
          
          // Aplicar filtro de búsqueda si existe
          const filteredSectores = searchTerm 
            ? filterBySearch(allSectores, searchTerm)
            : allSectores;
          
          // Aplicar ordenamiento si es necesario
          const sortedSectores = [...filteredSectores].sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (sortBy) {
              case 'nombre':
                aValue = a.nombre.toLowerCase();
                bValue = b.nombre.toLowerCase();
                break;
              case 'descripcion':
                aValue = a.descripcion || '';
                bValue = b.descripcion || '';
                break;
              case 'id_sector':
                aValue = parseInt(a.id_sector);
                bValue = parseInt(b.id_sector);
                break;
              default:
                aValue = a.nombre.toLowerCase();
                bValue = b.nombre.toLowerCase();
            }
            
            if (aValue < bValue) return sortOrder === 'ASC' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'ASC' ? 1 : -1;
            return 0;
          });
          
          // Aplicar paginación del lado del cliente
          const paginatedResult = paginateClientSide(sortedSectores, page, limit);
          
          return {
            data: paginatedResult
          };
        } catch (error: any) {
          console.error('Error al cargar sectores:', error);
          throw error;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });
  };

  // Query para buscar sectores - Ahora usa el query unificado
  const useSearchSectoresQuery = (search: string, page: number = 1, limit: number = 10) => {
    return useSectoresQuery(page, limit, 'nombre', 'ASC', search);
  };

  // Query para obtener un sector por ID
  const useSectorByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['sector', id],
      queryFn: () => sectoresService.getSectorById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener sectores activos
  const useActiveSectoresQuery = () => {
    return useQuery({
      queryKey: ['sectores-active'],
      queryFn: () => sectoresService.getActiveSectores(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useSectoresStatsQuery = () => {
    return useQuery({
      queryKey: ['sectores-stats'],
      queryFn: () => sectoresService.getSectoresStatistics(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener municipios disponibles para sectores
  const useMunicipiosDisponiblesQuery = () => {
    return useQuery({
      queryKey: ['municipios-disponibles-sectores'],
      queryFn: () => sectoresService.getMunicipiosDisponibles(),
      staleTime: 1000 * 60 * 15, // 15 minutos para datos de configuración
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear sector
  const useCreateSectorMutation = () => {
    return useMutation({
      mutationFn: (data: SectorFormData) => sectoresService.createSector(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['sectores'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-active'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Sector creado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear sector:', error);
        const message = error?.response?.data?.message || 'Error al crear el sector';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar sector
  const useUpdateSectorMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: SectorUpdateData }) => 
        sectoresService.updateSector(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['sectores'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-active'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-stats'] });
        queryClient.invalidateQueries({ queryKey: ['sector', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Sector actualizado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar sector:', error);
        const message = error?.response?.data?.message || 'Error al actualizar el sector';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar sector
  const useDeleteSectorMutation = () => {
    return useMutation({
      mutationFn: (id: string) => sectoresService.deleteSector(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['sectores'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-active'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Sector eliminado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar sector:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el sector';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleSectorStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => sectoresService.toggleSectorStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['sectores'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-active'] });
        queryClient.invalidateQueries({ queryKey: ['sectores-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado del sector actualizado',
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
    useSectoresQuery,
    useSearchSectoresQuery,
    useSectorByIdQuery,
    useActiveSectoresQuery,
    useSectoresStatsQuery,
    useMunicipiosDisponiblesQuery,
    
    // Mutations
    useCreateSectorMutation,
    useUpdateSectorMutation,
    useDeleteSectorMutation,
    useToggleSectorStatusMutation,
  };
};

export default useSectores;
