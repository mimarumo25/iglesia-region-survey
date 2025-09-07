/**
 * Hook personalizado para el formulario de Parroquias con validación
 * 
 * Proporciona validación con Zod para los campos de teléfono y email
 * específicos del contexto colombiano y católico.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { phoneValidationSchema, emailValidationSchema } from "@/utils/validationHelpers";

/**
 * Esquema de validación para el formulario de Parroquias
 */
export const parroquiaFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre de la parroquia es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  direccion: z
    .string()
    .min(1, "La dirección es obligatoria")
    .min(10, "La dirección debe ser más específica")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  telefono: phoneValidationSchema,
  email: emailValidationSchema,
  id_municipio: z
    .string()
    .min(1, "Debe seleccionar un municipio"),
});

export type ParroquiaFormData = z.infer<typeof parroquiaFormSchema>;

/**
 * Hook que proporciona validación y manejo del formulario de parroquias
 */
export const useParroquiaForm = (defaultValues?: Partial<ParroquiaFormData>) => {
  const form = useForm<ParroquiaFormData>({
    resolver: zodResolver(parroquiaFormSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
      telefono: "",
      email: "",
      id_municipio: "",
      ...defaultValues,
    },
  });

  /**
   * Valida si el formulario es válido para envío
   */
  const isFormValid = () => {
    const { nombre, direccion, id_municipio } = form.getValues();
    return nombre.trim() !== "" && direccion.trim() !== "" && id_municipio !== "";
  };

  /**
   * Resetea el formulario con valores por defecto
   */
  const resetForm = (values?: Partial<ParroquiaFormData>) => {
    form.reset({
      nombre: "",
      direccion: "",
      telefono: "",
      email: "",
      id_municipio: "",
      ...values,
    });
  };

  /**
   * Prepara los datos para envío a la API
   * Limpia strings vacíos y formatea campos opcionales
   */
  const prepareDataForSubmission = (data: ParroquiaFormData) => {
    return {
      nombre: data.nombre.trim(),
      direccion: data.direccion.trim(),
      telefono: data.telefono?.trim() || undefined,
      email: data.email?.trim() || undefined,
      id_municipio: data.id_municipio,
    };
  };

  return {
    form,
    isFormValid,
    resetForm,
    prepareDataForSubmission,
    // Exponer métodos útiles del formulario
    formState: form.formState,
    errors: form.formState.errors,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
  };
};
