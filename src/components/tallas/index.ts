/**
 * Módulo de Tallas - Exports principales
 * 
 * @description Punto de entrada centralizado para todos los componentes, hooks,
 * tipos y utilidades relacionadas con el manejo de tallas de vestimenta.
 * 
 * @author Sistema MIA - Módulo de Tallas
 * @version 1.0.0
 */

// ========== TIPOS ==========
export type {
  Talla,
  TipoTalla,
  TallasData,
  TallasFormData,
  TallaSelectProps,
  UseTallasReturn,
  TallaAutocompleteConfig
} from '@/types/tallas';

// ========== DATOS Y CONSTANTES ==========
export { 
  TALLAS_DATA, 
  getTallasMasComunes, 
  buscarTallas 
} from '@/data/tallas';

// ========== HOOKS ==========
export { 
  useTallas, 
  useTallasSearch, 
  useTallasValidation 
} from '@/hooks/useTallas';

// ========== COMPONENTES ==========
export { 
  TallaSelect,
  TallasGroup,
  default as TallaSelectDefault
} from '@/components/tallas/TallaSelect';

export { 
  default as TallasDemoPage 
} from '@/components/tallas/TallasDemoPage';

// ========== UTILIDADES ==========
export {
  tallasValidationSchemas,
  TallasZodSchemas,
  tallasDataTransformer,
  tallasDefaultValues,
  tallasErrorMessages,
  validateTallasManual,
  formatTallasForDisplay,
  generateSelectOptions
} from '@/utils/tallasUtils';

export type {
  TallasBasicForm,
  TallasStrictForm,
  TallasRequiredForm
} from '@/utils/tallasUtils';
