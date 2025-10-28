import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { centrosPobladosService, CentroPoblado, CreateCentroPobladoRequest, UpdateCentroPobladoRequest } from '@/services/centros-poblados';
import { useMunicipios } from '@/hooks/useMunicipios';

// Función para filtrar centros poblados del lado del cliente
const filterBySearch = (centrosPoblados: CentroPoblado[], searchTerm: string): CentroPoblado[] => {
  if (!searchTerm.trim()) return centrosPoblados;
  
  const term = searchTerm.toLowerCase().trim();
  return centrosPoblados.filter((cp) => 
    cp.nombre.toLowerCase().includes(term)
  );
};

// Función para filtrar por municipio
const filterByMunicipio = (centrosPoblados: CentroPoblado[], municipioId: string): CentroPoblado[] => {
  if (!municipioId || municipioId === 'all') return centrosPoblados;
  
  return centrosPoblados.filter((cp) => {
    // El campo es id_municipio_municipios (puede venir como string o número)
    const cpMunicipioId = typeof cp.id_municipio_municipios === 'string' 
      ? cp.id_municipio_municipios 
      : cp.id_municipio_municipios?.toString() || '';
    return cpMunicipioId === municipioId;
  });
};

// Función para paginación del lado del cliente
const paginateClientSide = (centrosPoblados: CentroPoblado[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCentrosPoblados = centrosPoblados.slice(startIndex, endIndex);
  
  return {
    data: paginatedCentrosPoblados,
    page,
    limit,
    total: centrosPoblados.length,
    totalPages: Math.ceil(centrosPoblados.length / limit),
  };
};

/**
 * Hook personalizado para gestionar centros poblados
 */
export const useCentrosPoblados = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const municipiosHook = useMunicipios();

  /**
   * Query para obtener todos los centros poblados con búsqueda, filtro y paginación
   */
  const useCentrosPobladosQuery = (
    searchTerm: string = '',
    municipioFilter: string = '',
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery<{ data: CentroPoblado[]; page: number; limit: number; total: number; totalPages: number }, Error>({
      queryKey: ['centrosPoblados', { searchTerm, municipioFilter, page, limit }],
      queryFn: async () => {
        try {
          // Obtener todos los centros poblados (limit máximo: 100 según validación del backend)
          const response = await centrosPobladosService.getCentrosPoblados(1, 100);
          let allCentrosPoblados = response.data || [];
          
          // Aplicar filtro de búsqueda
          if (searchTerm) {
            allCentrosPoblados = filterBySearch(allCentrosPoblados, searchTerm);
          }
          
          // Aplicar filtro de municipio
          if (municipioFilter && municipioFilter !== 'all') {
            allCentrosPoblados = filterByMunicipio(allCentrosPoblados, municipioFilter);
          }
          
          // Aplicar paginación del lado del cliente
          const paginatedResult = paginateClientSide(allCentrosPoblados, page, limit);
          
          return paginatedResult;
        } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
          console.error('Error al cargar centros poblados:', error);
          toast({
            title: "Error",
            description: errorMsg || "No se pudieron cargar los centros poblados",
            variant: "destructive"
          });
          throw error;
        }
      },
      placeholderData: (previousData) => previousData,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    });
  };

  // Query para municipios (reutilizando el hook existente)
  const useMunicipiosQuery = municipiosHook.useAllMunicipiosQuery;

  /**
   * Query para obtener centros poblados de un municipio específico
   */
  const useCentrosPobladosByMunicipioQuery = (municipioId: string | number | null) => {
    return useQuery<CentroPoblado[], Error>({
      queryKey: ['centrosPoblados', { municipioId }],
      queryFn: async () => {
        if (!municipioId) return [];
        try {
          const response = await centrosPobladosService.getCentrosPobladosByMunicipio(municipioId);
          // Asegurar que siempre devolvemos un array
          if (Array.isArray(response)) {
            return response;
          }
          return [];
        } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
          console.error(`Error al cargar centros poblados para municipio ${municipioId}:`, error);
          toast({
            title: "Error",
            description: errorMsg || "No se pudieron cargar los centros poblados",
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
   * Query para obtener todos los centros poblados
   */
  const useAllCentrosPobladosQuery = () => {
    return useQuery<CentroPoblado[], Error>({
      queryKey: ['allCentrosPoblados'],
      queryFn: async () => {
        try {
          // Obtener todos los centros poblados (limit máximo: 100 según validación del backend)
          const response = await centrosPobladosService.getCentrosPoblados(1, 100);
          return response.data || [];
        } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
          console.error('Error al cargar todos los centros poblados:', error);
          toast({
            title: "Error",
            description: errorMsg || "No se pudieron cargar los centros poblados",
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
   * Mutación para crear un centro poblado
   */
  const useCreateCentroPobladoMutation = () => {
    return useMutation<CentroPoblado, Error, CreateCentroPobladoRequest>({
      mutationFn: (data) => centrosPobladosService.createCentroPoblado(data),
      onSuccess: (data) => {
        // Invalidar y refetchear todos los queries relacionados
        queryClient.invalidateQueries({ queryKey: ['centrosPoblados'] });
        queryClient.invalidateQueries({ queryKey: ['allCentrosPoblados'] });
        // Refetchear explícitamente para actualizar la tabla inmediatamente
        queryClient.refetchQueries({ queryKey: ['centrosPoblados'] });
        queryClient.refetchQueries({ queryKey: ['allCentrosPoblados'] });
        toast({
          title: "Centro poblado creado",
          description: `El centro poblado "${data.nombre}" se ha creado exitosamente`,
          variant: "default"
        });
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al crear centro poblado:', error);
        toast({
          title: "Error al crear centro poblado",
          description: errorMsg || "No se pudo crear el centro poblado",
          variant: "destructive"
        });
      },
    });
  };

  /**
   * Mutación para actualizar un centro poblado
   */
  const useUpdateCentroPobladoMutation = () => {
    return useMutation<CentroPoblado, Error, { id: string; data: UpdateCentroPobladoRequest }>({
      mutationFn: ({ id, data }) => centrosPobladosService.updateCentroPoblado(id, data),
      onSuccess: (data) => {
        // Invalidar y refetchear todos los queries relacionados
        queryClient.invalidateQueries({ queryKey: ['centrosPoblados'] });
        queryClient.invalidateQueries({ queryKey: ['allCentrosPoblados'] });
        // Refetchear explícitamente para actualizar la tabla inmediatamente
        queryClient.refetchQueries({ queryKey: ['centrosPoblados'] });
        queryClient.refetchQueries({ queryKey: ['allCentrosPoblados'] });
        toast({
          title: "Centro poblado actualizado",
          description: `El centro poblado "${data.nombre}" se ha actualizado exitosamente`,
          variant: "default"
        });
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al actualizar centro poblado:', error);
        toast({
          title: "Error al actualizar centro poblado",
          description: errorMsg || "No se pudo actualizar el centro poblado",
          variant: "destructive"
        });
      },
    });
  };

  /**
   * Mutación para eliminar un centro poblado
   */
  const useDeleteCentroPobladoMutation = () => {
    return useMutation<boolean, Error, string>({
      mutationFn: (id) => centrosPobladosService.deleteCentroPoblado(id),
      onSuccess: () => {
        // Invalidar y refetchear todos los queries relacionados
        queryClient.invalidateQueries({ queryKey: ['centrosPoblados'] });
        queryClient.invalidateQueries({ queryKey: ['allCentrosPoblados'] });
        // Refetchear explícitamente para actualizar la tabla inmediatamente
        queryClient.refetchQueries({ queryKey: ['centrosPoblados'] });
        queryClient.refetchQueries({ queryKey: ['allCentrosPoblados'] });
        toast({
          title: "Centro poblado eliminado",
          description: "El centro poblado se ha eliminado exitosamente",
          variant: "default"
        });
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al eliminar centro poblado:', error);
        toast({
          title: "Error al eliminar centro poblado",
          description: errorMsg || "No se pudo eliminar el centro poblado",
          variant: "destructive"
        });
      },
    });
  };

  return {
    useCentrosPobladosQuery,
    useMunicipiosQuery,
    useCentrosPobladosByMunicipioQuery,
    useAllCentrosPobladosQuery,
    useCreateCentroPobladoMutation,
    useUpdateCentroPobladoMutation,
    useDeleteCentroPobladoMutation,
  };
};
