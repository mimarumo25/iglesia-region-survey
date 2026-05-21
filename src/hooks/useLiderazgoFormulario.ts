import { useQuery } from '@tanstack/react-query';
import { liderazgoService } from '@/services/liderazgo';

export const useLiderazgoFormulario = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['liderazgo-active-form'],
    queryFn: () => liderazgoService.getLiderazgos(false, 200, 1, 'nombre', 'ASC'),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  // data es LiderazgoResponse: { success, data: { status, data: TipoLiderazgo[], ... } }
  const liderazgos = data?.data?.data?.map((l) => ({
    id: l.id_tipo_liderazgo,
    nombre: l.nombre,
  })) || [];

  return {
    liderazgos,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al cargar liderazgos') : undefined,
  };
};
