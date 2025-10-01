/**
 * Hook para descarga de reportes de difuntos
 * Sistema MIA - Gestión Integral de Iglesias
 * 
 * Hook personalizado que maneja la descarga de reportes de difuntos
 * en formato Excel usando el endpoint específico de la API.
 */

import { useState } from 'react';
import { downloadDifuntosExcelReport } from '@/services/difuntos';
import { downloadExcelReport, supportsFileDownload } from '@/utils/downloadUtils';
import { DifuntosFilters } from '@/types/difuntos';
import { useToast } from '@/hooks/use-toast';

interface UseDifuntosDownloadResult {
  /** Estado de carga de la descarga */
  isDownloading: boolean;
  /** Error durante la descarga */
  error: string | null;
  /** Función para descargar el reporte de Excel */
  downloadExcel: (filters?: DifuntosFilters) => Promise<void>;
  /** Verifica si el navegador soporta descargas */
  canDownload: boolean;
}

/**
 * Hook personalizado para descargar reportes de difuntos
 * 
 * @returns Objeto con funciones y estado para manejar descargas
 * 
 * @example
 * ```typescript
 * const { downloadExcel, isDownloading, error, canDownload } = useDifuntosDownload();
 * 
 * const handleDownload = async () => {
 *   if (!canDownload) {
 *     alert('Su navegador no soporta descargas automáticas');
 *     return;
 *   }
 *   
 *   await downloadExcel({
 *     id_parentesco: '1',
 *     fecha_inicio: '2020-01-01'
 *   });
 * };
 * ```
 */
export const useDifuntosDownload = (): UseDifuntosDownloadResult => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const canDownload = supportsFileDownload();

  /**
   * Descarga el reporte de difuntos en formato Excel
   * 
   * @param filters - Filtros a aplicar en el reporte (opcional)
   */
  const downloadExcel = async (filters?: DifuntosFilters): Promise<void> => {
    if (!canDownload) {
      const errorMsg = 'Su navegador no soporta la descarga automática de archivos';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error de compatibilidad",
        description: errorMsg
      });
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      // Mostrar toast de inicio
      toast({
        title: "Generando reporte",
        description: "Preparando el archivo Excel de difuntos...",
        duration: 3000
      });

      // Llamar al servicio para obtener el blob
      const blob = await downloadDifuntosExcelReport(filters);
      
      // Descargar automáticamente el archivo
      downloadExcelReport(blob, 'reporte-difuntos');
      
      // Toast de éxito
      toast({
        title: "Descarga completada",
        description: "El reporte de difuntos se ha descargado exitosamente.",
        duration: 5000
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Error desconocido al descargar el reporte';
      setError(errorMessage);
      
      console.error('Error downloading difuntos report:', error);
      
      // Toast de error
      toast({
        variant: "destructive",
        title: "Error en la descarga",
        description: errorMessage,
        duration: 7000
      });
      
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    error,
    downloadExcel,
    canDownload
  };
};