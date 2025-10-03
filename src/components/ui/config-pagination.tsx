/**
 * 📄 Componente de Paginación Reutilizable para Configuración
 * 
 * Unifica todos los patrones de paginación encontrados en componentes de configuración:
 * - DisposicionBasura, SectoresConfig, Veredas (patrón simple)
 * - Parentescos, Profesiones (patrón completo)
 * - ConfigurationTable (patrón integrado)
 * 
 * Siguiendo el sistema de diseño del proyecto con shadcn/ui
 */

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

// ===== TIPOS E INTERFACES =====

export type ConfigPaginationVariant = 'simple' | 'complete' | 'compact';
export type ConfigPaginationSize = 'sm' | 'md' | 'lg';

// Mapeo de tamaños de nuestro componente a tamaños de shadcn/ui Button
const getButtonSize = (size: ConfigPaginationSize): 'sm' | 'lg' | 'default' => {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    case 'md':
    default:
      return 'default';
  }
};

export interface ConfigPaginationProps {
  // Datos de paginación (requeridos)
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  
  // Eventos (requeridos)
  onPageChange: (page: number) => void;
  
  // Selector de elementos por página
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPageSelector?: boolean;
  
  // Configuración visual
  variant?: ConfigPaginationVariant;
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  
  // Estados
  loading?: boolean;
  disabled?: boolean;
  
  // Personalización
  className?: string;
  infoText?: string;
  size?: ConfigPaginationSize;
  
  // Responsive
  hideInfoOnMobile?: boolean;
}

// ===== HELPERS INTERNOS =====

/**
 * Genera array de números de página con elipsis para navegación
 */
const generatePageNumbers = (
  current: number, 
  total: number, 
  maxVisible: number = 5
): (number | 'ellipsis')[] => {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);
  
  // Siempre mostrar primera página
  pages.push(1);
  
  let start = Math.max(2, current - halfVisible);
  let end = Math.min(total - 1, current + halfVisible);
  
  // Ajustar rango si estamos cerca del inicio o final
  if (current <= halfVisible + 1) {
    end = Math.min(total - 1, maxVisible - 1);
  }
  if (current >= total - halfVisible) {
    start = Math.max(2, total - maxVisible + 2);
  }
  
  // Agregar elipsis inicial si hay gap
  if (start > 2) {
    pages.push('ellipsis');
  }
  
  // Agregar páginas del rango
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== total) {
      pages.push(i);
    }
  }
  
  // Agregar elipsis final si hay gap
  if (end < total - 1) {
    pages.push('ellipsis');
  }
  
  // Siempre mostrar última página (si no es la primera)
  if (total > 1) {
    pages.push(total);
  }
  
  return pages;
};

/**
 * Calcula rango de elementos mostrados en la página actual
 */
const calculateItemRange = (
  page: number, 
  itemsPerPage: number, 
  totalItems: number
): { start: number; end: number } => {
  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, totalItems);
  return { start, end };
};

/**
 * Valida si se puede navegar a una página específica
 */
const canNavigate = (
  targetPage: number, 
  totalPages: number, 
  loading: boolean = false,
  disabled: boolean = false
): boolean => {
  return !loading && !disabled && targetPage >= 1 && targetPage <= totalPages;
};

// ===== COMPONENTE PRINCIPAL =====

export const ConfigPagination: React.FC<ConfigPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 25, 50],
  showItemsPerPageSelector = true,
  variant = 'simple',
  showInfo = true,
  showFirstLast = false,
  maxVisiblePages = 5,
  loading = false,
  disabled = false,
  className,
  infoText,
  size = 'md',
  hideInfoOnMobile = true,
}) => {
  
  // ===== VALIDACIONES =====
  
  // Validar props requeridas
  if (currentPage < 1 || currentPage > Math.max(1, totalPages)) {
    console.warn('ConfigPagination: currentPage fuera de rango válido');
    return null;
  }

  // ===== CÁLCULOS DERIVADOS =====

  const itemRange = useMemo(() => 
    calculateItemRange(currentPage, itemsPerPage, totalItems), 
    [currentPage, itemsPerPage, totalItems]
  );
  
  const pageNumbers = useMemo(() => 
    variant === 'complete' ? generatePageNumbers(currentPage, totalPages, maxVisiblePages) : [],
    [variant, currentPage, totalPages, maxVisiblePages]
  );
  
  const canGoPrevious = canNavigate(currentPage - 1, totalPages, loading, disabled);
  const canGoNext = canNavigate(currentPage + 1, totalPages, loading, disabled);
  const canGoFirst = canNavigate(1, totalPages, loading, disabled) && currentPage > 1;
  const canGoLast = canNavigate(totalPages, totalPages, loading, disabled) && currentPage < totalPages;

  // ===== HANDLERS =====
  
  const handlePageChange = (page: number) => {
    if (canNavigate(page, totalPages, loading, disabled)) {
      onPageChange(page);
    }
  };

  // ===== CLASES CSS =====
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const buttonSizeClasses = {
    sm: 'h-8 px-2',
    md: 'h-9 px-3', 
    lg: 'h-10 px-4',
  };

  // ===== RENDER VARIANTS =====

  const renderItemsPerPageSelector = () => {
    if (!showItemsPerPageSelector || !onItemsPerPageChange) return null;
    
    return (
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-muted-foreground whitespace-nowrap",
          sizeClasses[size],
          hideInfoOnMobile && "hidden sm:inline"
        )}>
          Mostrar
        </span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          disabled={loading || disabled}
        >
          <SelectTrigger className={cn(
            "w-20",
            buttonSizeClasses[size]
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {itemsPerPageOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className={cn(
          "text-muted-foreground whitespace-nowrap",
          sizeClasses[size],
          hideInfoOnMobile && "hidden sm:inline"
        )}>
          por página
        </span>
      </div>
    );
  };

  const renderInfo = () => {
    if (!showInfo) return null;
    
    const customInfo = infoText?.replace(/\{start\}/g, itemRange.start.toString())
      .replace(/\{end\}/g, itemRange.end.toString())
      .replace(/\{total\}/g, totalItems.toString());
    
    const defaultInfo = `Mostrando ${itemRange.start}-${itemRange.end} de ${totalItems} elementos`;
    
    return (
      <div className={cn(
        "text-muted-foreground",
        sizeClasses[size],
        hideInfoOnMobile && "hidden sm:block"
      )}>
        {customInfo || defaultInfo}
      </div>
    );
  };

  const renderSimpleControls = () => (
    <div className="flex items-center gap-2">
      {totalPages > 1 && (
        <Button
          variant="outline"
          size={getButtonSize(size)}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={cn(buttonSizeClasses[size])}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Anterior</span>
        </Button>
      )}
      
      {totalPages > 1 && (
        <span className={cn(
          "text-muted-foreground font-medium px-2",
          sizeClasses[size]
        )}>
          <span className="hidden sm:inline">Página </span>
          {currentPage}
          <span className="hidden sm:inline"> de {totalPages}</span>
        </span>
      )}
      
      {totalPages > 1 && (
        <Button
          variant="outline"
          size={getButtonSize(size)}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={cn(buttonSizeClasses[size])}
        >
          <span className="hidden sm:inline mr-1">Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const renderCompleteControls = () => (
    <div className="flex items-center gap-2">
      {/* Botón Primera página */}
      {showFirstLast && (
        <Button
          variant="outline"
          size={getButtonSize(size)}
          onClick={() => handlePageChange(1)}
          disabled={!canGoFirst}
          className={cn(buttonSizeClasses[size], "hidden sm:flex")}
        >
          <ChevronsLeft className="w-4 h-4" />
          <span className="hidden md:inline ml-1">Primera</span>
        </Button>
      )}

      {/* Botón Anterior */}
      <Button
        variant="outline"
        size={getButtonSize(size)}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={cn(buttonSizeClasses[size])}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline ml-1">Anterior</span>
      </Button>
      
      {/* Números de página */}
      <div className="hidden sm:flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="text-muted-foreground px-2">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size={getButtonSize(size)}
              onClick={() => handlePageChange(page)}
              disabled={loading || disabled}
              className={cn(
                "w-8 h-8 p-0",
                page === currentPage && "bg-primary text-primary-foreground"
              )}
            >
              {page}
            </Button>
          )
        ))}
      </div>
      
      {/* Info móvil */}
      <span className={cn(
        "sm:hidden text-muted-foreground font-medium px-2",
        sizeClasses[size]
      )}>
        {currentPage}/{totalPages}
      </span>
      
      {/* Botón Siguiente */}
      <Button
        variant="outline"
        size={getButtonSize(size)}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={cn(buttonSizeClasses[size])}
      >
        <span className="hidden sm:inline mr-1">Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Botón Última página */}
      {showFirstLast && (
        <Button
          variant="outline"
          size={getButtonSize(size)}
          onClick={() => handlePageChange(totalPages)}
          disabled={!canGoLast}
          className={cn(buttonSizeClasses[size], "hidden sm:flex")}
        >
          <span className="hidden md:inline mr-1">Última</span>
          <ChevronsRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const renderCompactControls = () => (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size={getButtonSize(size)}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className="w-8 h-8 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <span className={cn(
        "text-muted-foreground font-medium px-2",
        sizeClasses[size]
      )}>
        {currentPage}/{totalPages}
      </span>
      
      <Button
        variant="outline"
        size={getButtonSize(size)}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="w-8 h-8 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  // ===== RENDER PRINCIPAL =====

  const renderControls = () => {
    switch (variant) {
      case 'complete':
        return renderCompleteControls();
      case 'compact':
        return renderCompactControls();
      case 'simple':
      default:
        return renderSimpleControls();
    }
  };

  return (
    <div className={cn(
      "flex flex-col gap-4 pt-4 border-t border-border",
      loading && "opacity-50 pointer-events-none",
      className
    )}>
      {/* Primera fila: Información y selector de elementos por página */}
      {variant !== 'compact' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="order-2 sm:order-1">
            {renderInfo()}
          </div>
          <div className="order-1 sm:order-2">
            {renderItemsPerPageSelector()}
          </div>
        </div>
      )}
      
      {/* Segunda fila: Controles de navegación */}
      <div className={cn(
        "flex items-center",
        variant === 'compact' ? "justify-center" : "justify-center sm:justify-end"
      )}>
        {totalPages > 1 && renderControls()}
      </div>
    </div>
  );
};

// ===== EXPORT DEFAULT =====

export default ConfigPagination;

// ===== HOOK AUXILIAR (OPCIONAL) =====

/**
 * Hook para manejar estado de paginación de manera consistente
 */
export const useConfigPagination = (initialPage: number = 1) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const resetPage = () => {
    setCurrentPage(1);
  };
  
  return {
    currentPage,
    handlePageChange,
    resetPage,
  };
};