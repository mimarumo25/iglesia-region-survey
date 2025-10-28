import { z } from "zod"

/**
 * Validación para nombres de corregimientos
 * - Mínimo 3 caracteres
 * - Máximo 100 caracteres
 * - Solo letras, números, espacios y caracteres válidos
 */
const nombreCorregimiento = z
  .string()
  .min(1, "El nombre es obligatorio")
  .min(3, "El nombre debe tener al menos 3 caracteres")
  .max(100, "El nombre no puede exceder 100 caracteres")
  .refine((val) => {
    // Permitir letras, números, espacios, guiones, apostrofes, puntos
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\.']+$/;
    return nameRegex.test(val);
  }, {
    message: "El nombre solo puede contener letras, números, espacios, guiones, apostrofes y puntos"
  });

/**
 * Validación para municipios (ID)
 * Convierte strings a números automáticamente
 */
const municipioId = z
  .string()
  .or(z.number())
  .transform((val) => {
    const numVal = Number(val);
    if (isNaN(numVal) || numVal <= 0) {
      throw new Error("Debe seleccionar un municipio válido");
    }
    return numVal;
  })
  .refine((val) => !isNaN(val) && val > 0, {
    message: "Debe seleccionar un municipio válido"
  });

/**
 * Esquema para crear un corregimiento
 */
export const corregimientoCreateSchema = z.object({
  nombre: nombreCorregimiento,
  id_municipio: municipioId.optional(),
  id_municipio_municipios: municipioId.optional(),
}).refine(
  (data) => data.id_municipio || data.id_municipio_municipios,
  {
    message: "Debe seleccionar un municipio válido",
    path: ["id_municipio"],
  }
);

export type CorregimientoCreateData = z.infer<typeof corregimientoCreateSchema>;

/**
 * Esquema para actualizar un corregimiento
 */
export const corregimientoUpdateSchema = z.object({
  nombre: nombreCorregimiento,
  id_municipio: municipioId.optional(),
  id_municipio_municipios: municipioId.optional(),
}).refine(
  (data) => data.id_municipio || data.id_municipio_municipios,
  {
    message: "Debe seleccionar un municipio válido",
    path: ["id_municipio"],
  }
);

export type CorregimientoUpdateData = z.infer<typeof corregimientoUpdateSchema>;

/**
 * Función auxiliar para formatear el nombre del corregimiento
 */
export const formatNombreCorregimiento = (nombre: string): string => {
  return nombre
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
