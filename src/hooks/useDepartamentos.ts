import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { departamentosService } from '@/services/departamentos';
import { DepartamentoFormData, DepartamentoUpdateData } from '@/types/departamentos';
import { useMemo } from 'react';

// Función auxiliar para paginación client-side (temporal hasta que el backend implemente paginación)
const paginateClientSide = (data: any[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
    currentPage: page,
    hasNextPage: page < Math.ceil(data.length / limit),
    hasPreviousPage: page > 1,
  };
};

// Función auxiliar para filtrar datos por nombre
const filterBySearch = (data: any[], searchTerm: string) => {
  if (!searchTerm.trim()) return data;
  
  const search = searchTerm.toLowerCase().trim();
  return data.filter((item) => 
    item.nombre?.toLowerCase().includes(search) ||
    item.codigo_dane?.toLowerCase().includes(search)
  );
};

// Hook personalizado para todas las operaciones de departamentos
export const useDepartamentos = () => {
  const queryClient = useQueryClient();

  // Query para obtener departamentos (sin parámetros - paginación y filtrado CLIENT-SIDE)
  const useDepartamentosQuery = (
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'id_departamento', 
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    searchTerm: string = ''
  ) => {
    // Obtenemos TODOS los datos sin parámetros (el servicio no acepta filtros)
    const allDataQuery = useQuery({
      queryKey: ['all-departamentos'],
      queryFn: () => departamentosService.getActiveDepartamentos(), // Sin parámetros
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    });

    // Aplicamos filtrado por búsqueda, ordenamiento y paginación client-side usando useMemo
    const filteredAndPaginatedResult = useMemo(() => {
      if (!allDataQuery.data?.data) {
        return {
          departamentos: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      const allDepartamentos = allDataQuery.data.data;
      
      // Aplicar ordenamiento client-side
      const sortedData = [...allDepartamentos].sort((a, b) => {
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];
        
        if (sortOrder === 'ASC') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });

      // Aplicar filtrado por búsqueda
      const filteredData = filterBySearch(sortedData, searchTerm);

      // Aplicar paginación a los datos filtrados
      const paginatedData = paginateClientSide(filteredData, page, limit);
      
      return {
        departamentos: paginatedData.data,
        pagination: {
          currentPage: paginatedData.currentPage,
          totalPages: paginatedData.totalPages,
          totalCount: paginatedData.total,
          hasNext: paginatedData.hasNextPage,
          hasPrev: paginatedData.hasPreviousPage,
        },
      };
    }, [allDataQuery.data?.data, page, limit, sortBy, sortOrder, searchTerm]);

    return {
      ...allDataQuery,
      data: allDataQuery.data ? {
        ...allDataQuery.data,
        data: filteredAndPaginatedResult,
      } : undefined,
    };
  };

  // Query para buscar departamentos con BÚSQUEDA CLIENT-SIDE
  const useSearchDepartamentosQuery = (search: string, page: number = 1, limit: number = 10) => {
    // Reutilizamos la lógica de useDepartamentosQuery con el parámetro de búsqueda
    return useDepartamentosQuery(page, limit, 'id_departamento', 'ASC', search);
  };

  // Query para obtener un departamento por ID
  const useDepartamentoByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['departamento', id],
      queryFn: () => departamentosService.getDepartamentoById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener departamentos activos
  const useActiveDepartamentosQuery = () => {
    return useQuery({
      queryKey: ['departamentos-active'],
      queryFn: () => departamentosService.getActiveDepartamentos(),
      staleTime: 1000 * 60 * 10, // 10 minutos para datos activos
      refetchOnWindowFocus: false,
    });
  };

  // Query para obtener estadísticas
  const useDepartamentosStatsQuery = () => {
    return useQuery({
      queryKey: ['departamentos-stats'],
      queryFn: () => departamentosService.getDepartamentosStats(),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  // Mutación para crear departamento
  const useCreateDepartamentoMutation = () => {
    return useMutation({
      mutationFn: (data: DepartamentoFormData) => departamentosService.createDepartamento(data),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['departamentos'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-active'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Departamento creado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al crear departamento:', error);
        const message = error?.response?.data?.message || 'Error al crear el departamento';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar departamento
  const useUpdateDepartamentoMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: DepartamentoUpdateData }) => 
        departamentosService.updateDepartamento(id, data),
      onSuccess: (_, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['departamentos'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-active'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-stats'] });
        queryClient.invalidateQueries({ queryKey: ['departamento', variables.id] });
        
        toast({
          title: 'Éxito',
          description: 'Departamento actualizado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar departamento:', error);
        const message = error?.response?.data?.message || 'Error al actualizar el departamento';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar departamento
  const useDeleteDepartamentoMutation = () => {
    return useMutation({
      mutationFn: (id: string) => departamentosService.deleteDepartamento(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['departamentos'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-active'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Departamento eliminado correctamente',
          variant: 'default',
        });
      },
      onError: (error: any) => {
        console.error('Error al eliminar departamento:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el departamento';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para alternar estado
  const useToggleDepartamentoStatusMutation = () => {
    return useMutation({
      mutationFn: (id: string) => departamentosService.toggleDepartamentoStatus(id),
      onSuccess: () => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['departamentos'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-active'] });
        queryClient.invalidateQueries({ queryKey: ['departamentos-stats'] });
        
        toast({
          title: 'Éxito',
          description: 'Estado del departamento actualizado',
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
    useDepartamentosQuery,
    useSearchDepartamentosQuery,
    useDepartamentoByIdQuery,
    useActiveDepartamentosQuery,
    useDepartamentosStatsQuery,
    
    // Mutations
    useCreateDepartamentoMutation,
    useUpdateDepartamentoMutation,
    useDeleteDepartamentoMutation,
    useToggleDepartamentoStatusMutation,
  };
};

export default useDepartamentos;
