/**
 * Exportaciones centralizadas del módulo de Difuntos
 * Sistema MIA - Gestión Integral de Iglesias
 */

export { default as DifuntosForm } from './DifuntosForm';
export { default as DifuntosTable } from './DifuntosTable';
export { default as DifuntosReportPage } from './DifuntosReportPage';

// Tipos y interfaces
export * from '@/types/difuntos';

// Hook personalizado
export { useDifuntosConsulta } from '@/hooks/useDifuntosConsulta';

// Servicios
export * from '@/services/difuntos';