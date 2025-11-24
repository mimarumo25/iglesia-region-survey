import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { corregimientosService, Corregimiento, CreateCorregimientoRequest, UpdateCorregimientoRequest } from '@/services/corregimientos';

export interface CorregimientosQueryResponse {
  data: Corregimiento[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

/**
 * Hook personalizado para gestionar corregimientos dependientes del municipio
 */
export const useCorregimientos = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Query paginada para obtener todos los corregimientos con filtros
   */
  const useCorregimientosQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    searchTerm: string | undefined = ''
  ) => {
    return useQuery<CorregimientosQueryResponse, Error>({
      queryKey: ['corregimientos', { page, limit, sortBy, sortOrder, searchTerm: searchTerm || '' }],
      queryFn: async () => {
        try {
          const response = await corregimientosService.getCorregimientos(page, limit, sortBy, sortOrder);
          
          // Filtrar por búsqueda si hay término
          let filteredData = response.data || [];
          if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filteredData = filteredData.filter(
              (c) => c.nombre.toLowerCase().includes(searchLower)
            );
          }

          const total = filteredData.length;
          const totalPages = Math.ceil(total / limit);
          
          return {
            data: filteredData,
            pagination: {
              currentPage: page,
              totalPages,
              totalCount: total,
              hasNext: page < totalPages,
              hasPrev: page > 1,
              limit,
            },
          };
        } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
          console.error('Error al cargar corregimientos:', error);
          toast({
            title: "Error",
            description: errorMsg || "No se pudieron cargar los corregimientos",
            variant: "destructive"
          });
          throw error;
        }
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    });
  };

  /**
   * Query para obtener corregimientos de un municipio específico
   */
  const useCorregimientosByMunicipioQuery = (municipioId: string | number | null) => {
    return useQuery<Corregimiento[], Error>({
      queryKey: ['corregimientos', { municipioId }],
      queryFn: async () => {
        if (!municipioId) return [];
        try {
          const response = await corregimientosService.getCorregimientosByMunicipio(municipioId);
          // Asegurar que siempre devolvemos un array
          if (Array.isArray(response)) {
            return response;
          }
          return [];
        } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
          console.error(`Error al cargar corregimientos para municipio ${municipioId}:`, error);
          toast({
            title: "Error",
            description: errorMsg || "No se pudieron cargar los corregimientos",
            variant: "destructive"
          });
          throw error;
        }
      },
      enabled: !!municipioId,
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos
    });
  };

  /**
   * Query para obtener todos los corregimientos
   */
  const useAllCorregimientosQuery = () => {
    return useQuery<Corregimiento[], Error>({
      queryKey: ['allCorregimientos'],
      queryFn: async () => {
        try {
          const response = await corregimientosService.getCorregimientos(1, 1000);
          return response.data || [];
        } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
          console.error('Error al cargar todos los corregimientos:', error);
          toast({
            title: "Error",
            description: errorMsg || "No se pudieron cargar los corregimientos",
            variant: "destructive"
          });
          throw error;
        }
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    });
  };

  /**
   * Mutación para crear un corregimiento
   */
  const useCreateCorregimientoMutation = () => {
    return useMutation<Corregimiento, Error, CreateCorregimientoRequest>({
      mutationFn: corregimientosService.createCorregimiento,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['corregimientos'] });
        queryClient.invalidateQueries({ queryKey: ['allCorregimientos'] });
        toast({
          title: "Corregimiento creado",
          description: `El corregimiento "${data.nombre}" se ha creado exitosamente`,
          variant: "default"
        });
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al crear corregimiento:', error);
        toast({
          title: "Error al crear corregimiento",
          description: errorMsg || "No se pudo crear el corregimiento",
          variant: "destructive"
        });
      },
    });
  };

  /**
   * Mutación para actualizar un corregimiento
   */
  const useUpdateCorregimientoMutation = () => {
    return useMutation<Corregimiento, Error, { id: string | number; data: UpdateCorregimientoRequest }>({
      mutationFn: ({ id, data }) => corregimientosService.updateCorregimiento(id, data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['corregimientos'] });
        queryClient.invalidateQueries({ queryKey: ['allCorregimientos'] });
        toast({
          title: "Corregimiento actualizado",
          description: `El corregimiento "${data.nombre}" se ha actualizado exitosamente`,
          variant: "default"
        });
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al actualizar corregimiento:', error);
        toast({
          title: "Error al actualizar corregimiento",
          description: errorMsg || "No se pudo actualizar el corregimiento",
          variant: "destructive"
        });
      },
    });
  };

  /**
   * Mutación para eliminar un corregimiento
   */
  const useDeleteCorregimientoMutation = () => {
    return useMutation<boolean, Error, string | number>({
      mutationFn: corregimientosService.deleteCorregimiento,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['corregimientos'] });
        queryClient.invalidateQueries({ queryKey: ['allCorregimientos'] });
        toast({
          title: "Corregimiento eliminado",
          description: "El corregimiento se ha eliminado exitosamente",
          variant: "default"
        });
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al eliminar corregimiento:', error);
        toast({
          title: "Error al eliminar corregimiento",
          description: errorMsg || "No se pudo eliminar el corregimiento",
          variant: "destructive"
        });
      },
    });
  };

  return {
    useCorregimientosQuery,
    useCorregimientosByMunicipioQuery,
    useAllCorregimientosQuery,
    useCreateCorregimientoMutation,
    useUpdateCorregimientoMutation,
    useDeleteCorregimientoMutation,
  };
};
