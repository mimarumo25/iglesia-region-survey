import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AutocompleteOption } from "@/components/ui/autocomplete"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte una lista de municipios en opciones para autocomplete
 * @param municipios - Array de municipios
 * @param includeDepatment - Si incluir el nombre del departamento en el label
 * @returns Array de opciones para autocomplete
 */
export function municipiosToOptions(
  municipios: Array<{
    id_municipio: string;
    nombre_municipio: string;
    departamento?: {
      nombre: string;
    };
  }> = [],
  includeDepartment: boolean = false
): AutocompleteOption[] {
  return municipios.map((municipio) => ({
    value: municipio.id_municipio,
    label: includeDepartment && municipio.departamento
      ? `${municipio.nombre_municipio} (${municipio.departamento.nombre})`
      : municipio.nombre_municipio || 'Sin nombre'
  }));
}

/**
 * Formatea una fecha en formato legible
 * @param dateString - Fecha en string
 * @param defaultValue - Valor por defecto si no hay fecha
 * @returns Fecha formateada o valor por defecto
 */
export function formatDate(dateString?: string, defaultValue: string = '-'): string {
  if (!dateString) return defaultValue;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Encuentra una opción en un array de opciones por su value
 * @param options - Array de opciones
 * @param value - Valor a buscar
 * @returns La opción encontrada o undefined
 */
export function findOptionByValue(
  options: AutocompleteOption[],
  value: string
): AutocompleteOption | undefined {
  return options.find(option => option.value === value);
}
