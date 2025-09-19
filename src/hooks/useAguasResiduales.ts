import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { aguasResidualesService } from '@/services/aguas-residuales';
import {
  AguaResidual,
  AguaResidualCreate,
  AguaResidualUpdate,
  AguaResidualPagination,
  AguasResidualesResponse,
  ServerResponse
} from '@/types/aguas-residuales';

// ✅ PATRÓN UNIFICADO: Funciones de paginación y filtrado del lado del cliente
const paginateClientSide = <T>(data: T[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    currentPage: page,
    totalPages: Math.ceil(data.length / limit),
    totalItems: data.length,
    itemsPerPage: limit,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, data.length),
  };
};

const filterBySearch = (data: AguaResidual[], searchTerm: string): AguaResidual[] => {
  if (!searchTerm.trim()) return data;
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  return data.filter(item => 
    item.nombre?.toLowerCase().includes(normalizedSearch) ||
    item.descripcion?.toLowerCase().includes(normalizedSearch)
  );
};

export const useAguasResiduales = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERY PRINCIPAL UNIFICADO =====
  // Una sola query que maneja todo: obtener, buscar y paginar
  const useAguasResidualesQuery = (
    searchTerm: string = '',
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_tipo_aguas_residuales',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) => {
    return useQuery<ServerResponse<AguasResidualesResponse>, Error>({
      queryKey: ['aguasResiduales', { searchTerm, page, limit, sortBy, sortOrder }],
      queryFn: async () => {
        // Siempre obtenemos todos los datos del servidor
        const response = await aguasResidualesService.getAguasResiduales(1, 1000, sortBy, sortOrder);
        
        if (response.success && response.data?.tiposAguasResiduales) {
          const allData = response.data.tiposAguasResiduales;
          
          // Aplicar filtro de búsqueda del lado del cliente
          const filteredData = filterBySearch(allData, searchTerm);
          
          // Aplicar paginación del lado del cliente
          const paginatedResult = paginateClientSide(filteredData, page, limit);
          
          // Retornar en el formato esperado
          return {
            ...response,
            data: {
              tiposAguasResiduales: paginatedResult.data,
              pagination: {
                currentPage: paginatedResult.currentPage,
                totalPages: paginatedResult.totalPages,
                totalCount: paginatedResult.totalItems,
                hasNext: paginatedResult.currentPage < paginatedResult.totalPages,
                hasPrev: paginatedResult.currentPage > 1,
              }
            }
          };
        }
        
        return response;
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  };

  // Query para obtener un tipo de agua residual por ID
  const useAguaResidualByIdQuery = (id: string) => {
    return useQuery<ServerResponse<AguaResidual>, Error>({
      queryKey: ['aguaResidual', id],
      queryFn: () => aguasResidualesService.getAguaResidualById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo tipo de agua residual
  const useCreateAguaResidualMutation = () => {
    return useMutation<ServerResponse<AguaResidual>, Error, AguaResidualCreate>({
      mutationFn: aguasResidualesService.createAguaResidual,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['aguasResiduales'] });
        toast({
          title: "Éxito",
          description: "Tipo de agua residual creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating agua residual:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el tipo de agua residual",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un tipo de agua residual existente
  const useUpdateAguaResidualMutation = () => {
    return useMutation<ServerResponse<AguaResidual>, Error, { id: string; data: AguaResidualUpdate }>({
      mutationFn: ({ id, data }) => aguasResidualesService.updateAguaResidual(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['aguasResiduales'] });
        toast({
          title: "Éxito",
          description: "Tipo de agua residual actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating agua residual:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el tipo de agua residual",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un tipo de agua residual
  const useDeleteAguaResidualMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: aguasResidualesService.deleteAguaResidual,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['aguasResiduales'] });
        toast({
          title: "Éxito",
          description: "Tipo de agua residual eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting agua residual:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el tipo de agua residual",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useAguasResidualesQuery,
    useAguaResidualByIdQuery,
    useCreateAguaResidualMutation,
    useUpdateAguaResidualMutation,
    useDeleteAguaResidualMutation,
  };
};