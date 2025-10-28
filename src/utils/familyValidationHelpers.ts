/**
 * Utilidades para validaciones específicas de la familia
 */

import { FamilyMember } from "@/types/survey";

/**
 * Palabras clave que identifican un cargo o rol de responsabilidad en la familia
 * Se usa búsqueda case-insensitive
 */
const LEADERSHIP_KEYWORDS = [
  "cabeza",      // Cabeza de Hogar
  "hogar",       // Jefe del Hogar, Cabeza de Hogar
  "lider",       // Líder
  "jefe",        // Jefe de Familia
  "familiar",    // Responsable Familiar
  "responsable", // Responsable del Hogar
];

/**
 * Valida si el nombre de parentesco contiene palabras clave de liderazgo/responsabilidad
 * @param parentescoNombre - Nombre del parentesco a validar (ej: "Cabeza de Hogar", "Jefe de Familia")
 * @returns true si el parentesco contiene alguna palabra clave, false en caso contrario
 */
export function isLeadershipParentesco(parentescoNombre: string | null | undefined): boolean {
  if (!parentescoNombre || typeof parentescoNombre !== "string") {
    return false;
  }

  const normalizedNombre = parentescoNombre.toLowerCase().trim();
  
  return LEADERSHIP_KEYWORDS.some(keyword =>
    normalizedNombre.includes(keyword.toLowerCase())
  );
}

/**
 * Valida si existe al menos un familiar con un parentesco de liderazgo/responsabilidad
 * @param familyMembers - Lista de miembros de la familia
 * @returns true si hay al menos un familiar con parentesco de liderazgo, false en caso contrario
 */
export function hasLeadershipFamilyMember(familyMembers: FamilyMember[]): boolean {
  if (!Array.isArray(familyMembers) || familyMembers.length === 0) {
    return false;
  }

  return familyMembers.some(member => {
    if (!member.parentesco || !member.parentesco.nombre) {
      return false;
    }
    return isLeadershipParentesco(member.parentesco.nombre);
  });
}

/**
 * Obtiene el nombre del primer familiar con rol de liderazgo
 * @param familyMembers - Lista de miembros de la familia
 * @returns Nombre del familiar o null si no existe
 */
export function getLeadershipFamilyMemberName(familyMembers: FamilyMember[]): string | null {
  if (!Array.isArray(familyMembers) || familyMembers.length === 0) {
    return null;
  }

  const leader = familyMembers.find(member => {
    if (!member.parentesco || !member.parentesco.nombre) {
      return false;
    }
    return isLeadershipParentesco(member.parentesco.nombre);
  });

  return leader?.nombres || null;
}

/**
 * Genera un mensaje descriptivo sobre los roles de liderazgo esperados
 * @returns Mensaje descriptivo
 */
export function getLeadershipMessage(): string {
  return `Debe haber al menos un familiar con rol de responsabilidad (ej: Cabeza de Hogar, Jefe de Familia, Líder, etc.)`;
}
