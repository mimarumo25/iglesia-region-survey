/**
 * Hook para consultas de Difuntos - Sistema MIA
 * 
 * Este hook encapsula toda la lógica para consultar y gestionar
 * los datos de difuntos con filtros avanzados
 * 
 * Características:
 * - Filtros completos: parentesco, fechas, ubicación geográfica
 * - Estados de carga y error
 * - Exportación a PDF y Excel
 * - Limpiar filtros
 * - Manejo de estado reactivo
 * 
 * @version 1.0
 * @author Sistema MIA
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getDifuntos, exportDifuntosToPDF, downloadDifuntosExcelReport } from '@/services/difuntos';
import { downloadExcelReport } from '@/utils/downloadUtils';
import { DifuntoAPI, DifuntosFilters, DifuntosResponse } from '@/types/difuntos';

interface UseDifuntosConsultaResult {
  // Estado de los datos
  difuntos: DifuntoAPI[];
  total: number;
  filtrosAplicados: Record<string, any>;
  
  // Estados de control
  isLoading: boolean;
  error: string | null;
  
  // Filtros actuales
  filters: DifuntosFilters;
  setFilters: React.Dispatch<React.SetStateAction<DifuntosFilters>>;
  
  // Funciones principales
  searchDifuntos: (searchFilters?: DifuntosFilters) => Promise<void>;
  clearFilters: () => void;
  
  // Exportación
  exportToPDF: () => Promise<void>;
  exportToExcel: () => Promise<void>;
  isExporting: boolean;
}

/**
 * Hook personalizado para consultas de difuntos
 * 
 * @returns Objeto con estado, datos y funciones para gestionar difuntos
 * 
 * @example
 * ```tsx
 * const {
 *   difuntos,
 *   total,
 *   isLoading,
 *   error,
 *   filters,
 *   setFilters,
 *   searchDifuntos,
 *   clearFilters,
 *   exportToPDF,
 *   exportToExcel
 * } = useDifuntosConsulta();
 * 
 * // Establecer filtros
 * setFilters({
 *   id_parentesco: '1',
 *   id_municipio: '1',
 *   fecha_inicio: '2020-01-01',
 *   fecha_fin: '2023-12-31'
 * });
 * 
 * // Ejecutar búsqueda
 * await searchDifuntos();
 * ```
 */
export const useDifuntosConsulta = (): UseDifuntosConsultaResult => {
  // Estado principal
  const [difuntos, setDifuntos] = useState<DifuntoAPI[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Record<string, any>>({});
  
  // Estados de control
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  // Filtros
  const [filters, setFilters] = useState<DifuntosFilters>({});
  
  const { toast } = useToast();

  /**
   * Ejecuta la búsqueda de difuntos con los filtros proporcionados o actuales
   * @param searchFilters - Filtros específicos para esta búsqueda (opcional)
   */
  const searchDifuntos = useCallback(async (searchFilters?: DifuntosFilters): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Usar filtros proporcionados o los del estado actual
      const filtersToUse = searchFilters || filters;
      
      const response: DifuntosResponse = await getDifuntos(filtersToUse);
      
      setDifuntos(response.datos || []);
      setTotal(response.total || 0);
      setFiltrosAplicados(response.estadisticas?.filtros_aplicados || {});
      
      // Si se proporcionaron filtros, actualizar el estado
      if (searchFilters) {
        setFilters(searchFilters);
      }
      
      toast({
        title: "Consulta exitosa",
        description: response.mensaje || `Se encontraron ${response.total} registros de difuntos`,
        duration: 3000,
      });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Error al consultar los difuntos';
      setError(errorMessage);
      setDifuntos([]);
      setTotal(0);
      setFiltrosAplicados({});
      
      toast({
        title: "Error en la consulta",
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
      
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // Removemos 'filters' de las dependencias porque ahora se pasa como parámetro

  /**
   * Limpia todos los filtros aplicados
   */
  const clearFilters = useCallback((): void => {
    setFilters({});
    setDifuntos([]);
    setTotal(0);
    setFiltrosAplicados({});
    setError(null);
    
    toast({
      title: "Filtros limpiados",
      description: "Se han eliminado todos los filtros de búsqueda",
      duration: 2000,
    });
  }, [toast]);

  /**
   * Exporta los resultados actuales a PDF
   */
  const exportToPDF = useCallback(async (): Promise<void> => {
    if (!difuntos || difuntos.length === 0) {
      toast({
        title: "Sin datos para exportar",
        description: "Primero debe realizar una búsqueda",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const blob = await exportDifuntosToPDF(filters);
      
      // Crear URL temporal y descargar archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-difuntos-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "PDF generado",
        description: "El reporte ha sido descargado exitosamente",
        duration: 3000,
      });
      
    } catch (error: any) {
      toast({
        title: "Error al generar PDF",
        description: error.message || 'No se pudo generar el archivo PDF',
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsExporting(false);
    }
  }, [(difuntos || []).length, filters, toast]);

  /**
   * Exporta los resultados actuales a Excel usando el endpoint específico de reportes
   */
  const exportToExcel = useCallback(async (): Promise<void> => {
    if (!difuntos || difuntos.length === 0) {
      toast({
        title: "Sin datos para exportar",
        description: "Primero debe realizar una búsqueda",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Usar el endpoint específico de reportes de Excel
      const blob = await downloadDifuntosExcelReport(filters);
      
      // Usar la utilidad para descargar automáticamente
      downloadExcelReport(blob, 'reporte-difuntos');
      
      toast({
        title: "Excel generado",
        description: "El reporte ha sido descargado exitosamente",
        duration: 3000,
      });
      
    } catch (error: any) {
      toast({
        title: "Error al generar Excel",
        description: error.message || 'No se pudo generar el archivo Excel',
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsExporting(false);
    }
  }, [(difuntos || []).length, filters, toast]);

  return {
    // Estado de los datos
    difuntos,
    total,
    filtrosAplicados,
    
    // Estados de control
    isLoading,
    error,
    
    // Filtros
    filters,
    setFilters,
    
    // Funciones principales
    searchDifuntos,
    clearFilters,
    
    // Exportación
    exportToPDF,
    exportToExcel,
    isExporting,
  };
};

export default useDifuntosConsulta;