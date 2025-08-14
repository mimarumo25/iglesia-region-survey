import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ProfileService, ProfileUpdateRequest, ProfilePreferencesRequest, ChangePasswordRequest } from '@/services/profile';
import type { User } from '@/types/auth';

/**
 * Hook personalizado para gestionar el perfil del usuario con React Query
 * Proporciona funciones y estados para actualizar información personal, preferencias y contraseña
 */
export const useProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===== QUERIES =====

  // Query para obtener el perfil del usuario
  const useProfileQuery = () => {
    return useQuery<User, Error>({
      queryKey: ['profile'],
      queryFn: ProfileService.getProfile,
      onError: (error: any) => {
        console.error('Error al cargar perfil:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudo cargar la información del perfil.",
          variant: "destructive"
        });
      },
    });
  };

  // Query para obtener las preferencias del usuario
  const usePreferencesQuery = () => {
    return useQuery<ProfilePreferencesRequest, Error>({
      queryKey: ['preferences'],
      queryFn: ProfileService.getPreferences,
      onError: (error: any) => {
        console.error('Error al cargar preferencias:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudieron cargar las preferencias.",
          variant: "destructive"
        });
      },
    });
  };

  // Query para obtener estadísticas del usuario
  const useUserStatsQuery = () => {
    return useQuery<any, Error>({
      queryKey: ['userStats'],
      queryFn: ProfileService.getUserStats,
      onError: (error: any) => {
        console.error('Error al cargar estadísticas del usuario:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudieron cargar las estadísticas del usuario.",
          variant: "destructive"
        });
      },
    });
  };

  // ===== MUTATIONS =====

  // Mutación para actualizar información del perfil
  const useUpdateProfileMutation = () => {
    return useMutation<User, Error, ProfileUpdateRequest>({
      mutationFn: ProfileService.updateProfile,
      onSuccess: () => {
        queryClient.invalidateQueries(['profile']); // Invalida el perfil para refetch
        toast({
          title: "Perfil actualizado",
          description: "Los datos de su perfil se han guardado correctamente.",
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar perfil:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudieron guardar los cambios del perfil.",
          variant: "destructive"
        });
      },
    });
  };

  // Mutación para actualizar preferencias del usuario
  const useUpdatePreferencesMutation = () => {
    return useMutation<boolean, Error, ProfilePreferencesRequest>({
      mutationFn: ProfileService.updatePreferences,
      onSuccess: () => {
        queryClient.invalidateQueries(['preferences']); // Invalida las preferencias para refetch
        toast({
          title: "Preferencias guardadas",
          description: "Sus preferencias se han actualizado correctamente.",
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error al actualizar preferencias:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudieron guardar las preferencias.",
          variant: "destructive"
        });
      },
    });
  };

  // Mutación para cambiar contraseña del usuario
  const useChangePasswordMutation = () => {
    return useMutation<boolean, Error, ChangePasswordRequest>({
      mutationFn: ProfileService.changePassword,
      onSuccess: () => {
        toast({
          title: "Contraseña actualizada",
          description: "Su contraseña se ha cambiado exitosamente.",
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error al cambiar contraseña:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudo cambiar la contraseña. Verifique su contraseña actual.",
          variant: "destructive"
        });
      },
    });
  };

  // Mutación para subir foto de perfil
  const useUploadProfilePictureMutation = () => {
    return useMutation<string, Error, File>({
      mutationFn: ProfileService.uploadProfilePicture,
      onSuccess: () => {
        queryClient.invalidateQueries(['profile']); // Invalida el perfil para refetch la nueva URL de la imagen
        toast({
          title: "Foto actualizada",
          description: "Su foto de perfil se ha actualizado correctamente.",
          variant: "default"
        });
      },
      onError: (error: any) => {
        console.error('Error al subir foto:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudo subir la foto de perfil.",
          variant: "destructive"
        });
      },
    });
  };

  return {
    useProfileQuery,
    usePreferencesQuery,
    useUserStatsQuery,
    useUpdateProfileMutation,
    useUpdatePreferencesMutation,
    useChangePasswordMutation,
    useUploadProfilePictureMutation,
  };
};