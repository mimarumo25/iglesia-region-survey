/**
 * Tipos para el manejo de tallas de vestimenta en Colombia
 * 
 * @description Este archivo define los tipos TypeScript para manejar las diferentes
 * categorías de tallas utilizadas en Colombia para camisas/blusas, pantalones y calzado.
 */

// Tipo principal para una talla
export interface Talla {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: TipoTalla;
  orden: number;
}

// Categorías de tallas disponibles
export type TipoTalla = 'camisa' | 'pantalon' | 'calzado';

// Interface para las opciones de tallas organizadas por categoría
export interface TallasData {
  camisas: Talla[];
  pantalones: Talla[];
  calzado: Talla[];
}

// Interface para el formulario de tallas
export interface TallasFormData {
  talla_camisa: string;
  talla_pantalon: string;
  talla_zapato: string;
}

// Interface para el componente de selección de tallas
export interface TallaSelectProps {
  value: string;
  onChange: (value: string) => void;
  tipo: TipoTalla;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'select' | 'combobox';
}

// Interface para el hook de tallas
export interface UseTallasReturn {
  tallasData: TallasData;
  getTallasPorTipo: (tipo: TipoTalla) => Talla[];
  getTallaNombre: (tipo: TipoTalla, id: string) => string;
  isValidTalla: (tipo: TipoTalla, id: string) => boolean;
}

// Opciones de configuración para el autocomplete
export interface TallaAutocompleteConfig {
  showSearchIcon?: boolean;
  maxResults?: number;
  allowCustom?: boolean;
  searchPlaceholder?: string;
}
