/**
 * Utilidades de validación reutilizables para el sistema MIA
 * 
 * Este archivo contiene funciones de validación comunes que pueden ser
 * utilizadas en diferentes formularios y esquemas Zod del proyecto.
 * 
 * Características:
 * - Validaciones específicas para el contexto colombiano
 * - Funciones puras y reutilizables
 * - Mensajes de error claros y consistentes
 * - Compatible con Zod y React Hook Form
 */

/**
 * Valida números de teléfono colombianos
 * 
 * Criterios de validación:
 * - Solo números (pueden tener espacios, guiones o paréntesis como separadores)
 * - Mínimo 7 dígitos (teléfonos fijos)
 * - Máximo 10 dígitos (celulares)
 * - Formatos válidos: 3001234567, 300-123-4567, 300 123 4567, (300) 123-4567
 * 
 * @param value - El valor del teléfono a validar
 * @returns true si es válido, false si no
 */
export const isValidColombianPhone = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  
  // Remover todos los caracteres no numéricos
  const digitsOnly = value.replace(/\D/g, '');
  
  // Validar longitud
  if (digitsOnly.length < 7 || digitsOnly.length > 10) return false;
  
  // Para celulares (10 dígitos), debe comenzar con 3
  if (digitsOnly.length === 10 && !digitsOnly.startsWith('3')) {
    return false;
  }
  
  return true;
};

/**
 * Formatea un número de teléfono colombiano para display
 * 
 * @param value - El número de teléfono
 * @returns El número formateado o el valor original si no es válido
 */
export const formatColombianPhone = (value: string): string => {
  if (!value) return value;
  
  const digitsOnly = value.replace(/\D/g, '');
  
  if (digitsOnly.length === 10) {
    // Formato para celulares: 300-123-4567
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 7) {
    // Formato para teléfonos fijos: 123-4567
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  }
  
  return value;
};

/**
 * Valida direcciones de email con criterios específicos
 * 
 * @param value - El email a validar
 * @returns true si es válido, false si no
 */
export const isValidEmail = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  
  // Regex más estricta para emails
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Validar formato básico
  if (!emailRegex.test(value)) return false;
  
  // Validaciones adicionales
  if (value.length > 254) return false; // Límite RFC
  if (value.includes('..')) return false; // No puntos consecutivos
  if (value.startsWith('.') || value.endsWith('.')) return false; // No puede empezar/terminar con punto
  
  return true;
};

/**
 * Mensajes de error estándar para validaciones
 */
export const VALIDATION_MESSAGES = {
  phone: {
    invalid: "Ingrese un número de teléfono válido (7-10 dígitos)",
    tooShort: "El teléfono debe tener mínimo 7 dígitos",
    tooLong: "El teléfono debe tener máximo 10 dígitos",
    cellInvalid: "Los celulares deben comenzar con 3 y tener 10 dígitos",
  },
  email: {
    invalid: "Ingrese un email válido (ejemplo@dominio.com)",
    tooLong: "El email es demasiado largo",
    format: "Formato de email inválido",
  }
} as const;

/**
 * Esquemas de validación Zod reutilizables
 */
import { z } from "zod";

export const phoneValidationSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value || value.trim() === "") return true; // Campo opcional
    return isValidColombianPhone(value);
  }, {
    message: VALIDATION_MESSAGES.phone.invalid,
  });

export const emailValidationSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value || value.trim() === "") return true; // Campo opcional
    return isValidEmail(value);
  }, {
    message: VALIDATION_MESSAGES.email.invalid,
  });

/**
 * Hook personalizado para formateo en tiempo real de teléfonos
 * (Para uso futuro con inputs que requieren formateo automático)
 */
export const usePhoneFormatter = () => {
  const formatPhone = (value: string): string => {
    return formatColombianPhone(value);
  };

  const unformatPhone = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  return { formatPhone, unformatPhone };
};
