/**
 * Hook simplificado para usar habilidades en formularios
 * Wrapper around useHabilidades para facilitar su uso
 */
import { useQuery } from '@tanstack/react-query';
import { habilidadesService } from '@/services/habilidades';

export const useHabilidadesFormulario = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['habilidades-active'],
    queryFn: () => habilidadesService.getActiveHabilidades(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  // Transformar datos al formato esperado por el componente MultiSelectWithChips
  const habilidades = data?.data?.map((h: any) => ({
    id: h.id_habilidad,
    nombre: h.nombre,
    nivel: h.nivel
  })) || [];

  return {
    habilidades,
    isLoading,
    error: error ? (error.message || 'Error al cargar habilidades') : undefined
  };
};
