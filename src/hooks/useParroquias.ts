import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parroquiasService } from '@/services/parroquias';
import {
  Parroquia,
  ParroquiaCreate,
  ParroquiaUpdate,
  ParroquiasResponse,
  ServerResponse
} from '@/types/parroquias';
import { useToast } from '@/hooks/use-toast';

// Función para paginar datos del lado del cliente
const paginateClientSide = <T>(data: T[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalCount: data.length,
      hasNext: page < Math.ceil(data.length / limit),
      hasPrev: page > 1,
      limit: limit
    }
  };
};

// Función para filtrar parroquias por término de búsqueda
const filterBySearch = (parroquias: Parroquia[], searchTerm: string): Parroquia[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return parroquias;
  }
  
  const term = searchTerm.toLowerCase().trim();
  return parroquias.filter(parroquia => 
    parroquia.nombre?.toLowerCase().includes(term) ||
    parroquia.direccion?.toLowerCase().includes(term) ||
    parroquia.telefono?.toLowerCase().includes(term) ||
    parroquia.email?.toLowerCase().includes(term) ||
    parroquia.municipio?.nombre_municipio?.toLowerCase().includes(term)
  );
};

export const useParroquias = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query unificada para obtener parroquias con paginación y búsqueda
  const useParroquiasQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_parroquia',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    searchTerm: string = ''
  ) => {
    return useQuery({
      queryKey: ['parroquias', { page, limit, sortBy, sortOrder, searchTerm }],
      queryFn: async () => {
        // Obtener todos los datos sin paginación del backend
        const response = await parroquiasService.getParroquias(1, 1000, sortBy, sortOrder);
        const allParroquias = response?.data?.parroquias || [];
        
        // Aplicar filtro de búsqueda
        const filteredParroquias = filterBySearch(allParroquias, searchTerm);
        
        // Aplicar paginación client-side
        return paginateClientSide(filteredParroquias, page, limit);
      },
      placeholderData: (previousData) => previousData,
    });
  };

  // Query simplificada para búsqueda - reutiliza la query principal
  const useSearchParroquiasQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    // Reutilizar la query principal con el término de búsqueda
    return useParroquiasQuery(page, limit, sortBy, sortOrder, searchTerm);
  };

  // Query para obtener una parroquia por ID
  const useParroquiaByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['parroquia', id],
      queryFn: () => parroquiasService.getParroquiaById(id),
      enabled: !!id,
    });
  };

  // Query para obtener parroquias por municipio
  const useParroquiasByMunicipioQuery = (
    municipioId: string
  ) => {
    return useQuery({
      queryKey: ['parroquias', { municipio: municipioId }],
      queryFn: () => parroquiasService.getParroquiasByMunicipio(municipioId),
      enabled: !!municipioId,
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener estadísticas de parroquias
  const useParroquiaStatisticsQuery = () => {
    return useQuery({
      queryKey: ['parroquias-statistics'],
      queryFn: () => parroquiasService.getParroquiaStatistics(),
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear parroquia
  const useCreateParroquiaMutation = () => {
    return useMutation({
      mutationFn: async (parroquia: ParroquiaCreate) => {
        const response = await parroquiasService.createParroquia(parroquia);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parroquias'] }); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Parroquia creada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al crear parroquia';
        console.error('Error creating parroquia:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar parroquia
  const useUpdateParroquiaMutation = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: ParroquiaUpdate }) => {
        const response = await parroquiasService.updateParroquia(id, data);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parroquias'] }); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Parroquia actualizada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al actualizar parroquia';
        console.error('Error updating parroquia:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar parroquia
  const useDeleteParroquiaMutation = () => {
    return useMutation({
      mutationFn: parroquiasService.deleteParroquia,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parroquias'] }); // Invalida y refetch los datos de la lista
        toast({
          title: 'Éxito',
          description: 'Parroquia eliminada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al eliminar parroquia';
        console.error('Error deleting parroquia:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  return {
    useParroquiasQuery,
    useSearchParroquiasQuery,
    useParroquiaByIdQuery,
    useParroquiasByMunicipioQuery,
    useParroquiaStatisticsQuery,
    useCreateParroquiaMutation,
    useUpdateParroquiaMutation,
    useDeleteParroquiaMutation,
  };
};