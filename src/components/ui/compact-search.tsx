import React from 'react';
import { WorkingSearch } from './working-search';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompactSearchProps {
  className?: string;
  placeholder?: string;
}

/**
 * Componente de búsqueda adaptivo
 * - Siempre muestra el input de búsqueda
 * - Se adapta al tamaño de pantalla (más compacto en móvil)
 * - Mantiene toda la funcionalidad de WorkingSearch
 */
export const CompactSearch: React.FC<CompactSearchProps> = ({
  className = '',
  placeholder = 'Buscar...'
}) => {
  const isMobile = useIsMobile();

  // Siempre usar WorkingSearch pero con estilos adaptivos
  return (
    <WorkingSearch
      className={className}
      placeholder={isMobile ? placeholder : "Buscar en el sistema..."}
    />
  );
};