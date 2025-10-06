/**
 * 📊 PaginationControls - Componente de paginación reutilizable
 * 
 * Componente modular que implementa controles completos de paginación
 * con soporte responsive y opciones configurables.
 * 
 * Características:
 * - Navegación (anterior/siguiente, primera/última página)
 * - Selector de items por página
 * - Información de página actual y totales
 * - Modo compacto para móviles
 * - Estados de loading
 */

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationControlsProps } from "@/types/pagination";

const DEFAULT_ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

export const PaginationControls = ({
  pagination,
  onPageChange,
  onItemsPerPageChange,
  options = {},
  isLoading = false,
  className
}: PaginationControlsProps) => {
  const {
    showPageInfo = true,
    showItemsPerPage = true,
    showTotalItems = true,
    itemsPerPageOptions = DEFAULT_ITEMS_PER_PAGE_OPTIONS,
    compact = false
  } = options;

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage
  } = pagination;

  // Calcular rango de items mostrados
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handlers
  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => onPageChange(totalPages);
  const handleItemsPerPageChange = (value: string) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(parseInt(value));
      onPageChange(1); // Reset a la primera página al cambiar límite
    }
  };

  // No mostrar si no hay items
  if (totalItems === 0) {
    return null;
  }

  // Modo compacto (móvil)
  if (compact) {
    return (
      <div className={cn("flex flex-col gap-3 p-4 bg-muted/30 rounded-lg", className)}>
        {/* Información de totales */}
        {showTotalItems && (
          <div className="text-xs text-center text-muted-foreground">
            Mostrando <span className="font-medium text-foreground">{startItem}</span>-
            <span className="font-medium text-foreground">{endItem}</span> de{" "}
            <span className="font-medium text-foreground">{totalItems}</span> {totalItems === 1 ? "registro" : "registros"}
          </div>
        )}

        {/* Controles de navegación compactos */}
        <div className="flex items-center justify-between gap-2">
          {/* Botones navegación */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={!hasPrevPage || isLoading}
              className="h-8 w-8 p-0"
              title="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!hasNextPage || isLoading}
              className="h-8 w-8 p-0"
              title="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Información de página */}
          {showPageInfo && (
            <div className="text-xs text-muted-foreground">
              Página <span className="font-medium text-foreground">{currentPage}</span> de{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </div>
          )}

          {/* Selector de items por página */}
          {showItemsPerPage && onItemsPerPageChange && (
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={handleItemsPerPageChange}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map(option => (
                  <SelectItem key={option} value={option.toString()} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    );
  }

  // Modo completo (desktop)
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg",
      className
    )}>
      {/* Información de totales */}
      {showTotalItems && (
        <div className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{startItem}</span>-
          <span className="font-medium text-foreground">{endItem}</span> de{" "}
          <span className="font-medium text-foreground">{totalItems}</span> {totalItems === 1 ? "registro" : "registros"}
        </div>
      )}

      {/* Controles centrales */}
      <div className="flex items-center gap-2">
        {/* Botón primera página */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleFirstPage}
          disabled={!hasPrevPage || isLoading}
          className="h-9 w-9 p-0"
          title="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Botón anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={!hasPrevPage || isLoading}
          className="h-9 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        {/* Información de página */}
        {showPageInfo && (
          <div className="text-sm text-muted-foreground px-3 min-w-[120px] text-center">
            Página <span className="font-medium text-foreground">{currentPage}</span> de{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </div>
        )}

        {/* Botón siguiente */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={!hasNextPage || isLoading}
          className="h-9 px-3"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {/* Botón última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLastPage}
          disabled={!hasNextPage || isLoading}
          className="h-9 w-9 p-0"
          title="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Selector de items por página */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Mostrar:
          </span>
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={handleItemsPerPageChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-9 w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map(option => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">por página</span>
        </div>
      )}
    </div>
  );
};

// Componente de paginación simple (solo navegación)
export const SimplePaginationControls = ({
  pagination,
  onPageChange,
  isLoading = false,
  className
}: Pick<PaginationControlsProps, 'pagination' | 'onPageChange' | 'isLoading' | 'className'>) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={!hasPrevPage || isLoading}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Anterior
      </Button>
      
      <span className="text-sm text-muted-foreground px-2">
        Página {currentPage} de {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={!hasNextPage || isLoading}
      >
        Siguiente
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default PaginationControls;
