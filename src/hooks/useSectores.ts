import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { sectoresService } from '@/services/sectores';
import { SectorFormData, SectorUpdateData, Sector } from '@/types/sectores';

interface SectorApiItem {
  id_sector?: string | number;
  idSector?: string | number;
  id?: string | number;
  nombre?: string;
  name?: string;
  id_municipio?: string | number | null;
  municipio_id?: string | number | null;
  municipioId?: string | number | null;
  created_at?: string;
  createdAt?: string;
  fecha_creacion?: string;
  fechaCreacion?: string;
  updated_at?: string;
  updatedAt?: string;
  fecha_actualizacion?: string;
  fechaActualizacion?: string;
  municipio_nombre?: string;
  nombre_municipio?: string;
  municipioName?: string;
}

const filterBySearch = (sectores: Sector[], searchTerm: string): Sector[] => {
  if (!searchTerm.trim()) return sectores;

  const term = searchTerm.toLowerCase().trim();
  return sectores.filter((sector) => {
    const nombreMatch = sector.nombre.toLowerCase().includes(term);
    const municipioMatch = sector.municipioNombre?.toLowerCase().includes(term) ?? false;
    const municipioIdMatch = sector.id_municipio !== null
      ? String(sector.id_municipio).toLowerCase().includes(term)
      : false;

    return nombreMatch || municipioMatch || municipioIdMatch;
  });
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

const normalizeSector = (sector: SectorApiItem | null | undefined): Sector => {
  if (!sector) {
    return {
      id_sector: '',
      nombre: '',
      id_municipio: null,
      created_at: undefined,
      updated_at: undefined,
      municipioNombre: null,
    };
  }

  const resolvedIdSector = sector.id_sector ?? sector.idSector ?? sector.id ?? '';

  const rawMunicipioId =
    sector.id_municipio ??
    sector.municipio_id ??
    sector.municipioId ??
    null;

  const parsedMunicipioId = (() => {
    if (rawMunicipioId === null || rawMunicipioId === undefined) {
      return null;
    }

    if (typeof rawMunicipioId === 'number') {
      return rawMunicipioId;
    }

    const trimmed = rawMunicipioId.trim();
    if (trimmed.length === 0) {
      return null;
    }

    const numericValue = Number(trimmed);
    return Number.isNaN(numericValue) ? trimmed : numericValue;
  })();

  const resolvedNombre = sector.nombre ?? sector.name ?? '';

  const resolvedCreatedAt =
    sector.created_at ??
    sector.createdAt ??
    sector.fecha_creacion ??
    sector.fechaCreacion ??
    undefined;

  const resolvedUpdatedAt =
    sector.updated_at ??
    sector.updatedAt ??
    sector.fecha_actualizacion ??
    sector.fechaActualizacion ??
    undefined;

  const municipioNombre =
    sector.municipio_nombre ??
    sector.nombre_municipio ??
    sector.municipioName ??
    null;

  return {
    id_sector: resolvedIdSector.toString(),
    nombre: resolvedNombre,
    id_municipio: parsedMunicipioId,
    created_at: resolvedCreatedAt,
    updated_at: resolvedUpdatedAt,
    municipioNombre,
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
          const rawSectoresData = allSectoresResponse.data?.data;
          const allSectores = Array.isArray(rawSectoresData)
            ? rawSectoresData.map((item) => normalizeSector(item as SectorApiItem))
            : [];
          
          // Aplicar filtro de búsqueda si existe
          const filteredSectores = searchTerm 
            ? filterBySearch(allSectores, searchTerm)
            : allSectores;
          
          // Aplicar ordenamiento si es necesario
          const sortedSectores = [...filteredSectores].sort((a, b) => {
            let aValue: string | number | null | undefined;
            let bValue: string | number | null | undefined;

            switch (sortBy) {
              case 'nombre':
                aValue = a.nombre;
                bValue = b.nombre;
                break;
              case 'id_sector':
                aValue = Number.parseInt(a.id_sector, 10);
                bValue = Number.parseInt(b.id_sector, 10);
                break;
              case 'id_municipio':
                aValue = a.id_municipio;
                bValue = b.id_municipio;
                break;
              case 'created_at':
                aValue = a.created_at;
                bValue = b.created_at;
                break;
              case 'updated_at':
                aValue = a.updated_at;
                bValue = b.updated_at;
                break;
              default:
                aValue = a.nombre;
                bValue = b.nombre;
            }

            const normalize = (value: string | number | null | undefined) => {
              if (typeof value === 'number') return value;
              if (value === null || value === undefined) return '';
              return value.toString().toLowerCase();
            };

            const normalizedA = normalize(aValue);
            const normalizedB = normalize(bValue);

            if (typeof normalizedA === 'number' && typeof normalizedB === 'number') {
              if (normalizedA === normalizedB) return 0;
              return sortOrder === 'ASC'
                ? normalizedA - normalizedB
                : normalizedB - normalizedA;
            }

            const stringA = normalizedA.toString();
            const stringB = normalizedB.toString();
            return sortOrder === 'ASC'
              ? stringA.localeCompare(stringB)
              : stringB.localeCompare(stringA);
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

  // Query para obtener sectores por municipio
  const useSectoresByMunicipioQuery = (municipioId: string | number | null) => {
    return useQuery({
      queryKey: ['sectores', { municipio: municipioId }],
      queryFn: async () => {
        if (!municipioId) return { data: [] };
        
        try {
          const sectores = await sectoresService.getSectoresByMunicipio(municipioId);
          return {
            success: true,
            data: Array.isArray(sectores) 
              ? sectores.map(sector => normalizeSector(sector as SectorApiItem))
              : [],
            message: 'Sectores obtenidos exitosamente'
          };
        } catch (error) {
          console.error('Error al obtener sectores por municipio:', error);
          return { data: [] };
        }
      },
      enabled: !!municipioId,
      staleTime: 1000 * 60 * 5,
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
    useSectoresByMunicipioQuery,
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
