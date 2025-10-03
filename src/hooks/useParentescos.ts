import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { parentescosService } from '@/services/parentescos';
import {
  Parentesco,
  ParentescoCreate,
  ParentescoUpdate,
  ParentescosResponse,
  ServerResponse
} from '@/types/parentescos';

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

// Función para filtrar parentescos por término de búsqueda
const filterBySearch = (parentescos: Parentesco[], searchTerm: string): Parentesco[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return parentescos;
  }
  
  const term = searchTerm.toLowerCase().trim();
  return parentescos.filter(parentesco => 
    parentesco.nombre?.toLowerCase().includes(term) ||
    parentesco.descripcion?.toLowerCase().includes(term)
  );
};

export const useParentescos = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query unificada para obtener parentescos con paginación y búsqueda
  const useParentescosQuery = (
    page: number = 1,
    limit: number = 10,
    searchTerm: string = ''
  ) => {
    return useQuery({
      queryKey: ['parentescos', { page, limit, searchTerm }],
      queryFn: async () => {
        console.log('🔄 Hook: Ejecutando query para parentescos...');
        
        // Obtener todos los datos sin paginación del backend
        const response = await parentescosService.getParentescos(1000, 1);
        console.log('📦 Hook: Respuesta del servicio:', response);
        
        const allParentescos = Array.isArray(response) ? response : [];
        console.log('📋 Hook: Parentescos como array:', allParentescos.length, 'elementos');
        
        // Aplicar filtro de búsqueda
        const filteredParentescos = filterBySearch(allParentescos, searchTerm);
        console.log('🔍 Hook: Después del filtro de búsqueda:', filteredParentescos.length, 'elementos');
        
        // Aplicar paginación client-side
        const paginatedResult = paginateClientSide(filteredParentescos, page, limit);
        console.log('📄 Hook: Resultado paginado:', paginatedResult);
        
        return paginatedResult;
      },
      placeholderData: (previousData) => previousData,
    });
  };

  // Query simplificada para búsqueda - reutiliza la query principal
  const useSearchParentescosQuery = (
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ) => {
    // Reutilizar la query principal con el término de búsqueda
    return useParentescosQuery(page, limit, searchTerm);
  };

  // Query para obtener un parentesco por ID
  const useParentescoByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ['parentesco', id],
      queryFn: () => parentescosService.getParentescoById(id),
      enabled: !!id,
    });
  };

  // ===== MUTATIONS =====

  // Mutación para crear un nuevo parentesco
  const useCreateParentescoMutation = () => {
    return useMutation<ServerResponse<Parentesco>, Error, ParentescoCreate>({
      mutationFn: parentescosService.createParentesco,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parentescos'] });
        toast({
          title: "Éxito",
          description: "Parentesco creado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error creating parentesco:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al crear el parentesco",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para actualizar un parentesco existente
  const useUpdateParentescoMutation = () => {
    return useMutation<ServerResponse<Parentesco>, Error, { id: string; data: ParentescoUpdate }>({
      mutationFn: ({ id, data }) => parentescosService.updateParentesco(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parentescos'] });
        toast({
          title: "Éxito",
          description: "Parentesco actualizado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error updating parentesco:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el parentesco",
          variant: "destructive",
        });
      },
    });
  };

  // Mutación para eliminar un parentesco
  const useDeleteParentescoMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: parentescosService.deleteParentesco,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['parentescos'] });
        toast({
          title: "Éxito",
          description: "Parentesco eliminado correctamente",
        });
      },
      onError: (error: any) => {
        console.error('Error deleting parentesco:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el parentesco",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useParentescosQuery,
    useSearchParentescosQuery,
    useParentescoByIdQuery,
    useCreateParentescoMutation,
    useUpdateParentescoMutation,
    useDeleteParentescoMutation,
  };
};