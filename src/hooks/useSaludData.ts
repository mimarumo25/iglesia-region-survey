/**
 * 🏥 Custom Hook para gestión de datos de salud
 * Sistema MIA - Módulo de Personas con Condiciones de Salud
 */

import { useState, useCallback, useEffect } from 'react';
import { getPersonasSalud, exportSaludToExcel } from '@/services/salud';
import type { PersonaSalud, SaludFiltros } from '@/types/salud';
import { useToast } from '@/hooks/use-toast';

interface UseSaludDataResult {
  personas: PersonaSalud[];
  total: number;
  isLoading: boolean;
  error: string | null;
  hasQueried: boolean;
  fetchPersonas: (filtros?: SaludFiltros) => Promise<void>;
  exportToExcel: (filtros?: SaludFiltros) => Promise<void>;
  resetData: () => void;
}

/**
 * Hook personalizado para gestionar el estado y operaciones del módulo de salud
 * 
 * @example
 * ```typescript
 * const { 
 *   personas, 
 *   isLoading, 
 *   fetchPersonas, 
 *   exportToExcel 
 * } = useSaludData();
 * 
 * // Consultar con filtros
 * await fetchPersonas({
 *   id_enfermedad: 1,
 *   edad_min: 18,
 *   edad_max: 65
 * });
 * 
 * // Exportar a Excel
 * await exportToExcel({ id_enfermedad: 1 });
 * ```
 */
export const useSaludData = (): UseSaludDataResult => {
  const [personas, setPersonas] = useState<PersonaSalud[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasQueried, setHasQueried] = useState(false);
  const { toast } = useToast();

  /**
   * Consulta personas con condiciones de salud
   */
  const fetchPersonas = useCallback(async (filtros?: SaludFiltros) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { personas: data, total: totalRecords } = await getPersonasSalud(filtros);
      setPersonas(data);
      setTotal(totalRecords);
      setHasQueried(true);

      toast({
        title: "✅ Consulta exitosa",
        description: `Se encontraron ${totalRecords} persona(s) en total. Mostrando ${data.length} resultados.`,
        variant: "default"
      });

    } catch (err: any) {
      const errorMessage = err.message || 'Error al consultar personas con condiciones de salud';
      setError(errorMessage);
      setPersonas([]);
      setTotal(0);

      toast({
        title: "❌ Error en la consulta",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Exporta los datos a Excel
   */
  const exportToExcel = useCallback(async (filtros?: SaludFiltros) => {
    try {
      toast({
        title: "📥 Generando reporte...",
        description: "La descarga comenzará en breve",
        variant: "default"
      });

      await exportSaludToExcel(filtros);

      toast({
        title: "✅ Descarga exitosa",
        description: "El archivo Excel se ha descargado correctamente",
        variant: "default"
      });

    } catch (err: any) {
      const errorMessage = err.message || 'Error al exportar el reporte de salud';
      
      toast({
        title: "❌ Error en la exportación",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast]);

  /**
   * Resetea todos los datos
   */
  const resetData = useCallback(() => {
    setPersonas([]);
    setError(null);
    setHasQueried(false);
  }, []);

  return {
    personas,
    total,
    isLoading,
    error,
    hasQueried,
    fetchPersonas,
    exportToExcel,
    resetData
  };
};
