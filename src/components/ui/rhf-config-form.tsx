import React from 'react';
import { Control, FieldError, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AutocompleteWithLoading } from '@/components/ui/autocomplete-with-loading';
import { AutocompleteOption } from '@/components/ui/autocomplete';

// Tipos para el campo de formulario con React Hook Form
export interface RHFConfigFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'autocomplete';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  disabled?: boolean;
  // Props específicas para autocomplete
  options?: AutocompleteOption[];
  searchPlaceholder?: string;
  emptyText?: string;
  isLoading?: boolean;
  error?: any;
  errorText?: string;
}

/**
 * Componente de campo de formulario con React Hook Form integrado
 * Compatible con el diseño del sistema y validaciones Zod
 */
export const RHFConfigFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  rows = 3,
  disabled = false,
  options = [],
  searchPlaceholder,
  emptyText,
  isLoading = false,
  error,
  errorText,
}: RHFConfigFormFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error: fieldError } }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-foreground font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {type === 'textarea' ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                className="border-input-border focus:ring-primary focus:border-primary transition-smooth resize-none"
                style={{ borderRadius: '12px' }}
                rows={rows}
                disabled={disabled}
              />
            ) : type === 'autocomplete' ? (
              <AutocompleteWithLoading
                options={options}
                value={field.value || ''}
                onValueChange={field.onChange}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                emptyText={emptyText}
                isLoading={isLoading}
                error={error}
                errorText={errorText}
                disabled={disabled}
              />
            ) : (
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className="border-input-border focus:ring-primary focus:border-primary transition-smooth h-12"
                style={{ borderRadius: '12px' }}
                disabled={disabled}
              />
            )}
          </FormControl>
          <FormMessage className="text-destructive text-sm font-medium" />
        </FormItem>
      )}
    />
  );
};

/**
 * Utilidad para formatear errores de validación
 */
export const getFieldError = (error: FieldError | undefined): string => {
  if (!error) return '';
  return error.message || 'Error de validación';
};

/**
 * Tipos de utilidad para formularios con validación
 */
export interface FormWithValidationProps {
  loading?: boolean;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente wrapper para formularios con React Hook Form
 */
export const FormWithValidation: React.FC<FormWithValidationProps> = ({
  loading = false,
  onSubmit,
  children,
  className = '',
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-6 py-4 px-2">
        {children}
      </div>
    </form>
  );
};