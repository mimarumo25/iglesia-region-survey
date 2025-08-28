import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { MunicipiosService, Municipio, CreateMunicipioRequest, UpdateMunicipioRequest, MunicipiosResponse } from '@/services/municipios';

/**
 * Hook personalizado para gestionar municipios con React Query
 */
export const useMunicipios = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener municipios con paginación y búsqueda
  const useMunicipiosQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nombre_municipio',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    search?: string
  ) => {
    return useQuery<MunicipiosResponse, Error>({
      queryKey: ['municipios', { page, limit, sortBy, sortOrder, search }],
      queryFn: async () => {
        try {
          return await MunicipiosService.getMunicipios({ page, limit, sortBy, sortOrder, search });
        } catch (error: any) {
          console.error('Error al cargar municipios:', error);
          toast({
            title: "Error",
            description: error.message || "No se pudieron cargar los municipios",
            variant: "destructive"
          });
          throw error;
        }
      },
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener un municipio por ID
  const useMunicipioByIdQuery = (id: string) => {
    return useQuery<Municipio, Error>({
      queryKey: ['municipio', id],
      queryFn: async () => {
        try {
          return await MunicipiosService.getMunicipioById(id);
        } catch (error: any) {
          console.error('Error al cargar municipio por ID:', error);
          toast({
            title: "Error",
            description: error.message || "No se pudo cargar el municipio",
            variant: "destructive"
          });
          throw error;
        }
      },
      enabled: !!id,
    });
  };

  // Query para obtener todos los municipios (sin paginación, para selects)
  const useAllMunicipiosQuery = () => {
    return useQuery<Municipio[], Error>({
      queryKey: ['allMunicipios'],
      queryFn: async () => {
        try {
          return await MunicipiosService.getAllMunicipios();
        } catch (error: any) {
          console.error('Error al cargar todos los municipios:', error);
          toast({
            title: "Error",
            description: error.message || "No se pudieron cargar todos los municipios",
            variant: "destructive"
          });
          throw error;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (reemplaza cacheTime)
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un municipio
  const useCreateMunicipioMutation = () => {
    return useMutation<Municipio, Error, CreateMunicipioRequest>({
      mutationFn: MunicipiosService.createMunicipio,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['municipios'] }); // Invalida y refetch la lista de municipios
        toast({
          title: "Municipio creado",
          description: `El municipio "${variables.nombre_municipio}" se ha creado exitosamente`,
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error al crear municipio:', error);
        toast({
          title: "Error al crear municipio",
          description: error.message || "No se pudo crear el municipio",
          variant: "destructive"
        });
      },
    });
  };

  // Mutación para actualizar un municipio
  const useUpdateMunicipioMutation = () => {
    return useMutation<Municipio, Error, { id: string; data: UpdateMunicipioRequest }>({
      mutationFn: ({ id, data }) => MunicipiosService.updateMunicipio(id, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['municipios'] }); // Invalida y refetch la lista de municipios
        queryClient.invalidateQueries({ queryKey: ['municipio', variables.id] }); // Invalida el municipio específico
        toast({
          title: "Municipio actualizado",
          description: `El municipio "${variables.data.nombre_municipio}" se ha actualizado exitosamente`,
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar municipio:', error);
        toast({
          title: "Error al actualizar municipio",
          description: error.message || "No se pudo actualizar el municipio",
          variant: "destructive"
        });
      },
    });
  };

  // Mutación para eliminar un municipio
  const useDeleteMunicipioMutation = () => {
    return useMutation<boolean, Error, string>({
      mutationFn: MunicipiosService.deleteMunicipio,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['municipios'] }); // Invalida y refetch la lista de municipios
        toast({
          title: "Municipio eliminado",
          description: "El municipio se ha eliminado exitosamente",
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar municipio:', error);
        toast({
          title: "Error al eliminar municipio",
          description: error.message || "No se pudo eliminar el municipio",
          variant: "destructive"
        });
      },
    });
  };

  return {
    useMunicipiosQuery,
    useMunicipioByIdQuery,
    useAllMunicipiosQuery,
    useCreateMunicipioMutation,
    useUpdateMunicipioMutation,
    useDeleteMunicipioMutation,
  };
};