/**
 * Utilidades para descarga de archivos
 * Sistema MIA - Gestión Integral de Iglesias
 * 
 * Funciones auxiliares para manejar la descarga automática de archivos
 * desde respuestas blob de la API.
 */

/**
 * Descarga automáticamente un blob como archivo
 * 
 * @param blob - El blob a descargar
 * @param filename - Nombre del archivo (con extensión)
 * @param mimeType - Tipo MIME del archivo (opcional)
 */
export const downloadBlob = (blob: Blob, filename: string, mimeType?: string) => {
  try {
    // Crear un objeto URL temporal para el blob
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType || blob.type }));
    
    // Crear un elemento <a> temporal para la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Agregar el enlace al DOM temporalmente
    document.body.appendChild(link);
    
    // Simular el click para iniciar la descarga
    link.click();
    
    // Limpiar: remover el enlace y revocar la URL del blob
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    throw new Error('No se pudo descargar el archivo');
  }
};

/**
 * Descarga un reporte de Excel con nombre automático basado en fecha
 * 
 * @param blob - El blob del archivo Excel
 * @param prefix - Prefijo del nombre del archivo (ej: "reporte-difuntos")
 */
export const downloadExcelReport = (blob: Blob, prefix: string = 'reporte') => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const filename = `${prefix}-${timestamp}.xlsx`;
  
  downloadBlob(blob, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

/**
 * Descarga un reporte de PDF con nombre automático basado en fecha
 * 
 * @param blob - El blob del archivo PDF
 * @param prefix - Prefijo del nombre del archivo (ej: "reporte-difuntos")
 */
export const downloadPDFReport = (blob: Blob, prefix: string = 'reporte') => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const filename = `${prefix}-${timestamp}.pdf`;
  
  downloadBlob(blob, filename, 'application/pdf');
};

/**
 * Genera un nombre de archivo con timestamp
 * 
 * @param prefix - Prefijo del archivo
 * @param extension - Extensión del archivo (sin punto)
 * @returns Nombre del archivo con timestamp
 */
export const generateTimestampFilename = (prefix: string, extension: string): string => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, '');
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * Valida si el navegador soporta la API de descarga de archivos
 * 
 * @returns true si el navegador soporta la descarga de archivos
 */
export const supportsFileDownload = (): boolean => {
  return !!(window.URL && window.URL.createObjectURL && document.createElement);
};