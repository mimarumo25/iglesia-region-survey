import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enfermedadesService } from '@/services/enfermedades';
import {
  Enfermedad,
  EnfermedadCreate,
  EnfermedadUpdate,
  EnfermedadesResponse
} from '@/types/enfermedades';
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

// Función para filtrar enfermedades por término de búsqueda
const filterBySearch = (enfermedades: Enfermedad[], searchTerm: string): Enfermedad[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return enfermedades;
  }
  
  const term = searchTerm.toLowerCase().trim();
  return enfermedades.filter(enfermedad => 
    enfermedad.nombre?.toLowerCase().includes(term) ||
    enfermedad.descripcion?.toLowerCase().includes(term)
  );
};

export const useEnfermedades = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query unificada para obtener enfermedades con paginación y búsqueda
  const useEnfermedadesQuery = (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id_enfermedad',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    searchTerm: string = ''
  ) => {
    return useQuery({
      queryKey: ['enfermedades', { page, limit, sortBy, sortOrder, searchTerm }],
      queryFn: async () => {
        // Obtener todos los datos sin paginación del backend
        const response = await enfermedadesService.getEnfermedades(1, 1000, sortBy, sortOrder);
        const allEnfermedades = response?.data || [];
        
        // Aplicar filtro de búsqueda
        const filteredEnfermedades = filterBySearch(allEnfermedades, searchTerm);
        
        // Aplicar paginación client-side
        return paginateClientSide(filteredEnfermedades, page, limit);
      },
      placeholderData: (previousData) => previousData,
    });
  };

  // Query simplificada para búsqueda - reutiliza la query principal
  const useSearchEnfermedadesQuery = (
    query: string,
    page: number = 1,
    limit: number = 10
  ) => {
    // Reutilizar la query principal con el término de búsqueda
    return useEnfermedadesQuery(page, limit, 'nombre', 'ASC', query);
  };

  // Query para filtrar enfermedades por categoría
  const useEnfermedadesByCategoriaQuery = (
    categoria: string,
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery<EnfermedadesResponse, Error>({
      queryKey: ['enfermedades', { category: categoria, page, limit }],
      queryFn: () => enfermedadesService.getEnfermedadesByCategoria(categoria, page, limit),
      enabled: !!categoria.trim(),
      placeholderData: (previousData) => previousData,
    });
  };

  // Query para obtener una enfermedad por ID
  const useEnfermedadByIdQuery = (id: string) => {
    return useQuery<Enfermedad, Error>({
      queryKey: ['enfermedad', id],
      queryFn: () => enfermedadesService.getEnfermedadById(id),
      enabled: !!id,
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear enfermedad
  const useCreateEnfermedadMutation = () => {
    return useMutation<Enfermedad, Error, EnfermedadCreate>({
      mutationFn: enfermedadesService.createEnfermedad,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['enfermedades'] });
        toast({
          title: 'Éxito',
          description: 'Enfermedad creada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al crear enfermedad';
        console.error('Error creating enfermedad:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para actualizar enfermedad
  const useUpdateEnfermedadMutation = () => {
    return useMutation<Enfermedad, Error, { id: string; data: EnfermedadCreate }>({
      mutationFn: ({ id, data }) => enfermedadesService.updateEnfermedad(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['enfermedades'] });
        toast({
          title: 'Éxito',
          description: 'Enfermedad actualizada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al actualizar enfermedad';
        console.error('Error updating enfermedad:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Mutación para eliminar enfermedad
  const useDeleteEnfermedadMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: enfermedadesService.deleteEnfermedad,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['enfermedades'] });
        toast({
          title: 'Éxito',
          description: 'Enfermedad eliminada correctamente',
        });
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || 'Error al eliminar enfermedad';
        console.error('Error deleting enfermedad:', err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // ===== RETURN OBJECT =====
  return {
    // Queries
    useEnfermedadesQuery,
    useSearchEnfermedadesQuery,
    useEnfermedadesByCategoriaQuery,
    useEnfermedadByIdQuery,
    // Mutations
    useCreateEnfermedadMutation,
    useUpdateEnfermedadMutation,
    useDeleteEnfermedadMutation,
  };
};