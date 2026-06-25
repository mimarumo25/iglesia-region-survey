import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { necesidadesEnfermoService } from '@/services/necesidades-enfermo';
import {
  NecesidadEnfermoCreate,
  NecesidadEnfermoUpdate,
  NecesidadesEnfermoParams,
} from '@/types/necesidades-enfermo';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== 'object' || error === null) return fallback;

  const typedError = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };
  return typedError.response?.data?.message ?? typedError.message ?? fallback;
};

export const useNecesidadesEnfermoQuery = (params: NecesidadesEnfermoParams = {}) =>
  useQuery({
    queryKey: ['necesidades-enfermo', params],
    queryFn: () => necesidadesEnfermoService.getAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

export const useNecesidadesEnfermoOptions = () =>
  useQuery({
    queryKey: ['necesidades-enfermo-options'],
    queryFn: () => necesidadesEnfermoService.getSelectOptions(),
    staleTime: 1000 * 60 * 5,
  });

export const useNecesidadesEnfermoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['necesidades-enfermo'] });
    queryClient.invalidateQueries({ queryKey: ['necesidades-enfermo-options'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: NecesidadEnfermoCreate) => necesidadesEnfermoService.create(data),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Necesidad creada', description: 'El catálogo se actualizó correctamente.' });
    },
    onError: (error) => toast({
      title: 'No se pudo crear',
      description: getErrorMessage(error, 'Ocurrió un error al crear la necesidad.'),
      variant: 'destructive',
    }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: NecesidadEnfermoUpdate }) =>
      necesidadesEnfermoService.update(id, data),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Necesidad actualizada', description: 'Los cambios se guardaron correctamente.' });
    },
    onError: (error) => toast({
      title: 'No se pudo actualizar',
      description: getErrorMessage(error, 'Ocurrió un error al actualizar la necesidad.'),
      variant: 'destructive',
    }),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => necesidadesEnfermoService.deactivate(id),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Necesidad desactivada', description: 'El registro ya no estará disponible para nuevas encuestas.' });
    },
    onError: (error) => toast({
      title: 'No se pudo desactivar',
      description: getErrorMessage(error, 'La necesidad puede tener personas activas asociadas.'),
      variant: 'destructive',
    }),
  });

  return { createMutation, updateMutation, deactivateMutation };
};
