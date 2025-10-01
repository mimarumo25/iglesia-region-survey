import { z } from "zod"

/**
 * Validación para números de teléfono colombianos
 * Formatos válidos:
 * - Teléfonos fijos: 7 dígitos (ej: 1234567)
 * - Teléfonos móviles: 10 dígitos (ej: 3001234567)
 * - Con código de país: +57 seguido de 7 o 10 dígitos
 * - Con espacios, guiones o paréntesis opcionales
 */
const telefonoColombiano = z
  .string()
  .optional()
  .refine((val) => {
    if (!val || val.trim() === '') return true; // Opcional
    
    // Limpiar el teléfono de espacios, guiones, paréntesis y signos +
    const cleanPhone = val.replace(/[\s\-\(\)\+]/g, '');
    
    // Validar formatos colombianos
    const patterns = [
      /^57\d{7}$/, // +57 + 7 dígitos (fijo con código país)
      /^57\d{10}$/, // +57 + 10 dígitos (móvil con código país)
      /^\d{7}$/, // 7 dígitos (fijo local)
      /^\d{10}$/, // 10 dígitos (móvil local)
    ];
    
    return patterns.some(pattern => pattern.test(cleanPhone));
  }, {
    message: "Formato de teléfono inválido. Use formatos como: 1234567, 3001234567, +57 1234567, +57 300 123 4567"
  });

/**
 * Validación para email con formato estándar
 */
const emailOptional = z
  .string()
  .optional()
  .refine((val) => {
    if (!val || val.trim() === '') return true; // Opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  }, {
    message: "Formato de email inválido"
  });

/**
 * Validación para nombres (solo letras, espacios y algunos caracteres especiales)
 */
const nombreParroquia = z
  .string()
  .min(1, "El nombre es obligatorio")
  .min(3, "El nombre debe tener al menos 3 caracteres")
  .max(100, "El nombre no puede exceder 100 caracteres")
  .refine((val) => {
    // Permitir letras, números, espacios, guiones, apostrofes y puntos
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\.']+$/;
    return nameRegex.test(val);
  }, {
    message: "El nombre solo puede contener letras, números, espacios, guiones, apostrofes y puntos"
  });

/**
 * Validación para direcciones
 */
const direccion = z
  .string()
  .min(1, "La dirección es obligatoria")
  .min(5, "La dirección debe tener al menos 5 caracteres")
  .max(200, "La dirección no puede exceder 200 caracteres")
  .refine((val) => {
    // Permitir letras, números, espacios y caracteres comunes en direcciones
    const addressRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\.,#°]+$/;
    return addressRegex.test(val);
  }, {
    message: "La dirección contiene caracteres no válidos"
  });

/**
 * Esquema de validación para crear una parroquia
 */
export const parroquiaCreateSchema = z.object({
  nombre: nombreParroquia,
  direccion: direccion,
  telefono: telefonoColombiano,
  email: emailOptional,
  id_municipio: z
    .string()
    .min(1, "Debe seleccionar un municipio")
    .refine((val) => {
      // Verificar que sea un número válido
      return !isNaN(Number(val)) && Number(val) > 0;
    }, {
      message: "Debe seleccionar un municipio válido"
    })
});

/**
 * Esquema de validación para editar una parroquia
 * (mismo que crear, pero se puede extender con validaciones específicas)
 */
export const parroquiaUpdateSchema = parroquiaCreateSchema;

/**
 * Tipos TypeScript derivados de los esquemas Zod
 */
export type ParroquiaCreateData = z.infer<typeof parroquiaCreateSchema>;
export type ParroquiaUpdateData = z.infer<typeof parroquiaUpdateSchema>;

/**
 * Utilidad para limpiar y formatear número de teléfono
 */
export const formatTelefono = (telefono: string): string => {
  if (!telefono) return '';
  
  // Limpiar caracteres especiales
  const cleaned = telefono.replace(/[\s\-\(\)\+]/g, '');
  
  // Si empieza con 57, es código de país
  if (cleaned.startsWith('57')) {
    const number = cleaned.substring(2);
    if (number.length === 7) {
      // Teléfono fijo: XXX XXXX
      return `${number.substring(0, 3)} ${number.substring(3)}`;
    } else if (number.length === 10) {
      // Teléfono móvil: XXX XXX XXXX
      return `${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  } else {
    if (cleaned.length === 7) {
      // Teléfono fijo local: XXX XXXX
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
    } else if (cleaned.length === 10) {
      // Teléfono móvil local: XXX XXX XXXX
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
  }
  
  return telefono; // Retornar original si no coincide con formatos esperados
};

/**
 * Validador personalizado para verificar si el teléfono es válido
 */
export const isValidTelefonoColombiano = (telefono: string): boolean => {
  if (!telefono || telefono.trim() === '') return true; // Opcional
  
  const cleanPhone = telefono.replace(/[\s\-\(\)\+]/g, '');
  const patterns = [
    /^57\d{7}$/, // +57 + 7 dígitos (fijo con código país)
    /^57\d{10}$/, // +57 + 10 dígitos (móvil con código país)
    /^\d{7}$/, // 7 dígitos (fijo local)
    /^\d{10}$/, // 10 dígitos (móvil local)
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
};