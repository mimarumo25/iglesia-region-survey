/**
 * Hook simplificado para usar destrezas en formularios
 * Wrapper around useDestrezas para facilitar su uso
 */
import { useQuery } from '@tanstack/react-query';
import { destrezasService } from '@/services/destrezas';

export const useDestrezasFormulario = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['destrezas-active'],
    queryFn: () => destrezasService.getActiveDestrezas(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  // Transformar datos al formato esperado por el componente MultiSelectWithChips
  const destrezas = data?.data?.map((d: any) => ({
    id: d.id_destreza,
    nombre: d.nombre
  })) || [];

  return {
    destrezas,
    isLoading,
    error: error ? (error.message || 'Error al cargar destrezas') : undefined
  };
};
