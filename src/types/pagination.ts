/**
 * 📄 Tipos TypeScript para Paginación
 * 
 * Interfaces reutilizables para implementación de paginación
 * en diferentes módulos del sistema.
 */

/**
 * Información de paginación estándar de la API
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Parámetros de paginación para requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Opciones de configuración para el componente de paginación
 */
export interface PaginationOptions {
  showPageInfo?: boolean; // Mostrar "Página X de Y"
  showItemsPerPage?: boolean; // Mostrar selector de items por página
  showTotalItems?: boolean; // Mostrar "Mostrando X de Y items"
  itemsPerPageOptions?: number[]; // Opciones para el selector de items por página
  compact?: boolean; // Modo compacto para móviles
}

/**
 * Callbacks del componente de paginación
 */
export interface PaginationCallbacks {
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
}

/**
 * Props completas del componente de paginación
 */
export interface PaginationControlsProps extends PaginationCallbacks {
  pagination: PaginationInfo;
  options?: PaginationOptions;
  isLoading?: boolean;
  className?: string;
}

/**
 * Estado de paginación para uso en componentes
 */
export interface PaginationState {
  page: number;
  limit: number;
}

/**
 * Respuesta paginada genérica de la API
 */
export interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  pagination: PaginationInfo;
}
