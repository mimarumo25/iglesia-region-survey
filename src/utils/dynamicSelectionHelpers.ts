/**
 * Utilidades para manejar selecciones dinámicas basadas en IDs
 * 
 * Estos helpers convierten entre:
 * - Array de IDs seleccionados (usado en el formulario)
 * - Array de objetos {id, nombre, seleccionado} (usado en la API)
 */

import { AutocompleteOption } from '@/components/ui/autocomplete';
import { DynamicSelectionMap, DynamicSelectionItem } from '@/types/survey';

/**
 * Convierte un array de IDs seleccionados a DynamicSelectionMap (array de objetos)
 * 
 * @param selectedIds - Array de IDs que fueron seleccionados
 * @param availableOptions - Opciones disponibles del backend
 * @returns Array de objetos {id, nombre, seleccionado}
 * 
 * @example
 * convertIdsToSelectionMap(['1', '3', '5'], options)
 * // Retorna: [
 * //   { id: "1", nombre: "Recolección municipal", seleccionado: true },
 * //   { id: "2", nombre: "Incineración", seleccionado: false },
 * //   { id: "3", nombre: "Reciclaje", seleccionado: true },
 * //   ...
 * // ]
 */
export const convertIdsToSelectionMap = (
  selectedIds: string[],
  availableOptions: AutocompleteOption[]
): DynamicSelectionMap => {
  return availableOptions.map(option => ({
    id: option.value,
    nombre: option.label,
    seleccionado: selectedIds.includes(option.value)
  }));
};

/**
 * Convierte DynamicSelectionMap (array de objetos) a un array de IDs seleccionados
 * 
 * @param selectionMap - Array de objetos {id, nombre, seleccionado}
 * @returns Array de IDs donde seleccionado es true
 * 
 * @example
 * convertSelectionMapToIds(selectionMap)
 * // Retorna: ['1', '3', '5']
 */
export const convertSelectionMapToIds = (
  selectionMap: DynamicSelectionMap
): string[] => {
  return selectionMap
    .filter(item => item.seleccionado === true)
    .map(item => item.id);
};

/**
 * Obtiene los nombres/labels de las opciones seleccionadas
 * 
 * @param selectionMap - Array de objetos {id, nombre, seleccionado}
 * @returns Array de nombres de opciones seleccionadas
 * 
 * @example
 * getSelectedLabels(selectionMap)
 * // Retorna: ['Recolección municipal', 'Reciclaje']
 */
export const getSelectedLabels = (
  selectionMap: DynamicSelectionMap
): string[] => {
  return selectionMap
    .filter(item => item.seleccionado === true)
    .map(item => item.nombre);
};

/**
 * Actualiza el estado de selección de un item específico
 * 
 * @param selectionMap - Array de objetos actual
 * @param itemId - ID del item a actualizar
 * @param newState - Nuevo estado (true/false)
 * @returns Nuevo array con el item actualizado
 * 
 * @example
 * updateSelectionItem(selectionMap, "3", true)
 * // Retorna un nuevo array con el item id="3" actualizado
 */
export const updateSelectionItem = (
  selectionMap: DynamicSelectionMap,
  itemId: string,
  newState: boolean
): DynamicSelectionMap => {
  return selectionMap.map(item =>
    item.id === itemId ? { ...item, seleccionado: newState } : item
  );
};

/**
 * Valida que todas las opciones disponibles estén representadas en el mapa
 * 
 * @param selectionMap - Array de objetos {id, nombre, seleccionado}
 * @param availableOptions - Opciones disponibles del backend
 * @returns true si todas las opciones están en el mapa
 */
export const isCompleteSelectionMap = (
  selectionMap: DynamicSelectionMap,
  availableOptions: AutocompleteOption[]
): boolean => {
  return availableOptions.every(
    option => selectionMap.some(item => item.id === option.value)
  );
};

/**
 * Migra datos de estructura old (booleanos hardcodeados) a nueva estructura (objetos con id/nombre)
 * 
 * Útil para mantener compatibilidad con datos guardados antes del cambio
 * 
 * @param selectedIds - IDs que estaban seleccionados en la estructura anterior
 * @param availableOptions - Opciones disponibles del backend
 * @returns DynamicSelectionMap con la nueva estructura
 */
export const migrateOldToNewFormat = (
  selectedIds: string[],
  availableOptions: AutocompleteOption[]
): DynamicSelectionMap => {
  return convertIdsToSelectionMap(selectedIds, availableOptions);
};

/**
 * Crea una DynamicSelectionMap vacía (todos los items con seleccionado=false)
 * 
 * @param availableOptions - Opciones disponibles del backend
 * @returns DynamicSelectionMap con todos los valores en false
 */
export const createEmptySelectionMap = (
  availableOptions: AutocompleteOption[]
): DynamicSelectionMap => {
  return availableOptions.map(option => ({
    id: option.value,
    nombre: option.label,
    seleccionado: false
  }));
};

/**
 * Compara dos DynamicSelectionMaps para detectar cambios
 * 
 * @param map1 - Primer mapa a comparar
 * @param map2 - Segundo mapa a comparar
 * @returns true si son iguales
 */
export const areSelectionMapsEqual = (
  map1: DynamicSelectionMap,
  map2: DynamicSelectionMap
): boolean => {
  if (map1.length !== map2.length) return false;
  
  return map1.every((item1, index) => {
    const item2 = map2[index];
    return item1.id === item2.id && item1.seleccionado === item2.seleccionado;
  });
};

/**
 * Reporte de DEBUG: Muestra información completa sobre un mapa de selección
 * 
 * @param selectionMap - Mapa a reportar
 * @returns String con reporte formateado
 */
export const debugSelectionMap = (
  selectionMap: DynamicSelectionMap
): string => {
  const selectedLabels = getSelectedLabels(selectionMap);
  const selectedIds = convertSelectionMapToIds(selectionMap);
  
  return `
📊 REPORTE DE SELECCIÓN DINÁMICA:
  Total de opciones: ${selectionMap.length}
  Total seleccionadas: ${selectedIds.length}
  IDs seleccionados: [${selectedIds.join(', ')}]
  Nombres: ${selectedLabels.length > 0 ? selectedLabels.join(', ') : 'Ninguna'}
  Detalle completo:
${selectionMap.map(item => `    - ${item.id}: "${item.nombre}" = ${item.seleccionado}`).join('\n')}
  `;
};
