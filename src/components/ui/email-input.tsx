/**
 * Componente de Input Validado para Email
 * 
 * Input especializado que valida direcciones de email en tiempo real
 * y proporciona feedback visual inmediato al usuario.
 */

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { isValidEmail, VALIDATION_MESSAGES } from "@/utils/validationHelpers";

interface EmailInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  showValidation?: boolean;
  required?: boolean;
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(({
  label = "Correo Electrónico",
  value,
  onChange,
  showValidation = true,
  required = false,
  className,
  ...props
}, ref) => {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  
  // Estado de validación
  const isEmpty = !value || value.trim() === '';
  const isValid = isEmpty ? !required : isValidEmail(value);
  const showError = touched && !focused && !isEmpty && !isValid;
  const showSuccess = touched && !focused && !isEmpty && isValid;
  
  // Determinar el estado visual
  const inputState = showError ? 'error' : showSuccess ? 'success' : 'default';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    setFocused(false);
    
    // Limpiar espacios en blanco
    if (value && value !== value.trim()) {
      onChange(value.trim());
    }
    
    // Llamar onBlur original si existe
    props.onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const getHelperText = () => {
    if (showError) {
      return VALIDATION_MESSAGES.email.invalid;
    }
    if (showSuccess) {
      return "Dirección de email válida";
    }
    if (focused || (!touched && isEmpty)) {
      return "Ejemplo: usuario@dominio.com";
    }
    return "";
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type="email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn(
            {
              "border-red-500 focus:border-red-500 focus:ring-red-500": inputState === 'error',
              "border-green-500 focus:border-green-500 focus:ring-green-500": inputState === 'success',
            },
            className
          )}
          placeholder="usuario@dominio.com"
          autoComplete="email"
          spellCheck="false"
        />
      </div>
      
      {/* Mensaje de ayuda/error */}
      {showValidation && getHelperText() && (
        <p className={cn(
          "text-xs",
          {
            "text-red-500": showError,
            "text-green-600": showSuccess,
            "text-muted-foreground": !showError && !showSuccess,
          }
        )}>
          {getHelperText()}
        </p>
      )}
    </div>
  );
});

EmailInput.displayName = "EmailInput";
