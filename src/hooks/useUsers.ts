import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService, UserResponse, CreateUserRequest, UpdateUserRequest } from '@/services/users';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook personalizado para manejar la gestión de usuarios con React Query
 */
export const useUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  /**
   * Query para cargar la lista de usuarios
   */
  const useUsersQuery = () => {
    return useQuery<UserResponse[], Error>({
      queryKey: ['users'],
      queryFn: UsersService.getUsers,
      onError: (error: any) => {
        console.error('Error loading users:', error);
        // Manejar error específico de permisos del backend
        if (error.response?.data?.code === 'INSUFFICIENT_PERMISSIONS') {
          const errorMessage = error.response.data.message || 'No tienes permisos para acceder a los usuarios';
          toast({
            title: "Permisos insuficientes",
            description: errorMessage,
            variant: "destructive",
            duration: 5000,
          });
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Error al cargar usuarios';
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive"
          });
        }
      },
    });
  };

  /**
   * Query para obtener un usuario por ID
   */
  const useUserByIdQuery = (id: string) => {
    return useQuery<UserResponse, Error>({
      queryKey: ['user', id],
      queryFn: () => UsersService.getUserById(id),
      enabled: !!id,
      onError: (error: any) => {
        console.error('Error getting user by ID:', error);
        toast({
          title: "Error",
          description: error.message || "Error al obtener usuario",
          variant: "destructive"
        });
      },
    });
  };

  // ===== MUTATIONS =====

  /**
   * Mutación para crear un nuevo usuario
   */
  const useCreateUserMutation = () => {
    return useMutation<UserResponse, Error, CreateUserRequest>({
      mutationFn: UsersService.createUser,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalida la lista de usuarios
        toast({
          title: "✅ Usuario creado exitosamente",
          description: `${variables.primer_nombre} ${variables.primer_apellido} fue agregado al sistema.`,
          variant: "default",
          duration: 5000,
        });
      },
      onError: (error: any) => {
        console.error('Error creating user:', error);
        
        // Extraer mensaje de error con saltos de línea preservados
        const errorMessage = error.message || "Error al crear usuario";
        
        toast({
          title: "❌ Error al crear usuario",
          description: errorMessage,
          variant: "destructive",
          duration: 8000, // Más tiempo para leer errores de validación
        });
      },
    });
  };

  /**
   * Mutación para actualizar un usuario existente
   */
  const useUpdateUserMutation = () => {
    return useMutation<UserResponse, Error, { id: string; data: UpdateUserRequest }>({
      mutationFn: ({ id, data }) => UsersService.updateUser(id, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalida la lista de usuarios
        queryClient.invalidateQueries({ queryKey: ['user', variables.id] }); // Invalida el usuario específico
        toast({
          title: "Usuario actualizado",
          description: "Usuario actualizado exitosamente.",
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error updating user:', error);
        toast({
          title: "Error",
          description: error.message || "Error al actualizar usuario",
          variant: "destructive"
        });
      },
    });
  };

  /**
   * Mutación para eliminar un usuario
   */
  const useDeleteUserMutation = () => {
    return useMutation<void, Error, string>({
      mutationFn: UsersService.deleteUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalida la lista de usuarios
        toast({
          title: "Usuario eliminado",
          description: "Usuario eliminado exitosamente.",
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: error.message || "Error al eliminar usuario",
          variant: "destructive"
        });
      },
    });
  };

  return {
    useUsersQuery,
    useUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
  };
};